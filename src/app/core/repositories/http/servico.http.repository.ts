import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IServicoRepository } from '../servico.repository';
import { Servico } from '../../models/servico.model';

@Injectable({ providedIn: 'root' })
export class ServicoHttpRepository implements IServicoRepository {
  private apiUrl = '/api/servicos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  getById(id: string): Observable<Servico | undefined> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  create(entity: Omit<Servico, 'id'>): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, entity);
  }

  update(id: string, entity: Partial<Servico>): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
