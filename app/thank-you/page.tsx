import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-pine-500/10 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-pine-600">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-pine-800">Assessment received</h1>
        <p className="mt-2.5 text-[15px] text-ink/60 leading-relaxed">
          Thank you for rating the CNIC registration system. Your response has been recorded and will feed into the
          joint SIUT–Augmentec review.
        </p>
        <Link
          href="/"
          className="mt-7 inline-block rounded-md bg-pine-600 px-6 py-2.5 text-sm font-semibold text-bone shadow-sm hover:bg-pine-700 transition"
        >
          Submit another response
        </Link>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-ink/30">
          SIUT · DCTS · Data Analytics &amp; Improvement Sciences
        </p>
      </div>
    </main>
  );
}
