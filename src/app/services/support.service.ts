import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TalkResponse } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  // -------------------------------
  // Talks
  // -------------------------------

  getAllTalks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/talks`);
  }

  getTalkById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.base}/talks/${id}`);
  }

  updateTalkStatus(id: number | string, status: string): Observable<TalkResponse> {
    return this.http.patch<TalkResponse>(`${this.base}/talks/${id}/status`, { status });
  }

  deleteTalk(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/talks/${id}`);
  }

  // -------------------------------
  // FAQs
  // -------------------------------

  getAllFaqs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/faqs`);
  }

  getActiveFaqs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/faqs/active`);
  }

  createFaq(request: { question: string; answer: string; active?: boolean }): Observable<any> {
    return this.http.post<any>(`${this.base}/faqs`, request);
  }

  getFaqById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.base}/faqs/${id}`);
  }

  updateFaq(id: number | string, request: { question: string; answer: string; active?: boolean }): Observable<any> {
    return this.http.put<any>(`${this.base}/faqs/${id}`, request);
  }

  deleteFaq(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/faqs/${id}`);
  }

  toggleFaqActive(id: number | string): Observable<any> {
    return this.http.patch<any>(`${this.base}/faqs/${id}/activate-deactivate`, {});
  }

  // -------------------------------
  // Issues
  // -------------------------------

  getAllIssues(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/issues`);
  }

  getActiveIssues(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/issues/active`);
  }

  createIssue(request: { name: string; description: string; active?: boolean }): Observable<any> {
    return this.http.post<any>(`${this.base}/issues`, request);
  }

  getIssueById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.base}/issues/${id}`);
  }

  updateIssue(id: number | string, request: { name: string; description: string; active?: boolean }): Observable<any> {
    return this.http.put<any>(`${this.base}/issues/${id}`, request);
  }

  deleteIssue(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.base}/issues/${id}`);
  }

  toggleIssueActive(id: number | string): Observable<any> {
    return this.http.patch<any>(`${this.base}/issues/${id}/toggle`, {});
  }

  // -------------------------------
  // Notifications
  // -------------------------------

  getMyNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/notifications`);
  }

  markNotificationRead(id: number | string): Observable<any> {
    return this.http.patch<any>(`${this.base}/notifications/${id}/read`, {});
  }

  // -------------------------------
  // System config
  // -------------------------------

  getAllSystemConfig(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/system-config`);
  }

  createSystemConfig(request: { configKey: string; configValue: string; description?: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/system-config`, request);
  }

  getSystemConfigByKey(configKey: string): Observable<any> {
    return this.http.get<any>(`${this.base}/system-config/${encodeURIComponent(configKey)}`);
  }

  updateSystemConfigByKey(
    configKey: string,
    request: { configKey: string; configValue: string; description?: string }
  ): Observable<any> {
    return this.http.put<any>(
      `${this.base}/system-config/${encodeURIComponent(configKey)}`,
      request
    );
  }
}



