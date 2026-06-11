interface EmailSender {
  sendEmail(
    emailAddress: string,
    subject: string,
    body: string
  ): Promise<void>;
}

interface SmsSender {
  sendSms(
    phoneNumber: string,
    text: string
  ): Promise<void>;
}

interface PushSender {
  sendPushNotification(
    deviceToken: string,
    title: string,
    body: string
  ): Promise<void>;
}

interface InboxWriter {
  saveToInbox(
    userId: string,
    title: string,
    body: string
  ): Promise<void>;
}

// implement email notification channel
class EmailNotificationChannel implements EmailSender {
  async sendEmail(
    emailAddress: string,
    subject: string,
    body: string
  ): Promise<void> {
    console.log(`Sending email to ${emailAddress}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
  }
}

// implement in app inbox channel
class InAppInboxChannel implements InboxWriter {
  async saveToInbox(
    userId: string,
    title: string,
    body: string
  ): Promise<void> {
    console.log(`Saving inbox message for ${userId}`);
    console.log(`${title}: ${body}`);
  }
}

// implement mobile notification channel
class MobileNotificationChannel implements PushSender, InboxWriter {
  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string
  ): Promise<void> {
    console.log(`Sending push notification to ${deviceToken}`);
    console.log(`${title}: ${body}`);
  }

  async saveToInbox(
    userId: string,
    title: string,
    body: string
  ): Promise<void> {
    console.log(`Saving inbox message for ${userId}`);
    console.log(`${title}: ${body}`);
  }
}

// usage example
async function sendPasswordResetEmail(
  sender: EmailSender,
  emailAddress: string,
  resetLink: string
): Promise<void> {
  await sender.sendEmail(
    emailAddress,
    "Reset your password",
    `Click here: ${resetLink}`
  );
}

async function notifyMobileUser(
  sender: PushSender,
  deviceToken: string,
  title: string,
  body: string
): Promise<void> {
  await sender.sendPushNotification(deviceToken, title, body);
}

async function addInboxNotification(
  writer: InboxWriter,
  userId: string,
  title: string,
  body: string
): Promise<void> {
  await writer.saveToInbox(userId, title, body);
}

const emailChannel = new EmailNotificationChannel();
const inboxChannel = new InAppInboxChannel();
const mobileChannel = new MobileNotificationChannel();

// await sendPasswordResetEmail(
//   emailChannel,
//   "alice@example.com",
//   "https://example.com/reset"
// );

// await addInboxNotification(
//   inboxChannel,
//   "u123",
//   "Assignment graded",
//   "Your submission has been graded."
// );

// await notifyMobileUser(
//   mobileChannel,
//   "device-token-123",
//   "New message",
//   "You have a new message."
// );

// Compile-time error, which is good:
// await sendPasswordResetEmail(
//   inboxChannel,
//   "alice@example.com",
//   "https://example.com/reset"
// );