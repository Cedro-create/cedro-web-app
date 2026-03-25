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
    console.log(`🌐 EventoHttpRepository: GET ${this.apiUrl}`);
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getById(id: string): Observable<Evento | undefined> {
    console.log(`🌐 EventoHttpRepository: GET ${this.apiUrl}/${id}`);
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  create(entity: Omit<Evento, 'id'>): Observable<Evento> {
    console.log(`🌐 EventoHttpRepository: POST ${this.apiUrl}`, entity);
    return this.http.post<Evento>(this.apiUrl, entity);
  }

  update(id: string, entity: Partial<Evento>): Observable<Evento> {
    console.log(`🌐 EventoHttpRepository: PUT ${this.apiUrl}/${id}`, entity);
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    console.log(`🌐 EventoHttpRepository: DELETE ${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
