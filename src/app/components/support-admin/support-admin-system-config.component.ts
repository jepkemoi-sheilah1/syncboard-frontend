import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-support-admin-system-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin-system-config.component.html',
  styleUrl: './support-admin-system-config.component.scss'
})
export class SupportAdminSystemConfigComponent {
  private supportService = inject(SupportService);

  configs = signal<any[]>([]);
  loading = signal(false);
  error = signal('');

  // create form
  createKey = signal('');
  createValue = signal('');
  createDescription = signal('');

  // edit form
  editKey = signal('');
  editValue = signal('');
  editDescription = signal('');

  selectedKey = signal<string | null>(null);

  upserting = signal(false);

  loadAll(): void {
    this.loading.set(true);
    this.error.set('');
    this.supportService.getAllSystemConfig().subscribe({
      next: (res) => {
        this.configs.set(Array.isArray(res) ? res : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load system config');
        this.loading.set(false);
      }
    });
  }

  selectKey(configKey: string): void {
    this.selectedKey.set(configKey);
    this.editKey.set(configKey);
    this.editValue.set('');
    this.editDescription.set('');

    this.supportService.getSystemConfigByKey(configKey).subscribe({
      next: (cfg) => {
        this.editValue.set(cfg?.configValue ?? '');
        this.editDescription.set(cfg?.description ?? cfg?.configKey ?? '');
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load config by key');
      }
    });
  }

  create(): void {
    const key = this.createKey().trim();
    const value = this.createValue().trim();
    const description = this.createDescription().trim();

    if (!key || !value) {
      this.error.set('configKey and configValue are required');
      return;
    }

    this.upserting.set(true);
    this.error.set('');

    this.supportService.createSystemConfig({ configKey: key, configValue: value, description: description || undefined }).subscribe({
      next: () => {
        this.upserting.set(false);
        this.createKey.set('');
        this.createValue.set('');
        this.createDescription.set('');
        this.loadAll();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to create config');
        this.upserting.set(false);
      }
    });
  }

  update(): void {
    const key = this.selectedKey();
    if (!key) return;

    const value = this.editValue().trim();
    const description = this.editDescription().trim();

    this.upserting.set(true);
    this.error.set('');

    this.supportService.updateSystemConfigByKey(key, {
      configKey: key,
      configValue: value,
      description: description || undefined
    }).subscribe({
      next: () => {
        this.upserting.set(false);
        this.loadAll();
        this.selectKey(key);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to update config');
        this.upserting.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }
}

