import { collection, documentId, Firestore, getDocs, limit, query, where } from 'firebase/firestore';
import { FirestoreClientService } from '../service';
import { CreateDocument, Group, GroupCreateInput, User } from '../models';
import { FIRESTORE_COLLECTIONS } from '../../common/firestore_collections';
import { FirestoreError, ValidationError } from '../../common/validation';
import { clientGroupValidator } from '../models';
import { DEPARTMENT_VALUES, generateGroupUid } from '../../common';

export class GroupClientService extends FirestoreClientService<Group> {
  private readonly departmentId: keyof typeof DEPARTMENT_VALUES;

  constructor(firestore: Firestore, departmentId: keyof typeof DEPARTMENT_VALUES) {
    // Initialize with the correct subcollection path and the required validator
    super(firestore, FIRESTORE_COLLECTIONS.DEPARTMENT_GROUPS(departmentId), clientGroupValidator);
    this.departmentId = departmentId;
  }

  /**
   * Resolves user identifiers (email/display name) to UIDs
   * Handles Firestore's 'in' clause limitation (max 10 items) by processing in batches
   */
  private async resolveUserIdentifiers(identifiers: string[]): Promise<string[]> {
    if (identifiers.length === 0) return [];

    const usersCollection = collection(this.firestore, FIRESTORE_COLLECTIONS.USERS);
    const foundUsers = new Set<string>();
    const notFound = new Set(identifiers);

    // Process in chunks of 10 (Firestore's 'in' clause limitation)
    const chunkSize = 10;
    const chunks: string[][] = [];

    for (let i = 0; i < identifiers.length; i += chunkSize) {
      chunks.push(identifiers.slice(i, i + chunkSize));
    }

    try {
      // Process each chunk
      for (const chunk of chunks) {
        // Create queries for both email and display name for the current chunk
        const emailQuery = query(usersCollection, where('email', 'in', chunk));
        const displayNameQuery = query(usersCollection, where('displayName', 'in', chunk));

        // Execute both queries in parallel for the current chunk
        const [emailResults, displayNameResults] = await Promise.all([getDocs(emailQuery), getDocs(displayNameQuery)]);

        // Process email matches
        emailResults.docs.forEach((doc) => {
          const userData = doc.data();
          foundUsers.add(doc.id);
          notFound.delete(userData.email);
        });

        // Process display name matches
        displayNameResults.docs.forEach((doc) => {
          const userData = doc.data();
          foundUsers.add(doc.id);
          notFound.delete(userData.displayName);
        });
      }

      // If any identifiers weren't found, throw a detailed error
      if (notFound.size > 0) {
        throw new ValidationError(
          `Could not find users with the following identifiers: ${Array.from(notFound).join(', ')}`,
        );
      }

      return Array.from(foundUsers);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new FirestoreError(
        `Failed to resolve user identifiers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Creates a new group with resolved member UIDs
   */
  async createGroup(input: GroupCreateInput): Promise<Group> {
    try {
      const { memberIdentifiers, ...groupInput } = input;
      // Resolve member identifiers to UIDs
      const members = await this.resolveUserIdentifiers(memberIdentifiers);
      // Create the group with resolved UIDs
      const groupData: CreateDocument<Group> = {
        ...groupInput,
        members,
      };

      const groupUid = input.uid ?? (await this.generateValidGroupUid(input.groupName, input.academicYear));
      return this.create(groupData, groupUid);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors
      }
      throw new FirestoreError(`Failed to create group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates group members using identifiers
   */
  async updateGroupMembers(groupId: string, memberIdentifiers: string[]): Promise<void> {
    try {
      const memberUids = await this.resolveUserIdentifiers(memberIdentifiers);

      await this.update(groupId, {
        members: memberUids,
        updated: new Date(),
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Re-throw validation errors
      }
      throw new FirestoreError(
        `Failed to update group members: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Helper method to get the current department ID
   */
  getDepartmentId(): keyof typeof DEPARTMENT_VALUES {
    return this.departmentId;
  }

  /**
   * Removes all members from a group
   */
  async removeAllMembers(groupId: string): Promise<void> {
    try {
      await this.update(groupId, {
        members: [],
        updated: new Date(),
      });
    } catch (error) {
      throw new FirestoreError(`Failed to remove members: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Archives a group
   */
  async archiveGroup(groupId: string): Promise<void> {
    try {
      await this.update(groupId, {
        archived: true,
        updated: new Date(),
      });
    } catch (error) {
      throw new FirestoreError(`Failed to archive group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Unarchives a group
   */
  async unarchiveGroup(groupId: string): Promise<void> {
    try {
      await this.update(groupId, {
        archived: false,
        updated: new Date(),
      });
    } catch (error) {
      throw new FirestoreError(
        `Failed to unarchive group: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Gets all user documents for the group's members
   */
  async getGroupMembers(groupId: string): Promise<User[]> {
    try {
      const group = await this.get(groupId);
      if (!group) {
        throw new ValidationError('Group not found');
      }

      if (group.members.length === 0) {
        return [];
      }

      const usersCollection = collection(this.firestore, FIRESTORE_COLLECTIONS.USERS);
      const q = query(usersCollection, where(documentId(), 'in', group.members));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }) as User);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new FirestoreError(
        `Failed to get group members: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Removes specific members from a group using their identifiers
   */
  async removeMembers(groupId: string, memberIdentifiers: string[]): Promise<void> {
    try {
      // Get current group
      const group = await this.get(groupId);
      if (!group) {
        throw new ValidationError('Group not found');
      }

      // Resolve identifiers to UIDs
      const uidsToRemove = await this.resolveUserIdentifiers(memberIdentifiers);

      // Filter out the members to remove
      const updatedMembers = group.members.filter((uid) => !uidsToRemove.includes(uid));

      await this.update(groupId, {
        members: updatedMembers,
        updated: new Date(),
      });
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new FirestoreError(`Failed to remove members: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates that all provided member identifiers exist
   * Returns the resolved UIDs if valid, throws error if any don't exist
   */
  async validateMemberIdentifiers(memberIdentifiers: string[]): Promise<string[]> {
    try {
      return await this.resolveUserIdentifiers(memberIdentifiers);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new FirestoreError(
        `Failed to validate members: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Checks if a group ID is already taken in the current department
   * Returns true if the ID is available, false if it's taken
   */
  async isGroupIdAvailable(groupId: string): Promise<boolean> {
    try {
      const doc = await this.get(groupId);
      return doc === null;
    } catch (error) {
      throw new FirestoreError(
        `Failed to check group ID availability: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generates a valid group UID if it doesn't already exist using the group name and academic year
   */
  async generateValidGroupUid(groupName: string, academicYear: string): Promise<string> {
    try {
      const proposedUid = generateGroupUid(groupName, academicYear);
      const existingDoc = await this.get(proposedUid);

      if (existingDoc) {
        throw new Error(
          `A group named "${groupName}" already exists for the academic year ${academicYear}. ` +
            'Please choose a different name or academic year.',
        );
      }

      return proposedUid;
    } catch (error) {
      // If the error is from generateGroupUid, pass it through
      if (error instanceof Error && error.message.includes('Unable to generate valid UID')) {
        throw error;
      }
      // Re-throw any other errors
      throw error;
    }
  }

  /**
   * Gets all groups with optional filtering
   */
  async getAll(options?: { includeArchived?: boolean; academicYear?: string; limit?: number }): Promise<Group[]> {
    try {
      let q = query(this.collection);

      // Apply server-side filters if possible
      if (!options?.includeArchived) {
        q = query(q, where('archived', '==', false));
      }

      if (options?.academicYear) {
        q = query(q, where('academicYear', '==', options.academicYear));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
    } catch (error) {
      throw new FirestoreError(`Failed to fetch groups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets groups by academic year
   */
  async getByAcademicYear(academicYear: string, includeArchived = false): Promise<Group[]> {
    return this.getAll({ academicYear, includeArchived });
  }

  /**
   * Gets active (non-archived) groups
   */
  async getActive(): Promise<Group[]> {
    return this.getAll({ includeArchived: false });
  }

  /**
   * Gets groups by member UID
   */
  async getGroupsByMember(memberUid: string): Promise<Group[]> {
    try {
      const q = query(this.collection, where('members', 'array-contains', memberUid));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
    } catch (error) {
      throw new FirestoreError(
        `Failed to fetch member groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
