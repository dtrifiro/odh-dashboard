import React, { useEffect, useState } from 'react';
import { Modal, Form } from '@patternfly/react-core';
import { PodToleration } from '~/types';
import DashboardModalFooter from '~/concepts/dashboard/DashboardModalFooter';
import TolerationFields from './TolerationFields';
import { EMPTY_TOLERATION } from './const';

type ManageTolerationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialToleration?: PodToleration;
  onSave: (toleration: PodToleration) => void;
};

const ManageTolerationModal: React.FC<ManageTolerationModalProps> = ({
  isOpen,
  onClose,
  initialToleration,
  onSave,
}) => {
  const [toleration, setToleration] = useState<PodToleration>(EMPTY_TOLERATION);

  const isButtonDisabled = !toleration.key;

  useEffect(() => {
    if (initialToleration) {
      setToleration(initialToleration);
    }
  }, [initialToleration]);

  const handleUpdate = (updatedToleration: PodToleration) => {
    setToleration(updatedToleration);
  };

  const onBeforeClose = () => {
    setToleration(EMPTY_TOLERATION);
    onClose();
  };

  return (
    <Modal
      title={initialToleration ? 'Edit toleration' : 'Add toleration'}
      variant="medium"
      isOpen={isOpen}
      onClose={() => {
        onBeforeClose();
      }}
      footer={
        <DashboardModalFooter
          submitLabel={initialToleration ? 'Update' : 'Add'}
          onSubmit={() => {
            onSave(toleration);
            onBeforeClose();
          }}
          onCancel={() => onBeforeClose()}
          isSubmitDisabled={isButtonDisabled}
          alertTitle="Error saving toleration"
        />
      }
    >
      <Form>
        <TolerationFields toleration={toleration} onUpdate={handleUpdate} />
      </Form>
    </Modal>
  );
};

export default ManageTolerationModal;
