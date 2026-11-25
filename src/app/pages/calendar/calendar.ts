import { Component, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation';
import { EquipmentService } from '../../services/equipment';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  equipment = signal<any[]>([]);
  selectedId = signal<number | null>(null);
  year = signal(new Date().getFullYear());
  month = signal(new Date().getMonth() + 1);
  booked = signal<any[]>([]);

  weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
            'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private res: ReservationService, private eq: EquipmentService) {}

  ngOnInit() {
    this.eq
      .list({
        search: '', category: [], brand: [], location: [],
        available: '', sort: 'name', order: 'asc', page: 1, limit: 50,
      })
      .subscribe((r) => {
        this.equipment.set(r.data);
        if (r.data.length) {
          this.selectedId.set(r.data[0].id);
          this.load();
        }
      });
  }

  load() {
    const id = this.selectedId();
    if (!id) return;
    this.res.calendar(id, this.year(), this.month()).subscribe((r) => this.booked.set(r));
  }

  onSelect(value: string) {
    this.selectedId.set(Number(value));
    this.load();
  }

  prev() {
    if (this.month() === 1) { this.month.set(12); this.year.update((y) => y - 1); }
    else this.month.update((m) => m - 1);
    this.load();
  }

  next() {
    if (this.month() === 12) { this.month.set(1); this.year.update((y) => y + 1); }
    else this.month.update((m) => m + 1);
    this.load();
  }

  // خانات الشهر (مع فراغات في البداية)
  cells() {
    const y = this.year();
    const m = this.month();
    const daysInMonth = new Date(y, m, 0).getDate();
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7; // الاثنين أول يوم
    const out: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }

  dateStr(d: number) {
    return `${this.year()}-${String(this.month()).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  isBooked(d: number) {
    const s = this.dateStr(d);
    return this.booked().some(
      (b) => s >= b.start_date.slice(0, 10) && s <= b.end_date.slice(0, 10)
    );
  }

  isToday(d: number) {
    return this.dateStr(d) === new Date().toISOString().slice(0, 10);
  }
}
