import { DEPARTMENT_VALUES, FirestoreDocument, SharedDocumentValidator } from '../common';

/**
 * Represents an academic schedule.
 * Schedules contain events and are associated with specific departments and periods.
 */
export interface ScheduleModel extends FirestoreDocument {
  /** Title of the schedule */
  title: string;
  /** Academic period identifier (e.g., "Fall 2023") */
  academicPeriod: string;
  /** ID of the department this schedule belongs to */
  departmentId: string;
  /** Start date of the schedule period */
  startDate: Date;
  /** End date of the schedule period */
  endDate: Date;
  /** Indicates if the schedule is archived */
  archived: boolean;
}

export class ScheduleValidator extends SharedDocumentValidator<ScheduleModel> {
  validateModel(data: unknown): data is ScheduleModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: ScheduleModel) {
    const errors: string[] = [];

    if (!((data.title ?? '') as string).trim()) {
      errors.push('Title is required');
    }

    if (!((data.academicPeriod ?? '') as string).trim()) {
      errors.push('Academic period is required');
    }

    if (
      !((data.departmentId ?? '') as string) ||
      !Object.keys(DEPARTMENT_VALUES).includes((data.departmentId ?? '') as string)
    ) {
      errors.push('Valid department ID is required');
    }

    if (!(data.startDate instanceof Date)) {
      errors.push('Start date must be a valid Date');
    }

    if (!(data.endDate instanceof Date)) {
      errors.push('End date must be a valid Date');
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      errors.push('Start date must be before end date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<ScheduleModel>) {
    const errors: string[] = [];

    if (data.title === '') {
      errors.push('Title cannot be empty');
    }

    if (data.departmentId && !Object.keys(DEPARTMENT_VALUES).includes(data.departmentId)) {
      errors.push('Invalid department ID');
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      errors.push('Start date must be before end date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const scheduleValidator = new ScheduleValidator();
