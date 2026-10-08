import React, { useEffect } from "react";
import Image from "next/image";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  sender: string;
  time: string;
  text: string;
  colorClass: string;
  avatar: string;
};

type LobbyChatProps = {
  messages: Message[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
};

export function LobbyChat({
  messages,
  chatInput,
  setChatInput,
  handleSendMessage,
  chatEndRef,
}: LobbyChatProps) {
  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatEndRef]);

  return (
    <div className="border border-white/10 bg-[#07090e]/85 backdrop-blur-xl rounded-sm p-3 flex flex-col justify-between h-full min-h-0 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-display font-bold uppercase tracking-wider">
          <MessageSquare className="h-3 w-3 text-accent" />
          <span>ROOM CHAT</span>
        </div>
        <span className="text-[9px] font-mono text-white/30">[T] FOCUS</span>
      </div>

      {/* Chat Feed - Scrollable */}
      <ScrollArea className="flex-1 pr-1.5 mb-2 min-h-0">
        <div className="space-y-2.5">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              {/* Message sender avatar */}
              <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/10 bg-black shrink-0 mt-0.5">
                <Image 
                  src={msg.avatar} 
                  alt="Avatar"
                  fill
                  className="object-cover object-top"
                />
              </div>
              
              {/* Message details */}
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("font-display text-[10.5px] font-black uppercase tracking-wide truncate", msg.colorClass)}>
                    {msg.sender}
                  </span>
                  <span className="text-[8px] text-white/40 font-medium shrink-0">
                    {msg.time}
                  </span>
                </div>
                <p className="text-[11px] text-white/90 leading-relaxed font-sans select-text selection:bg-accent/20 break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input Box - Always Visible at the Bottom */}
      <form onSubmit={handleSendMessage} className="flex items-center shrink-0 gap-1.5 border border-white/10 bg-black/60 rounded-xs overflow-hidden p-0.5 focus-within:border-accent/50 transition-colors">
        <Input
          id="lobby-chat-input"
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type in room chat..."
          className="flex-1 bg-transparent border-none rounded-none px-2.5 py-1 text-xs text-white placeholder-white/40 font-sans outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0 h-8"
        />
        
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className="h-7 w-7 flex items-center justify-center text-accent hover:text-white hover:bg-accent/20 rounded-xs transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
