import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-my-profile',
  imports: [],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile implements OnInit {
  auth = inject(AuthService);
  userDetails: any = null;

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails() {
    const id = this.auth.state.user()?.id;
    if (!id) {
      console.error('User ID is not available.');
      return;
    }
    const success = await this.auth.getUser(id);
    if (success) {
      this.userDetails = this.auth.state.userDetails();
    }
  }
}
