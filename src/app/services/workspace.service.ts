import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Workspace,
  CreateWorkspaceRequest,
  WorkspaceMember,
  WorkspaceInvitation,
  SendWorkspaceInvitationRequest,
  WorkspaceInvitationResponse
} from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  // ─── Workspace CRUD ───────────────────────────────────────────────────────

  getMyWorkspaces(): Observable<Workspace[]> {
    return this.http.get<any>(`${this.base}/workspace/my-workspaces`).pipe(
      map(response => response.data)
    );
  }

  getWorkspace(id: string | number): Observable<Workspace> {
    return this.http.get<any>(`${this.base}/workspace/${id}`).pipe(
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

  // ─── Workspace Members ────────────────────────────────────────────────────

  /**
   * Get all members of a workspace
   */
  getWorkspaceMembers(workspaceId: string | number): Observable<WorkspaceMember[]> {
    return this.http.get<any>(`${this.base}/workspace/${workspaceId}/members`).pipe(
      map(response => response.data ?? response)
    );
  }

  /**
   * Remove a member from the workspace
   */
  removeWorkspaceMember(workspaceId: string | number, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/workspace/${workspaceId}/members/${userId}`
    );
  }

  /**
   * Update a member's role within the workspace
   */
  updateWorkspaceMemberRole(
    workspaceId: string | number,
    userId: string,
    role: 'admin' | 'member'
  ): Observable<WorkspaceMember> {
    return this.http.put<any>(
      `${this.base}/workspace/${workspaceId}/members/${userId}/role`,
      { role }
    ).pipe(map(response => response.data ?? response));
  }

  // ─── Workspace Invitations ────────────────────────────────────────────────

  /**
   * Invite a user to the workspace by email.
   * The backend should send them an email; they land on /accept-invite?token=...
   */
  inviteMember(request: SendWorkspaceInvitationRequest): Observable<WorkspaceInvitationResponse> {
    return this.http.post<WorkspaceInvitationResponse>(
      `${this.base}/workspace/${request.workspaceId}/invite`,
      { email: request.email, role: request.role }
    );
  }

  /**
   * Get pending invitations for a workspace
   */
  getPendingInvitations(workspaceId: string | number): Observable<WorkspaceInvitation[]> {
    return this.http.get<any>(
      `${this.base}/workspace/${workspaceId}/invites`
    ).pipe(map(response => response.data ?? response));
  }

  /**
   * Cancel / revoke a pending workspace invitation
   */
  cancelInvitation(workspaceId: string | number, invitationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/workspace/${workspaceId}/invites/${invitationId}`
    );
  }

  /**
   * Accept a workspace invitation via token (called from the invite-accept page)
   */
  acceptInvitation(token: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.base}/workspace/invitations/${token}/accept`,
      {}
    );
  }

  /**
   * Decline a workspace invitation via token
   */
  declineInvitation(token: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.base}/workspace/invitations/${token}/decline`,
      {}
    );
  }
}