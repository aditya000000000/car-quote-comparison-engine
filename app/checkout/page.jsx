"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function CheckoutPage() {
  const router = useRouter();

  const quote = useMemo(() => {
    if (typeof window === "undefined") return null;

    const saved = localStorage.getItem("selectedQuote");
    return saved ? JSON.parse(saved) : null;
  }, []);

  useEffect(() => {
    if (!quote) {
      router.replace("/quotes");
    }
  }, [quote, router]);

  if (!quote) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
              ✅ Plan Selected
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Checkout Summary
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Review your premium breakup and proceed to payment.
            </p>
          </div>

          <button
            onClick={() => router.push("/quotes")}
            className="h-fit rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            ← Back to Quotes
          </button>
        </div>

        {/* Main Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          {/* Top strip */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {quote.insurerName}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {quote.planName}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip label={`IDV ${formatINR(quote.idv)}`} />
                  <Chip label={`CSR ${quote.claimSettlementRatio || "--"}%`} />
                  <Chip label={`Cashless ${quote.cashlessGarages || "--"}`} />
                </div>
              </div>

              <div className="rounded-2xl bg-white px-5 py-4 text-right shadow-sm ring-1 ring-gray-200">
                <p className="text-xs font-semibold text-gray-500">
                  Total Premium
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  {formatINR(quote.totalPremium)}
                </p>
                <p className="text-xs text-gray-500">(Incl. GST)</p>
              </div>
            </div>
          </div>

          {/* Breakup */}
          <div className="px-6 py-6">
            <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200">
              <p className="text-sm font-bold text-gray-900">Premium Breakup</p>
              <p className="mt-1 text-xs text-gray-500">
                Includes add-ons, discount, and GST calculation
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <Row label="Base Premium" value={formatINR(quote.basePremium)} />
                <Row label="Add-ons Total" value={formatINR(quote.addonsTotal)} />
                <Row
                  label="Discount (NCB)"
                  value={`- ${formatINR(quote.discount)}`}
                  green
                />
                <Row label="Net Premium" value={formatINR(quote.netPremium)} />
                <Row label="GST (18%)" value={formatINR(quote.gst)} />

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between font-bold text-base">
                  <span>Total Premium</span>
                  <span>{formatINR(quote.totalPremium)}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => router.push("/quotes")}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                ← Modify Plan
              </button>

              <button
                onClick={() => alert("Payment integration later 😄")}
                className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
              >
                Proceed to Payment →
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              This is a demo checkout screen. Payment gateway can be integrated later.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={green ? "text-green-600 font-semibold" : "text-gray-900 font-medium"}>
        {value}
      </span>
    </div>
  );
}

function Chip({ label }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
      {label}
    </span>
  );
}
