import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <nav *ngIf="authService.isLoggedIn()" class="main-nav">
        <div class="nav-brand">Mi App</div>
        <ul class="nav-links">
          <li><a routerLink="/home">Inicio</a></li>
          <li><a (click)="logout()" class="logout-link">Cerrar sesión</a></li>
        </ul>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #4CAF50;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-links li {
      margin-left: 1.5rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }

    .nav-links a:hover {
      text-decoration: underline;
    }

    .logout-link {
      font-weight: bold;
    }

    main {
      flex: 1;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
