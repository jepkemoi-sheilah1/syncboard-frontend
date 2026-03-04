import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board.service';
import { ListService } from '../../services/list.service';
import { CardService } from '../../services/card.service';
import { Board, BoardList, Card, MOCK_BOARD } from '../../models/board.models';
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
  showAddCardModal = signal(false);
  newCardTitle = '';
  selectedListId = '';
  selectedCard = signal<Card | null>(null);

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) { this.loadBoard(boardId); }
    this.listService.lists$.subscribe(lists => this.lists.set(lists));
  }

  loadBoard(boardId: string): void {
    this.board.set({ ...MOCK_BOARD, id: boardId });
    this.listService.getLists(boardId).subscribe(lists => this.lists.set(lists));
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
  }

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

  drop(event: any, targetListId: string): void {
    const cards = event.container.data || [];
    const previousCards = event.previousContainer.data || [];
    
    if (event.previousContainer === event.container) {
      const reorderedCards = [...cards];
      moveItemInArray(reorderedCards, event.previousIndex, event.currentIndex);
      this.lists.update(lists => lists.map(list => list.id === targetListId ? { ...list, cards: reorderedCards } : list));
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
        this.cardService.moveCard({ cardId: destCards[event.currentIndex]?.id, targetListId, newIndex: event.currentIndex }).subscribe();
      }
    }
  }

  goBack(): void { this.router.navigate(['/boards']); }
  toggleNewListInput(): void { this.showNewListInput.set(!this.showNewListInput()); this.newListName = ''; }

  createList(): void {
    if (this.newListName.trim()) {
      this.listService.createList({ name: this.newListName.trim(), boardId: this.board()?.id || '' }).subscribe(() => {
        this.newListName = ''; this.showNewListInput.set(false);
      });
    }
  }

  openAddCard(listId: string, event: Event): void { event.stopPropagation(); this.selectedListId = listId; this.newCardTitle = ''; this.showAddCardModal.set(true); }
  closeAddCardModal(): void { this.showAddCardModal.set(false); this.selectedListId = ''; this.newCardTitle = ''; }

  createCard(): void {
    if (this.newCardTitle.trim() && this.selectedListId) {
      this.cardService.createCard({ title: this.newCardTitle.trim(), listId: this.selectedListId }).subscribe(() => this.closeAddCardModal());
    }
  }
}

