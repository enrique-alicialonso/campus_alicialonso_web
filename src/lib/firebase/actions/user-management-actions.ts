import { Group, GroupWithMembers, parseDepartment } from "@/database/client";
import { db, auth } from "../config/firebase";
import { Either } from "@/lib/utils/either";
import { GroupClientService } from "@/database/client";

export async function createUser(userData: any) {}

type CreateGroupError = {
  code:
    | "AUTH_REQUIRED"
    | "DEPARTMENT_REQUIRED"
    | "VALIDATION_ERROR"
    | "UNKNOWN_ERROR";
  message: string;
};

type CreateGroupSuccess = {
  groupId: string;
  group: Group;
};

export async function createGroup(
  groupData: {
    groupName: string;
    academicYear: string;
    memberIdentifiers: string[];
  },
  userDepartment: string
): Promise<Either<CreateGroupError, CreateGroupSuccess>> {
  const createGroupCore = async (): Promise<
    Either<CreateGroupError, CreateGroupSuccess>
  > => {
    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return Either.left({
        code: "AUTH_REQUIRED",
        message: "You must be logged in to create a group",
      });
    }

    if (!userDepartment) {
      return Either.left({
        code: "DEPARTMENT_REQUIRED",
        message: "You must be assigned to a department to create groups",
      });
    }

    try {
      const department = parseDepartment(userDepartment);
      const groupService = new GroupClientService(db, department);
      const group = await groupService.createGroup({
        groupName: groupData.groupName,
        academicYear: groupData.academicYear,
        memberIdentifiers: groupData.memberIdentifiers,
        archived: false,
        created: new Date(),
      });

      return Either.right({
        groupId: group.uid,
        group,
      });
    } catch (error) {
      return Either.left({
        code: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Validation failed",
      });
    }
  };

  try {
    return await createGroupCore();
  } catch (error) {
    return Either.left({
      code: "UNKNOWN_ERROR",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

export async function getPendingRequests() {
  return [];
}

type GetGroupsError = {
  code: "AUTH_REQUIRED" | "DEPARTMENT_REQUIRED" | "FETCH_ERROR";
  message: string;
};

type GetGroupsSuccess = {
  groups: GroupWithMembers[];
};

export async function getGroups(
  userDepartment: string,
  options?: {
    includeArchived?: boolean;
    academicYear?: string;
  }
): Promise<Either<GetGroupsError, GetGroupsSuccess>> {
  const getGroupsCore = async (): Promise<
    Either<GetGroupsError, GetGroupsSuccess>
  > => {
    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return Either.left({
        code: "AUTH_REQUIRED",
        message: "You must be logged in to fetch groups",
      });
    }

    if (!userDepartment) {
      return Either.left({
        code: "DEPARTMENT_REQUIRED",
        message: "You must be assigned to a department to fetch groups",
      });
    }

    try {
      const department = parseDepartment(userDepartment);
      const groupService = new GroupClientService(db, department);

      // Get all groups and filter in memory for better caching
      const allGroups = await groupService.getAll({ includeArchived: true });
      const allGroupsWithMembers: GroupWithMembers[] = [];

      for (const group of allGroups) {
        const members = await groupService.getGroupMembers(group.uid);
        allGroupsWithMembers.push({
          ...group,
          members: members,
        } as GroupWithMembers);
      }

      return Either.right({
        groups: allGroupsWithMembers,
      });
    } catch (error) {
      return Either.left({
        code: "FETCH_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch groups",
      });
    }
  };

  try {
    return await getGroupsCore();
  } catch (error) {
    return Either.left({
      code: "FETCH_ERROR",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
