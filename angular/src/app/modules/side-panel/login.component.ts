import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router'

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: 'login.component.html',
    styleUrls: ['side-panel.component.scss']
})
export class LoginComponent {
    email = new FormControl('')
    password = new FormControl('')
    mode = signal<'login' | 'register'>('login')

    private router = inject(Router)
    private authService = inject(UserAuthService)

    goBack() {
        this.router.navigate(["/side-panel"]);
    }

    onSubmit() {
        if (this.email.value && this.password.value) {
            const email = this.email.value;
            const password = this.password.value;

            if (this.mode() === 'login') {
                this.authService.login(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        this.goBack();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Login error:", errorCode, errorMessage);
                    });
            } else {
                this.authService.register(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        this.goBack();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error("Register error:", errorCode, errorMessage);
                    });
            }
        }
    }

    switchMode() {
        this.mode.set(this.mode() === 'login' ? 'register' : 'login')
    }
}