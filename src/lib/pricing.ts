export const getPlatformFeeRate = (amount: number): number => {
  if (amount < 2000) return 0.05;
  if (amount <= 5000) return 0.035;
  return 0.02;
};

export const calculatePlatformFee = (basePrice: number): number => {
  const rate = getPlatformFeeRate(basePrice);
  const rawFee = basePrice * rate;
  return rawFee < 1 ? Number(rawFee.toFixed(2)) : Math.round(rawFee);
};

export const calculateTotalPrice = (basePrice: number): number => {
  return basePrice + calculatePlatformFee(basePrice);
};

export const formatPrice = (amount: number): string => {
  const safe = Number(amount) || 0;
  return `₹${safe.toLocaleString("en-IN", {
    minimumFractionDigits: safe % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

