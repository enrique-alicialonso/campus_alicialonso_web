import { DocumentData, WithFieldValue } from 'firebase/firestore';
import {
  AccountRequestModel,
  accountRequestValidator,
  AttendanceRecordModel,
  attendanceRecordValidator,
  CourseModel,
  courseValidator,
  DepartmentModel,
  departmentValidator,
  GroupModel,
  groupValidator,
  ScheduleModel,
  scheduleValidator,
  UserModel,
  userValidator,
} from '../models';
import { createClientValidator } from './validator';

//- Client-specific base document type

/**
 * Base type for all Firestore client documents containing common fields
 */
export interface BaseDocument extends DocumentData {
  /** Firebase Authentication UID */
  uid: string;
  /** Timestamp when the document was created */
  created?: Date;
  /** Timestamp when the document was last updated */
  updated?: Date;
}

/**
 * Helper type to make all properties optional for updates
 * while maintaining type safety with FieldValues
 */
export type UpdateDocument<T> = Partial<T>;

/**
 * Helper type for document creation that excludes the uid
 * and allows FieldValues
 */
export type CreateDocument<T extends BaseDocument> = Omit<WithFieldValue<T>, 'uid'>;

export interface User extends BaseDocument, UserModel {}
export const clientUserValidator = createClientValidator(userValidator);

export interface Department extends BaseDocument, DepartmentModel {}
export const clientDepartmentValidator = createClientValidator(departmentValidator);

export interface Schedule extends BaseDocument, ScheduleModel {}
export const clientScheduleValidator = createClientValidator(scheduleValidator);

export interface Group extends BaseDocument, GroupModel {}
export const clientGroupValidator = createClientValidator(groupValidator);
/**
 * Special input type for group creation that allows user identification by email or display name
 */
export type GroupCreateInput = Omit<CreateDocument<Group>, 'members'> & {
  uid?: string;
  memberIdentifiers: string[]; // Array of emails or display names
};

/**
 * Type for groups with the members field populated with the User objects
 */
export type GroupWithMembers = Group & { members: User[] };

export interface Course extends BaseDocument, CourseModel {}
export const clientCourseValidator = createClientValidator(courseValidator);

export interface AttendanceRecord extends BaseDocument, AttendanceRecordModel {}
export const clientAttendanceRecordValidator = createClientValidator(attendanceRecordValidator);

export interface AccountRequest extends BaseDocument, AccountRequestModel {}
export const clientAccountRequestValidator = createClientValidator(accountRequestValidator);
