import React from "react";
import Image from "next/image";
import { Send } from "lucide-react";
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
  return (
    <div className="border border-white/[0.05] bg-[#07090e]/60 backdrop-blur-md rounded-sm p-4 flex flex-col justify-between h-full min-h-0 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="text-left text-white/65 text-[10px] font-display font-bold uppercase tracking-wider border-b border-white/[0.05] pb-2.5 mb-3 shrink-0">
        ROOM CHAT
      </div>

      {/* Chat Feed - Scrollable */}
      <ScrollArea className="flex-1 pr-2 mb-2">
        <div className="space-y-3.5">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5">
              {/* Message sender avatar */}
              <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10 bg-black shrink-0 mt-0.5">
                <Image 
                  src={msg.avatar} 
                  alt="Avatar"
                  fill
                  className="object-cover object-top"
                />
              </div>
              
              {/* Message details */}
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-display text-[11px] font-black uppercase tracking-wide", msg.colorClass)}>
                    {msg.sender}
                  </span>
                  <span className="text-[8px] text-white/40 font-medium">
                    {msg.time}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-sans mt-0.5 select-text selection:bg-accent/20">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="flex items-center shrink-0 gap-2 border border-white/10 bg-black/40 rounded-sm overflow-hidden p-1 focus-within:border-accent/40 transition-colors">
        <Input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none rounded-none px-3 py-1.5 text-xs text-white placeholder-white/40 font-sans outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
        />
        
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className="h-8 w-8 flex items-center justify-center text-accent hover:text-accent/80 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
