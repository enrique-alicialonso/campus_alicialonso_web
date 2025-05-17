import { FirestoreDocument, ATTENDANCE_STATUS, SharedDocumentValidator } from '../common';

export type AttendanceStatus = keyof typeof ATTENDANCE_STATUS;

/**
 * Represents an attendance record.
 * Records are immutable once created and track attendance for a specific event.
 */
export interface AttendanceRecordModel extends FirestoreDocument {
  /** ID of the course this attendance record belongs to */
  courseId: string;
  /** ID of the schedule containing the event */
  scheduleId?: string;
  /** ID of the event this attendance record is for */
  eventId?: string;
  /** IDs of the groups being tracked */
  groupIds: string[];
  /** Timestamp when attendance was taken */
  attendanceTime: Date;
  /** UID of the teacher who took attendance */
  teacherUid: string;
  /** Map of student UIDs to their attendance status */
  attendances: {
    [studentUid: string]: AttendanceStatus;
  };
  /** Optional notes for individual students */
  notes?: {
    [studentUid: string]: string;
  };
}

export class AttendanceRecordValidator extends SharedDocumentValidator<AttendanceRecordModel> {
  validateModel(data: unknown): data is AttendanceRecordModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: AttendanceRecordModel) {
    const errors: string[] = [];

    if (!((data.courseId ?? '') as string).trim()) {
      errors.push('Course ID is required');
    }

    if (!Array.isArray(data.groupIds) || data.groupIds.length === 0) {
      errors.push('At least one group ID is required');
    }

    if (!(data.attendanceTime instanceof Date)) {
      errors.push('Attendance time must be a valid Date');
    }

    if (!((data.teacherUid ?? '') as string).trim()) {
      errors.push('Teacher UID is required');
    }

    if (!data.attendances || Object.keys(data.attendances).length === 0) {
      errors.push('At least one attendance record is required');
    }

    // Validate attendance status values
    const validStatuses = Object.keys(ATTENDANCE_STATUS);
    const invalidStatuses = Object.values(data.attendances || {}).filter(
      (status: unknown) => !validStatuses.includes(status as string),
    );

    if (invalidStatuses.length > 0) {
      errors.push('Invalid attendance status found');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<AttendanceRecordModel>) {
    const errors: string[] = [];

    if (data.groupIds && data.groupIds.length === 0) {
      errors.push('Cannot remove all group IDs');
    }

    if (data.attendances) {
      const validStatuses = Object.keys(ATTENDANCE_STATUS);
      const invalidStatuses = Object.values(data.attendances).filter((status) => !validStatuses.includes(status));

      if (invalidStatuses.length > 0) {
        errors.push('Invalid attendance status found');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const attendanceRecordValidator = new AttendanceRecordValidator();
