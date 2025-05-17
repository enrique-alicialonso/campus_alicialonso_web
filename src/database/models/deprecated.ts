/**
 * @deprecated Use AttendanceRecord.attendances field instead
 */
export interface ActivityRecordConfirmation {
  confirmedAt: Date;
  confirmedBy: string;
  fullName: string;
  userId: string; // Google Workspace user ID
}

/**
 * @deprecated Use AttendanceRecord type instead
 */
export interface ActivityRecord {
  //@ts-nocheck
  attendedBy: ActivityRecordConfirmation[];
  closedAt: Date;
  closedBy: string; // Firebase Auth user ID
  courseId: string;
  createdAt: Date;
  notes?: string;
  open: boolean;
  openedAt: Date;
  openedBy: string; // Firebase Auth user ID
  updatedAt: Date;
}

/**
 * @deprecated Use the User type instead
 */
export interface CampusUser {
  uid: string; // Firebase Auth user ID
  gsuiteId: string; // Google Workspace user ID
  primaryEmail?: string; // Google Workspace user email
}
