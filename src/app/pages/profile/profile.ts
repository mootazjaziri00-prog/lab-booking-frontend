import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user = signal<any>(null);
  error = signal('');

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/users/me').subscribe({
      next: (res) => this.user.set(res),
      error: () => this.error.set('Impossible de charger le profil'),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
