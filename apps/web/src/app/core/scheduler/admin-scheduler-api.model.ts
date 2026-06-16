export interface OccupiedDecoration {
  decorationId: string;
  decorationName: string;
  quantity: number;
}

export interface SchedulerEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  inquiryId: string | null;
  occupiedDecorations: OccupiedDecoration[];
}
