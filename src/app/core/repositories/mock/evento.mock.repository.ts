import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IEventoRepository } from '../evento.repository';
import { Evento } from '../../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoMockRepository implements IEventoRepository {
  private eventos: Evento[] = [
    {
      id: '1',
      nome: 'Reunião com Cliente A',
      descricao: 'Discutir novo projeto',
      cor: '#3b82f6',
      data: new Date().toISOString().split('T')[0],
      horaInicio: '09:00',
      horaFim: '10:30',
      clienteIds: ['1'],
      servicoIds: ['2'],
      fornecedorIds: []
    },
    {
      id: '2',
      nome: 'Apresentação de Serviços',
      descricao: 'Apresentar catálogo completo',
      cor: '#22c55e',
      data: new Date().toISOString().split('T')[0],
      horaInicio: '14:00',
      horaFim: '15:00',
      clienteIds: ['2', '3'],
      servicoIds: ['1'],
      fornecedorIds: ['1']
    }
  ];

  getAll(): Observable<Evento[]> {
    return of([...this.eventos]);
  }

  getById(id: string): Observable<Evento | undefined> {
    return of(this.eventos.find(e => e.id === id));
  }

  create(entity: Omit<Evento, 'id'>): Observable<Evento> {
    const newEvento: Evento = {
      ...entity,
      id: String(Date.now())
    };
    this.eventos.push(newEvento);
    return of(newEvento);
  }

  update(id: string, entity: Partial<Evento>): Observable<Evento> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos[index] = { ...this.eventos[index], ...entity };
    }
    return of(this.eventos[index]);
  }

  delete(id: string): Observable<void> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos.splice(index, 1);
    }
    return of(void 0);
  }
}
