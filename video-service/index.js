const express = require("express");
const cors = require("cors");
const ffmpegPath = require("ffmpeg-static");
const { spawn } = require("child_process");
const { promises: fs } = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 4000;

const ROOT_DIR = __dirname;
const TMP_DIR = path.join(ROOT_DIR, "tmp");
const MEDIA_DIR = path.join(ROOT_DIR, "media");

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use("/media", express.static(MEDIA_DIR));

app.get("/health", async (_req, res) => {
  res.json({ ok: true, ffmpeg: !!ffmpegPath });
});

app.post("/render", async (req, res) => {
  try {
    const expectedToken = process.env.VIDEO_SERVICE_TOKEN;
    if (expectedToken) {
      const authHeader = req.headers.authorization || "";
      const providedToken = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "";
      if (providedToken !== expectedToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const {
      sourceType = "banner",
      imageSource,
      banner,
      animType = "slide",
      duration = 5,
      width = 1280,
      height = 720,
    } = req.body || {};

    const seconds = clampNumber(duration, 3, 20, 5);
    const outW = clampNumber(width, 320, 1920, 1280);
    const outH = clampNumber(height, 320, 1920, 720);

    let source = null;
    if (sourceType === "image") {
      source = imageSource || null;
    } else {
      source = banner?.backgroundImage || null;
    }

    if (!source || typeof source !== "string") {
      return res.status(400).json({
        error: "No image source. Provide imageSource or banner.backgroundImage",
      });
    }

    await ensureDirs();

    const jobId = uuidv4();
    const jobDir = path.join(TMP_DIR, jobId);
    await fs.mkdir(jobDir, { recursive: true });

    const inputPath = await materializeInputImage(source, jobDir);
    const outputTmpPath = path.join(jobDir, "output.mp4");
    const outputFileName = `${jobId}.mp4`;
    const outputFinalPath = path.join(MEDIA_DIR, outputFileName);

    await renderVideo({
      inputPath,
      outputPath: outputTmpPath,
      animType,
      duration: seconds,
      width: outW,
      height: outH,
    });

    await fs.rename(outputTmpPath, outputFinalPath);
    await safeCleanup(jobDir);

    const publicBase =
      process.env.PUBLIC_BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    return res.json({
      url: `${publicBase}/media/${outputFileName}`,
      provider: "ffmpeg-local",
      duration: seconds,
      animType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to render video",
      details: String(error?.message || error),
    });
  }
});

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

async function ensureDirs() {
  await fs.mkdir(TMP_DIR, { recursive: true });
  await fs.mkdir(MEDIA_DIR, { recursive: true });
}

async function materializeInputImage(source, jobDir) {
  if (source.startsWith("data:image/")) {
    const parsed = parseDataImage(source);
    const filePath = path.join(jobDir, `input.${parsed.ext}`);
    await fs.writeFile(filePath, parsed.buffer);
    return filePath;
  }

  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    const mime = response.headers.get("content-type") || "image/png";
    const ext = mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
    const arrayBuffer = await response.arrayBuffer();
    const filePath = path.join(jobDir, `input.${ext}`);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    return filePath;
  }

  // Treat as local absolute path
  return source;
}

function parseDataImage(dataUri) {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data:image URI");
  }
  const mime = match[1];
  const base64 = match[2];
  const ext = mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
  return { buffer: Buffer.from(base64, "base64"), ext };
}

async function renderVideo({ inputPath, outputPath, animType, duration, width, height }) {
  if (!ffmpegPath) throw new Error("ffmpeg binary not found");

  const filter = buildFilter(animType, duration, width, height);
  const args = [
    "-y",
    "-loop",
    "1",
    "-i",
    inputPath,
    "-t",
    String(duration),
    "-vf",
    filter,
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    outputPath,
  ];

  await runFfmpeg(args);
}

function buildFilter(animType, duration, width, height) {
  const base = `scale=${width * 1.5}:${height * 1.5}:force_original_aspect_ratio=increase`;

  if (animType === "fade") {
    const outStart = Math.max(0.8, duration - 0.8);
    return `${base},crop=${width}:${height},fade=t=in:st=0:d=0.6,fade=t=out:st=${outStart}:d=0.6`;
  }

  if (animType === "scale") {
    return (
      `${base},crop=${width}:${height},` +
      `zoompan=z='min(1+0.0007*on,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${width}x${height}:fps=30`
    );
  }

  // slide
  return `${base},crop=${width}:${height}:x='(in_w-${width})*t/${duration}':y='(in_h-${height})/2'`;
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-2000)}`));
    });
  });
}

async function safeCleanup(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // no-op
  }
}

app.listen(PORT, async () => {
  await ensureDirs();
  console.log(`Video service started on http://localhost:${PORT}`);
});
