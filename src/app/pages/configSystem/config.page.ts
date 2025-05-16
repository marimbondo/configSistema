import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture: string;
  joinDate: Date;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  currentUser: User;
  totalUsers: number = 0;
  isLoading: boolean = true;
  stats = {
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalAdmins: 0
  };

  constructor(
    private alertController: AlertController,
    private router: Router
  ) { 
    this.currentUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      isAdmin: true,
      profilePicture: 'assets/default-avatar.png',
      joinDate: new Date(2023, 5, 15)
    };
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    setTimeout(() => {
      this.totalUsers = 157;
      this.stats = {
        activeUsers: 89,
        newUsersThisMonth: 12,
        totalAdmins: 3
      };
      this.isLoading = false;
    }, 1000);
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAccount() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1500);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }
}