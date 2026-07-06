export {};

/** Structured bug data submitted by a user or tester. */
type BugReport = {
  /** Short summary used as the issue title in trackers. */
  title: string;
  /** Detailed reproduction notes and observed behavior. */
  description: string;
  /** Email or identifier of the person filing the bug. */
  reportedBy: string;
  /** Business impact level used for triage and alerting. */
  severity: "low" | "medium" | "high";
};

/** Abstraction for an external issue tracking system. */
interface IssueTracker {
  /** Creates a remote issue and returns its ticket id. */
  createIssue(report: BugReport): Promise<string>;
}

/** Abstraction for sending bug alerts to a team channel. */
interface TeamNotifier {
  /** Sends a high-priority alert for a newly created ticket. */
  notifyHighSeverityBug(ticketId: string, title: string): Promise<void>;
}

/** Abstraction for persisting bug reports to storage. */
interface BugReportRepository {
  /** Stores the report together with the external ticket id. */
  save(report: BugReport, ticketId: string): Promise<void>;
}

/** Jira-backed implementation of issue creation. */
class JiraIssueTracker implements IssueTracker {
  /** Creates a Jira issue and returns a simulated ticket id. */
  async createIssue(report: BugReport): Promise<string> {
    console.log(`Creating Jira issue: ${report.title}`);
    return "JIRA-123";
  }
}

/** Slack-backed implementation for high severity notifications. */
class SlackTeamNotifier implements TeamNotifier {
  /** Posts a high severity bug alert to the engineering channel. */
  async notifyHighSeverityBug(ticketId: string, title: string): Promise<void> {
    console.log(
      `Posting to #engineering-alerts: High severity bug reported: ${ticketId} - ${title}`
    );
  }
}

/** PostgreSQL-backed persistence implementation for bug reports. */
class PostgresBugReportRepository implements BugReportRepository {
  /** Saves the report and its ticket association. */
  async save(report: BugReport, ticketId: string): Promise<void> {
    console.log(`Saving bug report for ticket ${ticketId} to PostgreSQL`);
  }
}

/** Coordinates validation, issue creation, storage, and optional alerts. */
class BugReportService {
  /**
   * @param issueTracker Creates external issue tickets.
   * @param notifier Sends high severity notifications.
   * @param repository Persists submitted bug reports.
   */
  constructor(
    private readonly issueTracker: IssueTracker,
    private readonly notifier: TeamNotifier,
    private readonly repository: BugReportRepository
  ) {}

  /** Validates and submits a bug report through all configured dependencies. */
  async submitBugReport(report: BugReport): Promise<void> {
    if (report.title.trim() === "") {
      throw new Error("Bug report title is required.");
    }

    if (report.description.trim() === "") {
      throw new Error("Bug report description is required.");
    }

    const ticketId = await this.issueTracker.createIssue(report);

    await this.repository.save(report, ticketId);

    if (report.severity === "high") {
      await this.notifier.notifyHighSeverityBug(ticketId, report.title);
    }
  }
}

// usage example
const service = new BugReportService(
  new JiraIssueTracker(),
  new SlackTeamNotifier(),
  new PostgresBugReportRepository()
);

// await service.submitBugReport({
//   title: "Search results sometimes disappear",
//   description: "After applying two filters, the result list becomes empty.",
//   reportedBy: "alice@example.com",
//   severity: "high",
// });