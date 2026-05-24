import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board, CreateBoardRequest } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {}

  getBoard(boardId: string): Observable<Board> {
    return this.http.get<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`
    );
  }

  getBoardsByWorkspace(workspaceId: string): Observable<Board[]> {
    return this.http.get<Board[]>(
      `${environment.apiUrl}${environment.api.basePath}/workspaces/${workspaceId}/boards`
    );
  }

  createBoard(request: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards`,
      request
    );
  }
}