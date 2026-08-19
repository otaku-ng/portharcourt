"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[60svh] place-items-center px-8 py-20">
      <div className="max-w-[560px] border-t-8 border-brand-red bg-brand-paper-dark p-8">
        <p className="text-[0.7rem] font-black tracking-[0.14em] text-brand-red uppercase">PH Otakus / Something went wrong</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.85]">Try that again.</h1>
        <p className="mt-5 text-brand-ink-soft">We could not load this part of the community right now. Nothing was changed.</p>
        <button className="mt-7 min-h-12 bg-brand-ink px-5 text-[0.78rem] font-black tracking-[0.07em] text-white uppercase hover:bg-brand-blue hover:text-brand-ink" onClick={reset} type="button">Try again</button>
      </div>
    </main>
  );
}
