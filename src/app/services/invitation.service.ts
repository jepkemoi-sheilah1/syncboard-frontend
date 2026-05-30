import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// NOTE:
// This service is intentionally named "InvitationService" because the backend endpoint
// deals with inviting workspace members.
// Backend (Swagger) endpoint used:
//   POST /workspace/{workspaceId}/invite
// Request body (as used elsewhere in this frontend):
//   { invitations: [{ email, role }] }
//
// If your backend DTO differs, adjust the interface types accordingly.

export type WorkspaceInviteRole = 'admin' | 'member';

export interface SendWorkspaceInvitationRequest {
  workSpaceId: string | number;
  invitations: Array<{ email: string; role: WorkspaceInviteRole }>;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  sendInvitation(
    request: SendWorkspaceInvitationRequest
  ): Observable<any> {
    // Mirrors usage in WorkspaceService.inviteMember()
    // Swagger endpoint: POST /workspace/{workspaceId}/invite
    return this.http.post<any>(
      `${this.base}/workspace/${request.workSpaceId}/invite`,
      { email: request.invitations.map(i => i.email), role: undefined }
    );
  }
}

