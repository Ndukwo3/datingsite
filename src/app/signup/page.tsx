import { AuthPage } from "@/components/AuthPage";
import { Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";

export default function SignupPage() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <AuthPage defaultTab="signup" />
    </Suspense>
  );
}
