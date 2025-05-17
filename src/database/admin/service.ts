import { CollectionReference, DocumentReference, Firestore, Query, WithFieldValue } from 'firebase-admin/firestore';
import { BaseDocument, CreateDocument, UpdateDocument } from './models';
import { DocumentValidator } from './validator';
import { createConverter } from './converter';
import { FirestoreError, ValidationError } from '../common';

export interface QueryOptions {
  limit?: number;
  startAfter?: string;
  orderBy?: string;
  direction?: 'asc' | 'desc';
}

export class FirestoreAdminService<T extends BaseDocument> {
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

    try {
      const docRef = uid ? this.collection.doc(uid) : await this.collection.add(docToCreate as WithFieldValue<T>);
      await docRef.set(docToCreate as WithFieldValue<T>);
      const newDoc = await docRef.get();

      if (!newDoc.exists) throw new Error('Document was not created successfully');

      return { ...newDoc.data()!, uid: newDoc.id };
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new FirestoreError('Failed to create document');
    }
  }

  async createMultiple(documents: CreateDocument<T>[]): Promise<T[]> {
    const batch = this.collection.firestore.batch();
    const refs: DocumentReference<T>[] = [];

    documents.forEach((doc) => {
      const ref = this.collection.doc();
      refs.push(ref);
      batch.set(ref, doc as WithFieldValue<T>);
    });

    await batch.commit();
    return this.getMultiple(refs.map((ref) => ref.id));
  }

  async update(uid: string, data: UpdateDocument<T>): Promise<void> {
    if (this.validator) {
      const validation = this.validator.validateUpdate(data as Record<keyof T, unknown>);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }
    }

    const docRef = this.collection.doc(uid);
    const updateData = { ...data, updated: new Date() };

    await docRef.update(updateData);
  }

  async get(uid: string): Promise<T | null> {
    const docRef = this.collection.doc(uid);
    const docSnap = await docRef.get();
    return docSnap.exists ? ({ ...docSnap.data()!, uid: docSnap.id } as T) : null;
  }

  async delete(uid: string): Promise<void> {
    const docRef = this.collection.doc(uid);
    await docRef.delete();
  }

  async getMultiple(uids: string[]): Promise<T[]> {
    if (uids.length === 0) return [];

    // Firestore has a limit of 10 items for 'in' queries
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < uids.length; i += chunkSize) {
      chunks.push(uids.slice(i, i + chunkSize));
    }

    const results: T[] = [];
    for (const chunk of chunks) {
      const q = this.collection.where('__name__', 'in', chunk);
      const querySnapshot = await q.get();
      results.push(...querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
    }

    return results;
  }

  async query(queryFn: (ref: CollectionReference<T>) => Query<T>): Promise<T[]> {
    const q = queryFn(this.collection);
    const querySnapshot = await q.get();
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
  }

  async queryPaginated(
    queryFn: (ref: CollectionReference<T>) => Query<T>,
    options: QueryOptions,
  ): Promise<{
    items: T[];
    lastDoc: string | null;
  }> {
    let query = queryFn(this.collection);

    if (options.orderBy) {
      query = query.orderBy(options.orderBy, options.direction || 'asc');
    }
    if (options.startAfter) {
      const startDoc = await this.collection.doc(options.startAfter).get();
      query = query.startAfter(startDoc);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    return {
      items: snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id })),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
    };
  }

  async exists(uid: string): Promise<boolean> {
    const docRef = this.collection.doc(uid);
    const docSnap = await docRef.get();
    return docSnap.exists;
  }

  getCollectionRef(): CollectionReference<T> {
    return this.collection;
  }

  getDocumentRef(uid: string): DocumentReference<T> {
    return this.collection.doc(uid);
  }
}
