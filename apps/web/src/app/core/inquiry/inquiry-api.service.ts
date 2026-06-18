import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../api/api-config';
import {
  ApproveInquiryPayload,
  ApproveInquiryResponse,
  InquiryAvailability,
  InquiryDetail,
  InquiryListFilters,
  InquirySummary,
  SendSuccessEmailResponse,
} from '../auth/auth-api.model';
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

  listSummaries(filters?: InquiryListFilters): Observable<InquirySummary[]> {
    const params = new URLSearchParams();
    if (filters?.from) {
      params.set('from', filters.from);
    }
    if (filters?.to) {
      params.set('to', filters.to);
    }
    const query = params.toString();
    const endpoint = query ? `/api/inquiries?${query}` : '/api/inquiries';
    return this.http.get<InquirySummary[]>(apiUrl(endpoint));
  }

  getDetail(id: string): Observable<InquiryDetail> {
    return this.http.get<InquiryDetail>(apiUrl(`/api/inquiries/${id}`));
  }

  getAvailability(id: string): Observable<InquiryAvailability> {
    return this.http.get<InquiryAvailability>(
      apiUrl(`/api/inquiries/${id}/availability`),
    );
  }

  approve(
    id: string,
    payload: ApproveInquiryPayload,
  ): Observable<ApproveInquiryResponse> {
    return this.http.post<ApproveInquiryResponse>(
      apiUrl(`/api/inquiries/${id}/approve`),
      payload,
    );
  }

  sendSuccessEmail(id: string): Observable<SendSuccessEmailResponse> {
    return this.http.post<SendSuccessEmailResponse>(
      apiUrl(`/api/inquiries/${id}/send-success-email`),
      {},
    );
  }
}
