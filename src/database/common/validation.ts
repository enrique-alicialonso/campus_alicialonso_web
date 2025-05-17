import { FirestoreDocument } from './firestore_document';

/**
 * Generic validation result type
 */
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom error class for Firestore errors
 */
export class FirestoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestoreError';
  }
}

/**
 * Base validator interface that works with raw document data
 * regardless of client/admin implementation
 */
export interface BaseDocumentValidator<TModel extends FirestoreDocument> {
  validateCreate(data: Record<string, unknown>): ValidationResult;
  validateUpdate(data: Record<string, unknown>): ValidationResult;

  // Helper to validate the model shape
  validateModel(data: unknown): data is TModel;
}

/**
 * Shared validator implementation that can be used for both client and admin
 */
export abstract class SharedDocumentValidator<TModel extends FirestoreDocument>
  implements BaseDocumentValidator<TModel>
{
  abstract validateModel(data: unknown): data is TModel;

  validateCreate(data: Record<string, unknown>): ValidationResult {
    if (!this.validateModel(data)) {
      return { isValid: false, errors: ['Invalid document structure'] };
    }
    return this.validateCreateImpl(data);
  }

  validateUpdate(data: Record<string, unknown>): ValidationResult {
    if (!this.validateModel(data)) {
      return { isValid: false, errors: ['Invalid document structure'] };
    }
    return this.validateUpdateImpl(data);
  }

  protected abstract validateCreateImpl(data: TModel): ValidationResult;
  protected abstract validateUpdateImpl(data: Partial<TModel>): ValidationResult;
}
