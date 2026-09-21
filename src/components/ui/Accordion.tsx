"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openValues: string[];
  toggleValue: (value: string) => void;
  iconType: "chevron" | "plus";
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  iconType?: "chevron" | "plus";
  className?: string;
  children?: React.ReactNode;
  items?: Array<{
    id: string;
    index?: string;
    trigger: React.ReactNode;
    content: React.ReactNode;
    badge?: string;
  }>;
}

export function Accordion({
  type = "single",
  defaultValue,
  iconType = "plus",
  className,
  children,
  items,
}: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleValue = (value: string) => {
    setOpenValues((prev) => {
      const isOpen = prev.includes(value);
      if (type === "single") {
        return isOpen ? [] : [value];
      } else {
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue, iconType }}>
      <div className={cn("w-full divide-y divide-[#E5E5E2] border-y border-[#E5E5E2]", className)}>
        {items
          ? items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger index={item.index} badge={item.badge}>
                  {item.trigger}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))
          : children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const AccordionItemContext = createContext<{ value: string; triggerId: string; contentId: string } | null>(
  null
);

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const autoId = useId();
  const triggerId = `accordion-trigger-${autoId}`;
  const contentId = `accordion-content-${autoId}`;

  return (
    <AccordionItemContext.Provider value={{ value, triggerId, contentId }}>
      <div className={cn("group transition-colors", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index?: string;
  badge?: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({
  index,
  badge,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(AccordionItemContext);

  if (!ctx || !itemCtx) {
    throw new Error("AccordionTrigger must be used inside Accordion & AccordionItem");
  }

  const isOpen = ctx.openValues.includes(itemCtx.value);

  return (
    <h3>
      <button
        id={itemCtx.triggerId}
        aria-controls={itemCtx.contentId}
        aria-expanded={isOpen}
        onClick={() => ctx.toggleValue(itemCtx.value)}
        className={cn(
          "w-full py-5 sm:py-6 flex items-center justify-between text-left cursor-pointer",
          "active:bg-[#F0F0ED] active:duration-75",
          "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1400FF] focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4 sm:gap-6 pr-4 flex-1">
          {index && (
            <span className="font-mono text-xs text-[#858585] shrink-0 font-medium">
              {index}
            </span>
          )}
          <span className="text-lg sm:text-xl font-medium text-[#111111] group-hover:text-black transition-colors">
            {children}
          </span>
          {badge && (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0F0ED] text-[#555555] border border-[#E5E5E2] hidden sm:inline-block">
              {badge}
            </span>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#E5E5E2] group-hover:border-[#D8D8D4] bg-white transition-all">
          {ctx.iconType === "plus" ? (
            <Plus
              className={cn(
                "w-4 h-4 text-[#111111] transition-transform duration-300 ease-out",
                isOpen && "rotate-45 text-[#1400FF]"
              )}
            />
          ) : (
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[#111111] transition-transform duration-300 ease-out",
                isOpen && "rotate-180 text-[#1400FF]"
              )}
            />
          )}
        </div>
      </button>
    </h3>
  );
}

export interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(AccordionItemContext);

  if (!ctx || !itemCtx) {
    throw new Error("AccordionContent must be used inside Accordion & AccordionItem");
  }

  const isOpen = ctx.openValues.includes(itemCtx.value);

  return (
    <div
      id={itemCtx.contentId}
      role="region"
      aria-labelledby={itemCtx.triggerId}
      className={cn(
        "grid transition-all duration-300 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0 pb-0"
      )}
    >
      <div className="overflow-hidden">
        <div className={cn("text-base text-[#555555] leading-relaxed pt-1 sm:pl-10", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
