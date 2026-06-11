interface CourseActivity {
  id: string;
  title: string;
  open(): void;
}

interface Submittable {
  submit(studentId: string, content: string): void;
}

interface Gradable {
  grade(studentId: string, score: number): void;
}

interface AutoGradable {
  autoGrade(studentId: string): number;
}

interface RubricBased {
  setRubric(rubric: string): void;
}

interface Watchable {
  markWatched(studentId: string): void;
  getVideoUrl(): string;
}

// implementing programming assignment
class ProgrammingAssignment
  implements CourseActivity, Submittable, Gradable, AutoGradable, RubricBased
{
  constructor(
    public id: string,
    public title: string,
    private rubric: string = ""
  ) {}

  open(): void {
    console.log(`Opening assignment: ${this.title}`);
  }

  submit(studentId: string, content: string): void {
    console.log(`${studentId} submitted code: ${content}`);
  }

  grade(studentId: string, score: number): void {
    console.log(`${studentId} received ${score}`);
  }

  autoGrade(studentId: string): number {
    console.log(`Running tests for ${studentId}`);
    return 90;
  }

  setRubric(rubric: string): void {
    this.rubric = rubric;
  }
}

// implementing video lecture
class LectureVideo implements CourseActivity, Watchable {
  constructor(
    public id: string,
    public title: string,
    private videoUrl: string
  ) {}

  open(): void {
    console.log(`Opening video: ${this.title}`);
  }

  markWatched(studentId: string): void {
    console.log(`${studentId} watched ${this.title}`);
  }

  getVideoUrl(): string {
    return this.videoUrl;
  }
}

// usage example
function showVideo(activity: Watchable): void {
  console.log(activity.getVideoUrl());
}

function submitWork(activity: Submittable, studentId: string, content: string): void {
  activity.submit(studentId, content);
}

function runAutograder(activity: AutoGradable, studentId: string): number {
  return activity.autoGrade(studentId);
}

const assignment = new ProgrammingAssignment("a1", "Binary Search Tree Lab");
const video = new LectureVideo("v1", "Introduction to Trees", "https://example.com/trees");

submitWork(assignment, "s123", "class BinarySearchTree { ... }");
runAutograder(assignment, "s123");

showVideo(video);

// Compile-time error, which is good:
// showVideo(assignment);

// Compile-time error, which is good:
// submitWork(video, "s123", "my answer");