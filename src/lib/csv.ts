export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const HEADER_MAP: Record<string, string> = {
  businessname: "businessName",
  phone: "phone",
  email: "email",
  website: "website",
  city: "city",
  category: "category",
  contacttype: "contactType",
  googlerating: "googleRating",
  googlereviewcount: "googleReviewCount",
  founderownername: "ownerName",
  ownername: "ownerName",
  majorservices: "majorServices",
  facebook: "facebook",
  instagram: "instagram",
  linkedin: "linkedin",
  xtwitter: "twitter",
  twitter: "twitter",
  tiktok: "tiktok",
  youtube: "youtube",
  pinterest: "pinterest",
};

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function csvToProspectRows(text: string): Record<string, string>[] {
  const table = parseCSV(text);
  if (table.length < 2) return [];

  const headers = table[0].map((h) => HEADER_MAP[normalizeHeader(h)] ?? null);

  return table.slice(1).map((cols) => {
    const rowObj: Record<string, string> = {};
    headers.forEach((key, i) => {
      if (key) rowObj[key] = (cols[i] ?? "").trim();
    });
    return rowObj;
  }).filter((r) => r.businessName);
}
