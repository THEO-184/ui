/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from "classnames";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import CommonProps from "../../common/interfaces/common-props.interface";
import { RootState } from "../../common/stores/store";

interface Props extends CommonProps {
  children?: ReactNode;
  variant?: "block";
}

export function Button(props: Props) {
  const colors = useSelector((state: RootState) => state.settings.colors);

  return (
    <button
      className={classNames(`py-2 px-3 text-white rounded ${props.className}`, {
        "w-full": props.variant === "block",
        [`bg-${colors.primary}`]: colors.isClass,
      })}
    >
      {props.children}
    </button>
  );
}