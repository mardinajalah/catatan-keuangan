import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { removeToken, saveToken } from './storage';

export const getAuthToken = async (forceRefresh = false): Promise<string | null> => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken(forceRefresh);
    await saveToken(token);

    return token;
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

  try {
    if (data.name) {
      await updateProfile(credential.user, { displayName: data.name });
    }

    const token = await credential.user.getIdToken(true);

    return { user: credential.user, token };
  } catch (error) {
    await deleteUser(credential.user).catch(() => undefined);
    await removeToken();
    throw error;
  }
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

export const deleteFirebaseUser = async (user: User | null = auth.currentUser) => {
  if (user) {
    await deleteUser(user);
  }

  await removeToken();
};
