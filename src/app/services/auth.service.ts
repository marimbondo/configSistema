import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService, User } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {}

  login(email: string, password: string): Promise<User> {
    return this.dbService.login(email, password);
  }

  logout(): void {
    this.dbService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.dbService.getCurrentUser().pipe(
      map(user => !!user && user.isAuthenticated)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.dbService.getCurrentUser();
  }
}