import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-admin-issues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin-issues.component.html',
  styleUrl: './support-admin-issues.component.scss'
})
export class SupportAdminIssuesComponent {
  private supportService = inject(SupportService);

  issues = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  selectedIssueId = signal<string | null>(null);
  selectedIssue = signal<any | null>(null);

  updating = signal(false);

  // form drafts
  newName = signal('');
  newDescription = signal('');
  newActive = signal(true);

  editName = signal('');
  editDescription = signal('');
  editActive = signal(true);

  mode: 'list' | 'create' | 'edit' = 'list';

  filteredIssues = computed(() => this.issues());

  loadIssues(): void {
    this.loading.set(true);
    this.error.set('');
    this.supportService.getAllIssues().subscribe({
      next: (res) => {
        this.issues.set(Array.isArray(res) ? res : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load issues');
        this.loading.set(false);
      }
    });
  }

  viewIssue(id: string): void {
    this.selectedIssueId.set(id);
    this.selectedIssue.set(null);
    this.error.set('');

    this.supportService.getIssueById(id).subscribe({
      next: (issue) => {
        this.selectedIssue.set(issue);
        this.editName.set(issue?.name ?? '');
        this.editDescription.set(issue?.description ?? '');
        this.editActive.set(!!issue?.active);
        this.mode = 'edit';
      },
      error: () => {
        this.error.set('Failed to load issue');
      }
    });
  }

  createIssue(): void {
    const name = this.newName().trim();
    const description = this.newDescription().trim();
    if (!name || !description) {
      this.error.set('Name and description are required');
      return;
    }

    this.updating.set(true);
    this.error.set('');

    this.supportService
      .createIssue({ name, description, active: this.newActive() })
      .subscribe({
        next: () => {
          this.updating.set(false);
          this.newName.set('');
          this.newDescription.set('');
          this.newActive.set(true);
          this.loadIssues();
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to create issue');
          this.updating.set(false);
        }
      });
  }

  updateIssue(): void {
    const id = this.selectedIssueId();
    if (!id) return;

    const name = this.editName().trim();
    const description = this.editDescription().trim();
    if (!name || !description) {
      this.error.set('Name and description are required');
      return;
    }

    this.updating.set(true);
    this.error.set('');

    this.supportService
      .updateIssue(id, { name, description, active: this.editActive() })
      .subscribe({
        next: () => {
          this.updating.set(false);
          this.mode = 'list';
          this.loadIssues();
          this.viewIssue(id);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to update issue');
          this.updating.set(false);
        }
      });
  }

  toggleActive(): void {
    const id = this.selectedIssueId();
    if (!id) return;

    this.updating.set(true);
    this.error.set('');

    this.supportService.toggleIssueActive(id).subscribe({
      next: () => {
        this.updating.set(false);
        this.loadIssues();
        this.viewIssue(id);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to toggle issue');
        this.updating.set(false);
      }
    });
  }

  deleteIssue(): void {
    const id = this.selectedIssueId();
    if (!id) return;
    if (!confirm('Delete this issue?')) return;

    this.updating.set(true);
    this.error.set('');

    this.supportService.deleteIssue(id).subscribe({
      next: () => {
        this.updating.set(false);
        this.selectedIssueId.set(null);
        this.selectedIssue.set(null);
        this.mode = 'list';
        this.loadIssues();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to delete issue');
        this.updating.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadIssues();
  }
}

