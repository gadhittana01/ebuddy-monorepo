import admin from 'firebase-admin';
import serviceAccount from '../service-account.json';
import dotenv from 'dotenv';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

if (process.env.NODE_ENV !== 'production') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
  
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'; 
}

export { admin, db };
