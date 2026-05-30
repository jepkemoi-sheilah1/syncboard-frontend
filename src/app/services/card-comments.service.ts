import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CardComment, CreateCardCommentRequest } from '../models/card.comments.models';

@Injectable({
  providedIn: 'root'
})
export class CardCommentsService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  getByCard(cardId: string): Observable<CardComment[]> {
    return this.http.get<any>(`${this.base}/cards/${cardId}/comments`).pipe(
      map((response) => response.data ?? response)
    );
  }

  create(cardId: string, request: CreateCardCommentRequest): Observable<CardComment> {
    return this.http.post<any>(`${this.base}/cards/${cardId}/comments`, request).pipe(
      map((response) => response.data ?? response)
    );
  }
}

