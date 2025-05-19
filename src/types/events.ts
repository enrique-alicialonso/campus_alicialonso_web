export interface Event {
  value: string; // Not visibly used in the image, can be ignored for display
  title: string; // e.g., "Ballet", "Prep", "Técnica", "Taller", "Bankai"
  description: string; // e.g., "ELEMENTAL", "FUNDAMENTOS", "EXPLORADORES", "PROFESIONAL", "INNOVADORES"
  participants: string[]; // e.g., ["Gemma"], ["Enrique"], ["Ana Francy"], ["Enrique", "Manuel"]
  placesOverride: string[]; // Not visibly used in the image, can be ignored for display
  start: string; // ISO date-time string UTC, e.g., "2024-02-10T15:00:00"
  end: string; // ISO date-time string UTC, e.g., "2024-02-10T16:00:00"
  place: string; // e.g., "401", "402", "403", "otros"
  allDay: string; // Not visibly used in the image for its intended purpose. The image uses place names as column headers.
  id: string; // Unique event identifier
}

export interface Schedule {
  scheduleId: string;
  scheduleTitle: string; // e.g., "Horarios Curso 24-25 Cuatrimestre 2"
  department: string; // Not visibly used in the image
  events: Event[];
}
