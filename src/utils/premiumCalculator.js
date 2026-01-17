export const ADDONS = [
  { key: "zeroDep", label: "Zero Depreciation", price: 1200 },
  { key: "rsa", label: "Roadside Assistance (RSA)", price: 350 },
  { key: "engineProtect", label: "Engine Protect", price: 650 },
  { key: "consumables", label: "Consumables Cover", price: 400 },
];

export function calculatePremium({
  vehicleValue,
  carAge,
  cityTier,
  ncbPercent,
  selectedAddons = [],
}) {
  const idv = Number(vehicleValue || 0);

  const tierRate = cityTier === "1" ? 0.018 : cityTier === "2" ? 0.016 : 0.014;

  const ageMultiplier =
    carAge <= 1 ? 1.0 : carAge <= 3 ? 1.1 : carAge <= 5 ? 1.2 : 1.35;

  const basePremium = Math.round(idv * tierRate * ageMultiplier);

  const addonsTotal = selectedAddons.reduce((sum, addonKey) => {
    const addon = ADDONS.find((a) => a.key === addonKey);
    return sum + (addon?.price || 0);
  }, 0);

  // NCB discount
  const discount = Math.round(((basePremium + addonsTotal) * ncbPercent) / 100);

  const netPremium = basePremium + addonsTotal - discount;

  const gst = Math.round(netPremium * 0.18);

  const totalPremium = netPremium + gst;

  return {
    idv,
    basePremium,
    addonsTotal,
    discount,
    netPremium,
    gst,
    totalPremium,
  };
}
