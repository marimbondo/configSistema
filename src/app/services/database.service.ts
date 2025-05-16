import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (email && password) {
        const user: User = {
          id: '1',
          email: email,
          name: 'Usuário',
          isAuthenticated: true
        };
        this.setCurrentUser(user);
        resolve(user);
      } else {
        reject('Credenciais inválidas');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}