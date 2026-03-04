// ============================================
// Invitation Service - Board Member Invitation Operations
// ============================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Invitation, SendInvitationRequest, InvitationResponse, BoardMember } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  // Use mock data for now (backend not ready)
  private useMockData = true;

  // Pending invitations signal
  private pendingInvitationsSubject = new BehaviorSubject<Invitation[]>([]);
  pendingInvitations$ = this.pendingInvitationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ============================================
  // Invitation Operations
  // ============================================

  /**
   * Send an invitation to join a board
   */
  sendInvitation(request: SendInvitationRequest): Observable<InvitationResponse> {
    if (this.useMockData) {
      const newInvitation: Invitation = {
        id: `inv-${Date.now()}`,
        boardId: request.boardId,
        email: request.email,
        role: request.role,
        invitedBy: 'user-1',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };
      
      // Add to pending invitations
      const current = this.pendingInvitationsSubject.value;
      this.pendingInvitationsSubject.next([...current, newInvitation]);
      
      return of({ success: true, invitation: newInvitation }).pipe(delay(300));
    }

    return this.http.post<InvitationResponse>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${request.boardId}/invite`,
      request
    );
  }

  /**
   * Cancel an invitation
   */
  cancelInvitation(invitationId: string): Observable<void> {
    if (this.useMockData) {
      const current = this.pendingInvitationsSubject.value;
      this.pendingInvitationsSubject.next(current.filter(i => i.id !== invitationId));
      return of(undefined).pipe(delay(200));
    }

    return this.http.delete<void>(
      `${environment.apiUrl}${environment.api.basePath}/invitations/${invitationId}`
    );
  }

  /**
   * Get pending invitations for a board
   */
  getPendingInvitations(boardId: string): Observable<Invitation[]> {
    if (this.useMockData) {
      return of(this.pendingInvitationsSubject.value).pipe(delay(200));
    }

    return this.http.get<Invitation[]>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/invites`
    );
  }

  /**
   * Accept an invitation (for the user receiving it)
   */
  acceptInvitation(token: string): Observable<{ success: boolean }> {
    if (this.useMockData) {
      return of({ success: true }).pipe(delay(300));
    }

    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}${environment.api.basePath}/invitations/${token}/accept`,
      {}
    );
  }

  /**
   * Decline an invitation
   */
  declineInvitation(token: string): Observable<{ success: boolean }> {
    if (this.useMockData) {
      return of({ success: true }).pipe(delay(300));
    }

    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}${environment.api.basePath}/invitations/${token}/decline`,
      {}
    );
  }

  /**
   * Add member to board (when invitation is accepted)
   */
  addMemberToBoard(boardId: string, email: string, role: string): Observable<BoardMember> {
    if (this.useMockData) {
      const newMember: BoardMember = {
        userId: `user-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
        role: role as 'admin' | 'member' | 'observer',
        joinedAt: new Date()
      };
      return of(newMember).pipe(delay(200));
    }

    return this.http.post<BoardMember>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/members`,
      { email, role }
    );
  }

  /**
   * Remove a member from board
   */
  removeMember(boardId: string, userId: string): Observable<void> {
    if (this.useMockData) {
      return of(undefined).pipe(delay(200));
    }

    return this.http.delete<void>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/members/${userId}`
    );
  }

  /**
   * Update member role
   */
  updateMemberRole(boardId: string, userId: string, role: string): Observable<BoardMember> {
    if (this.useMockData) {
      const updatedMember: BoardMember = {
        userId: userId,
        email: 'member@example.com',
        name: 'Member',
        role: role as 'admin' | 'member' | 'observer',
        joinedAt: new Date()
      };
      return of(updatedMember).pipe(delay(200));
    }

    return this.http.put<BoardMember>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/members/${userId}/role`,
      { role }
    );
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get pending invitations
   */
  getPendingInvitationsValue(): Invitation[] {
    return this.pendingInvitationsSubject.value;
  }

  /**
   * Clear all pending invitations
   */
  clearPendingInvitations(): void {
    this.pendingInvitationsSubject.next([]);
  }
}
