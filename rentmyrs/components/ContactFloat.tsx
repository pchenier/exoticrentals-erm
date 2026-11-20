import { SITE, waUrl } from '@/lib/site';

export default function ContactFloat() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <a
        href={`sms:${SITE.phone}`}
        className="rounded-full border border-line bg-panel px-4 py-3 text-sm font-semibold shadow-lg hover:border-rs"
      >
        SMS
      </a>
      <a
        href={waUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-black shadow-lg"
      >
        WhatsApp
      </a>
    </div>
  );
}
