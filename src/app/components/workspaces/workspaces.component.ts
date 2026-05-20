import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../services/workspace.service';
import { AuthService } from '../../services/auth.service';
import { UserMenuComponent } from '../auth/user-menu/user-menu.component';
import { Workspace, CreateWorkspaceRequest, WorkspaceInvitation } from '../../models/board.models';

type ModalStep = 'create' | 'invite';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [CommonModule, FormsModule, UserMenuComponent],
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);
  private router = inject(Router);

  workspaces = signal<Workspace[]>([]);
  loading = signal(true);
  creating = signal(false);
  sending = signal(false);

  // Modal state
  showModal = signal(false);
  modalStep = signal<ModalStep>('create');
  justCreatedWorkspace = signal<Workspace | null>(null);

  // Create-workspace fields
  newWorkspaceName = '';
  newWorkspaceDescription = '';

  // Invite fields
  inviteEmail = '';
  inviteRole: 'admin' | 'member' = 'member';
  pendingInvitations = signal<WorkspaceInvitation[]>([]);
  invitedEmails = signal<string[]>([]);   // optimistic list shown in UI

  error = signal('');
  inviteError = signal('');
  inviteSuccess = signal('');

  userName = computed(() => {
    const user = this.authService.user();
    return user?.name || user?.email?.split('@')[0] || 'User';
  });

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.loading.set(true);
    this.workspaceService.getMyWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openWorkspace(id: string | number): void {
    this.router.navigate(['/workspaces', id, 'boards']);
  }

  // ─── Create Workspace ─────────────────────────────────────────────────────

  openCreateModal(): void {
    this.resetModal();
    this.modalStep.set('create');
    this.showModal.set(true);
  }

  createWorkspace(): void {
    if (!this.newWorkspaceName.trim()) return;
    this.creating.set(true);
    this.error.set('');

    const request: CreateWorkspaceRequest = {
      workSpaceName: this.newWorkspaceName.trim(),
      workSpaceDescription: this.newWorkspaceDescription.trim() || undefined
    };

    this.workspaceService.createWorkspace(request).subscribe({
      next: (workspace) => {
        this.workspaces.update(ws => [workspace, ...ws]);
        this.creating.set(false);
        // ✅ Move to invite step instead of navigating away
        this.justCreatedWorkspace.set(workspace);
        this.modalStep.set('invite');
      },
      error: () => {
        this.creating.set(false);
        this.error.set('Failed to create workspace. Please try again.');
      }
    });
  }

  // ─── Invite Members ───────────────────────────────────────────────────────

  sendInvite(): void {
    const email = this.inviteEmail.trim().toLowerCase();
    if (!email || !this.isValidEmail(email)) {
      this.inviteError.set('Please enter a valid email address.');
      return;
    }
    if (this.invitedEmails().includes(email)) {
      this.inviteError.set('This email has already been invited.');
      return;
    }

    const workspace = this.justCreatedWorkspace();
    if (!workspace) return;

    this.sending.set(true);
    this.inviteError.set('');
    this.inviteSuccess.set('');

    this.workspaceService.inviteMember({
      workspaceId: workspace.id,
      email,
      role: this.inviteRole
    }).subscribe({
      next: () => {
        this.invitedEmails.update(list => [...list, email]);
        this.inviteSuccess.set(`Invite sent to ${email}`);
        this.inviteEmail = '';
        this.sending.set(false);
        // Clear success message after 3s
        setTimeout(() => this.inviteSuccess.set(''), 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.sending.set(false);
        const msg = err?.error?.message || 'Failed to send invite. Please try again.';
        this.inviteError.set(msg);
      }
    });
  }

  /** Skip inviting and go straight to boards */
  skipToBoards(): void {
    const workspace = this.justCreatedWorkspace();
    if (workspace) {
      this.closeModal();
      this.openWorkspace(workspace.id);
    }
  }

  /** Done inviting — go to boards */
  finishAndGoToBoards(): void {
    const workspace = this.justCreatedWorkspace();
    if (workspace) {
      this.closeModal();
      this.openWorkspace(workspace.id);
    }
  }

  // ─── Modal Helpers ────────────────────────────────────────────────────────

  closeModal(): void {
    this.showModal.set(false);
    this.resetModal();
  }

  private resetModal(): void {
    this.newWorkspaceName = '';
    this.newWorkspaceDescription = '';
    this.inviteEmail = '';
    this.inviteRole = 'member';
    this.invitedEmails.set([]);
    this.pendingInvitations.set([]);
    this.error.set('');
    this.inviteError.set('');
    this.inviteSuccess.set('');
    this.justCreatedWorkspace.set(null);
    this.modalStep.set('create');
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  removeInvitedEmail(email: string): void {
    this.invitedEmails.update(list => list.filter(e => e !== email));
  }
}