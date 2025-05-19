"use client";

import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import { Event, Schedule } from "@/types/events";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/utils";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

type ResourceScheduleProps = {
  events: Event[];
  schedule?: Schedule;
};

type TimeSlot = {
  start: string;
  end: string;
  label: string;
};

type EventWithMeta = Event & {
  rowSpan: number;
  displayed: boolean;
};

export default function ResourceSchedule({
  events,
  schedule,
}: ResourceScheduleProps) {
  // Set timezone to Madrid
  const timezone = "Europe/Madrid";

  // Group events by day
  const eventsByDay = useMemo(() => {
    const groupedEvents: Record<string, EventWithMeta[]> = {};

    events.forEach((event) => {
      // Convert UTC to local timezone
      const startDate = dayjs(event.start).tz(timezone);
      const dateKey = startDate.format("YYYY-MM-DD");

      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }

      // Calculate rowSpan based on 30-minute intervals
      const startTime = startDate;
      const endTime = dayjs(event.end).tz(timezone);
      const durationMinutes = endTime.diff(startTime, "minute");
      const rowSpan = Math.ceil(durationMinutes / 30);

      groupedEvents[dateKey].push({
        ...event,
        rowSpan,
        displayed: false,
      });
    });

    return groupedEvents;
  }, [events, timezone]);

  // Sort days chronologically
  const sortedDays = useMemo(() => {
    return Object.keys(eventsByDay).sort();
  }, [eventsByDay]);

  // Get unique places across all events
  const uniquePlaces = useMemo(() => {
    const places = new Set<string>();

    events.forEach((event) => {
      places.add(event.place);
    });

    return Array.from(places).sort();
  }, [events]);

  // Generate time slots for a day
  const generateTimeSlots = (dayEvents: EventWithMeta[]): TimeSlot[] => {
    // Find earliest start time and latest end time
    let earliestStart = "23:59";
    let latestEnd = "00:00";

    dayEvents.forEach((event) => {
      const startTime = dayjs(event.start).tz(timezone).format("HH:mm");
      const endTime = dayjs(event.end).tz(timezone).format("HH:mm");

      if (startTime < earliestStart) earliestStart = startTime;
      if (endTime > latestEnd) latestEnd = endTime;
    });

    // Round down to nearest 30-min interval for start
    const [startHour, startMinute] = earliestStart.split(":").map(Number);
    const roundedStartMinute = Math.floor(startMinute / 30) * 30;

    // Round up to nearest 30-min interval for end
    const [endHour, endMinute] = latestEnd.split(":").map(Number);
    const roundedEndMinute = Math.ceil(endMinute / 30) * 30;

    const slots: TimeSlot[] = [];
    let currentTime = dayjs()
      .hour(startHour)
      .minute(roundedStartMinute)
      .second(0);

    const endTime = dayjs().hour(endHour).minute(roundedEndMinute).second(0);

    // Generate slots in 30-minute intervals
    while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
      const startTimeStr = currentTime.format("HH:mm");
      const nextTime = currentTime.add(30, "minute");
      const endTimeStr = nextTime.format("HH:mm");

      slots.push({
        start: startTimeStr,
        end: endTimeStr,
        label: `${startTimeStr} - ${endTimeStr}`,
      });

      currentTime = nextTime;
    }

    return slots;
  };

  // Function to find an event at a specific time slot and place
  const findEvent = (
    dayEvents: EventWithMeta[],
    timeSlot: TimeSlot,
    place: string
  ): EventWithMeta | null => {
    // Create a dayjs object for the time slot
    const slotStart = dayjs(`2000-01-01T${timeSlot.start}:00`);
    const slotEnd = dayjs(`2000-01-01T${timeSlot.end}:00`);

    for (const event of dayEvents) {
      if (event.place !== place || event.displayed) continue;

      const eventStart = dayjs(event.start).tz(timezone);
      const eventStartTime = dayjs(
        `2000-01-01T${eventStart.format("HH:mm")}:00`
      );

      // Check if this event starts at this time slot
      if (eventStartTime.isSame(slotStart)) {
        event.displayed = true; // Mark as displayed to avoid duplicates
        return event;
      }
    }

    return null;
  };

  // Function to format day header
  const formatDayHeader = (dateStr: string): string => {
    return dayjs(dateStr).format("ddd DD/MM");
  };

  const renderDaySchedule = (dateStr: string, dayEvents: EventWithMeta[]) => {
    const timeSlots = generateTimeSlots(dayEvents);
    const formattedDay = formatDayHeader(dateStr);

    // Reset displayed flag for each render
    dayEvents.forEach((event) => {
      event.displayed = false;
    });

    return (
      <React.Fragment key={dateStr}>
        {/* Day header row */}
        <TableRow className="bg-muted/50">
          <TableCell className="font-medium">{formattedDay}</TableCell>
          {uniquePlaces.map((place) => (
            <TableCell key={place} className="font-medium text-center">
              {place}
            </TableCell>
          ))}
        </TableRow>

        {/* Time slot rows */}
        {timeSlots.map((slot, slotIndex) => (
          <TableRow key={`${dateStr}-${slot.label}`}>
            <TableCell className="whitespace-nowrap">{slot.label}</TableCell>

            {uniquePlaces.map((place) => {
              const event = findEvent(dayEvents, slot, place);

              // If we found an event that starts at this time slot
              if (event) {
                return (
                  <TableCell
                    key={`${place}-${slot.label}`}
                    rowSpan={event.rowSpan}
                    className={cn(
                      "p-1 border align-top",
                      place === "401" && "bg-[#e8f4e5]", // Light green
                      place === "402" && "bg-[#d9edf7]", // Light blue
                      place === "403" && "bg-[#fcf8e3]", // Light yellow
                      place === "otros" && "bg-[#f2dede]" // Light red
                    )}
                  >
                    <div className="p-1">
                      <div className="font-bold">{event.title}</div>
                      <div className="text-xs uppercase">
                        {event.description}
                      </div>
                      <div className="text-xs mt-1">
                        {event.participants.join(" / ")}
                      </div>
                    </div>
                  </TableCell>
                );
              }

              // Check if this cell is covered by a previous event's rowSpan
              const isCoveredByRowSpan = dayEvents.some((event) => {
                if (event.place !== place) return false;

                const eventStart = dayjs(event.start).tz(timezone);
                const eventStartTime = eventStart.format("HH:mm");
                const eventStartIndex = timeSlots.findIndex(
                  (ts) => ts.start === eventStartTime
                );

                // If this event starts before the current slot and spans to or beyond this slot
                return (
                  eventStartIndex < slotIndex &&
                  eventStartIndex + event.rowSpan > slotIndex
                );
              });

              // If this cell is not covered by a rowSpan, render an empty cell
              return !isCoveredByRowSpan ? (
                <TableCell key={`${place}-${slot.label}`} className="border" />
              ) : null;
            })}
          </TableRow>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {schedule?.scheduleTitle && (
        <h1 className="text-2xl font-bold mb-6">{schedule.scheduleTitle}</h1>
      )}

      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32"></TableHead>
              {uniquePlaces.map((place) => (
                <TableHead key={place} className="text-center font-bold">
                  {place}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedDays.map((day) => renderDaySchedule(day, eventsByDay[day]))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
