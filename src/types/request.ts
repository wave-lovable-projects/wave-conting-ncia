export type RequestType = 'BM' | 'ACCOUNT' | 'PROFILE' | 'BALANCE' | 'OTHER';
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';

export interface RequestStatusChange {
  id: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  changedBy: string;
  changedAt: string;
}

export interface RequestComment {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  text: string;
  attachments: string[];
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  requesterId: string;
  requesterName: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  statusHistory: RequestStatusChange[];
  comments: RequestComment[];
}

export interface RequestFilters {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  requesterId?: string;
  assigneeId?: string;
}
