/** Line item model used to compute checkout totals. */
type OrderItem = {
  /** Product display name. */
  name: string;
  /** Price per unit. */
  unitPrice: number;
  /** Quantity purchased. */
  quantity: number;
};

/** Minimal order payload required for payment processing. */
type Order = {
  /** Unique order id used by downstream providers. */
  id: string;
  /** Collection of purchased line items. */
  items: OrderItem[];
};

/** Standard result payload returned by payment processors. */
type PaymentResult = {
  /** Indicates whether the payment operation succeeded. */
  success: boolean;
  /** Optional provider transaction id for successful payments. */
  transactionId?: string;
  /** Optional user-facing error message when payment fails. */
  errorMessage?: string;
};

/** Payment strategy interface implemented by each payment method. */
interface PaymentProcessor {
  /** Charges the given amount for the order and returns a result. */
  pay(order: Order, amount: number): PaymentResult;
}

/** Credit card details needed by the credit card processor. */
type CreditCardInfo = {
  /** Full card number (demo only, do not log in production). */
  cardNumber: string;
  /** Expiration month component. */
  expirationMonth: number;
  /** Expiration year component. */
  expirationYear: number;
  /** Card security code. */
  cvv: string;
};

// credit card payment processor implementation
class CreditCardPaymentProcessor implements PaymentProcessor {
  /**
   * @param cardInfo Card details used for charging.
   */
  constructor(private cardInfo: CreditCardInfo) {}

  /** Charges a credit card for the specified order amount. */
  pay(order: Order, amount: number): PaymentResult {
    console.log("Connecting to credit card processor...");
    console.log(`Charging card ending in ${this.cardInfo.cardNumber.slice(-4)}`);
    console.log(`Amount: $${amount.toFixed(2)}`);

    return {
      success: true,
      transactionId: `cc-${order.id}`,
    };
  }
}

// paypal payment processor implementation
/** PayPal account details needed by the PayPal processor. */
type PayPalInfo = {
  /** Account email used for PayPal charging. */
  email: string;
};

class PayPalPaymentProcessor implements PaymentProcessor {
  /**
   * @param paypalInfo PayPal account data used for charging.
   */
  constructor(private paypalInfo: PayPalInfo) {}

  /** Charges a PayPal account for the specified order amount. */
  pay(order: Order, amount: number): PaymentResult {
    console.log("Connecting to PayPal...");
    console.log(`Charging PayPal account: ${this.paypalInfo.email}`);
    console.log(`Amount: $${amount.toFixed(2)}`);

    return {
      success: true,
      transactionId: `pp-${order.id}`,
    };
  }
}

// gift card payment processor implementation
/** Gift card details needed by the gift card processor. */
type GiftCardInfo = {
  /** Gift card code entered by the customer. */
  cardCode: string;
};

class GiftCardPaymentProcessor implements PaymentProcessor {
  /**
   * @param giftCardInfo Gift card data used for redemption.
   */
  constructor(private giftCardInfo: GiftCardInfo) {}

  /** Redeems a gift card for the specified order amount. */
  pay(order: Order, amount: number): PaymentResult {
    console.log("Checking gift card balance...");
    console.log(`Redeeming gift card: ${this.giftCardInfo.cardCode}`);
    console.log(`Amount: $${amount.toFixed(2)}`);

    return {
      success: true,
      transactionId: `gc-${order.id}`,
    };
  }
}

// checkout service that uses a payment processor
class CheckoutService {
  /** Computes order total by summing line item extended prices. */
  calculateTotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  }

  /** Delegates payment to the supplied payment strategy. */
  checkout(order: Order, paymentProcessor: PaymentProcessor): PaymentResult {
    const total = this.calculateTotal(order);
    return paymentProcessor.pay(order, total);
  }
}

// example usage
const order: Order = {
  id: "ord-1001",
  items: [
    { name: "Keyboard", unitPrice: 80, quantity: 1 },
    { name: "Mouse", unitPrice: 25, quantity: 2 },
  ],
};

const checkoutService = new CheckoutService();

const creditCardProcessor = new CreditCardPaymentProcessor({
  cardNumber: "4111111111111111",
  expirationMonth: 12,
  expirationYear: 2028,
  cvv: "123",
});

const result = checkoutService.checkout(order, creditCardProcessor);

console.log(result);