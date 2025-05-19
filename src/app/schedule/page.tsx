import ResourceSchedule from "@/components/schedule/ResourceSchedule";
import { dummyEvents } from "@/components/schedule/dummyEvents";

export default function Schedule() {
  return <ResourceSchedule events={dummyEvents.events} />;
}
