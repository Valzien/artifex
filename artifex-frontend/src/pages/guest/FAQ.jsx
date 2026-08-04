import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFaq } from "@/services/api/faq";

function FaqItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-ink min-w-0 flex-1 truncate">{item.question}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink/50 transition-transform", isOpen && "rotate-180")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-200", isOpen ? "max-h-40 pb-4" : "max-h-0")}>
        <p className="text-sm leading-relaxed text-ink/60">{item.answer}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaq().then((data) => { setFaq(data); setLoading(false); });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-ink">FAQ</h1>
        <p className="mt-3 text-ink/60">Pertanyaan yang sering ditanyakan seputar Artifex</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-5 w-32 rounded bg-surface" />
              <div className="rounded-xl border border-border p-4 space-y-3">
                {[...Array(3)].map((_, j) => <div key={j} className="h-4 rounded bg-surface" />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {faq.map((section) => (
            <div key={section.category}>
              <h2 className="mb-3 text-lg font-semibold text-ink">{section.category}</h2>
              <div className="rounded-xl border border-border bg-surface">
                {section.items.map((item) => <FaqItem key={item.question} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-ink/60">
          Masih punya pertanyaan?{" "}
          <a href="/contact" className="font-medium text-primary hover:underline">Hubungi kami</a>
        </p>
      </div>
    </div>
  );
}

export default FAQ;
