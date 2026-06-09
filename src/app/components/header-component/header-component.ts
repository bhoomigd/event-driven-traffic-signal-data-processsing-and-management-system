import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, CollapseModule, RouterLink, RouterLinkActive],
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss']
})
export class HeaderComponent {
  auth = inject(AuthService);
  isCollapsed = true;
}
