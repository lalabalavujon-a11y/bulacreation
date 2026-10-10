import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/diagnostic/auth-context";

export const Route = createFileRoute("/logout")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: LogoutComponent,
});

function LogoutComponent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    void logout()
      .then(() => navigate({ to: "/login" }))
      .catch(() => setError("Could not sign out. Please refresh and try again."));
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      {error || "Signing out…"}
    </div>
  );
}
