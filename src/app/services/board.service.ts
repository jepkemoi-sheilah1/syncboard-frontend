// ============================================
// Board Service - CRUD Operations for Boards
// ============================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  // Boards signal for real-time updates
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  boards$ = this.boardsSubject.asObservable();

  // Current board signal
  currentBoard = signal<Board | null>(null);

  constructor(private http: HttpClient) {
    // Initialize with empty boards - user creates their own
    this.boardsSubject.next([]);
  }

  // ============================================
  // Board CRUD Operations
  // ============================================

  /**
   * Get all boards for the current user
   */
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(
      `${environment.apiUrl}${environment.api.basePath}/boards`
    );
  }

  /**
   * Get a single board with all lists and cards
   */
  getBoard(boardId: string): Observable<Board> {
    return this.http.get<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`
    );
  }

  /**
   * Create a new board
   */
  createBoard(request: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards`,
      request
    );
  }

  /**
   * Update board details
   */
  updateBoard(boardId: string, updates: UpdateBoardRequest): Observable<Board> {
    return this.http.put<Board>(
      `${environment.apiUrl}${environment.api.basePath}/boards/${boardId}`,
      updates
    );
  }

  /**
   * Delete a board
   */
  deleteBoard(boardId: string): Observable<void> {
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

  /**
   * Get current boards value
   */
  getCurrentBoards(): Board[] {
    return this.boardsSubject.value;
  }

  /**
   * Update boards from external source (e.g., WebSocket)
   */
  updateBoards(boards: Board[]): void {
    this.boardsSubject.next(boards);
  }
}

