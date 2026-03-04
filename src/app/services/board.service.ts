// ============================================
// Board Service - CRUD Operations for Boards
// ============================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board, CreateBoardRequest, UpdateBoardRequest, MOCK_BOARD, MOCK_LISTS } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  // Use mock data for now (backend not ready)
  private useMockData = true;

  // Current board signal
  currentBoard = signal<Board | null>(null);

  constructor(private http: HttpClient) {}

  // ============================================
  // Board CRUD Operations
  // ============================================

  /**
   * Get all boards for the current user
   */
  getBoards(): Observable<Board[]> {
    if (this.useMockData) {
      // Return mock boards
      return of([
        { ...MOCK_BOARD, id: 'board-1', name: 'Project Alpha' },
        { ...MOCK_BOARD, id: 'board-2', name: 'Sprint Planning' },
        { ...MOCK_BOARD, id: 'board-3', name: 'Marketing Campaign' }
      ]).pipe(delay(500));
    }

    return this.http.get<Board[]>(
      `${environment.apiUrl}${environment.api.basePath}/boards`
    );
  }

  /**
   * Get a single board with all lists and cards
   */
  getBoard(boardId: string): Observable<Board> {
    if (this.useMockData) {
      return of(MOCK_BOARD).pipe(delay(300));
    }

    return this.http.get<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`
    );
  }

  /**
   * Create a new board
   */
  createBoard(request: CreateBoardRequest): Observable<Board> {
    if (this.useMockData) {
      const newBoard: Board = {
        id: `board-${Date.now()}`,
        name: request.name,
        workspaceId: request.workspaceId || 'ws-1',
        createdAt: new Date(),
        ownerId: 'user-1',
        members: [
          { userId: 'user-1', email: 'user@example.com', name: 'Current User', role: 'owner', joinedAt: new Date() }
        ],
        isStarred: false
      };
      return of(newBoard).pipe(delay(300));
    }

    return this.http.post<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards`,
      request
    );
  }

  /**
   * Update board details
   */
  updateBoard(boardId: string, updates: UpdateBoardRequest): Observable<Board> {
    if (this.useMockData) {
      const board = this.currentBoard();
      if (board) {
        const updated = { ...board, ...updates };
        return of(updated).pipe(delay(200));
      }
    }

    return this.http.put<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`,
      updates
    );
  }

  /**
   * Delete a board
   */
  deleteBoard(boardId: string): Observable<void> {
    if (this.useMockData) {
      return of(undefined).pipe(delay(200));
    }

    return this.http.delete<void>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`
    );
  }

  /**
   * Toggle star/favorite on a board
   */
  toggleStar(boardId: string): Observable<Board> {
    const board = this.currentBoard();
    const newStarred = board ? !board.isStarred : false;
    return this.updateBoard(boardId, { isStarred: newStarred });
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Set the current board
   */
  setCurrentBoard(board: Board | null): void {
    this.currentBoard.set(board);
  }

  /**
   * Get current board
   */
  getCurrentBoard(): Board | null {
    return this.currentBoard();
  }
}

