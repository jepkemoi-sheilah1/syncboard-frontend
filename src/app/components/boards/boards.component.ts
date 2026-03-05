import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoardService } from '../../services/board.service';
import { InvitationService } from '../../services/invitation.service';
import { UserMenuComponent } from '../auth/user-menu/user-menu.component';
import { Board, CreateBoardRequest } from '../../models/board.models';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FormsModule, UserMenuComponent],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  private authService = inject(AuthService);
  private boardService = inject(BoardService);
  private invitationService = inject(InvitationService);
  private router = inject(Router);

  // State
  boards = signal<Board[]>([]);
  loading = signal(true);
  creating = signal(false);
  showCreateModal = signal(false);
  showInviteModal = signal(false);
  inviting = signal(false);
  inviteEmail = '';
  inviteRole = 'member';
  inviteBoardId = '';
  inviteError = signal('');
  inviteSuccess = signal(false);
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

  // Invite Member Methods
  closeInviteModal(): void {
    this.showInviteModal.set(false);
    this.inviteEmail = '';
    this.inviteBoardId = '';
    this.inviteRole = 'member';
    this.inviteError.set('');
    this.inviteSuccess.set(false);
  }

  sendInvite(): void {
    if (!this.inviteEmail.trim() || !this.inviteBoardId) {
      this.inviteError.set('Please fill in all fields');
      return;
    }

    this.inviting.set(true);
    this.inviteError.set('');

    this.invitationService.sendInvitation({
      boardId: this.inviteBoardId,
      email: this.inviteEmail.trim(),
      role: this.inviteRole as 'admin' | 'member' | 'observer'
    }).subscribe({
      next: (response) => {
        this.inviting.set(false);
        if (response.success) {
          this.inviteSuccess.set(true);
        } else {
          this.inviteError.set(response.message || 'Failed to send invitation');
        }
      },
      error: (err) => {
        this.inviting.set(false);
        this.inviteError.set(err.error?.message || 'Failed to send invitation');
      }
    });
  }
}

