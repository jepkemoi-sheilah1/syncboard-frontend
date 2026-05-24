import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


export class InviteDialogComponent {
  emailInput = '';
  errorMessage = '';
  isLoading = false;
  invitationService: any;
  
  constructor(
    public dialogRef: MatDialogRef<InviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardId: string }
  ) {}

  sendInvites(): void {
    
    this.errorMessage = '';
    
    // validate emails
    const emails = this.emailInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    // Validate each email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      this.errorMessage = `Invalid email address(es): ${invalidEmails.join(', ')}`;
      return;
    }
    
    if (emails.length === 0) {
      this.errorMessage = 'Please enter at least one email address';
      return;
    }
    
    // Send all invitations
    this.isLoading = true;
    
    const invitations$ = emails.map(email =>
      this.invitationService.sendInvitation({
        boardId: this.data.boardId,
        email: email,
        role: 'member' // or get from form
      }).pipe(
        catchError(error => {
          console.error(`Failed to send invitation to ${email}:`, error);
          return of({ success: false, email, error });
        })
      )
    );
    
    forkJoin(invitations$).subscribe({
      next: (results) => {
        const successful = results.filter((r: any) => r.success).length;
        const failed = results.length - successful;
        
        if (failed > 0) {
          this.errorMessage = `${successful} invitation(s) sent successfully. ${failed} failed.`;
        } else {
          this.dialogRef.close({ success: true, count: successful });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to send invitations. Please try again.';
        this.isLoading = false;
      }
    });
  }
}