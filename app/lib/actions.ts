'use server';

import { sql } from '@vercel/postgres';
import { stat } from 'fs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// validate and prepare the data
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * React Server Action
 * @param formData FormData
 */
export async function createInvoice(formData: FormData) {
  // extract the data from form and validate
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // insert the data into db
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // revalidate and redirect
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Update the invoice record
 * @param id customerId
 * @param formData FYI
 */
export async function updateInvoice(id: string, formData: FormData) {
  // extract the data from form and validate
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;

  // update the data in db
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id= ${id}
    `;
  } catch (error) {
    return {
      messgae: 'Database Error: Failed to Update Invoice.',
    };
  }

  // revalidate and redirect
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id=${id}`;
    revalidatePath('/dashboard.invoices');
    return { message: 'Delete Invoice.' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}
