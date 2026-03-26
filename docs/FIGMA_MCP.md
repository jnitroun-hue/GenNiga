# Figma MCP — настройка

## 1. Токен Figma

1. Зайдите на [figma.com](https://figma.com)
2. Клик по аватару (левый верхний угол) → **Settings**
3. Вкладка **Security** → **Personal access tokens**
4. **Create new token** — дайте имя, отметьте **File content** и **Comments**
5. Скопируйте токен (начинается с `figd_`)

## 2. Конфиг Cursor

Откройте `.cursor/mcp.json` (в проекте или глобально `%USERPROFILE%\.cursor\mcp.json`) и убедитесь:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp"],
      "env": {
        "FIGMA_API_KEY": "figd_ВАШ_ТОКЕН"
      }
    }
  }
}
```

## 3. Важно

- В `env` нужен именно `FIGMA_API_KEY`
- Токен не должен содержать пробелы или лишние кавычки
- После изменений **перезапустите Cursor**

## 4. Если не работает

1. Cursor Settings → MCP — проверьте, что сервер Figma отображается
2. В логах MCP ищите ошибки 404 или authentication
3. Убедитесь, что токен создан с нужными правами (File content, Comments)
