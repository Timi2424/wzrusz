import {
  buildMonthCalendarWeeks,
  isSegmentVisible,
  weekColumnHiddenCounts,
} from './scheduler-calendar.model';

describe('buildMonthCalendarWeeks', () => {
  it('creates one continuous segment for a multi-day event within a week', () => {
    const month = new Date(2026, 6, 1);
    const weeks = buildMonthCalendarWeeks(month, [
      {
        id: 'evt-1',
        title: 'Wesele',
        startsAt: '2026-07-15T08:00:00.000Z',
        endsAt: '2026-07-16T16:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
    ]);

    const weekWithEvent = weeks.find((week) =>
      week.segments.some((segment) => segment.event.id === 'evt-1'),
    );

    expect(weekWithEvent?.segments).toHaveLength(1);
    expect(weekWithEvent?.segments[0].span).toBe(2);
    expect(weekWithEvent?.segments[0].continuesBefore).toBe(false);
    expect(weekWithEvent?.segments[0].continuesAfter).toBe(false);
  });

  it('assigns separate lanes to overlapping events in the same week', () => {
    const month = new Date(2026, 6, 1);
    const weeks = buildMonthCalendarWeeks(month, [
      {
        id: 'evt-a',
        title: 'Wesele A',
        startsAt: '2026-07-15T08:00:00.000Z',
        endsAt: '2026-07-15T18:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
      {
        id: 'evt-b',
        title: 'Wesele B',
        startsAt: '2026-07-15T10:00:00.000Z',
        endsAt: '2026-07-16T12:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
    ]);

    const weekWithEvents = weeks.find((week) => week.segments.length >= 2);
    const lanes = new Set(weekWithEvents?.segments.map((segment) => segment.lane));

    expect(lanes.size).toBe(2);
  });

  it('assigns three lanes when three events overlap on the same day', () => {
    const month = new Date(2026, 6, 1);
    const weeks = buildMonthCalendarWeeks(month, [
      {
        id: 'evt-a',
        title: 'A',
        startsAt: '2026-07-15T08:00:00.000Z',
        endsAt: '2026-07-15T18:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
      {
        id: 'evt-b',
        title: 'B',
        startsAt: '2026-07-15T10:00:00.000Z',
        endsAt: '2026-07-15T20:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
      {
        id: 'evt-c',
        title: 'C',
        startsAt: '2026-07-15T12:00:00.000Z',
        endsAt: '2026-07-15T22:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
    ]);

    const weekWithEvents = weeks.find((week) => week.segments.length >= 3);
    const lanes = new Set(weekWithEvents?.segments.map((segment) => segment.lane));

    expect(lanes.size).toBe(3);
    expect(
      weekWithEvents?.segments.filter((segment) => isSegmentVisible(segment)),
    ).toHaveLength(2);
    expect(weekColumnHiddenCounts(weekWithEvents!)[2]).toBe(1);
  });

  it('marks hidden events per column when lanes exceed visible limit', () => {
    const month = new Date(2026, 6, 1);
    const weeks = buildMonthCalendarWeeks(month, [
      {
        id: 'evt-a',
        title: 'A',
        startsAt: '2026-07-15T08:00:00.000Z',
        endsAt: '2026-07-15T18:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
      {
        id: 'evt-b',
        title: 'B',
        startsAt: '2026-07-15T10:00:00.000Z',
        endsAt: '2026-07-15T20:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
      {
        id: 'evt-c',
        title: 'C',
        startsAt: '2026-07-15T12:00:00.000Z',
        endsAt: '2026-07-15T22:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
    ]);

    const weekWithEvents = weeks.find((week) => week.segments.length >= 3);

    expect(weekColumnHiddenCounts(weekWithEvents!)[2]).toBe(1);
  });

  it('splits a long event across weeks with continuation flags', () => {
    const month = new Date(2026, 6, 1);
    const weeks = buildMonthCalendarWeeks(month, [
      {
        id: 'evt-2',
        title: 'Festiwal',
        startsAt: '2026-07-30T10:00:00.000Z',
        endsAt: '2026-08-03T18:00:00.000Z',
        inquiryId: null,
        occupiedDecorations: [],
      },
    ]);

    const segments = weeks.flatMap((week) => week.segments);
    const eventSegments = segments.filter((segment) => segment.event.id === 'evt-2');

    expect(eventSegments.length).toBeGreaterThan(1);
    expect(eventSegments[0].continuesAfter).toBe(true);
    expect(eventSegments.at(-1)?.continuesBefore).toBe(true);
  });
});
