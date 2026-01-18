import { Routes } from '@angular/router'
import { SidePanelComponent } from './side-panel.component'
import { LoginComponent } from './login.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SidePanelComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
]
