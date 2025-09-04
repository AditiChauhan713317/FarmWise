import { useAuth } from '../context/Authcontext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Logout() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await logout();       
      router.replace('/login'); 
    }

    doLogout();
  }, []);

  return null;
}
