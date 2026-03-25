import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IClienteRepository } from '../cliente.repository';
import { Cliente } from '../../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteMockRepository implements IClienteRepository {
  private clientes: Cliente[] = [
    { id: '1', nome: 'João Silva', email: 'joao@example.com', telefone: '11999999999' },
    { id: '2', nome: 'Maria Santos', email: 'maria@example.com', telefone: '11888888888' },
    { id: '3', nome: 'Pedro Costa', email: 'pedro@example.com', telefone: '11777777777' }
  ];

  getAll(): Observable<Cliente[]> {
    return of([...this.clientes]);
  }

  getById(id: string): Observable<Cliente | undefined> {
    return of(this.clientes.find(c => c.id === id));
  }

  create(entity: Omit<Cliente, 'id'>): Observable<Cliente> {
    const newCliente: Cliente = {
      ...entity,
      id: String(Date.now())
    };
    this.clientes.push(newCliente);
    return of(newCliente);
  }

  update(id: string, entity: Partial<Cliente>): Observable<Cliente> {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes[index] = { ...this.clientes[index], ...entity };
    }
    return of(this.clientes[index]);
  }

  delete(id: string): Observable<void> {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
    }
    return of(void 0);
  }
}
