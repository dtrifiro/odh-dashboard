import * as React from 'react';
import { EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { Table } from '~/components/table';
import { PodToleration } from '~/types';
import { columns } from './const';
import TolerationRow from './TolerationRow';
import ManageTolerationModal from './ManageTolerationModal';

type TolerationTableProps = {
  tolerations: PodToleration[];
  onUpdate: (tolerations: PodToleration[]) => void;
};

export const TolerationsTable: React.FC<TolerationTableProps> = ({ tolerations, onUpdate }) => {
  const [editToleration, setEditToleration] = React.useState<PodToleration | undefined>();
  const [currentIndex, setCurrentIndex] = React.useState<number | undefined>();

  if (tolerations.length === 0) {
    return (
      <EmptyState variant="xs" data-testid="tolerations-modal-empty-state">
        <EmptyStateIcon icon={PlusCircleIcon} />
        <Title headingLevel="h2" size="lg">
          No tolerations
        </Title>
        <EmptyStateBody>
          Tolerations are applied to pods and allow the scheduler to schedule pods with matching
          taints.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <>
      <Table
        data={tolerations}
        columns={columns}
        rowRenderer={(toleration, rowIndex) => (
          <TolerationRow
            key={toleration.key + rowIndex}
            toleration={toleration}
            onEdit={(toleration) => {
              setEditToleration(toleration);
              setCurrentIndex(rowIndex);
            }}
            onDelete={() => {
              const updatedTolerations = [...tolerations];
              updatedTolerations.splice(rowIndex, 1);
              onUpdate(updatedTolerations);
            }}
          />
        )}
      />
      <ManageTolerationModal
        isOpen={!!editToleration}
        initialToleration={editToleration}
        onClose={() => {
          setEditToleration(undefined);
          setCurrentIndex(undefined);
        }}
        onSave={(toleration) => {
          if (currentIndex !== undefined) {
            const updatedTolerations = [...tolerations];
            updatedTolerations[currentIndex] = toleration;
            onUpdate(updatedTolerations);
          }
        }}
      />
    </>
  );
};
