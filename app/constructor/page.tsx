import { Suspense } from "react";
import { ConstructorContent } from "./ConstructorContent";

export default function ConstructorPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-8">Загрузка...</div>}>
      <ConstructorContent />
    </Suspense>
  );
}
