/** Flat grade record for one student. */
type StudentGrade = {
  /** System identifier for the student. */
  studentId: string;
  /** Human-readable student name. */
  studentName: string;
  /** Numeric score used to derive the letter grade. */
  score: number;
  /** Letter representation of performance. */
  letterGrade: string;
};

/** Common exporter contract for grade output formats. */
interface GradeExporter {
  /** Converts grade data to a specific serialized format. */
  export(grades: StudentGrade[]): string;
}

// implements csv exporter
class CsvGradeExporter implements GradeExporter {
  /** Renders grades as CSV with a header row. */
  export(grades: StudentGrade[]): string {
    const header = "studentId,studentName,score,letterGrade";

    const rows = grades.map(grade => {
      return `${grade.studentId},${grade.studentName},${grade.score},${grade.letterGrade}`;
    });

    return [header, ...rows].join("\n");
  }
}

// implements html exporter
class HtmlGradeExporter implements GradeExporter {
  /** Renders grades as a basic HTML table. */
  export(grades: StudentGrade[]): string {
    const rows = grades
      .map(grade => {
        return `
          <tr>
            <td>${grade.studentId}</td>
            <td>${grade.studentName}</td>
            <td>${grade.score}</td>
            <td>${grade.letterGrade}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <h1>Student Grades</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Score</th>
          <th>Letter Grade</th>
        </tr>
        ${rows}
      </table>
    `;
  }
}

// implements json exporter
class JsonGradeExporter implements GradeExporter {
  /** Renders grades as pretty-printed JSON. */
  export(grades: StudentGrade[]): string {
    return JSON.stringify(grades, null, 2);
  }
}

// Example usage
const grades: StudentGrade[] = [
  {
    studentId: "s101",
    studentName: "Maya Chen",
    score: 94,
    letterGrade: "A",
  },
  {
    studentId: "s102",
    studentName: "Jordan Lee",
    score: 87,
    letterGrade: "B",
  },
];

/** Sends exported grade content to a download destination (console in this demo). */
function downloadGrades(
  grades: StudentGrade[],
  exporter: GradeExporter
): void {
  const content = exporter.export(grades);
  console.log(content);
}

downloadGrades(grades, new CsvGradeExporter());
downloadGrades(grades, new HtmlGradeExporter());
downloadGrades(grades, new JsonGradeExporter());