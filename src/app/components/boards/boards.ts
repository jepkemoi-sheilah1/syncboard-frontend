import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserMenuComponent } from '../auth/user-menu/user-menu.component';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, UserMenuComponent],
  template: `
    <div class="boards-container">
      <!-- Welcome Header with User Info -->
      <header class="dashboard-header">
        <div class="welcome-section">
          <h1>👋 Welcome back, {{ userName() }}!</h1>
          <p>Here's what's happening with your boards today.</p>
        </div>
        
        <!-- User Menu with Logout -->
        <app-user-menu></app-user-menu>
      </header>

      <!-- Boards Section -->
      <section class="boards-section">
        <div class="section-header">
          <h2>Your Boards</h2>
          <button class="btn-new-board">+ New Board</button>
        </div>
        
        <div class="board-list">
          <div class="board-card">
            <div class="board-color" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
            <h3>Sample Board</h3>
            <p>Click to open</p>
          </div>
          
          <div class="board-card">
            <div class="board-color" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
            <h3>Personal Tasks</h3>
            <p>2 lists • 5 cards</p>
          </div>
          
          <div class="board-card">
            <div class="board-color" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
            <h3>Work Projects</h3>
            <p>5 lists • 12 cards</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .boards-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .welcome-section h1 {
      font-size: 1.75rem;
      color: #1e293b;
      margin: 0;
    }
    
    .welcome-section p {
      color: #64748b;
      margin: 0.5rem 0 0 0;
    }
    
    .boards-section {
      margin-top: 1rem;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
      font-size: 1.25rem;
      color: #1e293b;
      margin: 0;
    }
    
    .btn-new-board {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.625rem 1.25rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-new-board:hover {
      background: #2563eb;
    }
    
    .board-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .board-card {
      background: white;
      border-radius: 8px;
      padding: 0;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    
    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .board-color {
      height: 80px;
      width: 100%;
    }
    
    .board-card h3 {
      margin: 1rem 1rem 0.25rem 1rem;
      font-size: 1rem;
      color: #1e293b;
    }
    
    .board-card p {
      margin: 0 0 1rem 1rem;
      color: #64748b;
      font-size: 0.875rem;
    }
  `]
})
export class BoardsComponent {
  private authService = inject(AuthService);
  
  user = computed(() => this.authService.user());
  userName = computed(() => {
    const user = this.authService.user();
    return user?.name || user?.email?.split('@')[0] || 'User';
  });
  
  getUserInitials(): string {
    const user = this.authService.user();
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.length > 1 
        ? parts[0][0] + parts[1][0] 
        : user.name[0];
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  }
}

