export default function Loading() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <div className="panel animate-pulse p-8">
          <div className="h-4 w-32 rounded-full bg-ink/10" />
          <div className="mt-5 h-12 max-w-2xl rounded-2xl bg-ink/10" />
          <div className="mt-4 h-5 max-w-3xl rounded-2xl bg-ink/8" />
          <div className="mt-2 h-5 max-w-xl rounded-2xl bg-ink/8" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="panel animate-pulse overflow-hidden">
              <div className="h-56 bg-ink/8" />
              <div className="space-y-4 p-6">
                <div className="h-5 w-24 rounded-full bg-ink/10" />
                <div className="h-8 w-2/3 rounded-2xl bg-ink/10" />
                <div className="h-5 rounded-2xl bg-ink/8" />
                <div className="h-5 w-5/6 rounded-2xl bg-ink/8" />
                <div className="h-20 rounded-[24px] bg-ink/8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
