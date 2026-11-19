import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading = signal(false);
  private count = 0;

  start() {
    this.count++;
    this.loading.set(true);
  }

  stop() {
    this.count = Math.max(0, this.count - 1);
    this.loading.set(this.count > 0);
  }
}
