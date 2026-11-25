import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private api = 'http://localhost:3000/api';

  user = signal<any>(null);
  users = signal<any[]>([]);
  activeCount = signal(0);
  availableCount = signal(0);
  upcoming = signal<any[]>([]);
  error = signal('');

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() {
    this.http.get<any>(`${this.api}/users/me`).subscribe({
      next: (u) => {
        this.user.set(u);
        if (u.role === 'admin') this.loadUsers();
      },
      error: () => this.error.set('Impossible de charger le tableau de bord'),
    });

    this.http.get<any[]>(`${this.api}/reservations/mine`).subscribe((list) => {
      const active = list.filter((r) => r.status === 'active');
      this.activeCount.set(active.length);
      this.upcoming.set(active.slice(0, 3));
    });

    this.http
      .get<any>(`${this.api}/equipment`, { params: { available: '1', limit: '1' } })
      .subscribe((res) => this.availableCount.set(res.total));
  }

  loadUsers() {
    this.http.get<any[]>(`${this.api}/users`).subscribe({
      next: (list) => this.users.set(list),
      error: () => this.error.set('Impossible de charger les utilisateurs'),
    });
  }

  changeRole(u: any) {
    const role = u.role === 'admin' ? 'student' : 'admin';
    this.http.put(`${this.api}/users/${u.id}/role`, { role }).subscribe({
      next: () => {
        this.toast.show('Rôle mis à jour');
        this.loadUsers();
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur', 'error'),
    });
  }

  remove(u: any) {
    if (!confirm(`Supprimer ${u.name} ?`)) return;
    this.http.delete(`${this.api}/users/${u.id}`).subscribe({
      next: () => {
        this.toast.show('Utilisateur supprimé');
        this.loadUsers();
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur', 'error'),
    });
  }
}
