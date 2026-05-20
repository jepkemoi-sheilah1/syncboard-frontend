import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace.service';
import { WorkspaceMember, WorkspaceInvitation, WorkspaceInvitationResponse } from '../../models/board.models';

@Component({
  selector: 'app-workspace-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workspace-members.component.html',
  styleUrls: ['./workspace-members.component.css']
})
export class WorkspaceMembersComponent implements OnInit {
  @Input({ required: true }) workspaceId!: string | number;

  private workspaceService = inject(WorkspaceService);

  members = signal<WorkspaceMember[]>([]);
  pendingInvitations = signal<WorkspaceInvitation[]>([]);
  loading = signal(true);
  sending = signal(false);

  inviteEmail = '';
  inviteRole: 'admin' | 'member' = 'member';

  inviteError = signal('');
  inviteSuccess = signal('');

  ngOnInit(): void {
    this.loadMembers();
    this.loadPendingInvitations();
  }

  loadMembers(): void {
    this.loading.set(true);
    (this.workspaceService.getWorkspaceMembers(this.workspaceId) as import('rxjs').Observable<WorkspaceMember[]>)
      .subscribe({
        next: (members: WorkspaceMember[]) => {
          this.members.set(members);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadPendingInvitations(): void {
    (this.workspaceService.getPendingInvitations(this.workspaceId) as import('rxjs').Observable<WorkspaceInvitation[]>)
      .subscribe({
        next: (invites: WorkspaceInvitation[]) => this.pendingInvitations.set(invites),
        error: () => {}
      });
  }

  sendInvite(): void {
    const email = this.inviteEmail.trim().toLowerCase();
    if (!email || !this.isValidEmail(email)) {
      this.inviteError.set('Please enter a valid email address.');
      return;
    }

    this.sending.set(true);
    this.inviteError.set('');
    this.inviteSuccess.set('');

    this.workspaceService.inviteMember({
      workspaceId: this.workspaceId,
      email,
      role: this.inviteRole
    }).subscribe({
      next: (res: WorkspaceInvitationResponse) => {
        if (res.invitation) {
          this.pendingInvitations.update(list => [...list, res.invitation!]);
        }
        this.inviteSuccess.set(`Invite sent to ${email}`);
        this.inviteEmail = '';
        this.sending.set(false);
        setTimeout(() => this.inviteSuccess.set(''), 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.sending.set(false);
        this.inviteError.set(err?.error?.message || 'Failed to send invite.');
      }
    });
  }

  cancelInvitation(invitation: WorkspaceInvitation): void {
    this.workspaceService.cancelInvitation(this.workspaceId, invitation.id).subscribe({
      next: () => {
        this.pendingInvitations.update(list => list.filter(i => i.id !== invitation.id));
      },
      error: () => {}
    });
  }

  removeMember(member: WorkspaceMember): void {
    if (!confirm(`Remove ${member.name || member.email} from this workspace?`)) return;
    this.workspaceService.removeWorkspaceMember(this.workspaceId, member.userId).subscribe({
      next: () => {
        this.members.update(list => list.filter(m => m.userId !== member.userId));
      },
      error: () => {}
    });
  }

  getInitial(name: string): string {
    return (name || '?').charAt(0).toUpperCase();
  }

  avatarColor(seed: string): string {
    const colors = ['#5b5ef6', '#e11d48', '#0891b2', '#16a34a', '#d97706', '#7c3aed', '#db2777'];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}