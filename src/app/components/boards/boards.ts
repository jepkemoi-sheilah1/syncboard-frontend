import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoardService } from '../../services/board.service';
import { UserMenuComponent } from '../auth/user-menu/user-menu.component';
import { Board, CreateBoardRequest } from '../../models/board.models';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FormsModule, UserMenuComponent],
  template: `
    <div class="boards-container">
      <!-- Top Navigation Bar (Trello-style) -->
      <nav class="trello-nav">
        <div class="nav-left">
          <div class="logo" (click)="goHome()">
            <span class="logo-icon">📋</span>
            <span class="logo-text">SyncBoard</span>
          </div>
          <div class="nav-links">
            <a href="#" class="nav-link active">Workspaces</a>
            <a href="#" class="nav-link">Recent</a>
            <a href="#" class="nav-link">Starred</a>
          </div>
        </div>
        
        <div class="nav-center">
          <!-- Search Bar -->
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search boards..."
              [(ngModel)]="searchQuery"
              (input)="filterBoards()"
            >
          </div>
        </div>
        
        <div class="nav-right">
          <button class="btn-create-board" (click)="showCreateModal.set(true)">
            + Create Board
          </button>
          <app-user-menu></app-user-menu>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="boards-main">
        <!-- Workspace Header -->
        <div class="workspace-header">
          <div class="workspace-info">
            <div class="workspace-avatar">
              {{ userName().charAt(0).toUpperCase() }}
            </div>
            <div class="workspace-details">
              <h1>{{ userName() }}'s Workspace</h1>
              <p class="workspace-subtitle">Private workspace</p>
            </div>
          </div>
        </div>

        <!-- Boards Section -->
        <section class="boards-section">
          <div class="section-header">
            <h2>
              <span class="section-icon">📊</span>
              Your Boards
              <span class="board-count">({{ filteredBoards().length }})</span>
            </h2>
          </div>
          
          <!-- Board Grid -->
          <div class="board-grid" *ngIf="boards().length > 0">
            <!-- Create New Board Card -->
            <div class="board-card create-card" (click)="showCreateModal.set(true)">
              <div class="create-card-content">
                <span class="plus-icon">+</span>
                <span>Create new board</span>
              </div>
            </div>
            
            <!-- Existing Boards -->
            <div 
              class="board-card" 
              *ngFor="let board of filteredBoards()"
              (click)="openBoard(board.id)"
            >
              <div class="board-cover" [style.background]="getBoardColor(board.id)"></div>
              <div class="board-info">
                <h3>{{ board.name }}</h3>
                <div class="board-meta">
                  <span class="board-members">
                    <!-- Member Avatars -->
                    <div class="member-avatars">
                      <span 
                        class="member-avatar" 
                        *ngFor="let member of board.members.slice(0, 3)"
                        [title]="member.name"
                      >
                        {{ getInitials(member.name) }}
                      </span>
                      <span class="more-members" *ngIf="board.members.length > 3">
                        +{{ board.members.length - 3 }}
                      </span>
                    </div>
                  </span>
                </div>
              </div>
              <button class="btn-star" (click)="toggleStar(board, $event)" [class.starred]="board.isStarred">
                {{ board.isStarred ? '⭐' : '☆' }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="boards().length === 0 && !loading()">
            <div class="empty-icon">📋</div>
            <h3>No boards yet</h3>
            <p>Create your first board to get started!</p>
            <button class="btn-create-first" (click)="showCreateModal.set(true)">
              + Create Board
            </button>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading()">
            <div class="spinner"></div>
            <p>Loading boards...</p>
          </div>

          <!-- No Search Results -->
          <div class="no-results" *ngIf="boards().length > 0 && filteredBoards().length === 0">
            <p>No boards matching "{{ searchQuery }}"</p>
          </div>
        </section>
      </main>

      <!-- Create Board Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal()" (click)="showCreateModal.set(false)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create new board</h2>
            <button class="btn-close" (click)="showCreateModal.set(false)">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="boardName">Board Title</label>
              <input 
                type="text" 
                id="boardName"
                class="form-input" 
                placeholder="e.g. Marketing Plan, Sprint 1"
                [(ngModel)]="newBoardName"
                (keyup.enter)="createBoard()"
              >
            </div>
            <div class="form-group">
              <label>Board Color</label>
              <div class="color-options">
                <button 
                  *ngFor="let color of boardColors"
                  class="color-btn"
                  [style.background]="color"
                  [class.selected]="selectedColor === color"
                  (click)="selectedColor = color"
                ></button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="showCreateModal.set(false)">Cancel</button>
            <button 
              class="btn-create" 
              (click)="createBoard()"
              [disabled]="!newBoardName.trim() || creating()"
            >
              {{ creating() ? 'Creating...' : 'Create Board' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .boards-container {
      min-height: 100vh;
      background: #f4f5f7;
    }

    /* Trello-style Navigation */
    .trello-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #026aa7;
      color: white;
      gap: 1rem;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: bold;
    }

    .logo-icon {
      font-size: 1.25rem;
    }

    .logo-text {
      font-size: 1.1rem;
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      color: white;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .nav-link:hover, .nav-link.active {
      background: rgba(255,255,255,0.15);
    }

    .nav-center {
      flex: 1;
      max-width: 400px;
    }

    .search-container {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
    }

    .search-icon {
      margin-right: 0.5rem;
      font-size: 0.9rem;
    }

    .search-input {
      background: transparent;
      border: none;
      color: white;
      width: 100%;
      outline: none;
      font-size: 0.9rem;
    }

    .search-input::placeholder {
      color: rgba(255,255,255,0.7);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-create-board {
      background: white;
      color: #026aa7;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-create-board:hover {
      background: #f4f5f7;
    }

    /* Main Content */
    .boards-main {
      padding: 1.5rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .workspace-header {
      margin-bottom: 1.5rem;
    }

    .workspace-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .workspace-avatar {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: linear-gradient(135deg, #61bd4f 0%, #519839 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
    }

    .workspace-details h1 {
      font-size: 1.5rem;
      color: #172b4d;
      margin-bottom: 0.25rem;
    }

    .workspace-subtitle {
      color: #5e6c84;
      font-size: 0.9rem;
    }

    /* Boards Section */
    .boards-section {
      margin-top: 1rem;
    }

    .section-header {
      margin-bottom: 1rem;
    }

    .section-header h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      color: #172b4d;
    }

    .section-icon {
      font-size: 1.25rem;
    }

    .board-count {
      color: #5e6c84;
      font-weight: normal;
    }

    .board-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    .board-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      position: relative;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }

    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .board-cover {
      height: 100px;
      width: 100%;
    }

    .board-info {
      padding: 0.75rem;
    }

    .board-info h3 {
      font-size: 1rem;
      color: #172b4d;
      margin-bottom: 0.5rem;
    }

    .board-meta {
      display: flex;
      align-items: center;
    }

    .member-avatars {
      display: flex;
      align-items: center;
    }

    .member-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #dfe1e6;
      color: #172b4d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      margin-right: -8px;
      border: 2px solid white;
    }

    .more-members {
      margin-left: 12px;
      font-size: 0.75rem;
      color: #5e6c84;
    }

    .btn-star {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .board-card:hover .btn-star {
      opacity: 1;
    }

    .btn-star.starred {
      opacity: 1;
    }

    /* Create Card */
    .create-card {
      background: rgba(9, 30, 66, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }

    .create-card:hover {
      background: rgba(9, 30, 66, 0.13);
    }

    .create-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #5e6c84;
      font-weight: 500;
    }

    .plus-icon {
      font-size: 2rem;
      line-height: 1;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #5e6c84;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #172b4d;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      margin-bottom: 1.5rem;
    }

    .btn-create-first {
      background: #0079bf;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-create-first:hover {
      background: #026aa7;
    }

    /* Loading */
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #5e6c84;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #dfe1e6;
      border-top-color: #0079bf;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* No Results */
    .no-results {
      text-align: center;
      padding: 2rem;
      color: #5e6c84;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #dfe1e6;
    }

    .modal-header h2 {
      font-size: 1.1rem;
      color: #172b4d;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b778c;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .modal-body {
      padding: 1.25rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      color: #5e6c84;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 2px solid #dfe1e6;
      border-radius: 4px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      border-color: #0079bf;
    }

    .color-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .color-btn {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.15s, border-color 0.15s;
    }

    .color-btn:hover {
      transform: scale(1.1);
    }

    .color-btn.selected {
      border-color: #0079bf;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-top: 1px solid #dfe1e6;
    }

    .btn-cancel {
      background: none;
      border: none;
      color: #5e6c84;
      padding: 0.6rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-cancel:hover {
      background: #f4f5f7;
    }

    .btn-create {
      background: #0079bf;
      color: white;
      border: none;
      padding: 0.6rem 1.25rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-create:hover:not(:disabled) {
      background: #026aa7;
    }

    .btn-create:disabled {
      background: #dfe1e6;
      color: #a5adba;
      cursor: not-allowed;
    }
  `]
})
export class BoardsComponent implements OnInit {
  private authService = inject(AuthService);
  private boardService = inject(BoardService);
  private router = inject(Router);

