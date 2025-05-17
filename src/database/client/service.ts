import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDocs,
  getDoc,
  query,
  Query,
  setDoc,
  updateDoc,
  where,
  WithFieldValue,
  writeBatch,
  orderBy,
  startAfter,
  limit,
  documentId,
} from 'firebase/firestore';
import { BaseDocument, CreateDocument } from './models';
import { DocumentValidator } from './validator';
import { createConverter } from './converter';
import { FirestoreError, ValidationError } from '../common';

interface QueryOptions {
  limit?: number;
  startAfter?: string;
  orderBy?: string;
  direction?: 'asc' | 'desc';
}

export class FirestoreClientService<T extends BaseDocument> {
  protected readonly collection: CollectionReference<T>;
  protected readonly validator?: DocumentValidator<T>;
  protected readonly firestore: Firestore;

  constructor(firestore: Firestore, collectionPath: string, validator?: DocumentValidator<T>) {
    this.collection = collection(firestore, collectionPath).withConverter(createConverter<T>());
    this.validator = validator;
    this.firestore = firestore;
  }

  /**
   * Creates a new document in the collection. Please avoid using this method directly.
   * Use the specific service methods for creating documents instead.
   * @param data - The data to create the document with
   * @param uid - The UID of the document to create
   * @returns The created document
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
    } as WithFieldValue<T>;

    let docRef: DocumentReference<T>;
    try {
      if (uid) {
        docRef = doc(this.collection, uid);
        await setDoc(docRef, docToCreate);
      } else {
        docRef = doc(this.collection);
        await setDoc(docRef, docToCreate);
      }

      const newDoc = await getDoc(docRef);
      if (!newDoc.exists()) {
        throw new FirestoreError('Document was not created successfully');
      }
      return { ...newDoc.data()!, uid: newDoc.id };
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new FirestoreError('Failed to create document');
    }
  }

  async createMultiple(documents: CreateDocument<T>[]): Promise<T[]> {
    const batch = writeBatch(this.firestore);
    const refs: DocumentReference<T>[] = [];

    const now = new Date();
    documents.forEach((document) => {
      const ref = doc(this.collection);
      refs.push(ref);
      const docToCreate = {
        ...document,
        created: now,
        updated: now,
      } as WithFieldValue<T>;
      batch.set(ref, docToCreate);
    });

    await batch.commit();
    return this.getMultiple(refs.map((ref) => ref.id));
  }

  async update(uid: string, data: Record<keyof T, unknown>): Promise<void> {
    if (this.validator) {
      const validation = this.validator.validateUpdate(data);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }
    }

    const docRef = doc(this.collection, uid);
    await updateDoc(docRef, { ...data, updated: new Date() });
  }

  async get(uid: string): Promise<T | null> {
    const docRef = doc(this.collection, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { ...docSnap.data(), uid: docSnap.id } : null;
  }

  async delete(uid: string): Promise<void> {
    const docRef = doc(this.collection, uid);
    await deleteDoc(docRef);
  }

  async getMultiple(uids: string[]): Promise<T[]> {
    if (uids.length === 0) return [];

    // Firestore has a limit of 10 items for 'in' queries
    const chunkSize = 10;
    const chunks: string[][] = [];
    for (let i = 0; i < uids.length; i += chunkSize) {
      chunks.push(uids.slice(i, i + chunkSize));
    }

    const results: T[] = [];
    for (const chunk of chunks) {
      const q = query(this.collection, where(documentId(), 'in', chunk));
      const querySnapshot = await getDocs(q);
      results.push(...querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id })));
    }

    return results;
  }

  async query(queryFn: (ref: CollectionReference<T>) => Query<T>): Promise<T[]> {
    const q = queryFn(this.collection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
  }

  async queryPaginated(
    queryFn: (ref: CollectionReference<T>) => Query<T>,
    options: QueryOptions,
  ): Promise<{
    items: T[];
    lastDoc: string | null;
  }> {
    let q = queryFn(this.collection);

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.direction || 'asc'));
    }
    if (options.startAfter) {
      const startDoc = await getDoc(doc(this.collection, options.startAfter));
      if (startDoc.exists()) {
        q = query(q, startAfter(startDoc));
      }
    }
    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    return {
      items: snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id })),
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
    };
  }

  getCollectionRef(): CollectionReference<T> {
    return this.collection;
  }

  getDocumentRef(uid: string): DocumentReference<T> {
    return doc(this.collection, uid);
  }
}
