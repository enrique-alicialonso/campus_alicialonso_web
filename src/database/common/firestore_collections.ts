import { DEPARTMENT_VALUES } from './firestore_constants';

/**
 * Constants representing Firestore collection and document paths.
 * This object provides type-safe access to all Firestore paths in the application.
 *
 * @example
 * // Access main collections
 * db.collection(FIRESTORE_COLLECTIONS.USERS)
 *
 * // Access subcollections
 * db.collection(FIRESTORE_COLLECTIONS.DEPARTMENT_GROUPS('dept123'))
 *
 * // Get specific document paths
 * db.doc(FIRESTORE_COLLECTIONS.paths.user('user123'))
 */
export const FIRESTORE_COLLECTIONS = {
  /** Collection storing user profiles. Documents are keyed by Firebase Auth UID. */
  USERS: 'users',

  /** Collection storing department information. Documents are keyed by auto-generated ID or short code. */
  DEPARTMENTS: 'departments',

  /** Collection storing academic period schedules. Documents are keyed by auto-generated ID. */
  SCHEDULES: 'schedules',

  /** Collection storing course information. Documents are keyed by auto-generated ID. */
  COURSES: 'courses',

  /** Collection storing attendance records. Documents are keyed by auto-generated ID or composite ID. */
  ATTENDANCE_RECORDS: 'attendanceRecords',

  // Subcollections
  /**
   * Gets the path to a department's groups subcollection.
   * @param departmentId - The ID of the parent department
   * @returns Path to the groups subcollection
   */
  DEPARTMENT_GROUPS: (departmentId: keyof typeof DEPARTMENT_VALUES) => `departments/${departmentId}/groups`,

  /**
   * Gets the path to a schedule's events subcollection.
   * @param scheduleId - The ID of the parent schedule
   * @returns Path to the events subcollection
   */
  SCHEDULE_EVENTS: (scheduleId: string) => `schedules/${scheduleId}/events`,

  /**
   * Helper functions to get specific document paths.
   * These functions generate full paths to specific documents in the database.
   */
  paths: {
    /**
     * Gets the path to a specific user document.
     * @param userId - Firebase Auth UID of the user
     */
    user: (userId: string) => `users/${userId}`,

    /**
     * Gets the path to a specific department document.
     * @param departmentId - ID of the department
     */
    department: (departmentId: keyof typeof DEPARTMENT_VALUES) => `departments/${departmentId}`,

    /**
     * Gets the path to a specific department group document.
     * @param departmentId - ID of the parent department
     * @param groupId - ID of the group
     */
    departmentGroup: (departmentId: keyof typeof DEPARTMENT_VALUES, groupId: string) =>
      `departments/${departmentId}/groups/${groupId}`,

    /**
     * Gets the path to a specific schedule document.
     * @param scheduleId - ID of the schedule
     */
    schedule: (scheduleId: string) => `schedules/${scheduleId}`,

    /**
     * Gets the path to a specific schedule event document.
     * @param scheduleId - ID of the parent schedule
     * @param eventId - ID of the event
     */
    scheduleEvent: (scheduleId: string, eventId: string) => `schedules/${scheduleId}/events/${eventId}`,

    /**
     * Gets the path to a specific course document.
     * @param courseId - ID of the course
     */
    course: (courseId: string) => `courses/${courseId}`,

    /**
     * Gets the path to a specific attendance record document.
     * @param attendanceRecordId - ID of the attendance record
     */
    attendanceRecord: (attendanceRecordId: string) => `attendanceRecords/${attendanceRecordId}`,
  },
} as const;

/**
 * Type representing all possible collection paths in Firestore.
 * This can be used to type-check collection references.
 */
export type FirestoreCollectionPath =
  | typeof FIRESTORE_COLLECTIONS.USERS
  | typeof FIRESTORE_COLLECTIONS.DEPARTMENTS
  | typeof FIRESTORE_COLLECTIONS.SCHEDULES
  | typeof FIRESTORE_COLLECTIONS.COURSES
  | typeof FIRESTORE_COLLECTIONS.ATTENDANCE_RECORDS
  | ReturnType<typeof FIRESTORE_COLLECTIONS.DEPARTMENT_GROUPS>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.SCHEDULE_EVENTS>;

/**
 * Type representing all possible document paths in Firestore.
 * This can be used to type-check document references.
 */
export type FirestoreDocumentPath =
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.user>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.department>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.departmentGroup>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.schedule>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.scheduleEvent>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.course>
  | ReturnType<typeof FIRESTORE_COLLECTIONS.paths.attendanceRecord>;
