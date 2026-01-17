import { Suspense } from "react";
import QuotesClient from "./QuotesClient";

export default function QuotesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Quotes...</div>}>
      <QuotesClient />
    </Suspense>
  );
}
