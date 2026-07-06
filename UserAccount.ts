/** Base profile shared by all account providers. */
interface UserAccount {
  /** Unique account id in the local system. */
  readonly id: string;
  /** Primary email address for the user. */
  readonly email: string;
  /** Identity provider that owns authentication. */
  readonly provider: "local" | "google";
}

/** Capability for accounts that support password authentication. */
interface PasswordAuthenticatable {
  /** Validates a supplied password against stored credentials. */
  verifyPassword(password: string): Promise<boolean>;
  /** Changes password after validating the old password first. */
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

/** Locally managed account with password-based authentication. */
class LocalUserAccount implements UserAccount, PasswordAuthenticatable {
  /** Identifies this account as locally authenticated. */
  public readonly provider = "local";

  /**
   * @param id Unique account id.
   * @param email User email address.
   * @param passwordHash Stored password hash (plain in this demo).
   */
  constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string
  ) {}

  /** Checks whether the supplied password matches stored credentials. */
  async verifyPassword(password: string): Promise<boolean> {
    // Simplified for teaching purposes.
    return password === this.passwordHash;
  }

  /** Updates the password only when the old password is valid. */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const valid = await this.verifyPassword(oldPassword);

    if (!valid) {
      throw new Error("Old password is incorrect.");
    }

    this.passwordHash = newPassword;
  }
}

/** Google-managed account that does not expose password operations. */
class GoogleUserAccount implements UserAccount {
  /** Identifies this account as Google-authenticated. */
  public readonly provider = "google";

  /**
   * @param id Unique account id.
   * @param email User email address.
   * @param googleId Provider-specific Google subject id.
   */
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly googleId: string
  ) {}
}

// Example usage:
/** Logs in a user using password-capable account abstractions only. */
async function loginWithPassword(
  account: UserAccount & PasswordAuthenticatable,
  password: string
): Promise<void> {
  const valid = await account.verifyPassword(password);

  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  console.log(`Logged in as ${account.email}`);
}

const local = new LocalUserAccount("u1", "alice@example.com", "secret");
// await loginWithPassword(local, "secret");

const google = new GoogleUserAccount("u2", "bob@example.com", "google-123");

// Compile-time error, which is good:
// await loginWithPassword(google, "anything");