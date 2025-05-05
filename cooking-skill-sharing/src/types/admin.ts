export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'content_create' | 'content_edit' | 'content_delete' | 'report' | 'other';
  timestamp: Date;
  details?: Record<string, any>;
}

export interface AdminStats {
  totalUsers: number;
  pendingReports: number;
  activeAnnouncements: number;
  featuredItems: number;
  dailyActiveUsers: number;
  contentCreatedToday: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'students' | 'instructors' | 'admins';
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'scheduled' | 'active' | 'expired';
  createdBy: string;
}

export interface ModAction {
  id: string;
  reportId: string;
  action: 'approve' | 'remove' | 'warn' | 'ban';
  moderatorId: string;
  timestamp: Date;
  note?: string;
}
