import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC-ebKm5fk_k-LLjh_WLGeMecBQAwCuI18',
  authDomain: 'catatan-keuangan-985ec.firebaseapp.com',
  projectId: 'catatan-keuangan-985ec',
  storageBucket: 'catatan-keuangan-985ec.firebasestorage.app',
  messagingSenderId: '1027960196833',
  appId: '1:1027960196833:web:a4ada563da575c61eaf1a0',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => unknown;
};

export const auth = (() => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage) as never,
    });
  } catch {
    return getAuth(firebaseApp);
  }
})();
