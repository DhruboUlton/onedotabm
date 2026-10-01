import React from 'react';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import type { InvoiceDetail } from '@/lib/services/invoiceService';
import type { QuotationDetail } from '@/lib/services/quotationService';
import type { CompanySettingsRecord } from '@/types/database';
import { formatMoney, formatDate, invoiceStatusMeta } from '@/lib/invoiceMeta';
import { quotationStatusMeta } from '@/lib/quotationMeta';

const BRAND = '#1400FF';
const DARK = '#111111';
const MUTED = '#555555';
const LIGHT = '#858585';
const BORDER = '#E5E5E2';

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: DARK, padding: 36, paddingBottom: 56, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 24, height: 24, marginRight: 8 },
  brand: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: BRAND },
  small: { fontSize: 8, color: MUTED, marginTop: 2 },
  tag: { fontSize: 22, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  num: { fontSize: 10, color: BRAND, textAlign: 'right', marginTop: 3 },
  status: { fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'right', marginTop: 5, letterSpacing: 1, color: MUTED },
  rule: { height: 1, backgroundColor: BORDER, marginVertical: 16 },
  split: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 7, color: LIGHT, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  bold: { fontFamily: 'Helvetica-Bold' },
  metaCol: { alignItems: 'flex-end', marginLeft: 28 },
  th: { flexDirection: 'row', paddingBottom: 6 },
  tr: { flexDirection: 'row', paddingVertical: 7, borderTopWidth: 1, borderTopColor: '#F0F0ED' },
  cDesc: { flexGrow: 1, flexBasis: 0, paddingRight: 8 },
  cQty: { width: 36, textAlign: 'right' },
  cUnit: { width: 90, textAlign: 'right' },
  cAmt: { width: 90, textAlign: 'right' },
  thText: { fontSize: 7, color: LIGHT, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Helvetica-Bold' },
  totRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 3 },
  totLabel: { width: 170, textAlign: 'right', color: MUTED, paddingRight: 12 },
  totValue: { width: 90, textAlign: 'right' },
  grandRow: { borderTopWidth: 1, borderTopColor: BORDER, marginTop: 4, paddingTop: 8 },
  grandText: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: DARK },
  section: { marginTop: 16 },
  body: { fontSize: 8.5, color: MUTED, lineHeight: 1.5 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#F0F0ED' },
  balance: { borderRadius: 6, paddingVertical: 12, paddingHorizontal: 16, marginTop: 16 },
  balanceLabel: { fontSize: 8, color: 'rgba(255,255,255,0.75)' },
  balanceAmt: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#FFFFFF', marginTop: 2 },
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, fontSize: 7, color: LIGHT },
});

async function loadLogo(): Promise<Buffer | null> {
  try {
    return await readFile(path.join(process.cwd(), 'public', 'logo.png'));
  } catch {
    return null;
  }
}

