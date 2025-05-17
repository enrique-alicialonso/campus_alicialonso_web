"use client";

import { useState } from "react";
import { UserList } from "./user-list";
import { UserGroupList } from "./user-group-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="groups">User Groups</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UserList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </TabsContent>
      <TabsContent value="groups">
        <UserGroupList />
      </TabsContent>
    </Tabs>
  );
}
