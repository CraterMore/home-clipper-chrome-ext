import { Injectable, signal } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
    Auth
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDzbxQbO--v37RXbsghMM8rc8vr2oYJjKA",
    authDomain: "home-clipper.firebaseapp.com",
    projectId: "home-clipper"
};

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    private app: FirebaseApp;
    private auth: Auth;

    // Expose user as a signal
    user = signal<User | null>(null);

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);

        onAuthStateChanged(this.auth, (user) => {
            this.user.set(user);
        });
    }

    async login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async register(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    async logout() {
        return signOut(this.auth);
    }
}
