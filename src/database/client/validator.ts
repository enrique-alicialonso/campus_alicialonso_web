import { BaseDocument } from './models';
import { BaseDocumentValidator, ValidationResult } from '../common/validation';
import { FirestoreDocument } from '../common/firestore_document';

export interface DocumentValidator<T extends BaseDocument> {
  validateCreate(data: Record<keyof T, unknown>): ValidationResult;
  validateUpdate(data: Record<keyof T, unknown>): ValidationResult;
}

export function createClientValidator<T extends BaseDocument, TModel extends FirestoreDocument>(
  baseValidator: BaseDocumentValidator<TModel>,
): DocumentValidator<T> {
  return baseValidator;
}
