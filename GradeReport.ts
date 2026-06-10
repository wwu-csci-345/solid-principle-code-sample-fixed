type Student = {
  id: string;
  name: string;
  scores: number[];
};

type GradeSummary = {
  studentName: string;
  average: number;
  letterGrade: string;
};

class GradeCalculator {
  calculateAverage(scores: number[]): number {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
  }

  getLetterGrade(average: number): string {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  }

  summarize(student: Student): GradeSummary {
    const average = this.calculateAverage(student.scores);

    return {
      studentName: student.name,
      average,
      letterGrade: this.getLetterGrade(average),
    };
  }
}

class HtmlGradeReportFormatter {
  format(summary: GradeSummary): string {
    return `
      <h1>Grade Report</h1>
      <p>Student: ${summary.studentName}</p>
      <p>Average: ${summary.average.toFixed(2)}</p>
      <p>Grade: ${summary.letterGrade}</p>
    `;
  }
}

class FileReportWriter {
  save(filename: string, content: string): void {
    console.log(`Saving report to ${filename}`);
    console.log(content);
  }
}

class EmailReportSender {
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
