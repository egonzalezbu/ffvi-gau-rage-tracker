import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Auth, GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAUpOBfrO7qRqMRMSehvysT7qtzPr_uPs",
  authDomain: "ffvi-gau-rage-tracker.firebaseapp.com",
  projectId: "ffvi-gau-rage-tracker",
  storageBucket: "ffvi-gau-rage-tracker.appspot.com",
  messagingSenderId: "956763356423",
  appId: "1:956763356423:web:355a6183b053b4ba0b59a2"
};
const provider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public app: FirebaseApp;
  public db: Firestore;
  public auth: Auth;
  public currentUser: Promise<User | null>;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    const auth = getAuth();
    this.auth = auth;
    this.currentUser = new Promise(res => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          res(user);
        } else {
          res(null);
        }
      });
    });
  }

  login() {
    return signInWithPopup(this.auth, provider);
  }

  isLogged() {
    return this.auth.currentUser;
  }

  async getUserData() {
    if (!this.auth.currentUser) return;
    const docRef = doc(this.db, 'users', this.auth.currentUser.uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  async setUserData(data: any) {
    if (!this.auth.currentUser) return;
    return setDoc(doc(this.db, 'users', this.auth.currentUser.uid), data);
  }
}
