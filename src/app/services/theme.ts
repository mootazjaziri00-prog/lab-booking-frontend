import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    this.apply(saved ?? 'light');
  }

  toggle() {
    this.apply(this.theme() === 'light' ? 'dark' : 'light');
  }

  private apply(t: 'light' | 'dark') {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }
}
