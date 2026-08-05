import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, UploadCloud, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { getConversations, getMessages, sendMessage } from "@/services/api/freelancerChat";
import { uploadFile } from "@/services/api/upload";
import ChatBubble from "@/components/shared/ChatBubble";
import { Avatar } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";

function ConversationListSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
          <Skeleton className="h-10 w-2/3 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

function FreelancerChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setIsLoadingMsgs(true);
    const msgs = await getMessages(conv.id);
    setMessages(msgs);
    setIsLoadingMsgs(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    let mounted = true;
    const startConvId = searchParams.get("conv");
    getConversations().then((data) => {
      if (!mounted) return;
      setConversations(data);
      setIsLoadingConvs(false);
      if (startConvId) {
        searchParams.delete("conv");
        setSearchParams(searchParams, { replace: true });
        const existing = (data ?? []).find((c) => String(c.id) === String(startConvId));
        if (existing) selectConversation(existing);
      }
    });
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const convs = await getConversations();
        setConversations(
          (convs ?? []).map((c) =>
            c.id === activeConv?.id ? { ...c, unread: 0 } : c
          )
        );
        if (activeConv) {
          const msgs = await getMessages(activeConv.id);
          setMessages((prev) =>
            msgs.length > prev.length || msgs[msgs.length - 1]?.id !== prev[prev.length - 1]?.id
              ? msgs
              : prev
          );
        }
      } catch {
        // ignore polling errors
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [activeConv?.id]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeConv || isSending) return;
    setInput("");
    setIsSending(true);
    const msg = await sendMessage(activeConv.id, { content: text });
    setMessages((prev) => [...prev, msg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id ? { ...c, lastMessage: text, updatedAt: msg.createdAt, unread: 0 } : c
      )
    );
    setIsSending(false);
  };

  const handleImageSend = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv || isUploading) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const msg = await sendMessage(activeConv.id, {
        type: "image",
        attachment: { url, name: file.name },
      });
      setMessages((prev) => [...prev, msg]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id ? { ...c, lastMessage: "📷 Foto", updatedAt: msg.createdAt, unread: 0 } : c
        )
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handlePaymentRequest = async () => {
    const amount = Number(payAmount);
    if (!activeConv || !amount || amount <= 0 || isSending) return;
    setIsSending(true);
    try {
      const msg = await sendMessage(activeConv.id, {
        type: "payment",
        content: `Minta pembayaran sebesar ${amount.toLocaleString("id-ID")}`,
        amount,
      });
      setMessages((prev) => [...prev, msg]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id ? { ...c, lastMessage: "💳 Permintaan pembayaran", updatedAt: msg.createdAt, unread: 0 } : c
        )
      );
      setShowPayForm(false);
      setPayAmount("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  function formatDateShort(d) { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" }); }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className={cn("w-full shrink-0 border-r border-border bg-surface md:w-80", activeConv ? "hidden md:flex md:flex-col" : "flex flex-col")}>
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-ink">Chat</h3>
          <p className="text-xs text-ink/50">Pesan dari klien</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoadingConvs ? <ConversationListSkeleton /> : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-ink/50">Belum ada percakapan</p>
            </div>
          ) : conversations.map((conv) => (
            <button key={conv.id} onClick={() => selectConversation(conv)}
              className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface", activeConv?.id === conv.id && "bg-primary/5")}>
              <div className="relative shrink-0">
                <Avatar src={conv.client.avatar} name={conv.client.name} className="h-10 w-10 text-sm" />
                {conv.client.isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink truncate">{conv.client.name}</p>
                  <span className="text-[10px] text-ink/40 shrink-0">{formatDateShort(conv.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-0.5 text-xs text-ink/50 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{conv.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={cn("flex flex-1 flex-col bg-background", !activeConv && "hidden md:flex")}>
        {!activeConv ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div><p className="text-sm font-medium text-ink">Pilih percakapan</p><p className="mt-1 text-xs text-ink/50">Pilih klien untuk mulai chat</p></div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
              <button onClick={() => setActiveConv(null)} className="rounded-lg p-1 text-ink/60 hover:bg-surface md:hidden"><ArrowLeft className="h-5 w-5" /></button>
              <div className="relative">
                <Avatar src={activeConv.client.avatar} name={activeConv.client.name} className="h-9 w-9 text-sm" />
                {activeConv.client.isOnline && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{activeConv.client.name}</p>
                <p className="text-xs text-ink/50">{activeConv.client.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
            {isLoadingMsgs ? <MessagesSkeleton /> : (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} isMine={msg.sender === "freelancer"} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
            <div className="border-t border-border bg-surface px-4 py-3">
              {showPayForm && (
                <div className="mb-2 flex items-center gap-2">
                  <Input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="Nominal pembayaran (Rp)"
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={handlePaymentRequest} disabled={!payAmount || isSending}>
                    Kirim
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { setShowPayForm(false); setPayAmount(""); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSend}
                  disabled={isUploading}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !activeConv}
                  title="Kirim foto"
                >
                  <UploadCloud className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPayForm((v) => !v)}
                  disabled={!activeConv}
                  title="Minta pembayaran"
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
                <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ketik pesan..." className="flex-1" disabled={isSending} />
                <Button size="icon" onClick={handleSend} disabled={!input.trim() || isSending} isLoading={isSending}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FreelancerChat;
