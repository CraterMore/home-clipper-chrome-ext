import { Routes } from '@angular/router'
import { SidePanelComponent } from './side-panel.component'
import { LoginComponent } from './login.component'
import { ConfirmListingComponent } from './confirm-listing.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SidePanelComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'confirm-listing',
    component: ConfirmListingComponent
  }
]
