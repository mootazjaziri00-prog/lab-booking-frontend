import { Component, OnInit, signal } from '@angular/core';
import { EquipmentService } from '../../services/equipment';
import { ReservationService } from '../../services/reservation';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-equipment',
  imports: [],
  templateUrl: './equipment.html',
  styleUrl: './equipment.css',
})
export class Equipment implements OnInit {
  items = signal<any[]>([]);
  total = signal(0);
  totalPages = signal(1);
  filters = signal<any>({ categories: [], brands: [], locations: [] });

  search = '';
  category: string[] = [];
  brand: string[] = [];
  location: string[] = [];
  available = '';
  sort = 'id';
  order = 'asc';
  page = 1;
  limit = 6;

  private timer: any;

  categoryLabels: Record<string, string> = {
    camera: '📷 Caméras',
    printer3d: '🖨️ Imprimantes 3D',
    labkit: '🔬 Kits de labo',
    electronics: '💻 Électronique',
  };

  constructor(
  private svc: EquipmentService,
  private resSvc: ReservationService,
  private toast: ToastService
) {}

  ngOnInit() {
    this.svc.filters().subscribe((f) => this.filters.set(f));
    this.load();
  }
  

  load() {
    this.svc
      .list({
        search: this.search,
        category: this.category,
        brand: this.brand,
        location: this.location,
        available: this.available,
        sort: this.sort,
        order: this.order,
        page: this.page,
        limit: this.limit,
      })
      .subscribe((res) => {
        this.items.set(res.data);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
      });
  }

  onSearch(value: string) {
    this.search = value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.page = 1;
      this.load();
    }, 300);
  }

  toggle(list: string[], value: string) {
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1);
    else list.push(value);
    this.page = 1;
    this.load();
  }

  has(list: string[], value: string) {
    return list.includes(value);
  }

  setAvailable(value: string) {
    this.available = value;
    this.page = 1;
    this.load();
  }

  onSort(value: string) {
    const [sort, order] = value.split('-');
    this.sort = sort;
    this.order = order;
    this.page = 1;
    this.load();
  }

  goTo(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p;
    this.load();
  }

  pages() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  reset() {
    this.search = '';
    this.category = [];
    this.brand = [];
    this.location = [];
    this.available = '';
    this.sort = 'id';
    this.order = 'asc';
    this.page = 1;
    this.load();
  }
  selected = signal<any>(null);
booked = signal<any[]>([]);
startDate = '';
endDate = '';
today = new Date().toISOString().slice(0, 10);

openBooking(e: any) {
  this.selected.set(e);
  this.startDate = '';
  this.endDate = '';
  this.booked.set([]);
  this.resSvc.forEquipment(e.id).subscribe((r) => this.booked.set(r));
}

closeBooking() {
  this.selected.set(null);
}

confirmBooking() {
  if (!this.startDate || !this.endDate) {
    this.toast.show('Choisissez les dates', 'error');
    return;
  }
  this.resSvc
    .create({
      equipment_id: this.selected().id,
      start_date: this.startDate,
      end_date: this.endDate,
    })
    .subscribe({
      next: () => {
        this.toast.show('Réservation confirmée ✅');
        this.closeBooking();
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur', 'error'),
    });
}
}
