/** Liste de questions dépliables, même style que la FAQ de l'accueil. */
export default function FaqList({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="border-b border-line">
      {items.map(([q, a]) => (
        <details key={q} className="group border-t border-line py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-light">
            {q}
            <span className="text-2xl font-light text-rs transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-mute">{a}</p>
        </details>
      ))}
    </div>
  );
}
