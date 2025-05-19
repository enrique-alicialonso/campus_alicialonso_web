"use client";

import React from "react";
import ResourceSchedule from "./ResourceSchedule";
import { Event, Schedule } from "@/types/events";

export default function ResourceScheduleExample() {
  // Sample data based on the image provided
  const sampleSchedule: Schedule = {
    scheduleId: "schedule-1",
    scheduleTitle: "Horarios Curso 24-25 Cuatrimestre 2",
    department: "Danza",
    events: [
      // Monday events (February 10, 2024)
      {
        id: "1",
        value: "ballet-elemental-401-mon",
        title: "Ballet",
        description: "ELEMENTAL",
        participants: ["Gemma"],
        placesOverride: [],
        start: "2024-02-10T15:00:00Z",
        end: "2024-02-10T16:00:00Z",
        place: "401",
        allDay: "false",
      },
      {
        id: "2",
        value: "ballet-intermedio-402-mon",
        title: "Ballet",
        description: "INTERMEDIO",
        participants: ["Vivec", "Pepín"],
        placesOverride: [],
        start: "2024-02-10T15:00:00Z",
        end: "2024-02-10T16:30:00Z",
        place: "402",
        allDay: "false",
      },
      {
        id: "3",
        value: "ballet-profesional-403-mon",
        title: "Ballet",
        description: "PROFESIONAL",
        participants: ["Enrique"],
        placesOverride: [],
        start: "2024-02-10T15:00:00Z",
        end: "2024-02-10T16:30:00Z",
        place: "403",
        allDay: "false",
      },
      {
        id: "4",
        value: "prep-fundamentos-401-mon",
        title: "Prep",
        description: "FUNDAMENTOS",
        participants: ["Enrique"],
        placesOverride: [],
        start: "2024-02-10T16:00:00Z",
        end: "2024-02-10T16:30:00Z",
        place: "401",
        allDay: "false",
      },
      {
        id: "5",
        value: "tecnica-exploradores-402-mon",
        title: "Técnica",
        description: "EXPLORADORES",
        participants: ["Ana"],
        placesOverride: [],
        start: "2024-02-10T16:00:00Z",
        end: "2024-02-10T17:00:00Z",
        place: "402",
        allDay: "false",
      },
      {
        id: "6",
        value: "tecnica-innovadores-403-mon",
        title: "Técnica",
        description: "INNOVADORES",
        participants: ["Odwen"],
        placesOverride: [],
        start: "2024-02-10T16:00:00Z",
        end: "2024-02-10T17:00:00Z",
        place: "403",
        allDay: "false",
      },
      // Add more events as needed to match the image

      // Tuesday events (February 11, 2024)
      {
        id: "7",
        value: "ballet-elemental-401-tue",
        title: "Ballet",
        description: "ELEMENTAL",
        participants: ["Gemma"],
        placesOverride: [],
        start: "2024-02-11T15:00:00Z",
        end: "2024-02-11T16:00:00Z",
        place: "401",
        allDay: "false",
      },
      {
        id: "8",
        value: "ballet-intermedio-402-tue",
        title: "Ballet",
        description: "INTERMEDIO",
        participants: ["Vivec", "Pepín"],
        placesOverride: [],
        start: "2024-02-11T15:00:00Z",
        end: "2024-02-11T16:00:00Z",
        place: "402",
        allDay: "false",
      },
      // Add more events as needed
    ],
  };

  return (
    <div className="p-4">
      <ResourceSchedule
        events={sampleSchedule.events}
        schedule={sampleSchedule}
      />
    </div>
  );
}
