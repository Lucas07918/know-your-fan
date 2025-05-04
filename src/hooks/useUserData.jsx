import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // ajuste o caminho conforme seu projeto
import { useAuth } from "../contexts/AuthContext"; // supondo que você tenha um context

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchUserData() {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    }

    fetchUserData();
  }, [user]);

  return userData;
}
