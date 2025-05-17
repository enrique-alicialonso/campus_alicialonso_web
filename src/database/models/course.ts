import { FirestoreDocument, SharedDocumentValidator } from '../common';

/**
 * Represents a course in the system.
 * Courses are associated with teachers and academic years.
 */
export interface CourseModel extends FirestoreDocument {
  /** Name of the course */
  name: string;
  /** Optional detailed description of the course */
  description?: string;
  /** Optional color for displaying the course in the UI */
  color?: string;
  /** Optional URL to course image */
  imageUrl?: string;
  /** Array of teacher UIDs assigned to this course */
  teachers: string[];
  /** Academic year the course belongs to */
  academicYear: string;
}

export class CourseValidator extends SharedDocumentValidator<CourseModel> {
  validateModel(data: unknown): data is CourseModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: CourseModel) {
    const errors: string[] = [];

    if (!((data.name ?? '') as string).trim()) {
      errors.push('Course name is required');
    }

    if (!Array.isArray(data.teachers) || data.teachers.length === 0) {
      errors.push('At least one teacher is required');
    }

    if (!((data.academicYear ?? '') as string).trim()) {
      errors.push('Academic year is required');
    }

    if (!/^\d{4}-\d{4}$/.test((data.academicYear ?? '') as string)) {
      errors.push('Academic year must be in format YYYY-YYYY');
    }

    if (data.color && !/^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$/.test((data.color ?? '') as string)) {
      errors.push('Color must be a valid hex code or color name');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<CourseModel>) {
    const errors: string[] = [];

    if (data.name === '') {
      errors.push('Course name cannot be empty');
    }

    if (data.teachers && data.teachers.length === 0) {
      errors.push('Cannot remove all teachers');
    }

    if (data.color && !/^#[0-9A-Fa-f]{6}$|^[a-zA-Z]+$/.test(data.color)) {
      errors.push('Color must be a valid hex code or color name');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const courseValidator = new CourseValidator();
