import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminSchedulerApiService } from '../../../core/scheduler/admin-scheduler-api.service';
import { SchedulerEvent } from '../../../core/scheduler/admin-scheduler-api.model';

@Component({
  selector: 'app-admin-scheduler',
  imports: [DatePipe],
  templateUrl: './admin-scheduler.html',
  styleUrl: './admin-scheduler.scss',
})
export class AdminSchedulerPage implements OnInit {
  private readonly schedulerApi = inject(AdminSchedulerApiService);

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

  protected hoveredEvent(): SchedulerEvent | null {
    const id = this.hoveredEventId();
    if (!id) {
      return null;
    }
    return this.events().find((event) => event.id === id) ?? null;
  }

  private fetch(): void {
    this.loading.set(true);
    this.error.set(null);

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
