type StudentGrade = {
  studentId: string;
  studentName: string;
  score: number;
  letterGrade: string;
};

interface GradeExporter {
  export(grades: StudentGrade[]): string;
}

// implements csv exporter
class CsvGradeExporter implements GradeExporter {
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