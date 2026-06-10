type OrderItem = {
  name: string;
  unitPrice: number;
  quantity: number;
};

type Order = {
  id: string;
  items: OrderItem[];
};

type PaymentResult = {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
};

interface PaymentProcessor {
  pay(order: Order, amount: number): PaymentResult;
}

type CreditCardInfo = {
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
};

// credit card payment processor implementation
class CreditCardPaymentProcessor implements PaymentProcessor {
  constructor(private cardInfo: CreditCardInfo) {}

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
type PayPalInfo = {
  email: string;
};

class PayPalPaymentProcessor implements PaymentProcessor {
  constructor(private paypalInfo: PayPalInfo) {}

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
type GiftCardInfo = {
  cardCode: string;
};

class GiftCardPaymentProcessor implements PaymentProcessor {
  constructor(private giftCardInfo: GiftCardInfo) {}

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
  calculateTotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  }

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