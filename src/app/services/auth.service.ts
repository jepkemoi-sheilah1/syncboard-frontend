import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';

// ========== MODELS ==========

// User Models
export interface User {
  id?: string;
  firstName: string;
  sirName: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  // Computed property for display (used in components)
  name?: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface UserRegistrationRequest {
  firstName: string;
  sirName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserEmailDTO {
  email: string;
}

// Board Models
export interface Board {
  id: string;
  name: string;
  workspaceId: string;
}

export interface BoardsRequest {
  name: string;
}

// Workspace Models
export interface Workspace {
  id: string;
  name: string;
}

export interface WorkSpaceRequest {
  name: string;
}

export interface InviteRequest {
  email: string;
  workspaceId: string;
}

// List Models
export interface BoardList {
  id: string;
  name: string;
  boardId: string;
}

export interface ListRequest {
  name: string;
  boardId: string;
}

// Board Member Models
export interface BoardMember {
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface AddBoardMemberRequest {
  email: string;
  role: string;
}

// Comment Models
export interface Comment {
  id: string;
  content: string;
  cardId: string;
  userId: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Notification Models
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Activity Log Models
export interface ActivityLog {
  id: string;
  action: string;
  boardId: string;
  userId: string;
  createdAt: string;
}

// ========== API SERVICE ==========

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/v2.0`;

  // ========== USER ENDPOINTS ==========
  
  register(data: UserRegistrationRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/user/register`, data);
  }

  login(data: UserLoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/user/login`, data);
  }

  logout(): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/logout`, {});
  }

  updateUser(data: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/user/update`, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/delete`);
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/confirm`, { params: { token } });
  }

  requestPasswordReset(email: UserEmailDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/reset-password/request`, email);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/reset-password`, { token, newPassword });
  }

  // ========== WORKSPACE ENDPOINTS ==========

  createWorkspace(data: WorkSpaceRequest): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.baseUrl}/workspace/create`, data);
  }

  getMyWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.baseUrl}/workspace/my-workspaces`);
  }

  inviteToWorkspace(data: InviteRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/workspace/invite`, data);
  }

  acceptInvite(inviteToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/workspace/accept-invite`, { token: inviteToken });
  }

  deleteWorkspace(workspaceId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workspace/${workspaceId}`);
  }

  // ========== BOARD ENDPOINTS ==========

  getBoardsByWorkspace(workspaceId: string): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/workspace/${workspaceId}/boards`);
  }

  createBoard(workspaceId: string, data: BoardsRequest): Observable<Board> {
    return this.http.post<Board>(`${this.baseUrl}/workspace/${workspaceId}/boards`, data);
  }

  deleteBoard(boardId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workspace/boards/${boardId}`);
  }

  // ========== LIST ENDPOINTS ==========

  createList(data: ListRequest): Observable<BoardList> {
    return this.http.post<BoardList>(`${this.baseUrl}/list/create`, data);
  }

  getBoardLists(boardId: string): Observable<BoardList[]> {
    return this.http.get<BoardList[]>(`${this.baseUrl}/list/boardLists`, { 
      params: { boardId } 
    });
  }

  // ========== BOARD MEMBER ENDPOINTS ==========

  addBoardMember(boardId: string, data: AddBoardMemberRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/board/${boardId}/members`, data);
  }

  updateMemberRole(boardId: string, userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/board/${boardId}/members/${userId}/role`, { role });
  }

  removeBoardMember(boardId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/board/${boardId}/members/${userId}`);
  }

  // ========== CARD ASSIGNEE ENDPOINTS ==========

  reassignCard(cardId: string, userIds: string[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/cards/${cardId}/assignees/reassign`, { userIds });
  }

  removeCardAssignee(cardId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/cards/${cardId}/assignees/${userId}`);
  }

  // ========== COMMENT ENDPOINTS ==========

  getCardComments(cardId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/api/cards/${cardId}/comments`);
  }

  createComment(cardId: string, data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/api/cards/${cardId}/comments`, data);
  }

  // ========== NOTIFICATION ENDPOINTS ==========

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
  }

  markNotificationRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  // ========== ACTIVITY LOG ENDPOINTS ==========

  getBoardActivityLogs(boardId: string): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.baseUrl}/boards/${boardId}/activity-logs`);
  }
}

// ========== AUTH SERVICE ==========

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  // Signals for reactive state management
  private _user = signal<User | null>(null);
  private _isLoggedIn = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);
  private _verificationStatus = signal<{ verified?: boolean; error?: string } | null>(null);

  // Public computed signals
  user = computed(() => this._user());
  isLoggedIn = computed(() => this._isLoggedIn());
  isLoading = computed(() => this._isLoading());

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('syncboard_token');
    const userStr = localStorage.getItem('syncboard_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._user.set(user);
        this._isLoggedIn.set(true);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  private setAuthData(response: UserResponse): void {
    // Compute name from firstName and sirName
    const userWithName = {
      ...response.user,
      name: `${response.user.firstName} ${response.user.sirName}`.trim()
    };
    localStorage.setItem('syncboard_token', response.token);
    localStorage.setItem('syncboard_user', JSON.stringify(userWithName));
    this._user.set(userWithName);
    this._isLoggedIn.set(true);
  }

  private clearAuthData(): void {
    localStorage.removeItem('syncboard_token');
    localStorage.removeItem('syncboard_user');
    this._user.set(null);
    this._isLoggedIn.set(false);
  }

  // ========== AUTH METHODS ==========

  register(data: UserRegistrationRequest): Observable<any> {
    this._isLoading.set(true);
    return this.api.register(data).pipe(
      tap((response) => {
        this.setAuthData(response);
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  login(data: UserLoginRequest): Observable<any> {
    this._isLoading.set(true);
    return this.api.login(data).pipe(
      tap((response) => {
        this.setAuthData(response);
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Clear local auth even if API call fails
        this.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }

  deleteAccount(password: string): Observable<any> {
    this._isLoading.set(true);
    return this.api.deleteAccount().pipe(
      tap(() => {
        this.clearAuthData();
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  // ========== EMAIL VERIFICATION ==========

  verifyEmail(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.api.confirmEmail(token).subscribe({
        next: () => {
          this._verificationStatus.set({ verified: true });
          resolve(true);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Email verification failed';
          this._verificationStatus.set({ error: errorMessage });
          resolve(false);
        }
      });
    });
  }

  isEmailVerified(): boolean {
    const status = this._verificationStatus();
    return status?.verified || false;
  }

  getVerificationError(): string | undefined {
    const status = this._verificationStatus();
    return status?.error;
  }

  clearVerificationStatus(): void {
    this._verificationStatus.set(null);
  }

  // ========== PASSWORD RESET ==========

  forgotPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.requestPasswordReset({ email }).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  resetPassword(token: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.resetPassword(token, newPassword).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  // ========== TOKEN HELPERS ==========

  getToken(): string | null {
    return localStorage.getItem('syncboard_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

