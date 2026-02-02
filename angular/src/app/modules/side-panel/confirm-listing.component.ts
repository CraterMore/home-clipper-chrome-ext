import { CommonModule } from '@angular/common'
import { Component, inject, resource, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { ApartmentListing } from 'src/app/interfaces/apartment-listing';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
    selector: 'confirm-listing',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: 'confirm-listing.component.html',
    styleUrls: ['confirm-listing.component.scss']
})
export class ConfirmListingComponent {
    private authService = inject(UserAuthService);

    user = this.authService.user;
    listing = signal<ApartmentListing | null>(null)

    private router = inject(Router)
    private route = inject(ActivatedRoute)

    constructor() { }

    listingResource = resource({
        loader: async () => {
            const currentUser = this.user();
            if (!currentUser) return null;

            const tabId = Number(this.route.snapshot.queryParamMap.get('tabId'));
            const siteUrlParam = this.route.snapshot.queryParamMap.get('siteUrl');

            if (!tabId || !siteUrlParam) {
                console.error("Missing query params");
                return null;
            }

            // Wrap chrome.tabs.sendMessage in a Promise
            const msg = await new Promise<string>((resolve, reject) => {
                chrome.tabs.sendMessage(tabId, 'request', (response) => {
                    if (chrome.runtime.lastError) {
                        console.warn("Chrome runtime error:", chrome.runtime.lastError);
                        resolve("");
                    } else {
                        resolve(response);
                    }
                });
            });

            if (!msg) {
                console.warn("No content received from tab");
                return null;
            }

            const idToken = await currentUser.getIdToken();
            try {
                const res = await fetch("https://extract-property-info-r5lsmhlcka-uc.a.run.app?url=" + siteUrlParam, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'text/html',
                        'Authorization': 'Bearer ' + idToken
                    },
                    body: msg
                });

                if (!res.ok) {
                    console.error("Fetch failed", res.status);
                    return null;
                }

                // Show result
                const data = await res.json()
                console.log(data)
                return data;
            } catch (err) {
                console.error("Error fetching property info:", err);
                return null;
            }
        },
    })


    goBack() {
        this.router.navigate(["/side-panel"]);
    }

    onSubmit() {
        console.log("Submitting listing details...")
    }
}