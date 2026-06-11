interface UserRepository {
  save(user: {
    id: string;
    email: string;
    passwordHash: string;
  }): Promise<void>;
}

interface PasswordHasher {
  hash(password: string): Promise<string>;
}

interface WelcomeEmailSender {
  sendWelcomeEmail(email: string): Promise<void>;
}

interface AuditLogger {
  write(message: string): Promise<void>;
}

class PostgresUserRepository implements UserRepository {
  async save(user: {
    id: string;
    email: string;
    passwordHash: string;
  }): Promise<void> {
    console.log(`Saving user ${user.email} to PostgreSQL`);
  }
}

class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    // Simplified for teaching.
    return `bcrypt:${password}`;
  }
}

class SendGridWelcomeEmailSender implements WelcomeEmailSender {
  async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Sending welcome email to ${email} through SendGrid`);
  }
}

class FileAuditLogger implements AuditLogger {
  async write(message: string): Promise<void> {
    console.log(`Writing audit log to file: ${message}`);
  }
}

// implement user registration service
class UserRegistrationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly welcomeEmailSender: WelcomeEmailSender,
    private readonly auditLogger: AuditLogger
  ) {}

  async register(email: string, password: string): Promise<void> {
    if (!email.includes("@")) {
      throw new Error("Invalid email address.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const user = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
    };

    await this.userRepository.save(user);
    await this.welcomeEmailSender.sendWelcomeEmail(email);
    await this.auditLogger.write(`User registered: ${email}`);
  }
}

// usage example
const service = new UserRegistrationService(
  new PostgresUserRepository(),
  new BcryptPasswordHasher(),
  new SendGridWelcomeEmailSender(),
  new FileAuditLogger()
);

// await service.register("alice@example.com", "secure-password");