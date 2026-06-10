type DiscountType = "none" | "student" | "vip" | "senior";

type Customer = {
  name: string;
  discountType: DiscountType;
};

type Order = {
  subtotal: number;
  customer: Customer;
};

interface DiscountPolicy {
  calculateDiscount(order: Order): number;
}

class NoDiscountPolicy implements DiscountPolicy {
  calculateDiscount(order: Order): number {
    return 0;
  }
}

class StudentDiscountPolicy implements DiscountPolicy {
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.1;
  }
}

class VipDiscountPolicy implements DiscountPolicy {
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.2;
  }
}

class SeniorDiscountPolicy implements DiscountPolicy {
  calculateDiscount(order: Order): number {
    return order.subtotal * 0.15;
  }
}

// Factory for creating discount policies based on user type
class DiscountPolicyFactory {
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

class CheckoutService {
  constructor(private discountPolicy: DiscountPolicy) {}

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