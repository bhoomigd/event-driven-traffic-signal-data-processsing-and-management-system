import {
  Injectable, 
  signal, 
  computed, 
  inject
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://dummyjson.com/auth/login';
  private userApiUrl = 'https://dummyjson.com/users/';

  state = {
    user: signal<User | null>(null),
    accessToken: signal<string | null>(null),
    loading: signal(false),
    error: signal<string | null>(null),
    userDetails: signal<any | null>(null),
  };

  currentUser = computed(() => this.state.user());
  isAuthenticated = computed(() => !!this.state.accessToken());
  isLoading = computed(() => this.state.loading());
  error = computed(() => this.state.error());

  async login(username: string, password: string): Promise<boolean> {
    this.state.loading.set(true);
    this.state.error.set(null);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(this.apiUrl, {
          username,
          password,
          expiresInMins: 30,
        })
      );

      if (response && response.accessToken) {
        this.state.accessToken.set(response.accessToken);
        this.state.user.set({
          username: response.username,
          firstName: response.firstName,
          image: response.image,
          lastName: response.lastName,
          email: response.email,
          gender: response.gender,
          id: response.id
        });
        return true;
      }
      return false;
    } catch (error: any) {
      this.state.error.set('Invalid credentials. Please try again.');
      return false;
    } finally {
      this.state.loading.set(false);
    }
  }

  async getUser(id: number): Promise<boolean> {
    this.state.loading.set(true);
    this.state.error.set(null);

    try {
      const response = await firstValueFrom(
        this.http.get<any>(this.userApiUrl + id)
      );

      if (response) {
        this.state.userDetails.set(response);
        return true;
      }
      return false;
    } catch (error: any) {
      this.state.error.set('Invalid data. Please try again.');
      return false;
    } finally {
      this.state.loading.set(false);
    }
  }

  logout() {
    this.state.accessToken.set(null);
    this.state.user.set(null);
    this.state.error.set(null);
    this.router.navigate(['/login']);
  }
}