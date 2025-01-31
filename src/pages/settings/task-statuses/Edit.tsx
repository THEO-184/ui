/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, CardContainer, Element } from '@invoiceninja/cards';
import { InputField, InputLabel } from '@invoiceninja/forms';
import { AxiosError } from 'axios';
import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { route } from 'common/helpers/route';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { useTaskStatusQuery } from 'common/queries/task-statuses';
import { Badge } from 'components/Badge';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Container } from 'components/Container';
import { ColorPicker } from 'components/forms/ColorPicker';
import { Settings } from 'components/layouts/Settings';
import { Spinner } from 'components/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Archive } from './components/edit/Archive';
import { Delete } from './components/edit/Delete';
import { Restore } from './components/edit/Restore';

export function Edit() {
  const [t] = useTranslation();
  const { id } = useParams();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('task_settings'), href: '/settings/task_settings' },
    {
      name: t('edit_task_status'),
      href: route('/settings/task_statuses/:id/edit', { id }),
    },
  ];

  const { data } = useTaskStatusQuery({ id });

  const [errors, setErrors] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = `${import.meta.env.VITE_APP_TITLE}: ${
      data?.data.data.name
    }`;
  }, [data]);

  const invalidateTaskStatusCache = () => {
    queryClient.invalidateQueries(route('/api/v1/task_statuses/:id', { id }));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.data.data.name || '',
      color: data?.data.data.color || '',
    },
    onSubmit: (values) => {
      setErrors({});

      request('PUT', endpoint('/api/v1/task_statuses/:id', { id }), values)
        .then(() => {
          toast.dismiss();
          toast.success(t('updated_task_status'));
        })
        .catch((error: AxiosError<ValidationBag>) => {
          console.error(error);
          toast.dismiss();

          error.response?.status === 422
            ? setErrors(error.response.data)
            : toast.error(t('error_title'));
        })
        .finally(() => {
          formik.setSubmitting(false);
          invalidateTaskStatusCache();
        });
    },
  });

  return (
    <Settings title={t('task_statuses')}>
      {!data && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {data && (
        <Container className="space-y-6">
          <Breadcrumbs pages={pages} />

          <Card
            withSaveButton
            disableSubmitButton={formik.isSubmitting}
            onFormSubmit={formik.handleSubmit}
            title={data?.data.data.name}
          >
            <Element leftSide={t('status')}>
              {!data.data.data.is_deleted && !data.data.data.archived_at && (
                <Badge variant="primary">{t('active')}</Badge>
              )}

              {data.data.data.archived_at && !data.data.data.is_deleted ? (
                <Badge variant="yellow">{t('archived')}</Badge>
              ) : null}

              {data.data.data.is_deleted && (
                <Badge variant="red">{t('deleted')}</Badge>
              )}
            </Element>

            <CardContainer>
              <InputField
                type="text"
                id="name"
                label={t('name')}
                errorMessage={errors?.errors?.name}
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />

              <InputLabel>{t('color')}</InputLabel>

              <ColorPicker
                value={formik.values.color}
                onValueChange={(color) => formik.setFieldValue('color', color)}
              />
            </CardContainer>
          </Card>

          <Archive />
          <Restore />
          <Delete />
        </Container>
      )}
    </Settings>
  );
}
