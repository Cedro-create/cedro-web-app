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
    console.log('📥 EventoService: carregando eventos...');
    this.repository.getAll().subscribe(
      eventos => {
        console.log('✅ EventoService: eventos carregados', eventos);
        this._eventos.set(eventos);
      },
      error => {
        console.error('❌ EventoService: erro ao carregar eventos', error);
      }
    );
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
    console.log('🔨 EventoService.criarEvento: iniciando', evento);
    this.repository.create(evento).subscribe(
      novoEvento => {
        console.log('🎉 EventoService.criarEvento: evento criado com sucesso', novoEvento);
        const eventosList = [...this.eventos(), novoEvento];
        console.log('📋 EventoService.criarEvento: lista atualizada com', eventosList.length, 'eventos');
        this._eventos.set(eventosList);
      },
      error => {
        console.error('💥 EventoService.criarEvento: erro ao criar evento', error);
      }
    );
  }

  atualizarEvento(id: string, evento: Partial<Evento>) {
    console.log('🔄 EventoService.atualizarEvento: iniciando para ID', id, evento);
    this.repository.update(id, evento).subscribe(
      eventoAtualizado => {
        console.log('✏️ EventoService.atualizarEvento: sucesso', eventoAtualizado);
        const eventos = [...this.eventos()];
        const index = eventos.findIndex(e => e.id === id);
        if (index !== -1) {
          eventos[index] = eventoAtualizado;
          this._eventos.set(eventos);
          console.log('📝 EventoService.atualizarEvento: lista atualizada');
        }
      },
      error => {
        console.error('💥 EventoService.atualizarEvento: erro', error);
      }
    );
  }

  deletarEvento(id: string) {
    console.log('🗑️ EventoService.deletarEvento: deletando ID', id);
    this.repository.delete(id).subscribe(
      () => {
        console.log('✅ EventoService.deletarEvento: sucesso');
        this._eventos.set(this.eventos().filter(e => e.id !== id));
      },
      error => {
        console.error('💥 EventoService.deletarEvento: erro', error);
      }
    );
  }
}
