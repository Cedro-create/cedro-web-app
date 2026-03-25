import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../calendar.service';
import { EventoService } from '../../evento.service';
import { Evento } from '../../../../core/models/evento.model';

@Component({
  selector: 'app-day',
  imports: [CommonModule],
  templateUrl: './day.html',
  styleUrl: './day.css',
  standalone: true
})
export class DayComponent {
  @Input() selectedDate!: Date;
  @Output() abrirEvento = new EventEmitter<Evento>();
  @Output() novoEvento = new EventEmitter<{ data: string; hora: string }>();

  timeSlots = signal<string[]>([]);

  // Expor eventos para o template poder reagir
  get eventos() {
    return this.eventoService.eventos();
  }

  constructor(
    private calendarService: CalendarService,
    private eventoService: EventoService
  ) {
    this.timeSlots.set(this.calendarService.getTimeSlots());
  }

  getDataIso(): string {
    return this.selectedDate.toISOString().split('T')[0];
  }

  getEventoNoSlot(slot: string): Evento | undefined {
    return this.eventoService.slotOcupado(this.getDataIso(), slot);
  }

  onClickSlot(slot: string) {
    const evento = this.getEventoNoSlot(slot);
    if (evento) {
      this.abrirEvento.emit(evento);
    } else {
      this.novoEvento.emit({ data: this.getDataIso(), hora: slot });
    }
  }

  getTooltipText(evento: Evento): string {
    return `${evento.nome} (${evento.horaInicio} - ${evento.horaFim})`;
  }
}
