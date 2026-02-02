import { CommonModule } from '@angular/common'
import { Component, Inject, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { TAB_ID } from 'src/app/app.config'
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule],
  templateUrl: 'side-panel.component.html',
  styleUrls: ['side-panel.component.scss']
})
export class SidePanelComponent {
  siteName = signal('')
  siteUrl = signal('')

  private authService = inject(UserAuthService);
  user = this.authService.user;

  private router = inject(Router)

  constructor(@Inject(TAB_ID) readonly tabId: number) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      this.siteName.set(tabs[0].title)
      this.siteUrl.set(tabs[0].url)
      console.log(tabs[0].title)
    })

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TAB_CHANGED') {
        console.log("Tab switched to:", message.title);

        // Update your UI element
        this.siteName.set(message.title)
        this.siteUrl.set(message.url)
      }
    });
  }

  async onClick() {

    if (!this.user()) {
      this.router.navigate(['/side-panel/login'])
      return
    }

    this.router.navigate(['/side-panel/confirm-listing'], { queryParams: { tabId: this.tabId, siteUrl: this.siteUrl() } })
  }

  goToLogin() {
    this.router.navigate(['/side-panel/login'])
  }

  logout() {
    this.authService.logout()
      .catch((error) => {
        console.log(error)
      });
  }
}
