import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ReassignCardAssigneeRequest } from '../models/card.assignees.models';

@Injectable({
  providedIn: 'root'
})
export class CardAssigneesService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  reassign(cardId: string, request: ReassignCardAssigneeRequest): Observable<any> {
    // POST/PUT shape depends on backend; keep payload minimal.
    return this.http.post<any>(`${this.base}/cards/${cardId}/assignees/reassign`, request).pipe(
      map((response) => response.data ?? response)
    );
  }

  remove(cardId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/cards/${cardId}/assignees/${userId}`);
  }
}

