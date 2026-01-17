"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleValue: 600000,
    carAge: 2,
    cityTier: "1",
    ncbPercent: 20,
  });

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("quoteForm", JSON.stringify(form));
    router.push("/quotes");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
              ⚡ Compare premiums • Add-ons • GST breakup
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Car Insurance Quote <span className="text-gray-600">Comparison</span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-gray-600">
              Enter your car details and instantly compare quotes across insurers.
              View premium breakup, add-ons, discounts, and final payable amount.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill label="✅ Premium Breakup" />
              <Pill label="✅ Add-ons Pricing" />
              <Pill label="✅ NCB Discount" />
              <Pill label="✅ GST Included" />
            </div>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Glow background */}
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-r from-gray-100 via-white to-gray-100 blur-2xl" />

            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Get instant quotes
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Takes less than 30 seconds
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
                  🔒 Secure
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Vehicle Value (IDV)">
                  <input
                    type="number"
                    value={form.vehicleValue}
                    onChange={(e) =>
                      onChange("vehicleValue", Number(e.target.value))
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                    placeholder="e.g. 600000"
                  />
                </Field>

                <Field label="Car Age (years)">
                  <input
                    type="number"
                    value={form.carAge}
                    onChange={(e) => onChange("carAge", Number(e.target.value))}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                    placeholder="e.g. 2"
                  />
                </Field>

                <Field label="City Tier">
                  <select
                    value={form.cityTier}
                    onChange={(e) => onChange("cityTier", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                  >
                    <option value="1">Tier 1 (Metro)</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                  </select>
                </Field>

                <Field label="NCB Discount (%)">
                  <select
                    value={form.ncbPercent}
                    onChange={(e) =>
                      onChange("ncbPercent", Number(e.target.value))
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                  >
                    <option value={0}>0%</option>
                    <option value={20}>20%</option>
                    <option value={25}>25%</option>
                    <option value={35}>35%</option>
                    <option value={45}>45%</option>
                    <option value={50}>50%</option>
                  </select>
                </Field>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
                >
                  Get Quotes →
                </button>

                <p className="text-center text-xs text-gray-500">
                  By continuing, you agree to compare quotes for demo purposes.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer small note */}
        <div className="mt-10 text-center text-xs text-gray-500">
          Built with Next.js + Tailwind • Quote Comparison Engine
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="mt-2">{children}</div>
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
