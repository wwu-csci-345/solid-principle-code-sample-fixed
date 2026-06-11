interface UserAccount {
  readonly id: string;
  readonly email: string;
  readonly provider: "local" | "google";
}

interface PasswordAuthenticatable {
  verifyPassword(password: string): Promise<boolean>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

class LocalUserAccount implements UserAccount, PasswordAuthenticatable {
  public readonly provider = "local";

  constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string
  ) {}

  async verifyPassword(password: string): Promise<boolean> {
    // Simplified for teaching purposes.
    return password === this.passwordHash;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const valid = await this.verifyPassword(oldPassword);

    if (!valid) {
      throw new Error("Old password is incorrect.");
    }

    this.passwordHash = newPassword;
  }
}

class GoogleUserAccount implements UserAccount {
  public readonly provider = "google";

  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly googleId: string
  ) {}
}

// Example usage:
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