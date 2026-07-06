/** Base contract shared by all course activities shown in the LMS. */
interface CourseActivity {
  /** Unique activity identifier. */
  id: string;
  /** Human-readable activity title. */
  title: string;
  /** Opens the activity for viewing in the UI. */
  open(): void;
}

/** Capability for activities that accept student submissions. */
interface Submittable {
  /** Submits student work content for review. */
  submit(studentId: string, content: string): void;
}

/** Capability for activities that can be graded manually. */
interface Gradable {
  /** Records a score for a given student submission. */
  grade(studentId: string, score: number): void;
}

/** Capability for activities that support automatic grading. */
interface AutoGradable {
  /** Runs automatic evaluation and returns a score. */
  autoGrade(studentId: string): number;
}

/** Capability for activities that use a grading rubric. */
interface RubricBased {
  /** Updates the rubric text used during grading. */
  setRubric(rubric: string): void;
}

/** Capability for activities that provide watchable video content. */
interface Watchable {
  /** Marks the video as watched for a specific student. */
  markWatched(studentId: string): void;
  /** Returns the URL of the video resource. */
  getVideoUrl(): string;
}

// implementing programming assignment
class ProgrammingAssignment
  implements CourseActivity, Submittable, Gradable, AutoGradable, RubricBased
{
  /**
   * @param id Unique activity identifier.
   * @param title Name shown to students.
   * @param rubric Optional rubric text used for grading.
   */
  constructor(
    public id: string,
    public title: string,
    private rubric: string = ""
  ) {}

  /** Opens the programming assignment activity. */
  open(): void {
    console.log(`Opening assignment: ${this.title}`);
  }

  /** Stores a student's submitted code content. */
  submit(studentId: string, content: string): void {
    console.log(`${studentId} submitted code: ${content}`);
  }

  /** Records a manual score for a student's submission. */
  grade(studentId: string, score: number): void {
    console.log(`${studentId} received ${score}`);
  }

  /** Runs a simulated autograder and returns a score. */
  autoGrade(studentId: string): number {
    console.log(`Running tests for ${studentId}`);
    return 90;
  }

  /** Replaces the rubric used to evaluate submissions. */
  setRubric(rubric: string): void {
    this.rubric = rubric;
  }
}

// implementing video lecture
class LectureVideo implements CourseActivity, Watchable {
  /**
   * @param id Unique activity identifier.
   * @param title Name shown to students.
   * @param videoUrl URL used by the player.
   */
  constructor(
    public id: string,
    public title: string,
    private videoUrl: string
  ) {}

  /** Opens the lecture video activity. */
  open(): void {
    console.log(`Opening video: ${this.title}`);
  }

  /** Marks this video as watched for one student. */
  markWatched(studentId: string): void {
    console.log(`${studentId} watched ${this.title}`);
  }

  /** Returns the video URL for playback. */
  getVideoUrl(): string {
    return this.videoUrl;
  }
}

// usage example
/** Displays the watch URL for any watchable activity. */
function showVideo(activity: Watchable): void {
  console.log(activity.getVideoUrl());
}

/** Submits work to any activity that supports submissions. */
function submitWork(activity: Submittable, studentId: string, content: string): void {
  activity.submit(studentId, content);
}

/** Executes autograding for activities that support it. */
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