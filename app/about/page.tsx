import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-zinc-50">
          About CINDER
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          CINDER is a small-batch studio working in raw-edge tailoring and heavyweight
          cloth. Every piece is cut, dyed, and finished in limited runs — replace this
          copy with your own brand story.
        </p>
      </main>
    </>
  );
}
