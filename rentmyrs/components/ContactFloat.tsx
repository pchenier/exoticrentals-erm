import { SITE, waUrl } from '@/lib/site';

export default function ContactFloat() {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex sm:bottom-6 sm:right-6">
      <a href={`sms:${SITE.phone}`} className="label border border-line bg-ink px-4 py-3 hover:border-paper">SMS</a>
      <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="label bg-[#25D366] px-4 py-3 text-black">
        WhatsApp
      </a>
    </div>
  );
}
