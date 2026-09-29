import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Radar,
  TrendingUp,
  Workflow,
  Sparkles,
  Hexagon,
  Compass,
  LayoutGrid,
  Brain,
  Users,
  CreditCard,
  LogOut,
  PlayCircle,
  Layers,
  Crosshair,
} from "lucide-react";

import appCss from "../styles.css?url";
import { reportVibeError } from "../lib/vibe-error-reporting";
import { DiagnosticProvider, useDiagnostic } from "@/lib/diagnostic/context";
import { SrsProvider } from "@/lib/diagnostic/srs-context";
import { SubscriptionProvider, useSubscription } from "@/lib/diagnostic/subscription-context";
import { hasFeature, planRank, PLAN_LIST, type PlanKey } from "@/lib/diagnostic/subscription";
import { PlanBadge } from "@/components/diagnostic/paywall";
import { Onboarding } from "@/components/diagnostic/onboarding";
import { AppFooter } from "@/components/diagnostic/app-footer";
import { AuthProvider, useAuth } from "@/lib/diagnostic/auth-context";
import { cn } from "@/lib/utils";

/** Per-item visibility rules keyed by nav `to`. Returns true if visible for
 *  the active entitlements. Default (no rule) = always visible. */
type NavVisibility = (ents: ReturnType<typeof useSubscription>["entitlements"]) => boolean;
const NAV_VISIBILITY: Partial<Record<string, NavVisibility>> = {
  // AI Coach is Pro+ (text mentor). Free gets a 1/day teaser but the nav is
  // surfaced only once the user is on a paid plan, per the V1 spec table.
  "/coach": (ents) => planRank(ents.plan) >= 1,
  // Spaced Repetition deck is Pro+.
  "/srs": (ents) => hasFeature(ents, "spacedRepetition"),
  // Digital Twin is Performance+.
  "/twin": (ents) => hasFeature(ents, "digitalTwin"),
  // Coach OS is coach-tier only.
  "/coach-os": (ents) => hasFeature(ents, "coachOs"),
  // Calibration Intensive is coach-tier+ (one-time intensive owners).
  "/calibration": (ents) => planRank(ents.plan) >= 3,
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportVibeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/audit", label: "Audit", icon: ClipboardCheck },
  { to: "/analytics", label: "Analytics", icon: Radar },
  { to: "/leverage", label: "Leverage", icon: Workflow },
  { to: "/trajectory", label: "Trajectory", icon: TrendingUp },
  { to: "/srs", label: "Spaced Repetition", icon: Layers },
  { to: "/coach", label: "AI Coach", icon: Sparkles },
  { to: "/twin", label: "Digital Twin", icon: Brain },
  { to: "/coach-os", label: "Coach OS", icon: Users },
  { to: "/calibration", label: "Calibration", icon: Crosshair },
  { to: "/assessments", label: "Assessments", icon: LayoutGrid },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/guide", label: "Guide", icon: Compass },
] as const;

