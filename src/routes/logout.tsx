import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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

  useEffect(() => {
    logout();
    navigate({ to: "/login" });
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Signing out…
    </div>
  );
}
