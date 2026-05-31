export interface ProjectStudent {
  id: string;
  projectId: string;
  userId: string;
  groupName?: string;
}

export interface StudentSummary {
  id: string;
  name?: string;
  email: string;
}

export interface ProjectAssignment {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectStatus: string;
  groupName?: string;
  teammates: StudentSummary[];
}
