/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { GenericSelectorProps } from 'common/interfaces/generic-selector-props';
import { Vendor } from 'common/interfaces/vendor';
import { DebouncedCombobox, Record } from 'components/forms/DebouncedCombobox';
import { CreateVendorModal } from 'pages/vendors/components/CreateVendorModal';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface VendorSelectorProps extends GenericSelectorProps<Vendor> {
  initiallyVisible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
}

export function VendorSelector(props: VendorSelectorProps) {
  const [t] = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateVendorModal
        visible={props.initiallyVisible || isModalOpen}
        setVisible={props.setVisible || setIsModalOpen}
        setSelectedIds={props.setSelectedIds}
      />

      {!props.setSelectedIds && (
        <DebouncedCombobox
          {...props}
          value="id"
          endpoint="/api/v1/vendors"
          label="name"
          defaultValue={props.value}
          onChange={(value: Record<Vendor>) =>
            value.resource && props.onChange(value.resource)
          }
          actionLabel={t('new_vendor')}
          onActionClick={() => setIsModalOpen(true)}
          disabled={props.readonly}
        />
      )}
    </>
  );
}
