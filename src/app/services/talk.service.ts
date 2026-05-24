import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Issue, TalkRequest, TalkResponse } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class TalkService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  getActiveIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.base}/issues/active`);
  }

  sendMessage(request: TalkRequest): Observable<TalkResponse> {
    return this.http.post<TalkResponse>(`${this.base}/talks`, request);
  }
}