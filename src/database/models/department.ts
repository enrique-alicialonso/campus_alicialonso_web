import { FirestoreDocument, SharedDocumentValidator } from '../common';

/**
 * Represents a department in the institution.
 * Departments are top-level organizational units that contain groups and schedules.
 */
export interface DepartmentModel extends FirestoreDocument {
  /** Name of the department */
  title: string;
  /** Detailed description of the department */
  description: string;
  /** Array of user UIDs who have manager privileges for this department */
  managers: string[];
  /** ID of the currently active group */
  currentGroup?: string;
  /** ID of the associated Google Workspace group */
  googleGroupId?: string;
}

export class DepartmentValidator extends SharedDocumentValidator<DepartmentModel> {
  validateModel(data: unknown): data is DepartmentModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: DepartmentModel) {
    const errors: string[] = [];

    if (!((data.title ?? '') as string).trim()) {
      errors.push('Department title is required');
    }

    if (!((data.description ?? '') as string).trim()) {
      errors.push('Department description is required');
    }

    if (!Array.isArray(data.managers) || data.managers.length === 0) {
      errors.push('At least one manager is required');
    }

    if (data.googleGroupId && !(data.googleGroupId as string).includes('@')) {
      errors.push("Invalid Google Group ID format: ensure to use the group's email address");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<DepartmentModel>) {
    const errors: string[] = [];

    if (data.title === '') {
      errors.push('Department title cannot be empty');
    }

    if (data.description === '') {
      errors.push('Department description cannot be empty');
    }

    if (data.managers && data.managers.length === 0) {
      errors.push('Cannot remove all managers');
    }

    if (data.googleGroupId && !data.googleGroupId.includes('@')) {
      errors.push('Invalid Google Group ID format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const departmentValidator = new DepartmentValidator();
