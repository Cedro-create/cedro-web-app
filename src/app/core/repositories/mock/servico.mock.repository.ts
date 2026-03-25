import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IServicoRepository } from '../servico.repository';
import { Servico } from '../../models/servico.model';

@Injectable({ providedIn: 'root' })
export class ServicoMockRepository implements IServicoRepository {
  private servicos: Servico[] = [
    { id: '1', nome: 'Consultoria', descricao: 'Consultoria empresarial', preco: 150 },
    { id: '2', nome: 'Desenvolvimento', descricao: 'Desenvolvimento de software', preco: 200 },
    { id: '3', nome: 'Manutenção', descricao: 'Manutenção de sistemas', preco: 100 }
  ];

  getAll(): Observable<Servico[]> {
    return of([...this.servicos]);
  }

  getById(id: string): Observable<Servico | undefined> {
    return of(this.servicos.find(s => s.id === id));
  }

  create(entity: Omit<Servico, 'id'>): Observable<Servico> {
    const newServico: Servico = {
      ...entity,
      id: String(Date.now())
    };
    this.servicos.push(newServico);
    return of(newServico);
  }

  update(id: string, entity: Partial<Servico>): Observable<Servico> {
    const index = this.servicos.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicos[index] = { ...this.servicos[index], ...entity };
    }
    return of(this.servicos[index]);
  }

  delete(id: string): Observable<void> {
    const index = this.servicos.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicos.splice(index, 1);
    }
    return of(void 0);
  }
}
