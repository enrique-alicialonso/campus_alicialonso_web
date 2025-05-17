import {
  FirestoreDocument,
  SharedDocumentValidator,
  ValidationResult,
  DEPARTMENT_VALUES,
  USER_ROLES,
  USER_STATUS,
} from '../common';

/**
 * Represents a user profile in the system.
 * Users are stored in the users collection and are linked to Firebase Authentication.
 */
export interface UserModel extends FirestoreDocument {
  /** Institutional email address */
  email: string;
  /** The Id of the user in Google Workspace */
  googleWorkspaceId: string;
  /** User's full display name */
  displayName: string;
  /** Optional URL to user's profile photo */
  photoURL?: string;
  /** ID of the department the user belongs to */
  department?: keyof typeof DEPARTMENT_VALUES;
  /** User's role in the system */
  role?: keyof typeof USER_ROLES;
  /** Timestamp of user's last login */
  lastLogin: Date;
  /** Current status of the user account */
  status: keyof typeof USER_STATUS;
  /** Array of group IDs the user belongs to in the current academic year */
  groups?: string[];
  /** Additional custom fields for the user */
  additionalData?: {
    [key: string]: string | number | boolean;
  };
}

export class UserValidator extends SharedDocumentValidator<UserModel> {
  validateModel(data: unknown): data is UserModel {
    // TODO: Implement type checking logic
    return true; // Simplified for example
  }

  protected validateCreateImpl(data: UserModel): ValidationResult {
    const errors: string[] = [];

    if (!(data.email as string).includes('@')) {
      errors.push('Invalid email format');
    }

    if (!((data.displayName ?? '') as string).trim()) {
      errors.push('Display name is required');
    }

    if (!Object.keys(USER_ROLES).includes(data.role as string)) {
      errors.push('Invalid role');
    }

    if (!Object.keys(USER_STATUS).includes(data.status as string)) {
      errors.push('Invalid status');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  protected validateUpdateImpl(data: Partial<UserModel>): ValidationResult {
    const errors: string[] = [];

    if ((data.email as string) && !(data.email as string).includes('@')) {
      errors.push('Invalid email format');
    }

    if (data.role && !Object.keys(USER_ROLES).includes(data.role as string)) {
      errors.push('Invalid role');
    }

    if (data.status && !Object.keys(USER_STATUS).includes(data.status as string)) {
      errors.push('Invalid status');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const userValidator = new UserValidator();
