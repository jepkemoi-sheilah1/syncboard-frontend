import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Workspace, CreateWorkspaceRequest } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  getMyWorkspaces(): Observable<Workspace[]> {
    return this.http.get<any>(`${this.base}/workspace/my-workspaces`).pipe(
      map(response => response.data)
    );
  }

  createWorkspace(request: CreateWorkspaceRequest): Observable<Workspace> {
    return this.http.post<any>(`${this.base}/workspace/create`, request).pipe(
      map(response => response.data)
    );
  }

  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/workspace/${id}`);
  }
}