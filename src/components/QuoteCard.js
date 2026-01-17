"use client";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function QuoteCard({
  quote,
  onView,
  onSelect,
  onCompareToggle,
  isCompared,
}) {
  const isBestPrice = quote?.rank === 1;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl">
      <div className="h-1 w-full bg-gradient-to-r from-black via-gray-600 to-black opacity-70" />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-600">
                {quote.insurerName}
              </p>

              {isBestPrice && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                  Best Price
                </span>
              )}

              {isCompared && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  Added to Compare
                </span>
              )}
            </div>

            <h3 className="mt-1 text-xl font-semibold text-gray-900">
              {quote.planName}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip label={`CSR ${quote.claimSettlementRatio}%`} />
              <Chip label={`Cashless ${quote.cashlessGarages}`} />
              <Chip label={`IDV ${formatINR(quote.idv)}`} />
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 px-5 py-4 text-right ring-1 ring-gray-200">
            <p className="text-xs font-medium text-gray-500">Total Premium</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {formatINR(quote.totalPremium)}
            </p>
            <p className="text-xs text-gray-500">(Incl. GST)</p>
          </div>
        </div>

        <div className="my-5 h-px w-full bg-gray-100" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onView(quote)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View Breakup
            </button>

            <button
              onClick={() => onCompareToggle?.(quote)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                isCompared
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              {isCompared ? "Remove Compare" : "Compare"}
            </button>
          </div>

          <button
            onClick={() => onSelect(quote)}
            className="rounded-2xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
          >
            Select Plan →
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gray-100 blur-3xl" />
      </div>
    </div>
  );
}

function Chip({ label }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}
    </span>
  );
}
