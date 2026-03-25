import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFornecedorRepository } from '../fornecedor.repository';
import { Fornecedor } from '../../models/fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedorHttpRepository implements IFornecedorRepository {
  private apiUrl = '/api/fornecedores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  getById(id: string): Observable<Fornecedor | undefined> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
  }

  create(entity: Omit<Fornecedor, 'id'>): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiUrl, entity);
  }

  update(id: string, entity: Partial<Fornecedor>): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
