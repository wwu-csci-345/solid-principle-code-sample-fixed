/** Read-only course contract shared by active and archived courses. */
interface CourseInfo {
  /** Course code shown in schedules and summaries. */
  readonly code: string;
  /** Returns the current or historical enrollment total. */
  getEnrollmentCount(): number;
}

/** Course contract for courses that still allow enrollment. */
interface EnrollableCourse extends CourseInfo {
  /** Adds a student to the class roster when possible. */
  enroll(studentId: string): void;
}

/** Active course with enrollment rules and mutable roster state. */
class ActiveCourse implements EnrollableCourse {
  /** In-memory roster of student ids currently enrolled. */
  private enrolledStudents: string[] = [];

  /**
   * @param code Human-readable course identifier.
   * @param capacity Maximum number of students allowed.
   */
  constructor(
    public readonly code: string,
    private readonly capacity: number
  ) {}

  /** Enrolls a student after capacity and duplicate checks. */
  enroll(studentId: string): void {
    if (this.enrolledStudents.length >= this.capacity) {
      throw new Error("Course is full.");
    }

    if (this.enrolledStudents.includes(studentId)) {
      throw new Error("Student is already enrolled.");
    }

    this.enrolledStudents.push(studentId);
  }

  /** Returns the current number of enrolled students. */
  getEnrollmentCount(): number {
    return this.enrolledStudents.length;
  }
}

/** Archived course exposes summary data but cannot be modified. */
class ArchivedCourse implements CourseInfo {
  /**
   * @param code Human-readable course identifier.
   * @param finalEnrollmentCount Final roster size at archive time.
   */
  constructor(
    public readonly code: string,
    private readonly finalEnrollmentCount: number
  ) {}

  /** Returns the historical enrollment count stored at archive time. */
  getEnrollmentCount(): number {
    return this.finalEnrollmentCount;
  }
}

// Example usage:
/** Displays a one-line summary for any course-like object. */
function displayCourseSummary(course: CourseInfo): void {
  console.log(`${course.code}: ${course.getEnrollmentCount()} students`);
}

/** Enrolls a student into an enrollable course and logs the result. */
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