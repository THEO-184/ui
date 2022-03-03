/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from 'common/hooks/useTitle';
import { useInvoiceQuery } from 'common/queries/invoices';
import { setCurrentInvoice } from 'common/stores/slices/invoices';
import { BreadcrumRecord } from 'components/Breadcrumbs';
import { Default } from 'components/layouts/Default';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath, useParams } from 'react-router-dom';
import { ClientSelector } from '../components/ClientSelector';
import { InvoiceDetails } from '../components/InvoiceDetails';

export function Edit() {
  const { id } = useParams();
  const { documentTitle } = useTitle('edit_invoice');
  const { data: invoice } = useInvoiceQuery({ id });
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const pages: BreadcrumRecord[] = [
    { name: t('invoices'), href: '/invoices' },
    {
      name: t('edit_invoice'),
      href: generatePath('/invoices/:id/edit', { id }),
    },
  ];

  useEffect(() => {
    if (invoice?.data.data) {
      dispatch(setCurrentInvoice(invoice.data.data));
    }
  }, [invoice]);

  return (
    <Default title={documentTitle} breadcrumbs={pages}>
      <div className="grid grid-cols-12 gap-4">
        <ClientSelector readonly />
        <InvoiceDetails />
      </div>
    </Default>
  );
}
