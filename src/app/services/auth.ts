import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
  isAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.role === 'admin';
}
}
