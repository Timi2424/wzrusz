import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../api/api-config';
import { SchedulerEvent } from './admin-scheduler-api.model';

@Injectable({ providedIn: 'root' })
export class AdminSchedulerApiService {
  private readonly http = inject(HttpClient);

  listEvents(from: string, to: string): Observable<SchedulerEvent[]> {
    const params = new URLSearchParams({ from, to });
    return this.http.get<SchedulerEvent[]>(
      apiUrl(`/api/admin/scheduler/events?${params.toString()}`),
    );
  }
}
