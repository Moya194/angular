import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://reqres.in/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private platformId = inject(PLATFORM_ID);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      this.loadCurrentUser();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        this.currentUserSubject.next({ email: storedEmail });
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.storeToken(response.token);
          if (this.isBrowser()) {
            localStorage.setItem('email', email);
          }
          this.currentUserSubject.next({ email });
        }
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.storeToken(response.token);
          if (this.isBrowser()) {
            localStorage.setItem('email', email);
          }
          this.currentUserSubject.next({ email });
        }
      })
    );
  }

  storeToken(token: string): void {
    if (this.isBrowser()) localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ✅ Método que faltaba
  getUserInfo(): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/users/2`);
  }
}
