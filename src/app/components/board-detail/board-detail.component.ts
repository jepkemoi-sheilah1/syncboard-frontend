import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board.service';
import { ListService } from '../../services/list.service';
import { CardService } from '../../services/card.service';
import { Board, BoardList, Card } from '../../models/board.models';
import { CardModalComponent } from '../card-modal/card-modal.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule, CardModalComponent],
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  private listService = inject(ListService);
  private cardService = inject(CardService);

  board = signal<Board | null>(null);
  lists = signal<BoardList[]>([]);

  showNewListInput = signal(false);
  newListName = '';

  activeCardListId = signal<string | null>(null);
  newCardTitle = '';
  selectedCard = signal<Card | null>(null);

  editingBoardName = signal(false);
  boardNameEdit = '';

  editingListId = signal<string | null>(null);
  listNameEdit = '';

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) { this.loadBoard(boardId); }
    this.listService.lists$.subscribe(lists => this.lists.set(lists));
  }

  loadBoard(boardId: string): void {
    this.boardService.getBoard(boardId).subscribe({
      next: (board) => this.board.set(board),
      error: () => {}
    });
    this.listService.getLists(boardId).subscribe(lists => this.lists.set(lists));
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
  }

  // ─── Board Edit/Delete ────────────────────────────────────────────────────

  startEditingBoardName(): void {
    this.boardNameEdit = this.board()?.boardName || '';
    this.editingBoardName.set(true);
  }

  saveBoardName(): void {
    const boardId = this.board()?.id;
    if (!boardId || !this.boardNameEdit.trim()) return;
    this.boardService.updateBoard(boardId, { boardName: this.boardNameEdit.trim() }).subscribe({
      next: (updated) => {
        this.board.set(updated);
        this.editingBoardName.set(false);
      },
      error: () => {}
    });
  }

  cancelEditBoardName(): void {
    this.editingBoardName.set(false);
    this.boardNameEdit = '';
  }

  deleteBoard(): void {
    const boardId = this.board()?.id;
    if (!boardId) return;
    if (!confirm('Are you sure you want to delete this board?')) return;
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => this.router.navigate(['/boards']),
      error: () => {}
    });
  }

  // ─── List Edit/Delete ─────────────────────────────────────────────────────

  startEditingList(list: BoardList): void {
    this.listNameEdit = list.name;
    this.editingListId.set(list.id);
  }

  saveListName(listId: string): void {
    if (!this.listNameEdit.trim()) return;
    this.listService.updateList(listId, { name: this.listNameEdit.trim() }).subscribe({
      next: (updated) => {
        this.lists.update(lists => lists.map(l => l.id === listId ? { ...l, name: updated.name } : l));
        this.editingListId.set(null);
      },
      error: () => {}
    });
  }

  cancelEditList(): void {
    this.editingListId.set(null);
    this.listNameEdit = '';
  }

  deleteList(listId: string): void {
    if (!confirm('Are you sure you want to delete this list?')) return;
    this.listService.deleteList(listId).subscribe({
      next: () => this.lists.update(lists => lists.filter(l => l.id !== listId)),
      error: () => {}
    });
  }

  // ─── Card Modal ───────────────────────────────────────────────────────────

  openCardModal(card: Card): void { this.selectedCard.set({ ...card }); }
  closeCardModal(): void { this.selectedCard.set(null); }

  onSaveCard(updatedCard: Card): void {
    this.cardService.updateCard(updatedCard.id, {
      title: updatedCard.title,
      description: updatedCard.description,
      labels: updatedCard.labels
    }).subscribe(() => this.closeCardModal());
  }

  onDeleteCard(cardId: string): void {
    this.cardService.deleteCard(cardId).subscribe(() => this.closeCardModal());
  }

  // ─── Drag and Drop ────────────────────────────────────────────────────────

  drop(event: CdkDragDrop<Card[]>, targetListId: string): void {
    const cards = event.container.data || [];
    const previousCards = event.previousContainer.data || [];

    if (event.previousContainer === event.container) {
      const reorderedCards = [...cards];
      moveItemInArray(reorderedCards, event.previousIndex, event.currentIndex);
      this.lists.update(lists => lists.map(list =>
        list.id === targetListId ? { ...list, cards: reorderedCards } : list
      ));
    } else {
      const previousListId = previousCards[event.previousIndex]?.listId || '';
      if (previousListId) {
        const sourceCards = [...previousCards];
        const destCards = [...cards];
        transferArrayItem(sourceCards, destCards, event.previousIndex, event.currentIndex);
        if (destCards[event.currentIndex]) { destCards[event.currentIndex].listId = targetListId; }
        this.lists.update(lists => lists.map(list => {
          if (list.id === previousListId) return { ...list, cards: sourceCards };
          if (list.id === targetListId) return { ...list, cards: destCards };
          return list;
        }));
        this.cardService.moveCard({
          cardId: destCards[event.currentIndex]?.id,
          targetListId,
          newIndex: event.currentIndex
        }).subscribe();
      }
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  goBack(): void { this.router.navigate(['/boards']); }

  // ─── List Creation ────────────────────────────────────────────────────────

  toggleNewListInput(): void {
    this.showNewListInput.set(!this.showNewListInput());
    this.newListName = '';
  }

  createList(): void {
    if (this.newListName.trim()) {
      const boardId = this.board()?.id || '';
      this.listService.createList({ name: this.newListName.trim(), boardId }).subscribe((newList) => {
        this.newListName = '';
        this.showNewListInput.set(false);
        if (newList && newList.id) {
          this.activeCardListId.set(newList.id);
          this.newCardTitle = '';
        }
      });
    }
  }

  // ─── Card Creation ────────────────────────────────────────────────────────

  toggleCardInput(listId: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (this.activeCardListId() === listId) {
      this.activeCardListId.set(null);
      this.newCardTitle = '';
    } else {
      this.activeCardListId.set(listId);
      this.newCardTitle = '';
    }
  }

  createCardInline(listId: string): void {
    if (this.newCardTitle.trim()) {
      this.cardService.createCard({ title: this.newCardTitle.trim(), listId }).subscribe(() => {
        this.newCardTitle = '';
        this.activeCardListId.set(listId);
      });
    }
  }

  closeCardInput(): void {
    this.activeCardListId.set(null);
    this.newCardTitle = '';
  }
}