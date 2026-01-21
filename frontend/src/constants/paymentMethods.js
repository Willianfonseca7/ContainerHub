export const paymentOptions = [
  { value: 'credit_card', label: 'Kreditkarte' },
  { value: 'debit_card', label: 'Debitkarte' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'apple_pay', label: 'Apple Pay' },
];

export const paymentLabels = paymentOptions.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});
