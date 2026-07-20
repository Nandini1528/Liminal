export default function Loading() {
    return (
      <main className="min-h-screen bg-white px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="h-4 w-32 rounded bg-[#2A2B2B]/10" />
          <div className="mt-4 h-8 w-3/4 rounded bg-[#2A2B2B]/10" />
          <div className="mt-10 h-96 w-full rounded bg-[#2A2B2B]/5" />
        </div>
      </main>
    );
  }