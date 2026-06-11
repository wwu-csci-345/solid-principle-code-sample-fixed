type BugReport = {
  title: string;
  description: string;
  reportedBy: string;
  severity: "low" | "medium" | "high";
};

interface IssueTracker {
  createIssue(report: BugReport): Promise<string>;
}

interface TeamNotifier {
  notifyHighSeverityBug(ticketId: string, title: string): Promise<void>;
}

interface BugReportRepository {
  save(report: BugReport, ticketId: string): Promise<void>;
}

class JiraIssueTracker implements IssueTracker {
  async createIssue(report: BugReport): Promise<string> {
    console.log(`Creating Jira issue: ${report.title}`);
    return "JIRA-123";
  }
}

class SlackTeamNotifier implements TeamNotifier {
  async notifyHighSeverityBug(ticketId: string, title: string): Promise<void> {
    console.log(
      `Posting to #engineering-alerts: High severity bug reported: ${ticketId} - ${title}`
    );
  }
}

class PostgresBugReportRepository implements BugReportRepository {
  async save(report: BugReport, ticketId: string): Promise<void> {
    console.log(`Saving bug report for ticket ${ticketId} to PostgreSQL`);
  }
}

class BugReportService {
  constructor(
    private readonly issueTracker: IssueTracker,
    private readonly notifier: TeamNotifier,
    private readonly repository: BugReportRepository
  ) {}

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