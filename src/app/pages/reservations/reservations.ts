import { Component, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-reservations',
  imports: [],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations implements OnInit {
  list = signal<any[]>([]);

  constructor(private svc: ReservationService, private toast: ToastService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.mine().subscribe((r) => this.list.set(r));
  }

  cancel(r: any) {
    if (!confirm('Annuler cette réservation ?')) return;
    this.svc.cancel(r.id).subscribe({
      next: () => {
        this.toast.show('Réservation annulée', 'info');
        this.load();
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur', 'error'),
    });
  }
}
