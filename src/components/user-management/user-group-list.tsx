import { useState } from "react";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GroupWithMembers, User } from "@/database/client";
import { getGroups } from "@/lib/firebase/actions/user-management-actions";
import { useAuth } from "@/lib/hooks/use-auth";
import { useEffect } from "react";

export function UserGroupList() {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userDepartment } = useAuth();

  useEffect(() => {
    async function fetchGroups() {
      if (!userDepartment) {
        setError("No department assigned");
        setLoading(false);
        return;
      }
      try {
        const result = await getGroups(userDepartment, {
          includeArchived: false,
          academicYear: "24-25", // You might want to make this configurable
        });

        if (result.isLeftSide()) {
          console.error("Error fetching groups", result.getLeft());
          setError(result.getLeft()?.message ?? "An unknown error occurred");
          setGroups([]);
        } else {
          console.log("Groups fetched successfully", result.getRight());
          setGroups(result.getRight()?.groups ?? []);
          setError(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups", error);
        setError("An unknown error occurred");
        setGroups([]);
        setLoading(false);
      }
    }

    fetchGroups();
  }, [userDepartment]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prevOpenGroups) =>
      prevOpenGroups.includes(groupId)
        ? prevOpenGroups.filter((id) => id !== groupId)
        : [...prevOpenGroups, groupId]
    );
  };

  const handleEditGroup = (groupId: string) => {
    // Implement edit functionality here
    console.log(`Edit group ${groupId}`);
  };

  if (loading) {
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (groups.length === 0) {
    return <div>No groups found</div>;
  }

  console.log(groups);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Collapsible
          key={group.uid}
          open={openGroups.includes(group.uid)}
          onOpenChange={() => toggleGroup(group.uid)}
        >
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0">
                {openGroups.includes(group.uid) ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <div className="flex flex-row">
                  <div>{group.groupName}</div>
                  <div className="ml-2 text-xs text-gray-500">
                    [{group.uid}]
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditGroup(group.uid)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit {group.groupName}</span>
            </Button>
          </div>
          <CollapsibleContent className="p-4 bg-gray-50 rounded-b-lg">
            <h4 className="font-semibold mb-2">
              {group.members?.length ?? 0} members:
            </h4>
            <ul className="list-disc list-inside">
              {(group.members ?? [])
                .sort((a: User, b: User) =>
                  (a.displayName ?? "").localeCompare(b.displayName ?? "")
                )
                .map((member: User, index: number) => (
                  <li key={index}>{member?.displayName ?? "Unknown"}</li>
                ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
