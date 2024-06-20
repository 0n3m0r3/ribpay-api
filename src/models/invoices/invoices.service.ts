import { Injectable, NotFoundException } from '@nestjs/common';
import { Client, InvoiceObject } from 'lago-javascript-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, subAccount: string) {
    const client = Client(process.env.LAGO_API_KEY);

    const { data } = await client.invoices.findInvoice(id);

    const modifiedInvoice = {
      invoice_id: data.invoice.lago_id,
      sequential_id: data.invoice.sequential_id,
      number: data.invoice.number,
      issuing_date: data.invoice.issuing_date,
      invoice_type: data.invoice.invoice_type,
      currency: data.invoice.currency,
      fees_amount_cents: data.invoice.fees_amount_cents,
      taxes_amount_cents: data.invoice.taxes_amount_cents,
      coupons_amount_cents: data.invoice.coupons_amount_cents,
      credit_notes_amount_cents: data.invoice.credit_notes_amount_cents,
      sub_total_excluding_taxes_amount_cents:
        data.invoice.sub_total_excluding_taxes_amount_cents,
      sub_total_including_taxes_amount_cents:
        data.invoice.sub_total_including_taxes_amount_cents,
      total_amount_cents: data.invoice.total_amount_cents,
      prepaid_credit_amount_cents: data.invoice.prepaid_credit_amount_cents,
      amount_currency: (data.invoice as any).amount_currency,
      vat_amount_currency: (data.invoice as any).vat_amount_currency,
      credit_amount_currency: (data.invoice as any).credit_amount_currency,
      total_amount_currency: (data.invoice as any).total_amount_currency,
      amount_cents: (data.invoice as any).amount_cents,
      credit_amount_cents: (data.invoice as any).credit_amount_cents,
      vat_amount_cents: (data.invoice as any).vat_amount_cents,
      sub_total_vat_excluded_amount_cents: (data.invoice as any)
        .sub_total_vat_excluded_amount_cents,
      sub_total_vat_included_amount_cents: (data.invoice as any)
        .sub_total_vat_included_amount_cents,
    };

    return modifiedInvoice;
  }

  async findByAccount(id: string, subAccount: string, query: any) {
    const client = Client(process.env.LAGO_API_KEY);

    const searchParams = query ?? {};

    const { data } = await client.invoices.findAllInvoices({
      external_customer_id: id,
      ...searchParams,
    });

    const modifiedInvoices = data.invoices.map(
      (invoice: Partial<InvoiceObject> & Record<string, any>) => {
        return {
          invoice_id: invoice.lago_id,
          sequential_id: invoice.sequential_id,
          number: invoice.number,
          issuing_date: invoice.issuing_date,
          invoice_type: invoice.invoice_type,
          currency: invoice.currency,
          fees_amount_cents: invoice.fees_amount_cents,
          taxes_amount_cents: invoice.taxes_amount_cents,
          coupons_amount_cents: invoice.coupons_amount_cents,
          credit_notes_amount_cents: invoice.credit_notes_amount_cents,
          sub_total_excluding_taxes_amount_cents:
            invoice.sub_total_excluding_taxes_amount_cents,
          sub_total_including_taxes_amount_cents:
            invoice.sub_total_including_taxes_amount_cents,
          total_amount_cents: invoice.total_amount_cents,
          prepaid_credit_amount_cents: invoice.prepaid_credit_amount_cents,
          amount_currency: invoice.amount_currency,
          vat_amount_currency: invoice.vat_amount_currency,
          credit_amount_currency: invoice.credit_amount_currency,
          total_amount_currency: invoice.total_amount_currency,
          amount_cents: invoice.amount_cents,
          credit_amount_cents: invoice.credit_amount_cents,
          vat_amount_cents: invoice.vat_amount_cents,
          sub_total_vat_excluded_amount_cents:
            invoice.sub_total_vat_excluded_amount_cents,
          sub_total_vat_included_amount_cents:
            invoice.sub_total_vat_included_amount_cents,
        };
      },
    );

    const returnItems = {
      invoices: modifiedInvoices,
      meta: data.meta,
    };

    return returnItems;
  }
}
