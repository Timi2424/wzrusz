import { DatePipe, NgStyle } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminSchedulerApiService } from '../../../core/scheduler/admin-scheduler-api.service';
import { SchedulerEvent } from '../../../core/scheduler/admin-scheduler-api.model';
import {
  SchedulerEventSegment,
  SCHEDULER_VISIBLE_LANES,
  buildMonthCalendarWeeks,
  isSegmentVisible,
  weekColumnHiddenCounts,
} from './scheduler-calendar.model';

@Component({
  selector: 'app-admin-scheduler',
  imports: [DatePipe, NgStyle],
  templateUrl: './admin-scheduler.html',
  styleUrl: './admin-scheduler.scss',
})
export class AdminSchedulerPage implements OnInit {
  private readonly schedulerApi = inject(AdminSchedulerApiService);

  protected readonly weekdayLabels = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly events = signal<SchedulerEvent[]>([]);
  protected readonly month = signal(this.startOfMonth(new Date()));
  protected readonly hoveredEventId = signal<string | null>(null);

  protected readonly monthLabel = computed(() =>
    this.month().toLocaleDateString('pl-PL', {
      month: 'long',
      year: 'numeric',
    }),
  );

  protected readonly calendarWeeks = computed(() =>
    buildMonthCalendarWeeks(this.month(), this.events()),
  );

  protected readonly hasEventsInMonth = computed(() =>
    this.calendarWeeks().some((week) =>
      week.segments.some((segment) => {
        const day = week.days[segment.startColumn];
        return day.inMonth;
      }),
    ),
  );

  protected readonly visibleLanes = SCHEDULER_VISIBLE_LANES;
  protected isSegmentVisible = isSegmentVisible;
  protected weekColumnHiddenCounts = weekColumnHiddenCounts;

  protected overflowChipStyle(column: number): Record<string, string> {
    return {
      gridColumn: `${column + 1}`,
      gridRow: `${this.visibleLanes}`,
    };
  }

  ngOnInit(): void {
    this.fetch();
  }

  protected previousMonth(): void {
    const current = this.month();
    this.month.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.fetch();
  }

  protected nextMonth(): void {
    const current = this.month();
    this.month.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.fetch();
  }

  protected goToToday(): void {
    this.month.set(this.startOfMonth(new Date()));
    this.fetch();
  }

  protected showOccupied(eventId: string): void {
    this.hoveredEventId.set(eventId);
  }

  protected hideOccupied(): void {
    this.hoveredEventId.set(null);
  }

  protected dayLabel(date: Date): string {
    return String(date.getDate());
  }

  protected segmentStyle(segment: SchedulerEventSegment): Record<string, string> {
    return {
      gridColumn: `${segment.startColumn + 1} / span ${segment.span}`,
      gridRow: `${segment.lane + 1}`,
    };
  }

  private fetch(): void {
    this.loading.set(true);
    this.error.set(null);
    this.hoveredEventId.set(null);

    const from = this.month();
    const to = new Date(from.getFullYear(), from.getMonth() + 1, 1);

    this.schedulerApi
      .listEvents(from.toISOString(), to.toISOString())
      .subscribe({
        next: (rows) => {
          this.events.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Nie udało się pobrać harmonogramu.');
          this.loading.set(false);
        },
      });
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}
