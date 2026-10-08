"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePartyStore } from "@/store/partyStore";
import { sendMessageToParty } from "@/socket/emitter";

interface PartyChatOverlayProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function PartyChatOverlay({
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
}: PartyChatOverlayProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === "function" ? val(isOpen) : val;
    if (!isControlled) {
      setInternalIsOpen(nextVal);
    }
    onOpenChange?.(nextVal);
  };

  const { partyMessages } = usePartyStore();
  const [chatInput, setChatInput] = useState("");
  const [hasRecentMessages, setHasRecentMessages] = useState(false);

  const prevMessagesCountRef = useRef(partyMessages.length);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Trigger recent messages display whenever a new message arrives
  useEffect(() => {
    if (partyMessages.length > prevMessagesCountRef.current) {
      prevMessagesCountRef.current = partyMessages.length;
      setHasRecentMessages(true);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // If closed, keep visible for 7 seconds after new message
      if (!isOpen) {
        hideTimerRef.current = setTimeout(() => {
          setHasRecentMessages(false);
        }, 7000);
      }
    } else {
      prevMessagesCountRef.current = partyMessages.length;
    }
  }, [partyMessages.length, isOpen]);

  // When chat is closed manually, keep recent messages visible for 5 seconds before fading
  const handleCloseChat = () => {
    setIsOpen(false);
    if (partyMessages.length > 0) {
      setHasRecentMessages(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setHasRecentMessages(false);
      }, 5000);
    }
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll to bottom whenever messages update or chat opens/closes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: isOpen ? "smooth" : "auto" });
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [partyMessages, isOpen, hasRecentMessages]);

  // Global hotkeys: [Enter] or [T] to open and focus, [ESC] to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleCloseChat();
        return;
      }

      if ((e.key === "Enter" || e.key === "t" || e.key === "T") && !isInputFocused && !isOpen) {
        if (document.querySelector('[role="dialog"]')) return;
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, partyMessages.length]);

  // Close when clicking outside while chat is active
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleCloseChat();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, partyMessages.length]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) {
      // Valorant behavior: Pressing enter on empty input closes the chat
      handleCloseChat();
      return;
    }

    sendMessageToParty(trimmed);
    setChatInput("");
    setHasRecentMessages(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCloseChat();
    }
  };

  const isVisible = isOpen || hasRecentMessages;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-40 w-[380px] sm:w-[420px] transition-all duration-200 select-none font-sans",
        isOpen
          ? "h-[220px] sm:h-[240px] bg-[#0e1722]/85 backdrop-blur-sm border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] rounded-xs pointer-events-auto flex flex-col"
          : isVisible
          ? "max-h-[180px] bg-black/20 backdrop-blur-xs rounded-xs pointer-events-auto flex flex-col cursor-pointer border border-transparent transition-opacity duration-500 opacity-100"
          : "max-h-[180px] opacity-0 pointer-events-none border-transparent",
        className || "bottom-6 left-6"
      )}
      onClick={() => {
        if (!isOpen) {
          setIsOpen(true);
        }
      }}
    >
      {/* Messages Feed Area */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex-1 min-h-0 px-3 py-2 flex flex-col justify-end",
          isOpen
            ? "overflow-y-auto space-y-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-white/85 [&::-webkit-scrollbar-thumb]:rounded-none"
            : "overflow-hidden space-y-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        <div className="flex flex-col space-y-1 min-h-0">
          {partyMessages.length === 0 && isOpen && (
            <div className="text-[13px] leading-[1.35] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-white/50 select-none">
              <span className="text-[#58a6cf] font-medium mr-1.5">(Party)</span>
              <span className="text-[#dfda9a] font-semibold mr-1.5">SYSTEM:</span>
              <span className="text-white/60">Press [Enter] to chat.</span>
            </div>
          )}

          {partyMessages.map((msg) => (
            <div
              key={msg.id}
              className="text-[13px] leading-[1.35] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] break-words font-sans select-text selection:bg-[#58a6cf]/30"
            >
              <span className="text-[#58a6cf] font-medium mr-1.5 select-none">
                (Party)
              </span>
              <span className="text-[#dfda9a] font-semibold mr-1.5 select-none">
                {msg.sender}:
              </span>
              <span className="text-[#f1f5f9] font-normal">
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar: Only visible when chat is OPEN */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="h-9 bg-[#111c26]/95 border-t border-white/10 px-3 flex items-center gap-1.5 shrink-0"
        >
          {/* Channel Label */}
          <span className="text-[#58a6cf] font-medium text-[13px] shrink-0 select-none">
            Party:
          </span>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder=""
            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white text-[13px] font-sans p-0 caret-white"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      )}
    </div>
  );
}
