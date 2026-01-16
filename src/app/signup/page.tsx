"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignupContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div>
      Signup Page
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<p>Loading signup...</p>}>
      <SignupContent />
    </Suspense>
  );
}
