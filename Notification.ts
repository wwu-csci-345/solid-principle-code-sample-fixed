/** Capability for sending email notifications. */
interface EmailSender {
  /** Sends an email with subject and body to a recipient. */
  sendEmail(
    emailAddress: string,
    subject: string,
    body: string
  ): Promise<void>;
}

/** Capability for sending SMS text messages. */
interface SmsSender {
  /** Sends a text message to a phone number. */
  sendSms(
    phoneNumber: string,
    text: string
  ): Promise<void>;
}

/** Capability for sending push notifications to devices. */
interface PushSender {
  /** Sends a push notification payload to a device token. */
  sendPushNotification(
    deviceToken: string,
    title: string,
    body: string
  ): Promise<void>;
}

/** Capability for storing in-app inbox messages. */
interface InboxWriter {
  /** Saves a message for later viewing in the app inbox. */
  saveToInbox(
    userId: string,
    title: string,
    body: string
  ): Promise<void>;
}

// implement email notification channel
class EmailNotificationChannel implements EmailSender {
  /** Sends email through the configured email provider. */
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
  /** Writes an in-app inbox message for a specific user. */
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
  /** Sends a push notification to a mobile device. */
  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string
  ): Promise<void> {
    console.log(`Sending push notification to ${deviceToken}`);
    console.log(`${title}: ${body}`);
  }

  /** Stores a copy of the notification in the app inbox. */
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
/** Sends a password reset email using any email-capable sender. */
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

/** Sends a push notification to a mobile device. */
async function notifyMobileUser(
  sender: PushSender,
  deviceToken: string,
  title: string,
  body: string
): Promise<void> {
  await sender.sendPushNotification(deviceToken, title, body);
}

/** Adds an in-app inbox notification for a user. */
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