type OrderItem = {
  name: string;
  unitPrice: number;
  quantity: number;
};

type Order = {
  id: string;
  customerEmail: string;
  items: OrderItem[];
};

type OrderSummary = {
  orderId: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

class OrderCalculator {
  calculateSubtotal(order: Order): number {
    return order.items.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  }

  calculateTax(order: Order): number {
    return this.calculateSubtotal(order) * 0.1;
  }

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

class HtmlReceiptFormatter {
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

class ReceiptRepository {
  save(content: string): void {
    console.log("Saving receipt to database...");
    console.log(content);
  }
}

class ReceiptEmailSender {
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