/** Abstraction for user persistence. */
interface UserRepository {
  /** Saves a new user record to data storage. */
  save(user: {
    /** System-generated user id. */
    id: string;
    /** User email address. */
    email: string;
    /** Hashed password value. */
    passwordHash: string;
  }): Promise<void>;
}

/** Abstraction for secure password hashing. */
interface PasswordHasher {
  /** Returns a hashed representation of a plain password. */
  hash(password: string): Promise<string>;
}

/** Abstraction for sending onboarding emails. */
interface WelcomeEmailSender {
  /** Sends a welcome email to a newly registered user. */
  sendWelcomeEmail(email: string): Promise<void>;
}

/** Abstraction for writing security or audit events. */
interface AuditLogger {
  /** Writes an audit message to the logging backend. */
  write(message: string): Promise<void>;
}

/** PostgreSQL-backed implementation of user persistence. */
class PostgresUserRepository implements UserRepository {
  /** Persists the user in PostgreSQL (simulated in this demo). */
  async save(user: {
    id: string;
    email: string;
    passwordHash: string;
  }): Promise<void> {
    console.log(`Saving user ${user.email} to PostgreSQL`);
  }
}

/** Bcrypt-style hasher implementation (simplified for teaching). */
class BcryptPasswordHasher implements PasswordHasher {
  /** Hashes the provided password. */
  async hash(password: string): Promise<string> {
    // Simplified for teaching.
    return `bcrypt:${password}`;
  }
}

/** SendGrid-backed welcome email implementation. */
class SendGridWelcomeEmailSender implements WelcomeEmailSender {
  /** Sends a welcome message through SendGrid. */
  async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Sending welcome email to ${email} through SendGrid`);
  }
}

/** File-backed audit logger implementation. */
class FileAuditLogger implements AuditLogger {
  /** Appends an audit message to file storage (simulated). */
  async write(message: string): Promise<void> {
    console.log(`Writing audit log to file: ${message}`);
  }
}

// implement user registration service
/** Coordinates validation, persistence, onboarding, and audit logging. */
class UserRegistrationService {
  /**
   * @param userRepository Persists newly created users.
   * @param passwordHasher Hashes raw passwords before save.
   * @param welcomeEmailSender Sends post-registration welcome email.
   * @param auditLogger Records user registration events.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly welcomeEmailSender: WelcomeEmailSender,
    private readonly auditLogger: AuditLogger
  ) {}

  /** Registers a user by validating input and invoking dependencies. */
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