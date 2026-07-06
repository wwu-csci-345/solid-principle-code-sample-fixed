export {};

/** Supported customer discount categories. */
type DiscountType = "none" | "student" | "vip" | "senior";

/** Customer profile used during checkout calculations. */
type Customer = {
  /** Display name of the customer placing the order. */
  name: string;
  /** Discount category used to select a pricing policy. */
  discountType: DiscountType;
};

/** Minimal order model used for discount and total calculation. */
type Order = {
  /** Pre-discount amount before tax and shipping. */
  subtotal: number;
  /** Customer metadata that determines discount behavior. */
  customer: Customer;
};

/** Strategy interface for all discount calculations. */
interface DiscountPolicy {
  /** Returns the discount amount to subtract from the subtotal. */
  calculateDiscount(order: Order): number;
}

/** Default policy that applies no discount. */
class NoDiscountPolicy implements DiscountPolicy {
  /** Always returns zero discount. */
  calculateDiscount(order: Order): number {
    return 0;
  }
}

/** Student policy applying a 10% discount. */
class StudentDiscountPolicy implements DiscountPolicy {
  /** Calculates a 10% discount from the order subtotal. */
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.1;
  }
}

/** VIP policy applying a 20% discount. */
class VipDiscountPolicy implements DiscountPolicy {
  /** Calculates a 20% discount from the order subtotal. */
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.2;
  }
}

/** Senior policy applying a 15% discount. */
class SeniorDiscountPolicy implements DiscountPolicy {
  /** Calculates a 15% discount from the order subtotal. */
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.15;
  }
}

// Factory for creating discount policies based on user type
class DiscountPolicyFactory {
  /** Builds the appropriate policy implementation for a discount type. */
  static create(discountType: DiscountType): DiscountPolicy {
    if (discountType === "student") {
      return new StudentDiscountPolicy();
    }

    if (discountType === "vip") {
      return new VipDiscountPolicy();
    }

    if (discountType === "senior") {
      return new SeniorDiscountPolicy();
    }

    return new NoDiscountPolicy();
  }
}

/** Service that computes final totals using an injected discount policy. */
class CheckoutService {
  /**
   * @param discountPolicy Discount strategy used for all total calculations.
   */
  constructor(private discountPolicy: DiscountPolicy) {}

  /** Returns the final total after applying the configured discount. */
  calculateTotal(order: Order): number {
    const discount = this.discountPolicy.calculateDiscount(order);
    return order.subtotal - discount;
  }
}

// Example usage
const order: Order = {
  subtotal: 100,
  customer: {
    name: "Maya",
    discountType: "vip",
  },
};

const policy = DiscountPolicyFactory.create(order.customer.discountType);
const checkout = new CheckoutService(policy);
console.log(checkout.calculateTotal(order)); // 80