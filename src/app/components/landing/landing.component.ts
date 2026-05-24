import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../services/faq.service';
import { TalkService } from '../../services/talk.service';
import { FAQ, Issue } from '../../models/board.models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  private faqService = inject(FaqService);
  private talkService = inject(TalkService);

  faqs = signal<FAQ[]>([]);
  issues = signal<Issue[]>([]);
  expandedFaqId = signal<number | null>(null);

  talkForm = {
    fullName: '',
    email: '',
    message: '',
    issueId: null as number | null
  };
  talkSubmitting = signal(false);
  talkSuccess = signal(false);
  talkError = signal('');

  features = [
    { icon: '📋', title: 'Visual Boards', description: 'Organize work visually with boards that represent projects, goals, or any workflow.' },
    { icon: '📝', title: 'Lists & Cards', description: 'Break down work into lists and cards to track every detail.' },
    { icon: '✋', title: 'Drag & Drop', description: 'Move cards between lists with simple drag and drop.' },
    { icon: '⚡', title: 'Real-Time Collaboration', description: 'Work together instantly - see changes as they happen.' },
    { icon: '👥', title: 'Team Collaboration', description: 'Invite team members, assign tasks, and collaborate seamlessly.' },
    { icon: '🔧', title: 'Custom Workflows', description: 'Create custom lists and workflows that fit your team\'s needs.' },
    { icon: '📱', title: 'Accessible Anywhere', description: 'Access your boards from any device, anywhere.' }
  ];

  howItWorks = [
    { step: 1, title: 'Create Board', description: 'Start by creating a new board for your project' },
    { step: 2, title: 'Add Lists', description: 'Add lists to organize your workflow stages' },
    { step: 3, title: 'Add Cards', description: 'Create cards for tasks and drag them through your workflow' }
  ];

  ngOnInit(): void {
    this.faqService.getActiveFaqs().subscribe({
      next: (faqs) => this.faqs.set(faqs),
      error: () => {}
    });

    this.talkService.getActiveIssues().subscribe({
      next: (issues) => this.issues.set(issues),
      error: () => {}
    });
  }

  toggleFaq(id: number): void {
    this.expandedFaqId.set(this.expandedFaqId() === id ? null : id);
  }

  submitTalk(): void {
    const { fullName, email, message, issueId } = this.talkForm;

    if (!fullName.trim() || !email.trim() || !message.trim() || !issueId) {
      this.talkError.set('Please fill in all fields.');
      return;
    }

    this.talkSubmitting.set(true);
    this.talkError.set('');

    this.talkService.sendMessage({ fullName, email, message, issueId }).subscribe({
      next: () => {
        this.talkSubmitting.set(false);
        this.talkSuccess.set(true);
        this.talkForm = { fullName: '', email: '', message: '', issueId: null };
      },
      error: (err) => {
        this.talkSubmitting.set(false);
        this.talkError.set(err?.error?.message || 'Failed to send message. Please try again.');
      }
    });
  }
}