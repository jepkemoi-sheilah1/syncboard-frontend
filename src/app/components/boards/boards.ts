import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boards-container">
      <h1>My Boards</h1>
      <p>Welcome to your dashboard!</p>
      
      <div class="board-list">
        <div class="board-card">
          <h3>Sample Board</h3>
          <p>Click to open</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boards-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .board-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .board-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  `]
})
export class BoardsComponent {}

