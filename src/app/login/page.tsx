import { AuthPage } from "@/components/AuthPage";
import { Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";

export default function LoginPage() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <AuthPage defaultTab="login" />
    </Suspense>
  );
}
