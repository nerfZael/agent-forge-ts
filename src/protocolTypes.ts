type DateTime = string;

enum Status {
  created = "created",
  running = "running",
  completed = "completed",
}

interface Artifact {
  createdAt: DateTime;
  modifiedAt: DateTime;
  artifactId: string;
  agentCreated: boolean;
  relativePath: string;
  fileName: string;
}

interface TaskRequestBody {
  input: string;
  additionalInput: any;
}

interface Task {
  createdAt: DateTime;
  modifiedAt: DateTime;
  taskId: string;
  input: string;
  additionalInput: any;
  artifacts: Artifact[];
}

interface StepRequestBody {
  name: string | null;
  input: string;
  additionalInput: any;
}

interface Step {
  createdAt: DateTime;
  modifiedAt: DateTime;
  taskId: string;
  stepId: string;
  name: string | null;
  status: Status;
  input: string;
  additionalInput: any;
  output: string | null;
  additionalOutput: any;
  artifacts: Artifact[];
  isLast: boolean;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface TaskListResponse {
  tasks: Task[] | null;
  pagination: Pagination | null;
}

interface TaskStepsListResponse {
  steps: Step[] | null;
  pagination: Pagination | null;
}

interface TaskArtifactsListResponse {
  artifacts: Artifact[] | null;
  pagination: Pagination | null;
}

interface ArtifactUpload {
  file: string;
  relativePath: string;
}