function Sidebar() {
  const { name, email } = useAuth();
  const { entitlements } = useSubscription();
  const items = NAV.filter((item) => {
    const rule = NAV_VISIBILITY[item.to];
    return !rule || rule(entitlements);
  });
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img
          src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
          alt="Bula Creation Logo"
          className="size-7 rounded-sm object-contain"
        />
        <div className="leading-tight">
          <div className="font-display text-sm font-bold tracking-tight text-sidebar-foreground">
            BULA CREATION
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
            40-Point Algorithm
          </div>
        </div>
      </div>
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            activeProps={{ className: "bg-sidebar-accent text-gold" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <PlanBadge />
          {email?.trim().toLowerCase() === "lalabalavu.jon@gmail.com" && (
            <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
              Super Admin
            </span>
          )}
        </div>
        {email?.trim().toLowerCase() === "lalabalavu.jon@gmail.com" && <TierSimSwitcher />}
        {(name || email) && (
          <div className="mb-3 truncate text-[11px] leading-relaxed text-muted-foreground">
            {name && <div className="text-sidebar-foreground/80 font-medium">{name}</div>}
            {email && <div className="truncate text-muted-foreground/80">{email}</div>}
          </div>
        )}
        <Link
          to="/logout"
          className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-gold"
        >
          <LogOut className="size-3.5" /> Log out
        </Link>
        <Link
          to="/vsl"
          className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/5 px-2.5 py-1.5 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          <PlayCircle className="size-3.5" /> Watch the Method
        </Link>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          AI Goal Execution System. Private by default.
        </p>
      </div>
    </aside>
  );
}

/** Owner-only: simulate any tier without logging out. Overrides the entitlements
 *  used by nav visibility + paywall gates so you can preview each plan's UX. */
function TierSimSwitcher() {
  const { simulatedTier, setSimulatedTier } = useSubscription();
  const [open, setOpen] = useState(false);
  const current = simulatedTier ?? "coach_pro";

  return (
    <div className="mb-3 rounded-md border border-gold/20 bg-gold/5 p-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-gold"
      >
        <span>View as: {PLAN_LIST.find((p) => p.key === current)?.name ?? "Coach Pro"}</span>
        <span className="text-gold/60">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-1">
          {PLAN_LIST.map((p) => (
            <button
              key={p.key}
              onClick={() => {
                // Selecting the real plan clears the override.
                setSimulatedTier(p.key === "coach_pro" ? null : (p.key as PlanKey));
                setOpen(false);
              }}
              className={cn(
                "rounded px-2 py-1 text-left text-[11px] transition-colors",
                current === p.key
                  ? "bg-gold/20 text-gold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNav() {
  const { entitlements } = useSubscription();
  const items = NAV.filter((item) => {
    const rule = NAV_VISIBILITY[item.to];
    return !rule || rule(entitlements);
  });
  return (
    <nav className="sticky top-0 z-30 flex items-center gap-1 overflow-x-auto border-b border-border bg-background/90 px-3 py-2 backdrop-blur md:hidden">
      <div className="mr-2 flex items-center gap-1.5">
        <img
          src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
          alt="Bula Creation Logo"
          className="size-5 rounded-sm object-contain"
        />
        <span className="font-display text-xs font-bold">BULA CREATION</span>
      </div>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          activeProps={{ className: cn("text-gold") }}
          activeOptions={{ exact: item.to === "/" }}
        >
          <item.icon className="size-3.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bula Creation — AI Goal Execution System" },
      {
        name: "description",
        content:
          "Bula Creation: A personal operating system that converts goals, behaviour, self-assessment and AI coaching into a measurable feedback loop. The 40-Point Creation Algorithm.",
      },
      { name: "author", content: "Bula Creation · Bula Group" },
      { property: "og:title", content: "Bula Creation — AI Goal Execution System" },
      {
        property: "og:description",
        content:
          "Turn your single most important goal into a measurable feedback loop. Diagnose the constraint, prescribe the next move, track whether you moved with Bula Creation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "apple-touch-icon",
        href: "https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://bulacreation.app/#organization",
        name: "Bula Creation",
        url: "https://bulacreation.app",
        logo: "https://bulacreation.app/logo.svg",
        parentOrganization: {
          "@type": "Organization",
          name: "Bula Group",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://bulacreation.app/#software",
        name: "Bula Creation — 40-Point Creation Algorithm",
        applicationCategory: "BusinessApplication, LifestyleApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "GBP",
          lowPrice: "0",
          highPrice: "399",
        },
        description:
          "A cybernetic personal operating system that converts goals, behaviour, self-assessment and AI coaching into a measurable feedback loop.",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <DiagnosticProvider>
            <SrsProvider>
              <AppShell />
            </SrsProvider>
          </DiagnosticProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/** Hard auth + onboarding gate. Unauthenticated → /login. Authenticated but
 * not onboarded → forced onboarding overlay. Otherwise the app shell. */
function AppShell() {
  const { isAuthenticated, hydrated } = useAuth();
  const { onboarded } = useDiagnostic();
  const router = useRouter();
  const location = useLocation();

  const PUBLIC = ["/login", "/logout", "/vsl", "/terms", "/privacy", "/support"];
  const isPublic = PUBLIC.includes(location.pathname);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !isPublic) {
      router.navigate({ to: "/login" });
    }
  }, [hydrated, isAuthenticated, isPublic, router, location.pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!onboarded && <Onboarding />}
      <Sidebar />
      <MobileNav />
      <main className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
        <AppFooter />
      </main>
    </div>
  );
}
