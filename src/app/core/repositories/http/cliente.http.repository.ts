import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClienteRepository } from '../cliente.repository';
import { Cliente } from '../../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteHttpRepository implements IClienteRepository {
  private apiUrl = '/api/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(id: string): Observable<Cliente | undefined> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(entity: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, entity);
  }

  update(id: string, entity: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
