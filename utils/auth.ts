import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { getToken, removeToken, saveToken } from './storage';

const FIREBASE_PROJECT_ID = 'catatan-keuangan-985ec';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );

    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
};

const isFirebaseIdToken = (token: string) => {
  const payload = decodeJwtPayload(token);

  return (
    payload?.iss === `https://securetoken.google.com/${FIREBASE_PROJECT_ID}` &&
    payload?.aud === FIREBASE_PROJECT_ID
  );
};

export const getAuthToken = async (forceRefresh = false): Promise<string | null> => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken(forceRefresh);
    await saveToken(token);

    return token;
  }

  const cachedToken = await getToken();

  if (cachedToken && isFirebaseIdToken(cachedToken)) {
    return cachedToken;
  }

  await removeToken();

  return null;
};

export const registerWithFirebase = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);

  if (data.name) {
    await updateProfile(credential.user, { displayName: data.name });
  }

  const token = await credential.user.getIdToken(true);
  await saveToken(token);

  return { user: credential.user, token };
};

export const loginWithFirebase = async (data: { email: string; password: string }) => {
  const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
  const token = await credential.user.getIdToken(true);
  await saveToken(token);

  return { user: credential.user, token };
};

export const logoutFromFirebase = async () => {
  await signOut(auth);
  await removeToken();
};