  // State
  boards = signal<Board[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreateModal = signal(false);
  searchQuery = '';
  newBoardName = '';
  selectedColor = '#0079bf';

  // Board colors for the gradient effect
  boardColors = [
    '#0079bf', // Blue
    '#61bd4f', // Green
    '#f2d600', // Yellow
    '#ff9f1a', // Orange
    '#eb5a46', // Red
    '#c377e0', // Purple
    '#0079bf', // Blue
    '#51e898', // Teal
  ];

  userName = computed(() => {
    const user = this.authService.user();
    return user?.name || user?.email?.split('@')[0] || 'User';
  });

  filteredBoards = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.boards();
    return this.boards().filter(board => 
      board.name.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.loading.set(true);
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filterBoards(): void {
    // The computed filteredBoards will automatically update
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/board', boardId]);
  }

  goHome(): void {
    // Already on boards page
  }

  getBoardColor(boardId: string): string {
    // Generate consistent color based on board ID
    const colors = [
      'linear-gradient(135deg, #0079bf 0%, #026aa7 100%)',
      'linear-gradient(135deg, #61bd4f 0%, #519839 100%)',
      'linear-gradient(135deg, #f2d600 0%, #d9b51c 100%)',
      'linear-gradient(135deg, #ff9f1a 0%, #e6891a 100%)',
      'linear-gradient(135deg, #eb5a46 0%, #cf513d 100%)',
      'linear-gradient(135deg, #c377e0 0%, #a855c7 100%)',
      'linear-gradient(135deg, #51e898 0%, #3dcc7a 100%)',
    ];
    const index = boardId.charCodeAt(boardId.length - 1) % colors.length;
    return colors[index];
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  toggleStar(board: Board, event: Event): void {
    event.stopPropagation();
    // Toggle star logic would go here
  }

  createBoard(): void {
    if (!this.newBoardName.trim()) return;

    this.creating.set(true);
    const request: CreateBoardRequest = {
      name: this.newBoardName.trim()
    };

    this.boardService.createBoard(request).subscribe({
      next: (newBoard) => {
        this.boards.update(boards => [newBoard, ...boards]);
        this.showCreateModal.set(false);
        this.newBoardName = '';
        this.creating.set(false);
        // Navigate to the new board
        this.router.navigate(['/board', newBoard.id]);
      },
      error: () => {
        this.creating.set(false);
      }
    });
  }
}

