import { FirestoreDocument, SharedDocumentValidator } from '../common';

/**
 * Represents an event within a schedule.
 * Events are stored as subcollections under schedules.
 */
export interface ScheduleEventModel extends FirestoreDocument {
  /** Title of the event */
  title: string;
  /** Detailed description of the event */
  description: string;
  /** Start time of the event */
  startTime: Date;
  /** End time of the event */
  endTime: Date;
  /** Array of host UIDs */
  hosts: string[];
  /** Array of participant UIDs or group IDs */
  participants: string[];
  /** Array of course IDs */
  courseIds: string[];
  /** Optional location where the event takes place */
  location?: string;
  /** Optional color for displaying the event in the UI */
  color?: string;
}

export class ScheduleEventValidator extends SharedDocumentValidator<ScheduleEventModel> {
  validateModel(data: unknown): data is ScheduleEventModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: ScheduleEventModel) {
    const errors: string[] = [];

    if (!((data.title ?? '') as string).trim()) {
      errors.push('Title is required');
    }

    if (!((data.description ?? '') as string).trim()) {
      errors.push('Description is required');
    }

    if (!(data.startTime instanceof Date)) {
      errors.push('Start time must be a valid Date');
    }

    if (!(data.endTime instanceof Date)) {
      errors.push('End time must be a valid Date');
    }

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.push('Start time must be before end time');
    }

    if (!Array.isArray(data.hosts) || data.hosts.length === 0) {
      errors.push('At least one host is required');
    }

    if (!Array.isArray(data.participants)) {
      errors.push('Participants must be an array');
    }

    if (!Array.isArray(data.courseIds) || data.courseIds.length === 0) {
      errors.push('At least one course ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<ScheduleEventModel>) {
    const errors: string[] = [];

    if (data.title === '') {
      errors.push('Title cannot be empty');
    }

    if (data.description === '') {
      errors.push('Description cannot be empty');
    }

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.push('Start time must be before end time');
    }

    if (data.hosts && data.hosts.length === 0) {
      errors.push('Cannot remove all hosts');
    }

    if (data.courseIds && data.courseIds.length === 0) {
      errors.push('Cannot remove all course IDs');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const scheduleEventValidator = new ScheduleEventValidator();
