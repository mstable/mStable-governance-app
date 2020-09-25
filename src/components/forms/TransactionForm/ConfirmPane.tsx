import React, { FC, useCallback } from 'react';
import { useSendTransaction } from '../../../context/TransactionsProvider';
import { SubmitButton } from '../../core/Form';
import {
  useFormId,
  useFormSubmitting,
  useManifest,
  useSubmitEnd,
  useSubmitStart,
} from './FormProvider';

interface Props {
  confirmLabel: JSX.Element | string;
  valid: boolean;
  compact?: boolean;
}

export const ConfirmPane: FC<Props> = ({ children, confirmLabel, valid }) => {
  const sendTransaction = useSendTransaction();
  const manifest = useManifest();
  const submitting = useFormSubmitting();
  const submitStart = useSubmitStart();
  const submitEnd = useSubmitEnd();
  const formId = useFormId();

  const handleSend = useCallback(() => {
    if (valid && manifest) {
      submitStart();
      sendTransaction({ ...manifest, formId, onSent: submitEnd });
    }
  }, [formId, manifest, sendTransaction, submitEnd, submitStart, valid]);

  return (
    <div>
      <>
        <div>{children}</div>
        <SubmitButton
          type="button"
          onClick={handleSend}
          disabled={submitting || !valid}
        >
          {confirmLabel}
        </SubmitButton>
      </>
    </div>
  );
};
