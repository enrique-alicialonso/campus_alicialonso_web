"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createGroup } from "@/lib/firebase/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { user, userDepartment, loading } = useAuth();
  const [name, setName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [members, setMembers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const academicYears = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentAcademicYear =
      currentMonth >= 9 ? currentYear : currentYear - 1;

    return Array.from({ length: 11 }, (_, i) => {
      const year = currentAcademicYear - 5 + i;
      return `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    });
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentAcademicYear =
      currentMonth >= 9 ? currentYear : currentYear - 1;
    setAcademicYear(
      `${currentAcademicYear.toString().slice(-2)}-${(currentAcademicYear + 1)
        .toString()
        .slice(-2)}`
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userDepartment) {
      setError("You must be logged in and assigned to a department");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const memberList = members.split(",").map((member) => member.trim());
    const result = await createGroup(
      {
        groupName: name,
        academicYear,
        memberIdentifiers: memberList,
      },
      userDepartment
    );

    setIsSubmitting(false);

    if (result.isRightSide()) {
      console.log("Group created with ID:", result.getRight()?.groupId);
      onClose();
    } else {
      setError(result.getLeft()?.message || "An unexpected error occurred");
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="academicYear" className="text-right">
                Academic Year
              </Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="members" className="text-right">
                Members
              </Label>
              <Textarea
                id="members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="col-span-3"
                placeholder="Enter email addresses or full names, separated by commas"
                required
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
