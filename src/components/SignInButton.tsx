"use client";
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/config/firebase";
import { provider } from "@/lib/firebase/config/provider";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    console.log("Signing in");
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const idToken = await result.user.getIdToken();
      // const token = credential?.accessToken;
      // Store the token securely (e.g., in a HttpOnly cookie)
      // You'll need to implement this part on your server

      //= Send token to your backend API
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className="w-full" disabled={isLoading} onClick={signIn}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Iniciando sesión...
        </>
      ) : (
        "Iniciar sesión"
      )}
    </Button>
  );
}
