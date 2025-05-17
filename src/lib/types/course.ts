import { DocumentData, Timestamp } from "firebase/firestore";

export type CourseData = {
  bannerImage:
    | {
        name: string | undefined;
        url: string | undefined;
      }
    | undefined;
  colorValue: number | undefined;
  updatedAt: Date | undefined;
  createdAt: Date | undefined;
  groups: GroupData[] | undefined;
};

export type GroupData = {
  colorHex: string;
  createdAt: Date;
  createdBy: string;
  groupId: string;
  name: string;
  participantIds: string[];
};

export interface ActivityRecord extends DocumentData {
  /** Id of the record */
  id?: string;

  /** Id of the course of this record */
  courseId?: string;

  /** Id of the calendar of event/course of this record */
  calendarId?: string;

  /** Id of the event source of this record */
  eventId?: string;

  /** Flag signaling if the record is open or closed for registrations */
  open?: boolean;

  /** Id of the user who opened the record */
  openedBy?: string;

  /** Timestamp of the opening of the record */
  openedAt?: Timestamp;

  /** Id of the user who opened the record */
  closedBy?: string;

  /** Timestamp of the closing of the record */
  closedAt?: Timestamp;

  /** Additional notes for the record */
  notes?: string;

  /** Ids of the users that confirmed attendance */
  attendedBy?: AttendanceConfirmation[];

  /** Absence excuses that apply to this record */
  excuses?: AbsenceExcuse[];

  /** Ids of the users whose attendance is required */
  requiredBy?: string[];

  /** Ids of the groups that are required to attend this record */
  recordGroups?: string[];
}

export interface ActivityRecordData {
  /** Id of the record */
  id?: string;

  /** Id of the course of this record */
  courseId?: string;

  /** Id of the calendar of event/course of this record */
  calendarId?: string;

  /** Id of the event source of this record */
  eventId?: string;

  /** Flag signaling if the record is open or closed for registrations */
  open?: boolean;

  /** Id of the user who opened the record */
  openedBy?: string;

  /** Timestamp of the opening of the record */
  openedAt?: string;

  /** Id of the user who opened the record */
  closedBy?: string;

  /** Timestamp of the closing of the record */
  closedAt?: string;

  /** Additional notes for the record */
  notes?: string;

  /** Ids of the users that confirmed attendance */
  attendedBy?: AttendanceConfirmationData[];

  /** Absence excuses that apply to this record */
  excuses?: AbsenceExcuse[];

  /** Ids of the users whose attendance is required */
  requiredBy?: string[];

  /** Ids of the groups that are required to attend this record */
  recordGroups?: string[];
}

export type ConfirmationStatus =
  | "none"
  | "manuallyConfirmed"
  | "selfConfirmed"
  | "confirmedByUnknown"
  | "justified"
  | "absent";

export type AttendanceConfirmation = {
  userId?: string;
  confirmedAt?: Timestamp;
  confirmedBy?: string;
  fullName?: string;
  confirmationStatus?: ConfirmationStatus;
  justificationDocId?: string;
};

export type AttendanceConfirmationData = {
  userId?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  fullName?: string;
  confirmationStatus?: ConfirmationStatus;
  confirmationStatusDate?: string;
  justificationDocId?: string;
};

export type AbsenceExcuse = {
  userId: string;
  excuse: string;
};

export type StudentAttendanceReport = {
  fullName: string;
  attendance: AttendanceConfirmationData[];
};
