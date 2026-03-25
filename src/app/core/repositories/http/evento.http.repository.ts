import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEventoRepository } from '../evento.repository';
import { Evento } from '../../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoHttpRepository implements IEventoRepository {
  private apiUrl = '/api/eventos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getById(id: string): Observable<Evento | undefined> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  create(entity: Omit<Evento, 'id'>): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, entity);
  }

  update(id: string, entity: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
