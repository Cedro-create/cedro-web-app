import { Injectable, Inject, signal } from '@angular/core';
import { EVENTO_REPOSITORY } from '../../core/tokens';
import { IEventoRepository } from '../../core/repositories/evento.repository';
import { Evento } from '../../core/models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private _eventos = signal<Evento[]>([]);
  eventos = this._eventos.asReadonly();

  constructor(@Inject(EVENTO_REPOSITORY) private repository: IEventoRepository) {
    this.loadEventos();
  }

  private loadEventos() {
    this.repository.getAll().subscribe(eventos => {
      this._eventos.set(eventos);
    });
  }

  getEventosByDate(dataIso: string): Evento[] {
    return this.eventos().filter(e => e.data === dataIso);
  }

  getEventosForSlot(dataIso: string, slot: string): Evento[] {
    const eventosDia = this.getEventosByDate(dataIso);
    return eventosDia.filter(e => {
      const slots = this.getSlotsDaEvento(e);
      return slots.includes(slot);
    });
  }

  slotOcupado(dataIso: string, slot: string): Evento | undefined {
    return this.getEventosForSlot(dataIso, slot)[0];
  }

  private getSlotsDaEvento(evento: Evento): string[] {
    const slots: string[] = [];
    const [hInicio, mInicio] = evento.horaInicio.split(':').map(Number);
    const [hFim, mFim] = evento.horaFim.split(':').map(Number);

    let h = hInicio;
    let m = mInicio;

    while (h < hFim || (h === hFim && m < mFim)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 30;
      if (m === 60) {
        m = 0;
        h += 1;
      }
    }

    return slots;
  }

  criarEvento(evento: Omit<Evento, 'id'>) {
    this.repository.create(evento).subscribe(novoEvento => {
      this._eventos.set([...this.eventos(), novoEvento]);
    });
  }

  atualizarEvento(id: string, evento: Partial<Evento>) {
    this.repository.update(id, evento).subscribe(eventoAtualizado => {
      const eventos = [...this.eventos()];
      const index = eventos.findIndex(e => e.id === id);
      if (index !== -1) {
        eventos[index] = eventoAtualizado;
        this._eventos.set(eventos);
      }
    });
  }

  deletarEvento(id: string) {
    this.repository.delete(id).subscribe(() => {
      this._eventos.set(this.eventos().filter(e => e.id !== id));
    });
  }
}
