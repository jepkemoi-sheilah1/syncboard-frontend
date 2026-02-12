import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-user-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
    private authService = inject(AuthService);
    
    isOpen = signal(false);
    showDeleteConfirm = signal(false);

    user = computed(() => this.authService.user());
    isLoading = computed(() => this.authService.isLoading());

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

    toggleMenu(): void {
        this.isOpen.update(value => !value);
    }

    closeMenu(): void {
        this.isOpen.set(false);
    }

    openDeleteConfirm(): void {
        this.showDeleteConfirm.set(true);
        this.closeMenu();
    }

    closeDeleteConfirm(): void {
        this.showDeleteConfirm.set(false);
    }

    logout(): void {
        this.authService.logout();
        this.closeMenu();
    }
}

