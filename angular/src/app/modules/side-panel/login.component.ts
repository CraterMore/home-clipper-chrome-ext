import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth/web-extension';
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

    goBack() {
        this.router.navigate(["/side-panel"]);
    }

    onSubmit() {
        const auth = getAuth()

        if (this.mode() === 'login') {
            signInWithEmailAndPassword(auth, this.email.value, this.password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                this.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        } else {
            createUserWithEmailAndPassword(auth, this.email.value, this.password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                this.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        }
    }

    switchMode() {
        this.mode.set(this.mode() === 'login' ? 'register' : 'login')
    }
}