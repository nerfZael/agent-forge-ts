export type DateTime = string;

export enum Status {
  created = "created",
  running = "running",
  completed = "completed",
}

export interface Artifact {
  created_at: DateTime;
  modified_at: DateTime;
  artifact_id: string;
  agent_created: boolean;
  relative_path: string;
  file_name: string;
}

export interface TaskRequestBody {
  input: string;
  additional_input: any;
}

export interface Task {
  created_at: DateTime;
  modified_at: DateTime;
  task_id: string;
  input: string;
  additional_input: any;
  artifacts: Artifact[];
}

export interface StepRequestBody {
  name: string | null;
  input: string;
  additional_input: any;
}

export interface Step {
  created_at: DateTime;
  modified_at: DateTime;
  task_id: string;
  step_id: string;
  name: string | null;
  status: Status;
  input: string;
  additional_input: any;
  output: string | null;
  additional_output: any;
  artifacts: Artifact[];
  is_last: boolean;
}

export interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
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
  relative_path: string;
}