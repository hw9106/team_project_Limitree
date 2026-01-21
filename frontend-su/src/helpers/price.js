export const formatPrice = (price, currency) => {
  if (!currency) return price;

  if (currency.decimal === 0) {
    return currency.currencySymbol + Math.round(price).toLocaleString();
  }

  return currency.currencySymbol + price.toFixed(currency.decimal);
};
