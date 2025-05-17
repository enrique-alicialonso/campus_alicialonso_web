"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, UsersRound, Bell } from "lucide-react";
import { CreateGroupModal } from "./create-group-modal";
import {
  createUser,
  getPendingRequests,
} from "@/lib/firebase/actions/user-management-actions";

export function UserManagementToolbar() {
  const [pendingNotifications, setPendingNotifications] = useState(0);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  useEffect(() => {
    const updateNotifications = async () => {
      const requests = await getPendingRequests();
      setPendingNotifications(requests.length);
    };
    updateNotifications();
  }, []);

  const handleCreateUser = async () => {
    // This is a placeholder. In a real app, you'd open a modal or navigate to a form
    const userData = { name: "New User", email: "newuser@example.com" };
    await createUser(userData);
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleReviewRequests = () => {
    // Implement review requests functionality
    console.log("Review account requests");
  };

  return (
    <TooltipProvider>
      <div className="flex space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCreateUser}>
              <UserPlus className="h-4 w-4" />
              <span className="sr-only">Create new user</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new user</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCreateGroup}>
              <UsersRound className="h-4 w-4" />
              <span className="sr-only">Create new group</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new group</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReviewRequests}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {pendingNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {pendingNotifications}
                </Badge>
              )}
              <span className="sr-only">
                Review account requests ({pendingNotifications} pending)
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Review account requests ({pendingNotifications} pending)</p>
          </TooltipContent>
        </Tooltip>

        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}