function Header({ company, logo, title, number, status }: { company: CompanySettingsRecord; logo: Buffer | null; title: string; number: string; status: string }) {
  return (
    <View style={s.header}>
      <View>
        <View style={s.brandRow}>
          {logo && <Image style={s.logo} src={{ data: logo, format: 'png' }} />}
          <Text style={s.brand}>{company.company_name}</Text>
        </View>
        {company.tagline ? <Text style={s.small}>{company.tagline}</Text> : null}
        {company.email ? <Text style={s.small}>{company.email}</Text> : null}
        {company.phone ? <Text style={s.small}>{company.phone}</Text> : null}
        {company.address ? <Text style={s.small}>{company.address}</Text> : null}
      </View>
      <View>
        <Text style={s.tag}>{title}</Text>
        <Text style={s.num}>{number}</Text>
        <Text style={s.status}>{status.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function Party({ title, name, company, email, phone, address }: { title: string; name: string; company?: string | null; email?: string | null; phone?: string | null; address?: string | null }) {
  return (
    <View style={{ maxWidth: '50%' }}>
      <Text style={s.label}>{title}</Text>
      <Text style={[s.bold, { fontSize: 10 }]}>{name}</Text>
      {company ? <Text>{company}</Text> : null}
      {email ? <Text style={{ color: MUTED }}>{email}</Text> : null}
      {phone ? <Text style={{ color: MUTED }}>{phone}</Text> : null}
      {address ? <Text style={{ color: MUTED, marginTop: 3 }}>{address}</Text> : null}
    </View>
  );
}

function Meta({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ marginBottom: 8, alignItems: 'flex-end' }}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.bold, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

function Tot({ label, value, grand, color }: { label: string; value: string; grand?: boolean; color?: string }) {
  return (
    <View style={[s.totRow, grand ? s.grandRow : {}]}>
      <Text style={[s.totLabel, grand ? s.grandText : {}]}>{label}</Text>
      <Text style={[s.totValue, grand ? s.grandText : {}, color ? { color } : {}]}>{value}</Text>
    </View>
  );
}

function Block({ title, text }: { title: string; text?: string | null }) {
  if (!text || !text.trim()) return null;
  return (
    <View style={s.section} wrap={false}>
      <Text style={s.label}>{title}</Text>
      <Text style={s.body}>{text}</Text>
    </View>
  );
}

function Footer({ company, number }: { company: CompanySettingsRecord; number: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>{company.company_name}</Text>
      <Text>{number}</Text>
    </View>
  );
}

function InvoicePdf({ invoice: inv, company, logo }: { invoice: InvoiceDetail; company: CompanySettingsRecord; logo: Buffer | null }) {
  const cur = inv.currency || 'BDT';
  const balance = Math.max(0, inv.total - inv.amount_paid);
  const settled = inv.status === 'paid' || balance <= 0;
  return (
    <Document title={`Invoice ${inv.invoice_number}`} author={company.company_name}>
      <Page size="A4" style={s.page}>
        <Header company={company} logo={logo} title="INVOICE" number={inv.invoice_number} status={invoiceStatusMeta(inv.status).label} />
        <View style={s.rule} />
        <View style={s.split}>
          <Party title="Bill to" name={inv.client_name ?? ''} company={inv.client_company} email={inv.client_email} phone={inv.client_phone} address={inv.client_address} />
          <View style={{ flexDirection: 'row' }}>
            <View style={s.metaCol}>
              <Meta label="Issue date" value={formatDate(inv.issue_date)} />
              <Meta label="Due date" value={formatDate(inv.due_date)} color={settled ? DARK : '#D97706'} />
            </View>
            <View style={s.metaCol}>
              <Meta label="Currency" value={cur} />
              <Meta label="Invoice total" value={formatMoney(inv.total, cur)} color={BRAND} />
            </View>
          </View>
        </View>
        <View style={s.rule} />

        <View style={s.th}>
          <Text style={[s.thText, s.cDesc]}>Description</Text>
          <Text style={[s.thText, s.cQty]}>Qty</Text>
          <Text style={[s.thText, s.cUnit]}>Unit price</Text>
          <Text style={[s.thText, s.cAmt]}>Amount</Text>
        </View>
        {inv.items.map((it, i) => (
          <View key={i} style={s.tr} wrap={false}>
            <Text style={s.cDesc}>{it.description}</Text>
            <Text style={s.cQty}>{it.quantity}</Text>
            <Text style={s.cUnit}>{formatMoney(it.unit_price, cur)}</Text>
            <Text style={s.cAmt}>{formatMoney(it.total ?? it.quantity * it.unit_price, cur)}</Text>
          </View>
        ))}
        <View style={{ marginTop: 6 }} wrap={false}>
          <Tot label="Subtotal" value={formatMoney(inv.subtotal, cur)} />
          {inv.discount > 0 && (
            <Tot
              label={`Discount${inv.discount_type === 'percent' ? ` (${inv.discount_value}%)` : ''}${inv.discount_note ? ` - ${inv.discount_note}` : ''}`}
              value={`-${formatMoney(inv.discount, cur)}`}
              color="#059669"
            />
          )}
          {inv.tax > 0 && <Tot label={`${inv.tax_label || 'Tax'}${inv.tax_rate ? ` (${inv.tax_rate}%)` : ''}`} value={`+${formatMoney(inv.tax, cur)}`} />}
          <Tot label="Total" value={formatMoney(inv.total, cur)} grand />
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.label}>Payment history</Text>
          {inv.payments.length === 0 ? (
            <Text style={{ color: LIGHT }}>No payments recorded yet.</Text>
          ) : (
            inv.payments.map((p, i) => (
              <View key={i} style={s.payRow}>
                <Text style={{ color: MUTED }}>
                  {formatDate(p.payment_date)}
                  {p.payment_method ? `  ·  ${p.payment_method}` : ''}
                  {p.reference ? `  ·  ${p.reference}` : ''}
                </Text>
                <Text style={[s.bold, { color: '#059669' }]}>{formatMoney(p.amount, cur)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={[s.balance, { backgroundColor: settled ? '#059669' : BRAND }]} wrap={false}>
          <Text style={s.balanceLabel}>{settled ? 'Settled in full' : 'Balance Due'}</Text>
          <Text style={s.balanceAmt}>{formatMoney(balance, cur)}</Text>
        </View>

        <Block title="Notes" text={inv.invoice_notes} />
        <Block title="Payment instructions" text={inv.notes} />
        <Footer company={company} number={inv.invoice_number} />
      </Page>
    </Document>
  );
}

function QuotationPdf({ quotation: q, company, logo }: { quotation: QuotationDetail; company: CompanySettingsRecord; logo: Buffer | null }) {
  const cur = q.currency || 'BDT';
  return (
    <Document title={`Quotation ${q.quotation_number}`} author={company.company_name}>
      <Page size="A4" style={s.page}>
        <Header company={company} logo={logo} title="QUOTATION" number={q.quotation_number} status={quotationStatusMeta(q.status).label} />
        <Text style={[s.bold, { fontSize: 13, marginTop: 18 }]}>{q.title}</Text>
        <View style={s.rule} />
        <View style={s.split}>
          <Party title="Prepared for" name={q.client_name ?? ''} company={q.client_company} email={q.client_email} phone={q.client_phone} address={q.client_address} />
          <View style={{ flexDirection: 'row' }}>
            <View style={s.metaCol}>
              <Meta label="Issue date" value={formatDate(q.issue_date)} />
              <Meta label="Valid until" value={formatDate(q.expiry_date)} color="#D97706" />
            </View>
            <View style={s.metaCol}>
              <Meta label="Currency" value={cur} />
              <Meta label="Total" value={formatMoney(q.total, cur)} color={BRAND} />
            </View>
          </View>
        </View>

        <Block title="Scope overview" text={q.scope_overview} />
        <View style={s.rule} />

        <View style={s.th}>
          <Text style={[s.thText, s.cDesc]}>Scope</Text>
          <Text style={[s.thText, s.cQty]}>Qty</Text>
          <Text style={[s.thText, s.cUnit]}>Unit price</Text>
          <Text style={[s.thText, s.cAmt]}>Amount</Text>
        </View>
        {q.items.map((it, i) => (
          <View key={i} style={s.tr} wrap={false}>
            <View style={s.cDesc}>
              <Text style={s.bold}>{it.description}</Text>
              {it.deliverables ? <Text style={[s.body, { marginTop: 2 }]}>{it.deliverables}</Text> : null}
            </View>
            <Text style={s.cQty}>{it.quantity}</Text>
            <Text style={s.cUnit}>{formatMoney(it.unit_price, cur)}</Text>
            <Text style={s.cAmt}>{formatMoney(it.total ?? it.quantity * it.unit_price, cur)}</Text>
          </View>
        ))}
        <View style={{ marginTop: 6 }} wrap={false}>
          <Tot label="Subtotal" value={formatMoney(q.subtotal, cur)} />
          {q.discount > 0 && (
            <Tot
              label={`Discount${q.discount_type === 'percent' ? ` (${q.discount_value}%)` : ''}${q.discount_note ? ` - ${q.discount_note}` : ''}`}
              value={`-${formatMoney(q.discount, cur)}`}
              color="#059669"
            />
          )}
          {q.tax > 0 && <Tot label={`${q.tax_label || 'Tax'}${q.tax_rate ? ` (${q.tax_rate}%)` : ''}`} value={`+${formatMoney(q.tax, cur)}`} />}
          <Tot label="Total" value={formatMoney(q.total, cur)} grand />
        </View>

        <Block title="Project timeline" text={q.project_timeline} />
        <Block title="Payment terms" text={q.payment_terms} />
        <Block title="Terms & conditions" text={q.terms} />
        <Footer company={company} number={q.quotation_number} />
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(invoice: InvoiceDetail, company: CompanySettingsRecord): Promise<Buffer> {
  return renderToBuffer(<InvoicePdf invoice={invoice} company={company} logo={await loadLogo()} />);
}

export async function renderQuotationPdf(quotation: QuotationDetail, company: CompanySettingsRecord): Promise<Buffer> {
  return renderToBuffer(<QuotationPdf quotation={quotation} company={company} logo={await loadLogo()} />);
}

export function pdfResponse(buffer: Buffer, filename: string): Response {
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
