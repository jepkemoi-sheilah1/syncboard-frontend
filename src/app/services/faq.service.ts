import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FAQ } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private base = `${environment.apiUrl}${environment.api.basePath}`;

  constructor(private http: HttpClient) {}

  getActiveFaqs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.base}/faqs/active`);
  }
}