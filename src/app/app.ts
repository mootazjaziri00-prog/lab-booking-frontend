import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth';
import { ToastService } from './services/toast';
import { LoadingService } from './services/loading';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(
    public auth: AuthService,
    public toast: ToastService,
    public loader: LoadingService,
    public theme: ThemeService,
    private router: Router
  ) {}

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.toast.show('Déconnexion réussie', 'info');
    this.router.navigate(['/']);
  }
}
