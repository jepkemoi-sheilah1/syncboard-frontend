import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../services/workspace.service';
import { AuthService } from '../../services/auth.service';
import { UserMenuComponent } from '../auth/user-menu/user-menu.component';
import { Workspace, CreateWorkspaceRequest } from '../../models/board.models';

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
  showCreateModal = signal(false);
  newWorkspaceName = '';
  newWorkspaceDescription = '';
  error = signal('');

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

  openWorkspace(id: string): void {
    this.router.navigate(['/workspaces', id, 'boards']);
  }

  createWorkspace(): void {
    if (!this.newWorkspaceName.trim()) return;
    this.creating.set(true);

    const request: CreateWorkspaceRequest = {
      workSpaceName: this.newWorkspaceName.trim(),
      workSpaceDescription: this.newWorkspaceDescription.trim()
    };

    this.workspaceService.createWorkspace(request).subscribe({
      next: (workspace) => {
        this.workspaces.update(ws => [workspace, ...ws]);
        this.showCreateModal.set(false);
        this.newWorkspaceName = '';
        this.newWorkspaceDescription = '';
        this.creating.set(false);
        this.openWorkspace(workspace.id);
      },
      error: () => {
        this.creating.set(false);
        this.error.set('Failed to create workspace');
      }
    });
  }

  closeModal(): void {
    this.showCreateModal.set(false);
    this.newWorkspaceName = '';
    this.newWorkspaceDescription = '';
    this.error.set('');
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
} 