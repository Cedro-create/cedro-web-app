import { Component, signal, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../calendar.service';
import { EventoService } from '../../evento.service';
import { Evento } from '../../../../core/models/evento.model';

@Component({
  selector: 'app-weekly',
  imports: [CommonModule],
  templateUrl: './weekly.html',
  styleUrl: './weekly.css',
  standalone: true
})
export class WeeklyComponent {
  @Output() abrirEvento = new EventEmitter<Evento>();
  @Output() novoEvento = new EventEmitter<{ data: string; hora: string }>();

  currentDate = signal(new Date());
  weekDates = signal<Date[]>([]);
  timeSlots = signal<string[]>([]);
  eventosRefresh = signal(0); // Força re-renderização quando eventos mudam

  constructor(
    private calendarService: CalendarService,
    private eventoService: EventoService
  ) {
    this.updateWeek();

    // Monitorar mudanças nos eventos
    effect(() => {
      console.log('📢 WeeklyComponent: eventos atualizados, força re-renderização', this.eventoService.eventos().length);
      this.eventosRefresh.set(this.eventosRefresh() + 1);
    });
  }

  updateWeek() {
    this.weekDates.set(this.calendarService.getWeekDates(this.currentDate()));
    this.timeSlots.set(this.calendarService.getTimeSlots());
  }

  previousWeek() {
    this.currentDate.set(
      this.calendarService.addWeeks(this.currentDate(), -1)
    );
    this.updateWeek();
  }

  nextWeek() {
    this.currentDate.set(
      this.calendarService.addWeeks(this.currentDate(), 1)
    );
    this.updateWeek();
  }

  isToday(date: Date): boolean {
    return this.calendarService.isToday(date);
  }

  getDateLabel(date: Date): string {
    const day = this.calendarService.formatDayOfWeek(date);
    return `${day} ${date.getDate()}`;
  }

  getWeekLabel(): string {
    const start = this.weekDates()[0];
    const end = this.weekDates()[6];
    if (!start || !end) return '';
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
  }

  getDataIsoFromDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getEventoNoSlot(date: Date, slot: string): Evento | undefined {
    const dataIso = this.getDataIsoFromDate(date);
    return this.eventoService.slotOcupado(dataIso, slot);
  }

  onClickSlot(date: Date, slot: string) {
    const evento = this.getEventoNoSlot(date, slot);
    if (evento) {
      this.abrirEvento.emit(evento);
    } else {
      const dataIso = this.getDataIsoFromDate(date);
      this.novoEvento.emit({ data: dataIso, hora: slot });
    }
  }

  getTooltipText(evento: Evento): string {
    return `${evento.nome} (${evento.horaInicio} - ${evento.horaFim})`;
  }
}
