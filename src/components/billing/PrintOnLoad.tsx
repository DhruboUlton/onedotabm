'use client';

import { useEffect } from 'react';

/** Opens the print dialog once the page has rendered — "Save as PDF" from there. */
export function PrintOnLoad() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);
  return null;
}
