// ============================================
// Card Modal Component - Card Detail/Edit View
// ============================================

import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, Label } from '../../models/board.models';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.css']
})
export class CardModalComponent implements OnInit {
  constructor(private cardService: CardService) { }
  // Input: Card to display/edit
  @Input() card: Card | null = null;
  
  // Output: Events to parent
  @Output() save = new EventEmitter<Card>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  // Editable fields
  editTitle = '';
  editDescription = '';
  
  // UI State
  isEditing = signal(false);
  showLabelPicker = signal(false);
  isTogglingLabel = signal(false);

  // Available labels for picker

  availableLabels: Label[] = [
    { id: 'l1', name: 'Urgent', color: '#ef4444' },
    { id: 'l2', name: 'Important', color: '#f59e0b' },
    { id: 'l3', name: 'Design', color: '#8b5cf6' },
    { id: 'l4', name: 'Bug', color: '#dc2626' },
    { id: 'l5', name: 'Feature', color: '#3b82f6' },
    { id: 'l6', name: 'Done', color: '#22c55e' },
    { id: 'l7', name: 'Review', color: '#06b6d4' }
  ];

  ngOnInit(): void {
    if (this.card) {
      this.editTitle = this.card.title;
      this.editDescription = this.card.description || '';
    }
  }

  /**
   * Close the modal
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Handle overlay click
   */
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  /**
   * Save card changes
   */
  onSave(): void {
    if (this.card && this.editTitle.trim()) {
      const updatedCard: Card = {
        ...this.card,
        title: this.editTitle.trim(),
        description: this.editDescription.trim(),
        updatedAt: new Date()
      };
      this.save.emit(updatedCard);
    }
  }

  /**
   * Delete the card
   */
  onDelete(): void {
    if (this.card) {
      this.delete.emit(this.card.id);
    }
  }

  /**
   * Toggle label picker
   */
  toggleLabelPicker(): void {
    this.showLabelPicker.set(!this.showLabelPicker());
  }

  /**
   * Toggle a label on/off
   */
  toggleLabel(label: Label): void {
    if (!this.card) return;
    if (this.isTogglingLabel()) return;

    this.isTogglingLabel.set(true);

    const exists = this.card.labels.some(l => l.id === label.id);

    // If label exists, remove it; otherwise create it.
    const request$ = exists
      ? this.cardService.removeLabel(this.card.id, label.id)
      : this.cardService.addLabel(this.card.id, label);

    request$.subscribe({
      next: (updatedCard) => {
        // Prefer backend-updated labels if the backend actually returned them.
        if (Array.isArray(updatedCard?.labels)) {
          this.card!.labels = updatedCard.labels;
          this.isTogglingLabel.set(false);
          return;
        }


        // Strict SSOT fallback: re-fetch the card.
        this.cardService.getCard(this.card!.id).subscribe({
          next: (freshCard) => {
            this.card!.labels = freshCard.labels ?? [];
          },
          error: () => {
            // Keep UI unchanged on error.
          },
          complete: () => {
            this.isTogglingLabel.set(false);
          }
        });
      },
      error: () => {
        // Keep UI unchanged on error.
        this.isTogglingLabel.set(false);
      },
      complete: () => {
        if (!this.isTogglingLabel()) return;
      }
    });
  }


  /**
   * Check if label is applied
   */
  hasLabel(labelId: string): boolean {
    return this.card?.labels.some(l => l.id === labelId) || false;
  }

  /**
   * Remove a label from card
   */
  removeLabel(labelId: string): void {
    if (!this.card) return;
    if (this.isTogglingLabel()) return;

    this.isTogglingLabel.set(true);

    const request$ = this.cardService.removeLabel(this.card.id, labelId);

    request$.subscribe({
      next: (updatedCard) => {
        if (Array.isArray(updatedCard?.labels)) {
          this.card!.labels = updatedCard.labels;
          this.isTogglingLabel.set(false);
          return;
        }

        this.cardService.getCard(this.card!.id).subscribe({
          next: (freshCard) => {
            this.card!.labels = freshCard.labels ?? [];
          },
          error: () => {
            // Keep UI unchanged on error.
          },
          complete: () => {
            this.isTogglingLabel.set(false);
          }
        });
      },
      error: () => {
        this.isTogglingLabel.set(false);
      }
    });
  }



  /**
   * Start editing
   */
  startEditing(): void {
    this.isEditing.set(true);
  }

  /**
   * Cancel editing
   */
  cancelEditing(): void {
    if (this.card) {
      this.editTitle = this.card.title;
      this.editDescription = this.card.description || '';
    }
    this.isEditing.set(false);
  }
}
