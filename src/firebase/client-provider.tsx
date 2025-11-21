"use client";

import { ReactNode } from "react";

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // Since Firebase is removed, this provider just passes through its children.
  return <>{children}</>;
}
