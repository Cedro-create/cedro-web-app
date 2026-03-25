import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyComponent } from './views/weekly/weekly';
import { MonthlyComponent } from './views/monthly/monthly';
import { EventoModalComponent } from './components/evento-modal/evento-modal';
import { EventoService } from './evento.service';
import { Evento } from '../../core/models/evento.model';

type ViewType = 'weekly' | 'monthly';

@Component({
  selector: 'app-agenda',
  imports: [CommonModule, WeeklyComponent, MonthlyComponent, EventoModalComponent],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
  standalone: true
})
export class AgendaComponent {
  currentView = signal<ViewType>('weekly');
  showEventoModal = signal(false);
  eventoEditando = signal<Evento | null>(null);
  dataInicial = signal<string | undefined>(undefined);
  horaInicial = signal<string | undefined>(undefined);

  constructor(private eventoService: EventoService) {}

  switchView(view: ViewType) {
    this.currentView.set(view);
  }

  abrirNovoEvento() {
    this.eventoEditando.set(null);
    this.dataInicial.set(undefined);
    this.horaInicial.set(undefined);
    this.showEventoModal.set(true);
  }

  abrirEditarEvento(evento: Evento) {
    this.eventoEditando.set(evento);
    this.showEventoModal.set(true);
  }

  abrirNovoEventoComData(data: string, hora: string) {
    this.eventoEditando.set(null);
    this.dataInicial.set(data);
    this.horaInicial.set(hora);
    this.showEventoModal.set(true);
  }

  fecharModal() {
    this.showEventoModal.set(false);
    this.eventoEditando.set(null);
  }

  salvarEvento(evento: Evento) {
    if (this.eventoEditando()) {
      this.eventoService.atualizarEvento(evento.id, evento);
    } else {
      const { id, ...eventoSemId } = evento;
      this.eventoService.criarEvento(eventoSemId);
    }
    this.fecharModal();
  }
}
