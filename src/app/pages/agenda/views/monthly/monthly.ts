import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../calendar.service';
import { DayComponent } from '../day/day';

@Component({
  selector: 'app-monthly',
  imports: [CommonModule, DayComponent],
  templateUrl: './monthly.html',
  styleUrl: './monthly.css',
  standalone: true
})
export class MonthlyComponent {
  currentDate = signal(new Date());
  days = signal<(number | null)[][]>([]);
  dayOfWeekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  selectedDay = signal<Date | null>(null);
  showDayModal = signal(false);

  constructor(private calendarService: CalendarService) {
    this.updateMonth();
  }

  updateMonth() {
    this.days.set(this.calendarService.getMonthDays(this.currentDate()));
  }

  previousMonth() {
    this.currentDate.set(
      this.calendarService.addMonths(this.currentDate(), -1)
    );
    this.updateMonth();
  }

  nextMonth() {
    this.currentDate.set(
      this.calendarService.addMonths(this.currentDate(), 1)
    );
    this.updateMonth();
  }

  selectDay(day: number | null) {
    if (day === null) return;
    const selectedDate = new Date(
      this.currentDate().getFullYear(),
      this.currentDate().getMonth(),
      day
    );
    this.selectedDay.set(selectedDate);
    this.showDayModal.set(true);
  }

  closeDayModal() {
    this.showDayModal.set(false);
  }

  isToday(day: number | null): boolean {
    if (day === null) return false;
    const date = new Date(
      this.currentDate().getFullYear(),
      this.currentDate().getMonth(),
      day
    );
    return this.calendarService.isToday(date);
  }

  getMonthYear(): string {
    return this.calendarService.formatMonthYear(this.currentDate());
  }
}
