import { CommonModule } from '@angular/common'
import { Component, Inject, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { TAB_ID } from 'src/app/app.config'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { async } from 'rxjs';

@Component({
    selector: 'app-side-panel',
    imports: [CommonModule],
    templateUrl: 'side-panel.component.html',
    styleUrls: ['side-panel.component.scss']
})
export class SidePanelComponent {
  docContent = signal('')
  siteName = signal('')
  siteUrl = signal('')
  user = signal(null)

  private app = initializeApp({
      apiKey: "AIzaSyDzbxQbO--v37RXbsghMM8rc8vr2oYJjKA",
      authDomain: "home-clipper.firebaseapp.com",
      projectId: "home-clipper"
    });

  private router = inject(Router)

  constructor(@Inject(TAB_ID) readonly tabId: number) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      this.siteName.set(tabs[0].title)
      this.siteUrl.set(tabs[0].url)
      console.log(tabs[0].title)
    })

    
    const auth = getAuth(this.app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user.set(user)
      } else {
        this.user.set(null)
      }
    });

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
    // Get the page's current HTML content
    chrome.tabs.sendMessage(this.tabId, 'request', async (msg) => {
      this.docContent.set(msg)
      console.log(this.docContent())
      const idToken = await this.user().getIdToken();
      // Make API call to scrape the listing
      // TODO: Remove userId parameter from call
      const res = await fetch("https://extract-property-info-r5lsmhlcka-uc.a.run.app?url=" + this.siteUrl(), {
        method: "POST",
        headers: {
          'Content-Type': 'text/html',
          'Authorization': 'Bearer ' + idToken
        },
        body: this.docContent()
      })
      // Show result
      const data = await res.json()
      console.log(data)
    })
  }

  goToLogin() {
    this.router.navigate(['/side-panel/login'])
  }

  logout() {
    const auth = getAuth(this.app);
    signOut(auth).then(() => {
      this.user.set(null)
    }).catch((error) => {
      console.log(error)
    });
  }
}
