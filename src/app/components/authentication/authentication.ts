import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class Authentication {
  auth = inject(AuthService);
  router = inject(Router);
  credentials = { username: '', password: '' };

  async onSubmit() {
    const success = await this.auth.login(this.credentials.username, this.credentials.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
