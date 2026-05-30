import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin-notifications.component.html',
  styleUrl: './support-admin-notifications.component.scss'
})
export class SupportAdminNotificationsComponent {
  private supportService = inject(SupportService);

  notifications = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  markReadInProgress = signal(false);

  // If backend returns read status as a boolean, keep it generic.
  unreadCount = computed(() => this.notifications().filter(n => !n?.read && !n?.isRead).length);

  loadNotifications(): void {
    this.loading.set(true);
    this.error.set('');
    this.supportService.getMyNotifications().subscribe({
      next: (res) => {
        this.notifications.set(Array.isArray(res) ? res : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load notifications');
        this.loading.set(false);
      }
    });
  }

  markRead(id: string): void {
    this.markReadInProgress.set(true);
    this.error.set('');

    this.supportService.markNotificationRead(id).subscribe({
      next: () => {
        this.markReadInProgress.set(false);
        this.loadNotifications();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to mark as read');
        this.markReadInProgress.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }
}

