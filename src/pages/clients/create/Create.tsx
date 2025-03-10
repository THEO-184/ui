/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { route } from 'common/helpers/route';
import { useQuery } from 'common/hooks/useQuery';
import { Client } from 'common/interfaces/client';
import { ClientContact } from 'common/interfaces/client-contact';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { Page } from 'components/Breadcrumbs';
import { Default } from 'components/layouts/Default';
import { Spinner } from 'components/Spinner';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AdditionalInfo } from '../edit/components/AdditionalInfo';
import { Address } from '../edit/components/Address';
import { Contacts } from '../edit/components/Contacts';
import { Details } from '../edit/components/Details';

export function Create() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const pages: Page[] = [
    { name: t('clients'), href: '/clients' },
    {
      name: t('new_client'),
      href: route('/clients/create'),
    },
  ];

  const [client, setClient] = useState<Client | undefined>();
  const [errors, setErrors] = useState<ValidationBag>();

  const [contacts, setContacts] = useState<Partial<ClientContact>[]>([
    {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      send_email: false,
    },
  ]);

  const { data: blankClient, isLoading } = useQuery('/api/v1/clients/create', {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (blankClient?.data.data) {
      setClient(blankClient.data.data);
    }
  }, [blankClient]);

  const onSave = () => {
    set(client as Client, 'contacts', contacts);
    const toastId = toast.loading(t('processing'));
    setErrors(undefined);
    if (
      !(
        client?.name != '' ||
        contacts[0].first_name != '' ||
        contacts[0].last_name != ''
      )
    ) {
      setErrors({
        message: t('invalid_name // needs translation'),
        errors: { name: [t('please_enter_a_client_or_contact_name')] },
      });
      toast.error(t('error_title'), { id: toastId });

      return onSave;
    }

    request('POST', endpoint('/api/v1/clients'), client)
      .then((response) => {
        toast.success(t('created_client'), { id: toastId });

        navigate(route('/clients/:id', { id: response.data.data.id }));
      })
      .catch((error: AxiosError<ValidationBag>) => {
        console.error(error);

        if (error.response?.status === 422) {
          setErrors(error.response.data);
        }

        toast.error(t('error_title'), { id: toastId });
      });
  };

  return (
    <Default
      title={t('new_client')}
      breadcrumbs={pages}
      onSaveClick={onSave}
      onBackClick={route('/clients')}
    >
      {isLoading && <Spinner />}

      <div className="flex flex-col xl:flex-row xl:gap-4">
        <div className="w-full xl:w-1/2">
          <Details client={client} setClient={setClient} errors={errors} />
          <Address client={client} setClient={setClient} />
        </div>

        <div className="w-full xl:w-1/2">
          <Contacts
            contacts={contacts}
            setContacts={setContacts}
            errors={errors}
          />
          <AdditionalInfo client={client} setClient={setClient} />
        </div>
      </div>
    </Default>
  );
}
