export type DateTime = string;

export enum Status {
  created = "created",
  running = "running",
  completed = "completed",
}

export interface Artifact {
  createdAt: DateTime;
  modifiedAt: DateTime;
  artifactId: string;
  agentCreated: boolean;
  relativePath: string;
  fileName: string;
}

export interface TaskRequestBody {
  input: string;
  additionalInput: any;
}

export interface Task {
  createdAt: DateTime;
  modifiedAt: DateTime;
  taskId: string;
  input: string;
  additionalInput: any;
  artifacts: Artifact[];
}

export interface StepRequestBody {
  name: string | null;
  input: string;
  additionalInput: any;
}

export interface Step {
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

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TaskListResponse {
  tasks: Task[] | null;
  pagination: Pagination | null;
}

export interface TaskStepsListResponse {
  steps: Step[] | null;
  pagination: Pagination | null;
}

export interface TaskArtifactsListResponse {
  artifacts: Artifact[] | null;
  pagination: Pagination | null;
}

export interface ArtifactUpload {
  file: string;
  relativePath: string;
}