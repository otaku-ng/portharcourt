import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";
import { displayHeading, kicker, shell } from "@/lib/tailwind";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to create your PH Otakus member profile and RSVP to community events.",
};

const oauthErrors: Record<string, string> = {
  OAuthSignin: "Google sign-in could not start. Try again.",
  OAuthCallback: "Google sign-in did not complete. Try again.",
  OAuthAccountNotLinked:
    "That Google account is not linked to this member account.",
  AccessDenied: "Sign-in was cancelled or access was denied.",
  Configuration:
    "Member sign-in is not configured yet. Add the Google OAuth environment variables.",
};

function safeCallbackUrl(value: unknown): string {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : "/profile";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const errorMessage = params.error
    ? (oauthErrors[params.error] ?? "We could not sign you in. Try again.")
    : null;

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  return (
    <main className="overflow-hidden">
      <section
        className={`${shell} grid min-h-[calc(100svh-80px)] items-center py-20`}
      >
        <div className="mx-auto w-full max-w-[720px] border-t-8 border-brand-blue bg-brand-paper-dark p-[clamp(28px,6vw,70px)]">
          <p className={kicker}>
            <span className="text-brand-red">PH Otakus members</span> Your place
            in the room
          </p>
          <h1 className={`${displayHeading} mt-5 text-[clamp(4rem,10vw,9rem)]`}>
            Sign in.
            <br />
            <em className="font-inherit not-italic text-brand-red">Show up.</em>
          </h1>
          <p className="mt-7 max-w-[520px] text-lg">
            Create your community profile, keep a record of the events you join
            and start your Otaku Passport.
          </p>
          {errorMessage ? (
            <p
              className="mt-6 border-l-4 border-brand-red bg-white px-4 py-3 text-sm text-brand-red"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <form className="mt-8" action={signInWithGoogle}>
            <button
              className="inline-flex min-h-12 items-center gap-6 bg-brand-ink px-6 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase transition-colors hover:bg-brand-blue hover:text-brand-ink"
              type="submit"
            >
              Continue with Google <span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="mt-6 max-w-[500px] text-sm text-brand-ink-soft">
            Signing in here does not replace the WhatsApp community.{" "}
            <Link
              className="font-black underline underline-offset-4 hover:text-brand-red"
              href="/community#join"
            >
              Join the group separately.
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
