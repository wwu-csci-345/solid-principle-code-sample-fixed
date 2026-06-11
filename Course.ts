interface CourseInfo {
  readonly code: string;
  getEnrollmentCount(): number;
}

interface EnrollableCourse extends CourseInfo {
  enroll(studentId: string): void;
}

class ActiveCourse implements EnrollableCourse {
  private enrolledStudents: string[] = [];

  constructor(
    public readonly code: string,
    private readonly capacity: number
  ) {}

  enroll(studentId: string): void {
    if (this.enrolledStudents.length >= this.capacity) {
      throw new Error("Course is full.");
    }

    if (this.enrolledStudents.includes(studentId)) {
      throw new Error("Student is already enrolled.");
    }

    this.enrolledStudents.push(studentId);
  }

  getEnrollmentCount(): number {
    return this.enrolledStudents.length;
  }
}

class ArchivedCourse implements CourseInfo {
  constructor(
    public readonly code: string,
    private readonly finalEnrollmentCount: number
  ) {}

  getEnrollmentCount(): number {
    return this.finalEnrollmentCount;
  }
}

// Example usage:
function displayCourseSummary(course: CourseInfo): void {
  console.log(`${course.code}: ${course.getEnrollmentCount()} students`);
}

function enrollStudent(course: EnrollableCourse, studentId: string): void {
  course.enroll(studentId);
  console.log(`${studentId} enrolled in ${course.code}`);
}

const activeCourse = new ActiveCourse("CSCI 345", 30);
const archivedCourse = new ArchivedCourse("CSCI 330", 28);

displayCourseSummary(activeCourse);
displayCourseSummary(archivedCourse);

enrollStudent(activeCourse, "s123");

// Compile-time error, which is good:
// enrollStudent(archivedCourse, "s456");