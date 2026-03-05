// ============================================
// List Service - CRUD Operations for Lists
// ============================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { BoardList, CreateListRequest, UpdateListRequest, MOCK_LISTS } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // Use mock data for now (backend not ready)
  private useMockData = true;

  // Lists signal for real-time updates
  private listsSubject = new BehaviorSubject<BoardList[]>([]);
  lists$ = this.listsSubject.asObservable();

constructor(private http: HttpClient) {
    // Initialize with empty lists - user creates their own lists
    // Set useMockData to true only if you want pre-filled demo data
    if (this.useMockData) {
      // Start with empty lists - user will create their own
      this.listsSubject.next([]);
    }
  }

  // ============================================
  // List CRUD Operations
  // ============================================

  /**
   * Get all lists for a board
   */
getLists(boardId: string): Observable<BoardList[]> {
    if (this.useMockData) {
      // Return empty lists - user creates their own
      return of([]).pipe(delay(300));
    }

    return this.http.get<BoardList[]>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/lists`
    );
  }

  /**
   * Create a new list
   */
  createList(request: CreateListRequest): Observable<BoardList> {
    if (this.useMockData) {
      const currentLists = this.listsSubject.value;
      const newList: BoardList = {
        id: `list-${Date.now()}`,
        name: request.name,
        boardId: request.boardId,
        order: request.order ?? currentLists.length,
        cards: []
      };
      
      // Update the lists
      const updatedLists = [...currentLists, newList];
      this.listsSubject.next(updatedLists);
      
      return of(newList).pipe(delay(200));
    }

    return this.http.post<BoardList>(
      `${environment.apiUrl}${environment.api.basePath}/lists`,
      request
    );
  }

  /**
   * Update a list
   */
  updateList(listId: string, updates: UpdateListRequest): Observable<BoardList> {
    if (this.useMockData) {
      const currentLists = this.listsSubject.value;
      const listIndex = currentLists.findIndex(l => l.id === listId);
      
      if (listIndex !== -1) {
        const updatedList = { ...currentLists[listIndex], ...updates };
        const updatedLists = [...currentLists];
        updatedLists[listIndex] = updatedList;
        this.listsSubject.next(updatedLists);
        return of(updatedList).pipe(delay(200));
      }
    }

    return this.http.put<BoardList>(
      `${environment.apiUrl}${environment.api.basePath}/lists/${listId}`,
      updates
    );
  }

  /**
   * Delete a list
   */
  deleteList(listId: string): Observable<void> {
    if (this.useMockData) {
      const currentLists = this.listsSubject.value;
      const updatedLists = currentLists.filter(l => l.id !== listId);
      this.listsSubject.next(updatedLists);
      return of(undefined).pipe(delay(200));
    }

    return this.http.delete<void>(
      `${environment.apiUrl}${environment.api.basePath}/lists/${listId}`
    );
  }

  /**
   * Reorder lists
   */
  reorderLists(boardId: string, listIds: string[]): Observable<BoardList[]> {
    if (this.useMockData) {
      const currentLists = this.listsSubject.value;
      const reorderedLists = listIds.map((id, index) => {
        const list = currentLists.find(l => l.id === id);
        return list ? { ...list, order: index } : null;
      }).filter((l): l is BoardList => l !== null);
      
      this.listsSubject.next(reorderedLists);
      return of(reorderedLists).pipe(delay(200));
    }

    return this.http.put<BoardList[]>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}/lists/reorder`,
      { listIds }
    );
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get current lists value
   */
  getCurrentLists(): BoardList[] {
    return this.listsSubject.value;
  }

  /**
   * Update lists from external source (e.g., WebSocket)
   */
  updateLists(lists: BoardList[]): void {
    this.listsSubject.next(lists);
  }
}
