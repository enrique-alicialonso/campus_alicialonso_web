import { DocumentData, FieldValue } from 'firebase-admin/firestore';
import {
  AccountRequestModel,
  AttendanceRecordModel,
  CourseModel,
  DepartmentModel,
  GroupModel,
  ScheduleModel,
  UserModel,
  userValidator,
  departmentValidator,
  scheduleValidator,
  groupValidator,
  courseValidator,
  attendanceRecordValidator,
  accountRequestValidator,
  ScheduleEventModel,
  scheduleEventValidator,
} from '../models';
import { createAdminValidator } from './validator';

/**
 * Admin-specific base document type
 */
export interface BaseDocument extends DocumentData {
  /** Firebase Authentication UID */
  uid: string;
  /** Timestamp when the document was created */
  created?: Date | FieldValue;
  /** Timestamp when the document was last updated */
  updated?: Date | FieldValue;
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
export type CreateDocument<T extends BaseDocument> = Omit<T, 'uid'>;

export interface User extends BaseDocument, UserModel {}
export const adminUserValidator = createAdminValidator(userValidator);

export interface Department extends BaseDocument, DepartmentModel {}
export const adminDepartmentValidator = createAdminValidator(departmentValidator);

export interface Schedule extends BaseDocument, ScheduleModel {}
export const adminScheduleValidator = createAdminValidator(scheduleValidator);

export interface ScheduleEvent extends BaseDocument, ScheduleEventModel {}
export const adminScheduleEventValidator = createAdminValidator(scheduleEventValidator);

export interface Group extends BaseDocument, GroupModel {}
export const adminGroupValidator = createAdminValidator(groupValidator);

export interface Course extends BaseDocument, CourseModel {}
export const adminCourseValidator = createAdminValidator(courseValidator);

export interface AttendanceRecord extends BaseDocument, AttendanceRecordModel {}
export const adminAttendanceRecordValidator = createAdminValidator(attendanceRecordValidator);

export interface AccountRequest extends BaseDocument, AccountRequestModel {}
export const adminAccountRequestValidator = createAdminValidator(accountRequestValidator);
