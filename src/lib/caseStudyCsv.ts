import { parseCSV } from './csv.ts';

export interface CaseStudyCsvRow {
  client: string;
  industry: string;
  services: string[];
  headline: string;
  description: string;
  metrics: { metric: string; label: string }[];
  challenge: string;
  solution: string;
  testimonial: string;
  featured: boolean;
}

// Column name (letters and digits only, lowercased) to field. Several spellings
// map to the same field.
const HEADER_MAP: Record<string, string> = {
  clientbrand: 'client', client: 'client', brand: 'client',
  industry: 'industry',
  service: 'services', services: 'services',
  resultheadline: 'headline', headline: 'headline', result: 'headline',
  description: 'description', summary: 'description',
  keymetrics: 'metrics', metrics: 'metrics',
  challenge: 'challenge', problem: 'challenge',
  solution: 'solution', strategy: 'solution',
  clienttestimonial: 'testimonial', testimonial: 'testimonial',
  featureonhomepage: 'featured', featured: 'featured',
};

const TRUEY = new Set(['true', 'yes', 'y', '1', 'featured']);

// Strips the UTF-8 BOM Excel writes ahead of the first header, too.
const normalizeHeader = (h: string) => h.replace(/^﻿/, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function parseServices(raw: string): string[] {
  return raw.split(/[;|]/).map((s) => s.trim()).filter(Boolean);
}

/**
 * Turns "Revenue +239%; ROAS 2.1x to 4.3x; 126 creatives tested" into
 * { label, metric } pairs. A chunk is a stat when a label precedes its first
 * number ("Revenue" / "+239%"); one that opens with a figure keeps the whole
 * text as the metric with no label.
 */
export function parseMetrics(raw: string): { metric: string; label: string }[] {
  return raw
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk) => {
      const words = chunk.split(/\s+/);
      const firstNumeric = words.findIndex((w) => /\d/.test(w) || /^[+-]/.test(w));
      if (firstNumeric > 0) {
        return { label: words.slice(0, firstNumeric).join(' '), metric: words.slice(firstNumeric).join(' ') };
      }
      return { label: '', metric: chunk };
    });
}

/** Unknown columns are ignored and rows without a client or headline are dropped. */
export function csvToCaseStudyRows(text: string): CaseStudyCsvRow[] {
  const table = parseCSV(text);
  if (table.length < 2) return [];
  const headers = table[0].map((h) => HEADER_MAP[normalizeHeader(h)] ?? null);

  return table
    .slice(1)
    .map((cols) => {
      const raw: Record<string, string> = {};
      headers.forEach((key, i) => {
        if (key) raw[key] = (cols[i] ?? '').trim();
      });
      return {
        client: raw.client ?? '',
        industry: raw.industry ?? '',
        services: parseServices(raw.services ?? ''),
        headline: raw.headline ?? '',
        description: raw.description ?? '',
        metrics: parseMetrics(raw.metrics ?? ''),
        challenge: raw.challenge ?? '',
        solution: raw.solution ?? '',
        testimonial: raw.testimonial ?? '',
        featured: TRUEY.has((raw.featured ?? '').toLowerCase()),
      };
    })
    .filter((r) => r.client && r.headline);
}

export const CASE_STUDY_CSV_TEMPLATE = [
  'client_brand,industry,service,result_headline,description,key_metrics,challenge,solution,client_testimonial,feature_on_homepage',
  '"TechStart BD","E-Commerce","Meta Ads;Google Ads;Funnel Strategy","Scaled monthly revenue from $18K to $61K in 5 months.","Rebuilt paid acquisition around product-level campaigns and stronger creative testing.","Revenue +239%; ROAS 2.1x to 4.3x; CPA -41%; 126 creatives tested","Acquisition costs were rising and campaigns depended on a few ads.","Separated prospecting and retargeting, introduced structured creative testing.","The new system made our ad spend easier to scale.",true',
].join('\n');
