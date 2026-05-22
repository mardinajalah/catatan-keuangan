import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AuthForm from '../../components/AuthForm';
import CustomModal from '../../components/CustomModal';
import api from '../../utils/api';
import { deleteFirebaseUser, logoutFromFirebase, registerWithFirebase } from '../../utils/auth';
import { getApiErrorMessage, getFirebaseAuthErrorMessage } from '../../utils/errors';

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      if (data.password !== data.confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok');
        return;
      }

      if (!data.name || !data.email || !data.password) {
        setError('Nama, email, dan password wajib diisi');
        return;
      }

      let registerResult;

      try {
        registerResult = await registerWithFirebase({
          name: data.name,
          email: data.email,
          password: data.password,
        });
      } catch (firebaseError) {
        setError(
          getFirebaseAuthErrorMessage(firebaseError) ||
            'Register Firebase gagal. Periksa email, password, dan koneksi internet.'
        );
        return;
      }

      try {
        await api.post('/auth/sync-profile', { name: data.name });
      } catch (syncError) {
        let rollbackMessage = 'Akun Firebase yang baru dibuat sudah dihapus.';

        try {
          await deleteFirebaseUser(registerResult.user);
        } catch (rollbackError) {
          await logoutFromFirebase();
          rollbackMessage =
            'Akun Firebase mungkin masih ada karena proses rollback gagal. Coba hapus user tersebut dari Firebase Console.';
        }

        setError(
          `Register gagal karena akun belum bisa sinkron ke backend. ${rollbackMessage} ${getApiErrorMessage(
            syncError,
            'Periksa konfigurasi backend Vercel.'
          )}`
        );
        return;
      }

      await logoutFromFirebase();
      
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Terjadi kesalahan saat register.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <AuthForm 
        type="register"
        isLoading={isLoading}
        errorMessage={error}
        onSubmit={handleRegister}
        onFooterLinkPress={handleGoToLogin}
      />
      <CustomModal
        visible={showSuccessModal}
        type="success"
        title="Sukses"
        message="Registrasi berhasil. Silakan login."
        primaryButtonText="OK"
        onPrimaryPress={() => {
          setShowSuccessModal(false);
          router.replace('/login');
        }}
        primaryButtonVariant="primary"
      />
    </>
  );
}
