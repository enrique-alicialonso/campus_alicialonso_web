"use client";

import * as React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { classroom_v1 } from "googleapis/build/src/apis/classroom/v1";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "@/lib/firebase/config/firebase";
import { CourseData, GroupData } from "@/lib/types";

type CourseGroupSettingsProps = {
  courseId: string;
  groupId: string;
  initialGroupData: GroupData;
  courseStudents: classroom_v1.Schema$UserProfile[];
};

type State = {
  groupName: string;
  groupColor: string;
  filter: string;
  availableStudents: classroom_v1.Schema$UserProfile[];
  groupMembers: classroom_v1.Schema$UserProfile[];
};

type Action =
  | { type: "SET_GROUP_NAME"; payload: string }
  | { type: "SET_GROUP_COLOR"; payload: string }
  | { type: "SET_FILTER"; payload: string }
  | {
      type: "SET_AVAILABLE_STUDENTS";
      payload: classroom_v1.Schema$UserProfile[];
    }
  | { type: "SET_GROUP_MEMBERS"; payload: classroom_v1.Schema$UserProfile[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_GROUP_NAME":
      return { ...state, groupName: action.payload };
    case "SET_GROUP_COLOR":
      return { ...state, groupColor: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_AVAILABLE_STUDENTS":
      return { ...state, availableStudents: action.payload };
    case "SET_GROUP_MEMBERS":
      return { ...state, groupMembers: action.payload };
    default:
      return state;
  }
}

export default function CourseGroupSettingsContent({
  courseId,
  groupId,
  initialGroupData,
  courseStudents,
}: CourseGroupSettingsProps) {
  const [groupData, setGroupData] = React.useState<GroupData>(initialGroupData);
  const [availableStudents, setAvailableStudents] =
    React.useState(courseStudents);

  const db = getFirestore(app);
  const courseDocRef = doc(db, "coursedata", courseId);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(courseDocRef, (doc) => {
      if (doc.exists()) {
        const courseData = doc.data() as CourseData;
        const updatedGroupData = (courseData.groups ?? []).find(
          (group: GroupData) => group.groupId === groupId
        );
        if (updatedGroupData) {
          setGroupData(updatedGroupData);
        }
      }
    });

    return () => unsubscribe();
  }, [courseDocRef, courseId, groupId]);

  const updateGroupData = async (newData: Partial<GroupData>) => {
    try {
      await updateDoc(courseDocRef, {
        groups: arrayUnion({
          ...groupData,
          ...newData,
        }),
      });
    } catch (error) {
      console.error("Error updating group data:", error);
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {
    groupName: "",
    groupColor: "#000000",
    filter: "",
    availableStudents: courseStudents,
    groupMembers: [],
  });

  const filteredStudents = React.useMemo(
    () =>
      state.availableStudents.filter(
        (student) =>
          student.name?.fullName
            ?.toLowerCase()
            .includes(state.filter.toLowerCase()) ?? false
      ),
    [state.availableStudents, state.filter]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        source.droppableId === "available"
          ? state.availableStudents
          : state.groupMembers,
        source.index,
        destination.index
      );

      if (source.droppableId === "available") {
        dispatch({ type: "SET_AVAILABLE_STUDENTS", payload: items });
      } else {
        dispatch({ type: "SET_GROUP_MEMBERS", payload: items });
      }
    } else {
      const moveResult = move(
        source.droppableId === "available"
          ? state.availableStudents
          : state.groupMembers,
        source.droppableId === "available"
          ? state.groupMembers
          : state.availableStudents,
        source,
        destination
      );

      dispatch({
        type: "SET_AVAILABLE_STUDENTS",
        payload: moveResult.available || moveResult.groupMembers,
      });
      dispatch({
        type: "SET_GROUP_MEMBERS",
        payload: moveResult.groupMembers || moveResult.available,
      });
    }
    if (result.destination?.droppableId === "group") {
      const studentId = result.draggableId;
      updateGroupData({
        participantIds: arrayUnion(studentId) as unknown as string[],
      });
    } else if (result.source.droppableId === "group") {
      const studentId = result.draggableId;
      updateGroupData({
        participantIds: arrayRemove(studentId) as unknown as string[],
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Student Group Settings</h1>

      <div className="mb-4">
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          value={state.groupName}
          onChange={(e) =>
            dispatch({ type: "SET_GROUP_NAME", payload: e.target.value })
          }
          placeholder="Enter group name"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="groupColor">Group Color</Label>
        <Input
          id="groupColor"
          type="color"
          value={state.groupColor}
          onChange={(e) =>
            dispatch({ type: "SET_GROUP_COLOR", payload: e.target.value })
          }
          className="h-10 w-20"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="studentFilter">Filter Students</Label>
        <Input
          id="studentFilter"
          value={state.filter}
          onChange={(e) =>
            dispatch({ type: "SET_FILTER", payload: e.target.value })
          }
          placeholder="Filter by student name"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Available Students</h2>
            <Droppable droppableId="available">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] bg-gray-100 p-4 rounded"
                >
                  {filteredStudents.map((student, index) => (
                    <Draggable
                      key={student.id ?? ""}
                      draggableId={student.id ?? ""}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow"
                        >
                          {student.name?.fullName}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Group Members</h2>
            <Droppable droppableId="group">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] bg-gray-100 p-4 rounded"
                >
                  {state.groupMembers.map((student, index) => (
                    <Draggable
                      key={student.id ?? ""}
                      draggableId={student.id ?? ""}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow"
                        >
                          {student.name?.fullName}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      <Button className="mt-4">Save Group Settings</Button>
    </div>
  );
}

// Helper function to reorder list
const reorder = (
  list: classroom_v1.Schema$UserProfile[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper function to move item from one list to another
const move = (
  source: classroom_v1.Schema$UserProfile[],
  destination: classroom_v1.Schema$UserProfile[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Record<string, classroom_v1.Schema$UserProfile[]> = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
