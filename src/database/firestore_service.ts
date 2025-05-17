import { BaseDocument, CreateDocument, UpdateDocument } from './admin';
import { CollectionReference, DocumentReference, Firestore, Query, WithFieldValue } from '@google-cloud/firestore';
import { DocumentValidator } from './admin/validator';
import { createConverter } from './admin/converter';
import { ValidationError } from './common';

/**
 * Generic Firestore service class
 */
export class FirestoreService<T extends BaseDocument> {
  protected readonly collection: CollectionReference<T>;
  protected readonly validator?: DocumentValidator<T>;

  constructor(firestore: Firestore, collectionPath: string, validator?: DocumentValidator<T>) {
    this.collection = firestore.collection(collectionPath).withConverter(createConverter<T>());
    this.validator = validator;
  }

  /**
   * Create a new document
   */
  async create(data: CreateDocument<T>, uid?: string): Promise<T> {
    // Validate data if validator exists
    if (this.validator) {
      const validation = this.validator.validateCreate(data as Record<keyof T, unknown>);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }
    }

    const now = new Date();
    const docToCreate = {
      ...data,
      created: now,
      updated: now,
    };

    const docRef = uid ? this.collection.doc(uid) : await this.collection.add(docToCreate as WithFieldValue<T>);

    if (uid) await docRef.set(docToCreate as WithFieldValue<T>);

    const newDoc = await docRef.get();
    return newDoc.data()!;
  }

  /**
   * Update an existing document
   */
  async update(uid: string, data: UpdateDocument<T>): Promise<void> {
    if (this.validator) {
      const validation = this.validator.validateUpdate(data as Record<keyof T, unknown>);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }
    }

    await this.collection.doc(uid).update(data);
  }

  /**
   * Get a document by ID
   */
  async get(uid: string): Promise<T | null> {
    const doc = await this.collection.doc(uid).get();
    return doc.exists ? doc.data()! : null;
  }

  /**
   * Delete a document
   */
  async delete(uid: string): Promise<void> {
    await this.collection.doc(uid).delete();
  }

  /**
   * Get multiple documents by their IDs
   */
  async getMultiple(uids: string[]): Promise<T[]> {
    const docs = await this.collection.where('uid', 'in', uids).get();
    return docs.docs.map((doc) => doc.data());
  }

  /**
   * Query documents with optional filtering
   */
  async query(queryFn: (ref: CollectionReference<T>) => Query<T>): Promise<T[]> {
    const query = queryFn(this.collection);
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Get a reference to the collection
   */
  getCollectionRef(): CollectionReference<T> {
    return this.collection;
  }

  /**
   * Get a document reference
   */
  getDocumentRef(uid: string): DocumentReference<T> {
    return this.collection.doc(uid);
  }
}
