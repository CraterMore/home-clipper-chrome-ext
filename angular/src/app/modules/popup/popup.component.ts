import { CommonModule } from '@angular/common'
import { Component, Inject, signal } from '@angular/core'
import { TAB_ID } from 'src/app/app.config'

@Component({
    selector: 'app-popup',
    imports: [CommonModule],
    templateUrl: 'popup.component.html',
    styleUrls: ['popup.component.scss']
})
export class PopupComponent {
  docContent = signal('')
  siteName = signal('')
  siteUrl = signal('')

  constructor(@Inject(TAB_ID) readonly tabId: number) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      this.siteName.set(tabs[0].title)
      this.siteUrl.set(tabs[0].url)
    })
  }

  async onClick() {
    // Get the page's current HTML content
    chrome.tabs.sendMessage(this.tabId, 'request', async (msg) => {
      this.docContent.set(msg)
      console.log(this.docContent())
      // Make API call to scrape the listing
      const res = await fetch("https://extract-property-info-r5lsmhlcka-uc.a.run.app?url=" + this.siteUrl() + "&userId=1", {
        method: "POST",
        headers: {
          'Content-Type': 'text/html'
        },
        body: this.docContent()
      })
      // Show result
      const data = await res.json()
      console.log(data)
    })
  }
}
