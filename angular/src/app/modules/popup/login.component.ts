import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth/web-extension';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: 'login.component.html',
    styleUrls: ['popup.component.scss']
})
export class LoginComponent {
    email = new FormControl('')
    password = new FormControl('')

    onSubmit() {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, this.email.value, this.password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.email + " is signed in");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
}