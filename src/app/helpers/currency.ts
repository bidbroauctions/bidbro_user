export const formatCurrency = (value: string) => {
  const num = parseFloat(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatFromCurrencyToNumber = (value: string) => {
  return parseFloat(value.replace(/[₦,]/g, "")); // Removes the "₦" symbol and commas
};
export const formatNumberWithCommas = (value: number | string) => {
  // Ensure the value is a number
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  // If it's not a number, return an empty string
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
