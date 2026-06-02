import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-admin-talks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin-talks.component.html',
  styleUrl: './support-admin-talks.component.scss'
})
export class SupportAdminTalksComponent {
  private supportService = inject(SupportService);

  talks = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  selectedTalkId = signal<string | null>(null);
  selectedTalk = signal<any | null>(null);
  updating = signal(false);

  statusDraft = signal('IN_REVIEW');
  
  // Template-friendly editable 
  statusDraftValue = 'IN_REVIEW';

filteredTalks = computed(() => {
    const v = this.talks();
    return Array.isArray(v) ? v : [];
  });

  loadTalks(): void {
    this.loading.set(true);
    this.error.set('');
    this.supportService.getAllTalks().subscribe({
      next: (t) => {
        this.talks.set(Array.isArray(t) ? t : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load talks');
        this.loading.set(false);
      }
    });
  }

  viewTalk(id: string): void {
    this.selectedTalkId.set(id);
    this.selectedTalk.set(null);
    this.error.set('');

    this.supportService.getTalkById(id).subscribe({
      next: (talk) => {
        this.selectedTalk.set(talk);
        const s = talk?.status;
        if (typeof s === 'string' && s) {
          this.statusDraft.set(s);
          this.statusDraftValue = s;
        }
      },
      error: () => {
        this.error.set('Failed to load talk');
      }
    });
  }

  updateStatus(): void {
    // Ensure latest input is reflected
    this.statusDraft.set(this.statusDraftValue);
    const id = this.selectedTalkId();
    if (!id) return;

    // Keep signal and template value in sync
    this.statusDraft.set(this.statusDraftValue);
    const status = this.statusDraftValue.trim();
    if (!status) return;

    this.updating.set(true);
    this.error.set('');

    // SSOT: PATCH then GET /talks/:id and set selectedTalk
    this.supportService.updateTalkStatus(id, status).subscribe({
      next: () => {
        this.supportService.getTalkById(id).subscribe({
          next: (talk) => {
            this.selectedTalk.set(talk);
            this.updating.set(false);
          },
          error: () => {
            this.error.set('Status updated, but failed to refresh talk');
            this.updating.set(false);
          }
        });
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to update status');
        this.updating.set(false);
      }
    });
  }
}


