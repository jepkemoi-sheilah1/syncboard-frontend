import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-admin-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin-faqs.component.html',
  styleUrl: './support-admin-faqs.component.scss'
})
export class SupportAdminFaqsComponent {
  private supportService = inject(SupportService);

  faqs = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  selectedFaqId = signal<string | null>(null);
  selectedFaq = signal<any | null>(null);

  updating = signal(false);

  // form drafts
  newQuestion = signal('');
  newAnswer = signal('');
  newActive = signal(true);

  editQuestion = signal('');
  editAnswer = signal('');
  editActive = signal(true);

  mode: 'list' | 'create' | 'edit' = 'list';

  filteredFaqs = computed(() => this.faqs());

  loadFaqs(): void {
    this.loading.set(true);
    this.error.set('');
    this.supportService.getAllFaqs().subscribe({
      next: (res) => {
        this.faqs.set(Array.isArray(res) ? res : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load FAQs');
        this.loading.set(false);
      }
    });
  }

  viewFaq(id: string): void {
    this.selectedFaqId.set(id);
    this.selectedFaq.set(null);
    this.error.set('');

    this.supportService.getFaqById(id).subscribe({
      next: (faq) => {
        this.selectedFaq.set(faq);
        this.editQuestion.set(faq?.question ?? '');
        this.editAnswer.set(faq?.answer ?? '');
        this.editActive.set(!!faq?.active);
        this.mode = 'edit';
      },
      error: () => {
        this.error.set('Failed to load FAQ');
      }
    });
  }

  createFaq(): void {
    const question = this.newQuestion().trim();
    const answer = this.newAnswer().trim();
    if (!question || !answer) {
      this.error.set('Question and answer are required');
      return;
    }

    this.updating.set(true);
    this.error.set('');

    this.supportService
      .createFaq({ question, answer, active: this.newActive() })
      .subscribe({
        next: () => {
          this.mode = 'list';
          this.newQuestion.set('');
          this.newAnswer.set('');
          this.newActive.set(true);
          this.loadFaqs();
          this.updating.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to create FAQ');
          this.updating.set(false);
        }
      });
  }

  updateFaq(): void {
    const id = this.selectedFaqId();
    if (!id) return;

    const question = this.editQuestion().trim();
    const answer = this.editAnswer().trim();
    if (!question || !answer) {
      this.error.set('Question and answer are required');
      return;
    }

    this.updating.set(true);
    this.error.set('');

    this.supportService
      .updateFaq(id, { question, answer, active: this.editActive() })
      .subscribe({
        next: () => {
          this.updating.set(false);
          this.mode = 'list';
          this.loadFaqs();
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to update FAQ');
          this.updating.set(false);
        }
      });
  }

  toggleActive(): void {
    const id = this.selectedFaqId();
    if (!id) return;

    this.updating.set(true);
    this.error.set('');

    this.supportService.toggleFaqActive(id).subscribe({
      next: () => {
        this.updating.set(false);
        this.loadFaqs();
        if (this.selectedFaqId()) this.viewFaq(this.selectedFaqId()!);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to toggle FAQ');
        this.updating.set(false);
      }
    });
  }

  deleteFaq(): void {
    const id = this.selectedFaqId();
    if (!id) return;
    if (!confirm('Delete this FAQ?')) return;

    this.updating.set(true);
    this.error.set('');

    this.supportService.deleteFaq(id).subscribe({
      next: () => {
        this.updating.set(false);
        this.selectedFaqId.set(null);
        this.selectedFaq.set(null);
        this.mode = 'list';
        this.loadFaqs();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to delete FAQ');
        this.updating.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadFaqs();
  }
}

