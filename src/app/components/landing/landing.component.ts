import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    {
      icon: '📋',
      title: 'Visual Boards',
      description: 'Organize work visually with boards that represent projects, goals, or any workflow.'
    },
    {
      icon: '📝',
      title: 'Lists & Cards',
      description: 'Break down work into lists and cards to track every detail.'
    },
    {
      icon: '✋',
      title: 'Drag & Drop',
      description: 'Move cards between lists with simple drag and drop.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Collaboration',
      description: 'Work together instantly - see changes as they happen.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Invite team members, assign tasks, and collaborate seamlessly.'
    },
    {
      icon: '🔧',
      title: 'Custom Workflows',
      description: 'Create custom lists and workflows that fit your team\'s needs.'
    },
    {
      icon: '📱',
      title: 'Accessible Anywhere',
      description: 'Access your boards from any device, anywhere.'
    }
  ];

  howItWorks = [
    {
      step: 1,
      title: 'Create Board',
      description: 'Start by creating a new board for your project'
    },
    {
      step: 2,
      title: 'Add Lists',
      description: 'Add lists to organize your workflow stages'
    },
    {
      step: 3,
      title: 'Add Cards',
      description: 'Create cards for tasks and drag them through your workflow'
    }
  ];
}


