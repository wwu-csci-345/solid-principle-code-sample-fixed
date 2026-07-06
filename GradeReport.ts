/** Raw student record used as grade report input. */
type Student = {
  /** Unique student identifier. */
  id: string;
  /** Student display name. */
  name: string;
  /** List of assignment or exam scores. */
  scores: number[];
};

/** Computed summary for presenting student performance. */
type GradeSummary = {
  /** Student name copied from the source record. */
  studentName: string;
  /** Arithmetic mean of all provided scores. */
  average: number;
  /** Letter grade derived from the average score. */
  letterGrade: string;
};

/** Computes averages and letter grades from raw student scores. */
class GradeCalculator {
  /** Calculates the arithmetic mean for a score list. */
  calculateAverage(scores: number[]): number {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
  }

  /** Converts a numeric average into a letter grade. */
  getLetterGrade(average: number): string {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  }

  /** Produces a presentation-friendly summary for one student. */
  summarize(student: Student): GradeSummary {
    const average = this.calculateAverage(student.scores);

    return {
      studentName: student.name,
      average,
      letterGrade: this.getLetterGrade(average),
    };
  }
}

/** Formats grade summaries as a simple HTML snippet. */
class HtmlGradeReportFormatter {
  /** Renders summary fields as HTML text for display or export. */
  format(summary: GradeSummary): string {
    return `
      <h1>Grade Report</h1>
      <p>Student: ${summary.studentName}</p>
      <p>Average: ${summary.average.toFixed(2)}</p>
      <p>Grade: ${summary.letterGrade}</p>
    `;
  }
}

/** Persists generated reports to file storage (console in this demo). */
class FileReportWriter {
  /** Saves report content under the provided filename. */
  save(filename: string, content: string): void {
    console.log(`Saving report to ${filename}`);
    console.log(content);
  }
}

/** Sends generated reports through email (console in this demo). */
class EmailReportSender {
  /** Sends report content to a recipient email address. */
  send(email: string, content: string): void {
    console.log(`Sending report to ${email}`);
    console.log(content);
  }
}

// Example usage
const student: Student = {
  id: 's101',
  name: 'Maya Chen',
  scores: [92, 87, 95, 90],
};

const calculator = new GradeCalculator();
const formatter = new HtmlGradeReportFormatter();
const fileWriter = new FileReportWriter();
const emailSender = new EmailReportSender();

const summary = calculator.summarize(student);
const html = formatter.format(summary);

fileWriter.save('maya-grade-report.html', html);
emailSender.send('parent@example.com', html);
