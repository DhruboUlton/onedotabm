"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: AdminModalSize;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<AdminModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
  full: "max-w-[95vw] sm:max-w-[90vw] h-[90vh]",
};

export function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnEsc = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
}: AdminModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose();
        return;
      }

      // Basic focus trapping
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "admin-modal-title" : undefined}
      aria-describedby={description ? "admin-modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-white rounded-3xl border border-[#E5E5E2] shadow-2xl z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]",
          sizeStyles[size],
          className
        )}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="p-5 sm:p-6 border-b border-[#E5E5E2] flex items-start justify-between gap-4 bg-white shrink-0">
            <div>
              {title && (
                <h3
                  id="admin-modal-title"
                  className="text-lg font-semibold tracking-tight text-[#111111]"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p id="admin-modal-description" className="text-xs text-[#555555] mt-1">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 sm:px-6 sm:py-4 border-t border-[#E5E5E2] bg-[#F7F7F5]/50 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
