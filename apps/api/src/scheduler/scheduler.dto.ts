export interface OccupiedDecorationDto {
  decorationId: string;
  decorationName: string;
  quantity: number;
}

export interface SchedulerEventDto {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  inquiryId: string | null;
  occupiedDecorations: OccupiedDecorationDto[];
}

export interface SchedulerRangeFiltersDto {
  from: string;
  to: string;
}
