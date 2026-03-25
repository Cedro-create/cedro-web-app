import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IFornecedorRepository } from '../fornecedor.repository';
import { Fornecedor } from '../../models/fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedorMockRepository implements IFornecedorRepository {
  private fornecedores: Fornecedor[] = [
    { id: '1', nome: 'Fornecedor A', contato: 'João', email: 'fornecedor-a@example.com', telefone: '11955555555' },
    { id: '2', nome: 'Fornecedor B', contato: 'Maria', email: 'fornecedor-b@example.com', telefone: '11944444444' }
  ];

  getAll(): Observable<Fornecedor[]> {
    return of([...this.fornecedores]);
  }

  getById(id: string): Observable<Fornecedor | undefined> {
    return of(this.fornecedores.find(f => f.id === id));
  }

  create(entity: Omit<Fornecedor, 'id'>): Observable<Fornecedor> {
    const newFornecedor: Fornecedor = {
      ...entity,
      id: String(Date.now())
    };
    this.fornecedores.push(newFornecedor);
    return of(newFornecedor);
  }

  update(id: string, entity: Partial<Fornecedor>): Observable<Fornecedor> {
    const index = this.fornecedores.findIndex(f => f.id === id);
    if (index !== -1) {
      this.fornecedores[index] = { ...this.fornecedores[index], ...entity };
    }
    return of(this.fornecedores[index]);
  }

  delete(id: string): Observable<void> {
    const index = this.fornecedores.findIndex(f => f.id === id);
    if (index !== -1) {
      this.fornecedores.splice(index, 1);
    }
    return of(void 0);
  }
}
