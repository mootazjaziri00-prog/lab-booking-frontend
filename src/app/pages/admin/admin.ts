import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  stats = signal<any>(null);
  error = signal('');

  labels: Record<string, string> = {
    camera: '📷 Caméras',
    printer3d: '🖨️ Imprimantes 3D',
    labkit: '🔬 Kits de labo',
    electronics: '💻 Électronique',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/admin/stats').subscribe({
      next: (s) => this.stats.set(s),
      error: () => this.error.set('Impossible de charger les statistiques'),
    });
  }

  percent(count: number) {
    const max = Math.max(...this.stats().byCategory.map((c: any) => c.count), 1);
    return (count / max) * 100;
  }

  availablePercent() {
    const e = this.stats().equipment;
    return e.total ? Math.round((e.available / e.total) * 100) : 0;
  }
}
