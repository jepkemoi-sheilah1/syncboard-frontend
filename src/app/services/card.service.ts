// ============================================
// Card Service - CRUD Operations for Cards
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, CreateCardRequest, UpdateCardRequest, MoveCardRequest, Label } from '../models/board.models';
import { ListService } from './list.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  // Use real API - backend is ready
  private useMockData = false;

  constructor(
    private http: HttpClient,
    private listService: ListService
  ) {}

  // ============================================
  // Card CRUD Operations
  // ============================================

  /**
   * Get cards for a specific list
   */
  getCards(listId: string): Observable<Card[]> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      const list = lists.find(l => l.id === listId);
      return of(list?.cards || []).pipe(delay(200));
    }

    return this.http.get<Card[]>(
      `${environment.apiUrl}${environment.api.basePath}/lists/${listId}/cards`
    );
  }

  /**
   * Get a single card by ID
   */
  getCard(cardId: string): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      for (const list of lists) {
        const card = list.cards.find(c => c.id === cardId);
        if (card) {
          return of(card).pipe(delay(200));
        }
      }
    }

    return this.http.get<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${cardId}`
    );
  }

  /**
   * Create a new card
   */
  createCard(request: CreateCardRequest): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      const listIndex = lists.findIndex(l => l.id === request.listId);
      
      if (listIndex !== -1) {
        const list = lists[listIndex];
        const newCard: Card = {
          id: `card-${Date.now()}`,
          title: request.title,
          description: request.description || '',
          listId: request.listId,
          order: request.order ?? list.cards.length,
          labels: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add card to list
        const updatedList = {
          ...list,
          cards: [...list.cards, newCard]
        };
        
        const updatedLists = [...lists];
        updatedLists[listIndex] = updatedList;
        this.listService.updateLists(updatedLists);
        
        return of(newCard).pipe(delay(200));
      }
    }

    return this.http.post<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards`,
      request
    );
  }

  /**
   * Update a card
   */
  updateCard(cardId: string, updates: UpdateCardRequest): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      
      for (let i = 0; i < lists.length; i++) {
        const cardIndex = lists[i].cards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1) {
          const updatedCard = {
            ...lists[i].cards[cardIndex],
            ...updates,
            updatedAt: new Date()
          };
          
          const updatedCards = [...lists[i].cards];
          updatedCards[cardIndex] = updatedCard;
          
          const updatedList = { ...lists[i], cards: updatedCards };
          const updatedLists = [...lists];
          updatedLists[i] = updatedList;
          this.listService.updateLists(updatedLists);
          
          return of(updatedCard).pipe(delay(200));
        }
      }
    }

    return this.http.put<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${cardId}`,
      updates
    );
  }

  /**
   * Move card to a different list
   */
  moveCard(request: MoveCardRequest): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      let movedCard: Card | null = null;
      
      // Find and remove card from current list
      for (let i = 0; i < lists.length; i++) {
        const cardIndex = lists[i].cards.findIndex(c => c.id === request.cardId);
        
        if (cardIndex !== -1) {
          movedCard = { ...lists[i].cards[cardIndex], listId: request.targetListId };
          const updatedCards = [...lists[i].cards];
          updatedCards.splice(cardIndex, 1);
          
          const updatedList = { ...lists[i], cards: updatedCards };
          const updatedLists = [...lists];
          updatedLists[i] = updatedList;
          
          // Add to target list
          const targetListIndex = updatedLists.findIndex(l => l.id === request.targetListId);
          if (targetListIndex !== -1 && movedCard) {
            const targetList = updatedLists[targetListIndex];
            const newCards = [...targetList.cards];
            newCards.splice(request.newIndex, 0, movedCard);
            
            updatedLists[targetListIndex] = { ...targetList, cards: newCards };
          }
          
          this.listService.updateLists(updatedLists);
          break;
        }
      }
      
      if (movedCard) {
        return of(movedCard).pipe(delay(200));
      }
    }

    return this.http.put<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${request.cardId}/move`,
      request
    );
  }

  /**
   * Delete a card
   */
  deleteCard(cardId: string): Observable<void> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      
      for (let i = 0; i < lists.length; i++) {
        const cardIndex = lists[i].cards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1) {
          const updatedCards = [...lists[i].cards];
          updatedCards.splice(cardIndex, 1);
          
          const updatedList = { ...lists[i], cards: updatedCards };
          const updatedLists = [...lists];
          updatedLists[i] = updatedList;
          this.listService.updateLists(updatedLists);
          
          return of(undefined).pipe(delay(200));
        }
      }
    }

    return this.http.delete<void>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${cardId}`
    );
  }

  // ============================================
  // Label Operations
  // ============================================

  /**
   * Add a label to a card
   */
  addLabel(cardId: string, label: Label): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      
      for (let i = 0; i < lists.length; i++) {
        const cardIndex = lists[i].cards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1) {
          const card = lists[i].cards[cardIndex];
          const updatedCard = {
            ...card,
            labels: [...card.labels, label],
            updatedAt: new Date()
          };
          
          const updatedCards = [...lists[i].cards];
          updatedCards[cardIndex] = updatedCard;
          
          const updatedList = { ...lists[i], cards: updatedCards };
          const updatedLists = [...lists];
          updatedLists[i] = updatedList;
          this.listService.updateLists(updatedLists);
          
          return of(updatedCard).pipe(delay(200));
        }
      }
    }

    return this.http.post<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${cardId}/labels`,
      label
    );
  }

  /**
   * Remove a label from a card
   */
  removeLabel(cardId: string, labelId: string): Observable<Card> {
    if (this.useMockData) {
      const lists = this.listService.getCurrentLists();
      
      for (let i = 0; i < lists.length; i++) {
        const cardIndex = lists[i].cards.findIndex(c => c.id === cardId);
        
        if (cardIndex !== -1) {
          const card = lists[i].cards[cardIndex];
          const updatedCard = {
            ...card,
            labels: card.labels.filter(l => l.id !== labelId),
            updatedAt: new Date()
          };
          
          const updatedCards = [...lists[i].cards];
          updatedCards[cardIndex] = updatedCard;
          
          const updatedList = { ...lists[i], cards: updatedCards };
          const updatedLists = [...lists];
          updatedLists[i] = updatedList;
          this.listService.updateLists(updatedLists);
          
          return of(updatedCard).pipe(delay(200));
        }
      }
    }

    return this.http.delete<Card>(
      `${environment.apiUrl}${environment.api.basePath}/cards/${cardId}/labels/${labelId}`
    );
  }
}
