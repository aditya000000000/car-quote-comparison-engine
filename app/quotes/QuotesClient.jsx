"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuoteCard from "@/src/components/QuoteCard";
import { insurers } from "@/src/data/insurers";
import { ADDONS, calculatePremium } from "@/src/utils/premiumCalculator";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function QuotesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quoteForm] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("quoteForm");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedAddons, setSelectedAddons] = useState(["zeroDep"]);

  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [sortBy, setSortBy] = useState("lowPremium");
  const [minCSR, setMinCSR] = useState(80);
  const [minCashless, setMinCashless] = useState(0);
  const [maxPremium, setMaxPremium] = useState(50000);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!quoteForm) router.replace("/");
  }, [quoteForm, router]);

  const allQuotes = useMemo(() => {
    if (!quoteForm) return [];

    const list = insurers.map((ins) => {
      const premium = calculatePremium({
        vehicleValue: quoteForm.vehicleValue,
        carAge: quoteForm.carAge,
        cityTier: quoteForm.cityTier,
        ncbPercent: quoteForm.ncbPercent,
        selectedAddons,
      });

      return {
        quoteId: ins.id,
        insurerName: ins.name,
        planName: ins.planName,
        claimSettlementRatio: ins.claimSettlementRatio,
        cashlessGarages: ins.cashlessGarages,
        ...premium,
      };
    });

    const sortedByPremium = [...list].sort(
      (a, b) => a.totalPremium - b.totalPremium
    );

    return list.map((q) => ({
      ...q,
      rank: sortedByPremium.findIndex((x) => x.quoteId === q.quoteId) + 1,
    }));
  }, [quoteForm, selectedAddons]);

  const quotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    const searched = allQuotes.filter((q) => {
      if (!query) return true;
      return (
        q.insurerName.toLowerCase().includes(query) ||
        q.planName.toLowerCase().includes(query)
      );
    });

    const filtered = searched.filter((q) => {
      const csrOk = q.claimSettlementRatio >= minCSR;
      const cashlessOk = q.cashlessGarages >= minCashless;
      const premiumOk = q.totalPremium <= maxPremium;
      return csrOk && cashlessOk && premiumOk;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "lowPremium") return a.totalPremium - b.totalPremium;
      if (sortBy === "highCSR")
        return b.claimSettlementRatio - a.claimSettlementRatio;
      if (sortBy === "highCashless")
        return b.cashlessGarages - a.cashlessGarages;
      return 0;
    });

    return sorted;
  }, [allQuotes, search, sortBy, minCSR, minCashless, maxPremium]);

  const quotesById = useMemo(() => {
    const map = {};
    allQuotes.forEach((q) => {
      map[q.quoteId] = q;
    });
    return map;
  }, [allQuotes]);

  const recommendedId = useMemo(() => {
    if (!quotes.length) return null;
    const best = [...quotes].sort(
      (a, b) => b.claimSettlementRatio - a.claimSettlementRatio
    )[0];
    return best?.quoteId || null;
  }, [quotes]);

  const viewBreakup = useMemo(() => {
    const viewId = searchParams.get("view");
    if (!viewId) return null;
    return quotesById[viewId] || null;
  }, [searchParams, quotesById]);

  const toggleAddon = (key) => {
    setSelectedAddons((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const onSelectPlan = (quote) => {
    localStorage.setItem("selectedQuote", JSON.stringify(quote));
    router.push("/checkout");
  };

  const onCompareToggle = (quote) => {
    setCompareList((prev) => {
      const exists = prev.includes(quote.quoteId);

      if (exists) return prev.filter((id) => id !== quote.quoteId);

      if (prev.length >= 3) {
        alert("You can compare maximum 3 plans.");
        return prev;
      }

      return [...prev, quote.quoteId];
    });
  };

  const compareQuotes = compareList.map((id) => quotesById[id]).filter(Boolean);

  const copyShareLink = async (quoteId) => {
    try {
      const url = `${window.location.origin}/quotes?view=${quoteId}`;
      await navigator.clipboard.writeText(url);
      alert("Share link copied ✅");
    } catch (e) {
      alert("Failed to copy link ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Compare Quotes
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Search, filter, compare, and view premium breakup.
            </p>

            {quoteForm && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill label={`IDV ${formatINR(quoteForm.vehicleValue)}`} />
                <Pill label={`Car Age ${quoteForm.carAge} yrs`} />
                <Pill label={`City Tier ${quoteForm.cityTier}`} />
                <Pill label={`NCB ${quoteForm.ncbPercent}%`} />
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            ← Edit Details
          </button>
        </div>

        {/* Search */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full">
              <p className="text-sm font-semibold text-gray-900">Search plans</p>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search insurer or plan name..."
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
              Showing <span className="text-gray-900">{quotes.length}</span> plans
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-7 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4">
            <p className="text-sm font-semibold text-gray-900">Add-ons</p>
          </div>

          <div className="px-5 pb-5">
            <div className="mt-4 flex flex-wrap gap-2">
              {ADDONS.map((a) => {
                const active = selectedAddons.includes(a.key);

                return (
                  <button
                    key={a.key}
                    onClick={() => toggleAddon(a.key)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-black text-white shadow-sm"
                        : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {a.label}{" "}
                    <span className={active ? "text-gray-200" : "text-gray-500"}>
                      ({formatINR(a.price)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters + Quotes */}
        <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Filters */}
          <div className="lg:col-span-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4">
              <p className="text-sm font-semibold text-gray-900">Filters</p>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Min CSR</p>
                  <span className="text-xs font-semibold text-gray-600">
                    {minCSR}%
                  </span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={minCSR}
                  onChange={(e) => setMinCSR(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">
                    Min Cashless Garages
                  </p>
                  <span className="text-xs font-semibold text-gray-600">
                    {minCashless}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={9000}
                  step={500}
                  value={minCashless}
                  onChange={(e) => setMinCashless(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">
                    Max Premium
                  </p>
                  <span className="text-xs font-semibold text-gray-600">
                    {formatINR(maxPremium)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={500}
                  value={maxPremium}
                  onChange={(e) => setMaxPremium(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">Sort</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm outline-none"
                >
                  <option value="lowPremium">Lowest Premium</option>
                  <option value="highCSR">Highest CSR</option>
                  <option value="highCashless">Most Cashless Garages</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setSortBy("lowPremium");
                  setMinCSR(80);
                  setMinCashless(0);
                  setMaxPremium(50000);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Quote List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4">
              {quotes.map((q) => (
                <div key={q.quoteId}>
                  <div className="mb-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => copyShareLink(q.quoteId)}
                      className="rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      🔗 Share
                    </button>

                    {q.quoteId === recommendedId && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                        Recommended
                      </span>
                    )}
                  </div>

                  <QuoteCard
                    quote={q}
                    isCompared={compareList.includes(q.quoteId)}
                    onView={(quote) => router.push(`/quotes?view=${quote.quoteId}`)}
                    onSelect={onSelectPlan}
                    onCompareToggle={onCompareToggle}
                  />
                </div>
              ))}
            </div>

            {quotes.length === 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-bold text-gray-900">No plans found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Breakup Modal */}
      {viewBreakup && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">{viewBreakup.insurerName}</p>
                <h2 className="text-xl font-bold text-gray-900">
                  Premium Breakup
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {viewBreakup.planName}
                </p>
              </div>

              <button
                onClick={() => router.replace("/quotes")}
                className="rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
              <div className="space-y-3 text-sm">
                <Row label="Vehicle Value (IDV)" value={formatINR(viewBreakup.idv)} />
                <Row label="Base Premium" value={formatINR(viewBreakup.basePremium)} />
                <Row label="Add-ons Total" value={formatINR(viewBreakup.addonsTotal)} />
                <Row label="Net Premium" value={formatINR(viewBreakup.netPremium)} />
                <Row label="GST (18%)" value={formatINR(viewBreakup.gst)} />

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between font-bold text-base">
                  <span>Total Premium</span>
                  <span>{formatINR(viewBreakup.totalPremium)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan(viewBreakup)}
              className="mt-5 w-full rounded-2xl bg-black px-4 py-3 text-white font-semibold shadow-sm transition hover:opacity-90"
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
      {label}
    </span>
  );
}
