import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  getBoard(boardId: string): Observable<Board> {
    return this.http.get<Board>(`${this.base}/boards/${boardId}`);
  }

  getBoardsByWorkspace(workspaceId: string): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.base}/workspaces/${workspaceId}/boards`);
  }

  createBoard(request: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(`${this.base}/boards`, request);
  }

  updateBoard(boardId: string, request: UpdateBoardRequest): Observable<Board> {
    return this.http.put<Board>(`${this.base}/boards/${boardId}`, request);
  }

  deleteBoard(boardId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/boards/${boardId}`);
  }
}