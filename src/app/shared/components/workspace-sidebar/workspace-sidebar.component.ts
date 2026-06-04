import { Component, Input, Output, EventEmitter, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace.service';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

export interface WorkspaceBoardItem {
  id: string;
  boardName: string;
  boardColor?: string;
}

@Component({
  selector: 'app-workspace-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './workspace-sidebar.component.html',
  styleUrls: ['./workspace-sidebar.component.css']
})
export class WorkspaceSidebarComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input({ required: true }) boards: WorkspaceBoardItem[] = [];
  @Output() onCreateBoardRequested = new EventEmitter<void>();

  // Workspace header
  workspaceId = signal('');
  collapsed = signal(false);

  // Members panel
  membersOpen = signal(false);
  membersLoading = signal(false);
  membersError = signal('');
  members = signal<any[]>([]);
  membersFetched = signal(false);

  // user
  user = computed(() => this.authService.user());

  // mobile drawer
  mobileOpen = signal(false);

  // workspace name/avatar (best-effort; app does not expose workspace name from provided endpoints without extra API)
  workspaceName = computed(() => 'Workspace');
  workspaceAvatarColor = computed(() => '#3b82f6');

  ngOnInit(): void {
    const wsId = this.route.snapshot.paramMap.get('workspaceId') || '';
    this.workspaceId.set(wsId);
  }

  // Template helpers
  isMobile(): boolean {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  }

  openBoard(boardId: string): void {
    if (!boardId) return;
    this.router.navigate(['/board', boardId]);
  }

  toggleCollapse(): void {
    this.collapsed.set(!this.collapsed());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  toggleMembers(): void {
    const next = !this.membersOpen();
    this.membersOpen.set(next);
    if (next && !this.membersFetched()) {
      this.loadMembers();
    }
  }

  private loadMembers(): void {
    const wsId = this.workspaceId() || this.route.snapshot.paramMap.get('workspaceId') || '';
    if (!wsId) return;

    this.membersLoading.set(true);
    this.membersError.set('');

    this.workspaceService.getWorkspaceMembers(wsId).pipe(
      catchError(() => {
        this.membersError.set('Failed to load members.');
        return of([]);
      })
    ).subscribe((members) => {
      this.members.set(Array.isArray(members) ? members : []);
      this.membersFetched.set(true);
      this.membersLoading.set(false);
    });
  }

  getInitial(nameOrEmail: string | undefined | null): string {
    const s = (nameOrEmail ?? '').toString().trim();
    if (!s) return '?';
    return s.charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }

  getRoleBadge(member: any): 'owner' | 'member' {
    const role = String(member?.role ?? member?.workspaceRole ?? '').toLowerCase();
    return role === 'owner' ? 'owner' : 'member';
  }

  memberAvatarColor(m: any): string {
    return this.getRoleBadge(m) === 'owner' ? '#f59e0b' : '#64748b';
  }

  isActiveBoardRoute(boardId: string): boolean {
    return (this.router.url || '').includes(`/board/${boardId}`);
  }

  trackByBoardId(_index: number, b: WorkspaceBoardItem): string {
    return b.id;
  }

  trackByMember(_index: number, m: any): string {
    return String(m?.email || m?.userId || m?.name || _index);
  }

  boardSwatchColor(b: WorkspaceBoardItem): string {
    return b.boardColor || '#0079bf';
  }
}

