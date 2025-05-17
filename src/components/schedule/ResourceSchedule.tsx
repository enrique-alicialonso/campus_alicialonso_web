"use client";
import { dummyEvents } from "./dummyEvents";
import React, { useState, useEffect } from "react";
import {
  DayPilotCalendar,
  CalendarProps,
  DayPilot,
} from "@daypilot/daypilot-lite-react";
import { isDateInSameWeek } from "@/lib/utils";

export default function ResourceSchedule() {
  const beginDate = "2024-10-09";
  console.log(beginDate);
  // State for viewType
  const [config, setConfig] = useState<CalendarProps>({
    viewType: "Resources",
    startDate: DayPilot.Date.parse(beginDate, "yyyy-MM-dd", "en-US"),
    columns: Array.from(
      new Set(dummyEvents.events.map((event) => `${event.place ?? "Unknown"}`))
    ).map((place) => ({ name: place, id: place })),
  });

  const [events, setEvents] = useState<DayPilot.EventData[]>([]);

  useEffect(() => {
    setEvents(
      dummyEvents.events
        // .filter((event) => isDateInSameWeek(event.start, beginDate))
        .map((event) =>
          event.start && event.end
            ? {
                start: DayPilot.Date.parse(
                  event.start,
                  "yyyy-MM-ddTHH:mm:ss.000Z"
                ).addHours(2),
                end: DayPilot.Date.parse(
                  event.end,
                  "yyyy-MM-ddTHH:mm:ss.000Z"
                ).addHours(2),
                id: event.id,
                text: event.title,
                resource: `${event.place ?? "Unknown"}`,
              }
            : null
        )
        .filter((event) => event !== null)
        .filter((event) => event.start && event.end)
    );
  }, []);

  // State for startDate
  const [startDate, setStartDate] = useState(config.startDate);
  console.log("events");
  console.log(events);
  return (
    <DayPilotCalendar
      {...config}
      startDate={startDate}
      events={(() => {
        console.log(JSON.stringify(events[0]));
        return events;
      })()}
    />
  );
}
