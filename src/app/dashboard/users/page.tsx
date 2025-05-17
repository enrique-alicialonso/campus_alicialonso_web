import React from "react";
import { getUserEmail } from "@/lib/firebase/config/auth";
import { redirect } from "next/navigation";
import { fetchUserInfo } from "@/lib/google/googleapis";
import { UserManagement } from "@/components/user-management/user-management";
import { UserManagementToolbar } from "@/components/user-management/user-management-toolbar";

type Props = {};
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsersPage({}: Props) {
  const userEmail = await getUserEmail();
  if (!userEmail) redirect("/");

  // const userInfo = await fetchUserInfo(userEmail);
  // console.log(userInfo);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <UserManagementToolbar />
      </div>
      <UserManagement />
    </div>
  );
}
