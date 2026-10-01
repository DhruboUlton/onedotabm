/** The fields a client's business can be created or updated with. */
export interface ClientBusinessInput {
  name: string;
  industry: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
}

const FIELD_PATTERN = /^businesses\[(\d+)\]\[(name|industry|website|address|notes)\]$/;

/**
 * Businesses arrive from the add-client form as parallel indexed fields —
 * businesses[0][name], businesses[0][website] and so on — so the modal can add
 * rows without an extra round trip.
 *
 * Rows keep their form order. Blank values are dropped, and a row with no name
 * is dropped entirely, so an untouched row costs nothing.
 */
export function readBusinesses(form: FormData): Partial<ClientBusinessInput>[] {
  const rows = new Map<number, Partial<ClientBusinessInput>>();

  for (const [key, value] of form.entries()) {
    const match = key.match(FIELD_PATTERN);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as keyof ClientBusinessInput;
    const row = rows.get(index) ?? {};
    const text = typeof value === 'string' ? value.trim() : '';
    if (text !== '') row[field] = text;
    rows.set(index, row);
  }

  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row)
    .filter((row) => row.name);
}
