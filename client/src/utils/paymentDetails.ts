export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer' | 'Easypaisa';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Pay with cash when your order arrives at your doorstep.',
  },
  {
    value: 'Bank Transfer',
    label: 'Bank Transfer',
    description: 'Transfer the total amount to our bank account, then place your order.',
  },
  {
    value: 'Easypaisa',
    label: 'Easypaisa',
    description: 'Send the total amount to our Easypaisa account, then place your order.',
  },
];

export const BANK_DETAILS = {
  accountTitle: 'FIZZA SARFRAZ',
  iban: 'PK60FAYS3048704000010067',
  branch: 'IBB I-8 Markaz, Islamabad',
};

export const EASYPAISA_DETAILS = {
  accountTitle: 'Fiza Sarfraz',
  number: '0333 4399207',
};
