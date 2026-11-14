import { useState } from "react";
import { Check, Copy } from "lucide-react";
import Modal from "../../../../components/modal";
import type { ShareServicesModalProps } from "../../../../interface/service.types";
import { Button } from "../../../../components/button";

const DEFAULT_DUMMY_URL = "https://salora.lk/services/sribees-salon";

export function ShareServicesModal({
  isOpen,
  onClose,
  shareUrl = DEFAULT_DUMMY_URL,
}: ShareServicesModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out our Salon Services Catalog: ${shareUrl}`,
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Service Catalog"
      size="sm"
    >
      <div className="flex flex-col py-1">
        {/* Header statement */}
        <p className="text-xs sm:text-sm font-bold text-primary tracking-tight">
          Share Your All Services with this Link
        </p>

        {/* Link & Copy Box */}
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-primary-lighter/25 p-2 sm:p-2.5 transition focus-within:border-primary">
          <span className="truncate font-mono text-xs text-slate-700 select-all pl-1">
            {shareUrl}
          </span>
          <Button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-primary hover:bg-primary-dark shadow-primary/20"
            }`}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Social Share Section */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <p className="text-xs text-slate-500 font-medium">
            Share this link via social media
          </p>

          <div className="mt-3.5 flex items-center justify-center gap-4">
            {/* Facebook Button */}
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="flex size-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs transition-transform hover:scale-110 hover:shadow-md cursor-pointer"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* WhatsApp Button */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs transition-transform hover:scale-110 hover:shadow-md cursor-pointer"
            >
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShareServicesModal;
