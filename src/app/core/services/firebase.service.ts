import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    private db = getFirestore(initializeApp(environment.firebaseConfig));

    // Firebase collection path for transactions.
    firebase_path = environment.firebasePath; 


    //listen to transaction document in Firestore 
    listenTransaction(orderId: string) {
        return new Observable((subscriber) => {
            const docRef = doc(this.db, this.firebase_path , orderId);

            const unsubscribe = onSnapshot( 
                docRef,
                (snap) => subscriber.next(snap.exists() ? snap.data() : null),
                (err) => subscriber.error(err)
            );

            return () => unsubscribe();  
        });
    }

    
    // Returns full Firestore document path as string.
    getTransactionPath(orderId: string): string {
        return `${this.firebase_path}/${orderId}`;
    }
}