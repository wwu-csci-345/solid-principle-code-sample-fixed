export {};

/** Individual purchasable line item in an order. */
type OrderItem = {
  /** Display name of the purchased product. */
  name: string;
  /** Price per single unit before tax. */
  unitPrice: number;
  /** Number of units purchased for the item. */
  quantity: number;
};

/** Basic order payload used to generate a receipt. */
type Order = {
  /** Unique order identifier. */
  id: string;
  /** Email address used for receipt delivery. */
  customerEmail: string;
  /** Collection of purchased items. */
  items: OrderItem[];
};

/** Computed totals and metadata used by receipt formatters. */
type OrderSummary = {
  /** Order id copied from the source order. */
  orderId: string;
  /** Customer email copied from the source order. */
  customerEmail: string;
  /** Item lines included on the receipt. */
  items: OrderItem[];
  /** Sum of item line totals before tax. */
  subtotal: number;
  /** Calculated tax amount. */
  tax: number;
  /** Final amount due including tax. */
  total: number;
};

/** Calculates monetary totals for receipts. */
class OrderCalculator {
  /** Computes subtotal by summing each line item's extended price. */
  calculateSubtotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  }

  /** Computes tax using a fixed 10% rate for this demo. */
  calculateTax(order: Order): number {
    return this.calculateSubtotal(order) * 0.1;
  }

  /** Builds a full receipt summary with subtotal, tax, and total. */
  summarize(order: Order): OrderSummary {
    const subtotal = this.calculateSubtotal(order);
    const tax = this.calculateTax(order);

    return {
      orderId: order.id,
      customerEmail: order.customerEmail,
      items: order.items,
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }
}

/** Formats an order summary into a printable HTML receipt. */
class HtmlReceiptFormatter {
  /** Renders summary details as an HTML fragment. */
  format(summary: OrderSummary): string {
    const itemRows = summary.items
      .map(item => {
        return `
          <li>
            ${item.name}: ${item.quantity} x $${item.unitPrice}
          </li>
        `;
      })
      .join("");

    return `
      <h1>Receipt for Order ${summary.orderId}</h1>
      <ul>
        ${itemRows}
      </ul>
      <p>Subtotal: $${summary.subtotal.toFixed(2)}</p>
      <p>Tax: $${summary.tax.toFixed(2)}</p>
      <p>Total: $${summary.total.toFixed(2)}</p>
    `;
  }
}

/** Stores receipt content in persistence (console in this demo). */
class ReceiptRepository {
  /** Saves rendered receipt content. */
  save(content: string): void {
    console.log("Saving receipt to database...");
    console.log(content);
  }
}

/** Sends rendered receipts to customers via email. */
class ReceiptEmailSender {
  /** Sends the receipt to the specified email address. */
  send(email: string, content: string): void {
    console.log(`Sending receipt to ${email}`);
    console.log(content);
  }
}

// Example usage
const order: Order = {
  id: "ord-1001",
  customerEmail: "customer@example.com",
  items: [
    { name: "Keyboard", unitPrice: 75, quantity: 1 },
    { name: "Mouse", unitPrice: 25, quantity: 2 },
  ],
};

const calculator = new OrderCalculator();
const formatter = new HtmlReceiptFormatter();
const repository = new ReceiptRepository();
const emailSender = new ReceiptEmailSender();

const summary = calculator.summarize(order);
const html = formatter.format(summary);

repository.save(html);
emailSender.send(summary.customerEmail, html);