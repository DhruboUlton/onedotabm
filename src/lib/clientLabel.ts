/**
 * How a client reads in a picker or a list.
 *
 * A client is a person, so the person's name leads. Their primary business
 * follows when they have one, because two people can share a first name but the
 * business is what a project or an invoice is usually remembered by.
 */
export function clientLabel(client: {
  contact_person: string;
  company_name?: string | null;
}): string {
  // Names get typed with stray spaces, and they show up in the middle of a label.
  const person = client.contact_person.trim();
  const business = client.company_name?.trim();
  return business ? `${person} — ${business}` : person;
}
