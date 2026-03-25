import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  getFirstDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  getWeekDates(date: Date): Date[] {
    const current = new Date(date);
    const first = current.getDate() - current.getDay();
    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(current.setDate(first + i));
      week.push(new Date(day));
    }

    return week;
  }

  getMonthDays(date: Date): (number | null)[][] {
    const daysInMonth = this.getDaysInMonth(date);
    const firstDay = this.getFirstDayOfMonth(date);
    const days: (number | null)[][] = [];
    let week: (number | null)[] = new Array(firstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      week.push(i);
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      week = week.concat(new Array(7 - week.length).fill(null));
      days.push(week);
    }

    return days;
  }

  getTimeSlots(): string[] {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  formatMonthYear(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }

  formatDayOfWeek(date: Date): string {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  addWeeks(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }
}
