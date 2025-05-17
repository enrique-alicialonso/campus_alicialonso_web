import { FirestoreDocument, SharedDocumentValidator } from '../common';

/**
 * Represents a group within a department.
 * Groups are stored as subcollections under departments and represent cohorts of students.
 */
export interface GroupModel extends FirestoreDocument {
  /** Academic year the group belongs to (e.g., "2023-2024") */
  academicYear: string;
  /** Display name of the group */
  groupName: string;
  /** Array of user UIDs who are members of this group */
  members: string[];
  /** Indicates if the group is archived */
  archived: boolean;
}

export class GroupValidator extends SharedDocumentValidator<GroupModel> {
  validateModel(data: unknown): data is GroupModel {
    // TODO: Implement type checking logic
    return true;
  }

  protected validateCreateImpl(data: GroupModel) {
    const errors: string[] = [];

    if (!((data.academicYear ?? '') as string).trim()) {
      errors.push('Academic year is required');
    } else if (!/^\d{2}-\d{2}$/.test((data.academicYear ?? '') as string)) {
      errors.push('Academic year must be in format YY-YY');
    }

    if (!((data.groupName ?? '') as string).trim()) {
      errors.push('Group name is required');
    }

    if (!Array.isArray(data.members)) {
      errors.push('Members must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<GroupModel>) {
    const errors: string[] = [];

    if (data.academicYear && !/^\d{2}-\d{2}$/.test(data.academicYear as string)) {
      errors.push('Academic year must be in format YY-YY');
    }

    if (data.groupName && !(data.groupName as string).trim()) {
      errors.push('Group name cannot be empty');
    }

    if (data.members && !Array.isArray(data.members)) {
      errors.push('Members must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const groupValidator = new GroupValidator();
