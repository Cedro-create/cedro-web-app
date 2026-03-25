import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true
})
export class LayoutComponent {
  drawerToggle = 'drawer-toggle';

  toggleDrawer() {
    const checkbox = document.getElementById(
      'drawer-toggle'
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
}
