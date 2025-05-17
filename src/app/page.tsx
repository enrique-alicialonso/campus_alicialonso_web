"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import router from "next/router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/config/firebase";
import { provider } from "@/lib/firebase/config/provider";
import SignInButton from "@/components/SignInButton";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        // You might want to store the token securely here
        // For example, you could send it to your backend to create a session
        // await storeTokenOnServer(token);

        // Redirect to dashboard or home page after successful login
        router.push("/dashboard");
      } else {
        throw new Error("Failed to obtain access token");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      setError(
        "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/images/bg-blueprint.jpg')",
      }}
    >
      <Card className="w-full max-w-[400px] backdrop-blur-md bg-white/30 border-opacity-50 border-[0.7px]">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 relative">
            <Image
              src="/images/logos/logo_icon_white.png"
              height={96}
              width={96}
              alt="Logo"
            />
          </div>
          <h1 className="text-center text-xl font-bold text-white leading-tight">
            Bienvenido al Panel de Control del Campus Virtual Alicia Alonso
          </h1>
        </CardHeader>
        <CardContent>
          <SignInButton />
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="#" className="text-sm text-white hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
