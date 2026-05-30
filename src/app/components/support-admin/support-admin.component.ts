import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportAdminTalksComponent } from './support-admin-talks.component';
import { SupportAdminFaqsComponent } from './support-admin-faqs.component';
import { SupportAdminIssuesComponent } from './support-admin-issues.component';
import { SupportAdminNotificationsComponent } from './support-admin-notifications.component';
import { SupportAdminSystemConfigComponent } from './support-admin-system-config.component';

@Component({
  selector: 'app-support-admin',
  standalone: true,
  imports: [
    CommonModule,
    SupportAdminTalksComponent,
    SupportAdminFaqsComponent,
    SupportAdminIssuesComponent,
    SupportAdminNotificationsComponent,
    SupportAdminSystemConfigComponent
  ],
  templateUrl: './support-admin.component.html',
  styleUrl: './support-admin.component.scss'
})
export class SupportAdminComponent {}


