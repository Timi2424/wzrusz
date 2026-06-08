import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../api/api-config';
import { InquirySummary } from '../auth/auth-api.model';
import { DekolistaItem } from '../dekolista/dekolista.model';
import {
  CreateInquiryPayload,
  CreateInquiryResponse,
  buildCreateInquiryPayload,
} from './inquiry-api.model';
import { InquiryFormValue } from './inquiry-form.model';

@Injectable({ providedIn: 'root' })
export class InquiryApiService {
  private readonly http = inject(HttpClient);

  submit(
    form: InquiryFormValue,
    items: readonly DekolistaItem[],
  ): Observable<CreateInquiryResponse> {
    const payload: CreateInquiryPayload = buildCreateInquiryPayload(form, items);
    return this.http.post<CreateInquiryResponse>(apiUrl('/api/inquiries'), payload);
  }

  listSummaries(): Observable<InquirySummary[]> {
    return this.http.get<InquirySummary[]>(apiUrl('/api/inquiries'));
  }
}
