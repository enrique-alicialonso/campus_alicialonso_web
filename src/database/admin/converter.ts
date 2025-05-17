import { FirestoreDataConverter, Timestamp, WithFieldValue, DocumentData } from 'firebase-admin/firestore';
import { BaseDocument } from './models';
import { dateToString, isDate, parseDate } from './utils';

/**
 * Generic Firestore converter with smart date handling
 */
export function createConverter<T extends BaseDocument>(): FirestoreDataConverter<T> {
  return {
    toFirestore(doc: WithFieldValue<T>): DocumentData {
      const data: DocumentData = {};

      Object.entries(doc as Record<string, unknown>).forEach(([key, value]) => {
        if (isDate(value)) {
          // Special handling for created/updated timestamps
          if (key === 'created' || key === 'updated') {
            data[key] = Timestamp.fromDate(value);
          } else {
            // Convert other Date objects to ISO strings
            data[key] = dateToString(value);
          }
        } else {
          // Copy non-date values as-is
          data[key] = value;
        }
      });

      return data;
    },

    fromFirestore(snapshot: DocumentData): T {
      const data = snapshot.data();
      const converted: Record<string, unknown> = {};

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Timestamp) {
          // Convert Timestamps back to Dates for created/updated
          converted[key] = value.toDate();
        } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
          // Convert ISO date strings back to Date objects
          const parsed = parseDate(value);
          if (parsed) {
            converted[key] = parsed;
          } else {
            converted[key] = value; // Keep original if parsing fails
          }
        } else {
          converted[key] = value;
        }
      });

      return {
        ...converted,
        uid: snapshot.id,
      } as T;
    },
  };
}

/**
 * Example usage:
 *
 * interface MyDoc extends BaseDocument {
 *   normalDate: Date;      // Will be stored as ISO string
 *   created: Date;         // Will be stored as Timestamp
 *   updated: Date;         // Will be stored as Timestamp
 *   otherField: string;    // Will be stored as-is
 * }
 *
 * const converter = createConverter<MyDoc>();
 * const collection = firestore.collection('mycollection').withConverter(converter);
 */
