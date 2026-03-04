// ============================================
// WebSocket Service - Real-Time Synchronization
// ============================================

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Card, BoardMember, CardMovedEvent, CardUpdatedEvent, CardCreatedEvent, CardDeletedEvent, MemberJoinedEvent, MemberLeftEvent, PresenceUpdateEvent } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // Connection status
  isConnected = signal(false);
  
  // Current board ID
  private currentBoardId: string | null = null;
  
  // WebSocket connection (mock for now)
  private ws: WebSocket | null = null;
  
  // Event subjects for listening
  private cardMovedSubject = new Subject<CardMovedEvent>();
  private cardUpdatedSubject = new Subject<CardUpdatedEvent>();
  private cardCreatedSubject = new Subject<CardCreatedEvent>();
  private cardDeletedSubject = new Subject<CardDeletedEvent>();
  private memberJoinedSubject = new Subject<MemberJoinedEvent>();
  private memberLeftSubject = new Subject<MemberLeftEvent>();
  private presenceUpdateSubject = new Subject<PresenceUpdateEvent>();
  
  // Observables for components to subscribe
  cardMoved$ = this.cardMovedSubject.asObservable();
  cardUpdated$ = this.cardUpdatedSubject.asObservable();
  cardCreated$ = this.cardCreatedSubject.asObservable();
  cardDeleted$ = this.cardDeletedSubject.asObservable();
  memberJoined$ = this.memberJoinedSubject.asObservable();
  memberLeft$ = this.memberLeftSubject.asObservable();
  presenceUpdate$ = this.presenceUpdateSubject.asObservable();
  
  // Online members
  private onlineMembersSubject = new BehaviorSubject<BoardMember[]>([]);
  onlineMembers$ = this.onlineMembersSubject.asObservable();

  constructor() {
    // For now, simulate connection with mock data
    this.simulateConnection();
  }

  // ============================================
  // Connection Methods
  // ============================================

  /**
   * Connect to WebSocket server
   * Note: This is a mock implementation - backend not ready
   */
  connect(boardId: string): void {
    this.currentBoardId = boardId;
    this.isConnected.set(true);
    
    // Simulate connection
    console.log(`[WebSocket] Connected to board: ${boardId}`);
    
    // Simulate other members being online
    this.simulateOnlineMembers();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.currentBoardId = null;
    this.isConnected.set(false);
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    console.log('[WebSocket] Disconnected');
  }

  /**
   * Join a board room
   */
  joinBoard(boardId: string): void {
    if (this.isConnected()) {
      // In real implementation, send join event
      console.log(`[WebSocket] Joining board: ${boardId}`);
    }
  }

  /**
   * Leave a board room
   */
  leaveBoard(boardId: string): void {
    if (this.isConnected()) {
      // In real implementation, send leave event
      console.log(`[WebSocket] Leaving board: ${boardId}`);
    }
  }

  // ============================================
  // Emit Events (Client → Server)
  // ============================================

  /**
   * Emit card moved event
   */
  emitCardMoved(card: Card, fromListId: string, toListId: string, newIndex: number): void {
    const event: CardMovedEvent = {
      cardId: card.id,
      fromListId,
      toListId,
      newIndex,
      userId: 'user-1' // Current user
    };
    
    // In real implementation, send via WebSocket
    console.log('[WebSocket] Emit card-moved:', event);
    
    // For demo, also emit locally to test
    // this.cardMovedSubject.next(event);
  }

  /**
   * Emit card updated event
   */
  emitCardUpdated(card: Card): void {
    const event: CardUpdatedEvent = {
      card,
      userId: 'user-1'
    };
    
    console.log('[WebSocket] Emit card-updated:', event);
    // this.cardUpdatedSubject.next(event);
  }

  /**
   * Emit card created event
   */
  emitCardCreated(card: Card): void {
    const event: CardCreatedEvent = {
      card,
      userId: 'user-1'
    };
    
    console.log('[WebSocket] Emit card-created:', event);
    // this.cardCreatedSubject.next(event);
  }

  /**
   * Emit card deleted event
   */
  emitCardDeleted(cardId: string, listId: string): void {
    const event: CardDeletedEvent = {
      cardId,
      listId,
      userId: 'user-1'
    };
    
    console.log('[WebSocket] Emit card-deleted:', event);
    // this.cardDeletedSubject.next(event);
  }

  /**
   * Emit list created event
   */
  emitListCreated(list: any): void {
    console.log('[WebSocket] Emit list-created:', list);
  }

  /**
   * Emit member joined event
   */
  emitMemberJoined(member: BoardMember): void {
    console.log('[WebSocket] Emit member-joined:', member);
  }

  // ============================================
  // Subscribe to Events (Server → Client)
  // ============================================

  /**
   * Subscribe to card moved events
   */
  onCardMoved(callback: (data: CardMovedEvent) => void): () => void {
    const subscription = this.cardMoved$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to card updated events
   */
  onCardUpdated(callback: (data: CardUpdatedEvent) => void): () => void {
    const subscription = this.cardUpdated$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to card created events
   */
  onCardCreated(callback: (data: CardCreatedEvent) => void): () => void {
    const subscription = this.cardCreated$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to card deleted events
   */
  onCardDeleted(callback: (data: CardDeletedEvent) => void): () => void {
    const subscription = this.cardDeleted$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to member joined events
   */
  onMemberJoined(callback: (data: MemberJoinedEvent) => void): () => void {
    const subscription = this.memberJoined$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to member left events
   */
  onMemberLeft(callback: (data: MemberLeftEvent) => void): () => void {
    const subscription = this.memberLeft$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to presence updates
   */
  onPresenceUpdate(callback: (data: PresenceUpdateEvent) => void): () => void {
    const subscription = this.presenceUpdate$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Simulate WebSocket connection (for demo)
   */
  private simulateConnection(): void {
    // Mock connection after 1 second
    setTimeout(() => {
      this.isConnected.set(true);
      console.log('[WebSocket] Simulated connection established');
    }, 1000);
  }

  /**
   * Simulate online members (for demo)
   */
  private simulateOnlineMembers(): void {
    const mockMembers: BoardMember[] = [
      { userId: 'user-1', email: 'you@example.com', name: 'You', role: 'owner', joinedAt: new Date() },
      { userId: 'user-2', email: 'jane@example.com', name: 'Jane Smith', role: 'member', joinedAt: new Date() }
    ];
    this.onlineMembersSubject.next(mockMembers);
  }

  /**
   * Get online members
   */
  getOnlineMembers(): BoardMember[] {
    return this.onlineMembersSubject.value;
  }
}
