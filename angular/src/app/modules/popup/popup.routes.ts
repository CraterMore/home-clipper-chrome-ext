import { Routes } from '@angular/router'
import { PopupComponent } from './popup.component'
import { LoginComponent } from './login.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PopupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
]
