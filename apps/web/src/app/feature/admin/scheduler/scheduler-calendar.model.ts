import { SchedulerEvent } from '../../../core/scheduler/admin-scheduler-api.model';

export interface SchedulerCalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
}

export interface SchedulerEventSegment {
  key: string;
  event: SchedulerEvent;
  startColumn: number;
  span: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
  showTitle: boolean;
}

export interface SchedulerCalendarWeek {
  days: SchedulerCalendarDay[];
  segments: SchedulerEventSegment[];
}

/** Fixed number of event rows shown in each calendar week. */
export const SCHEDULER_VISIBLE_LANES = 2;

export function isSegmentVisible(segment: SchedulerEventSegment): boolean {
  return segment.lane < SCHEDULER_VISIBLE_LANES;
}

export function weekColumnHiddenCounts(week: SchedulerCalendarWeek): number[] {
  return Array.from({ length: 7 }, (_, column) => {
    const hiddenEventIds = week.segments
      .filter(
        (segment) =>
          segment.lane >= SCHEDULER_VISIBLE_LANES &&
          column >= segment.startColumn &&
          column <= segment.startColumn + segment.span - 1,
      )
      .map((segment) => segment.event.id);

    return new Set(hiddenEventIds).size;
  });
}

export function buildMonthCalendarWeeks(
  month: Date,
  events: readonly SchedulerEvent[],
): SchedulerCalendarWeek[] {
  const days = buildMonthDays(month);
  const weeks: SchedulerCalendarWeek[] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const weekDays = days.slice(weekIndex * 7, weekIndex * 7 + 7);
    const segments = buildWeekSegments(weekDays, events, weekIndex);
    weeks.push({ days: weekDays, segments });
  }

  return weeks;
}

export function buildMonthCalendar(
  month: Date,
  events: readonly SchedulerEvent[],
): SchedulerCalendarDay[] {
  return buildMonthDays(month);
}

function buildMonthDays(month: Date): SchedulerCalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, monthIndex, 1 - startOffset);
  const today = startOfDay(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    return {
      date,
      inMonth: date.getMonth() === monthIndex,
      isToday: date.getTime() === today.getTime(),
    };
  });
}

function buildWeekSegments(
  weekDays: SchedulerCalendarDay[],
  events: readonly SchedulerEvent[],
  weekIndex: number,
): SchedulerEventSegment[] {
  const rawSegments = events
    .map((event) => buildEventSegment(event, weekDays, weekIndex))
    .filter((segment): segment is SchedulerEventSegment => segment !== null);

  return assignSegmentLanes(rawSegments);
}

function buildEventSegment(
  event: SchedulerEvent,
  weekDays: SchedulerCalendarDay[],
  weekIndex: number,
): SchedulerEventSegment | null {
  const columns: number[] = [];

  weekDays.forEach((day, column) => {
    if (eventOverlapsDay(event, day.date)) {
      columns.push(column);
    }
  });

  if (columns.length === 0) {
    return null;
  }

  const startColumn = columns[0];
  const endColumn = columns[columns.length - 1];
  const eventStartDay = startOfDay(new Date(event.startsAt));
  const eventEndDay = lastOccupiedDay(new Date(event.endsAt));
  const weekStartDay = startOfDay(weekDays[0].date);
  const weekEndDay = startOfDay(weekDays[6].date);

  return {
    key: `${event.id}-${weekIndex}-${startColumn}`,
    event,
    startColumn,
    span: endColumn - startColumn + 1,
    lane: 0,
    continuesBefore: eventStartDay < weekStartDay,
    continuesAfter: eventEndDay > weekEndDay,
    showTitle: sameDay(weekDays[startColumn].date, eventStartDay) || startColumn === 0,
  };
}

function assignSegmentLanes(
  segments: SchedulerEventSegment[],
): SchedulerEventSegment[] {
  const sorted = [...segments].sort((a, b) => {
    if (a.startColumn !== b.startColumn) {
      return a.startColumn - b.startColumn;
    }
    return b.span - a.span;
  });

  const placed: SchedulerEventSegment[] = [];

  for (const segment of sorted) {
    let lane = 0;

    while (
      placed.some(
        (other) =>
          other.lane === lane && segmentsOverlap(other, segment),
      )
    ) {
      lane += 1;
    }

    placed.push({ ...segment, lane });
  }

  return placed.sort((a, b) => a.lane - b.lane || a.startColumn - b.startColumn);
}

function segmentsOverlap(
  a: SchedulerEventSegment,
  b: SchedulerEventSegment,
): boolean {
  const aEnd = a.startColumn + a.span - 1;
  const bEnd = b.startColumn + b.span - 1;
  return a.startColumn <= bEnd && b.startColumn <= aEnd;
}

function eventOverlapsDay(event: SchedulerEvent, day: Date): boolean {
  const dayStart = startOfDay(day);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

  return startsAt < dayEnd && endsAt > dayStart;
}

function lastOccupiedDay(endsAt: Date): Date {
  const endDay = startOfDay(endsAt);
  if (
    endsAt.getHours() === 0 &&
    endsAt.getMinutes() === 0 &&
    endsAt.getSeconds() === 0 &&
    endsAt.getMilliseconds() === 0
  ) {
    endDay.setDate(endDay.getDate() - 1);
  }
  return endDay;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
