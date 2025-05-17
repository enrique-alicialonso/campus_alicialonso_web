import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, db } from "../firebase/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      // Validate session when auth state changes
      if (firebaseUser) {
        try {
          const response = await fetch("/api/auth/validate-session");
          if (!response.ok) {
            // Session is invalid, sign out from Firebase
            await auth.signOut();
            setUser(null);
            setUserDepartment(null);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error validating session:", error);
          setUser(null);
          setUserDepartment(null);
          setLoading(false);
          return;
        }
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();
          setUserDepartment(userData?.department || null);
        } catch (error) {
          console.error("Error fetching user department:", error);
          setUserDepartment(null);
        }
      } else {
        setUserDepartment(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    userDepartment,
  };
}
