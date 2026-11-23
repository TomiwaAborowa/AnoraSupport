import { Suspense } from "react";
import UnlockClient from "./UnlockClient";

export default function UnlockPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <Suspense fallback={<p className="text-anora-mute">Confirming your gift...</p>}>
        <UnlockClient />
      </Suspense>
    </main>
  );
}
