import { BaseDocument, CreateDocument } from '../models';

/** Convert document to CreateDocument */
export function convertDocumentToCreateDocument<T extends BaseDocument>(document: T): CreateDocument<T> {
  const { ...rest } = document;
  return { ...rest } as CreateDocument<T>;
}
