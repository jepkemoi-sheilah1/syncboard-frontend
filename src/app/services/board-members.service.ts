import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BoardMember } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardMembersService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  add(boardId: string, request: { email: string; role: BoardMember['role'] }): Observable<any> {
    return this.http.post<any>(`${this.base}/board/${boardId}/members`, request).pipe(
      map((response) => response.data ?? response)
    );
  }

  updateRole(
    boardId: string,
    userId: string,
    role: BoardMember['role']
  ): Observable<any> {
    return this.http.put<any>(
      `${this.base}/board/${boardId}/members/${userId}/role`,
      { role }
    ).pipe(map((response) => response.data ?? response));
  }

  remove(boardId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/board/${boardId}/members/${userId}`);
  }
}

