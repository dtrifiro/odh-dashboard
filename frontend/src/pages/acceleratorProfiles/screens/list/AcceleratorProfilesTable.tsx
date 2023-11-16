import * as React from 'react';
import { Button, ToolbarItem } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import DashboardSearchField, { SearchType } from '~/concepts/dashboard/DashboardSearchField';
import DashboardEmptyTableView from '~/concepts/dashboard/DashboardEmptyTableView';
import { Table } from '~/components/table';
import AcceleratorProfilesTableRow from '~/pages/acceleratorProfiles/screens/list/AcceleratorProfilesTableRow';
import { AcceleratorKind } from '~/k8sTypes';
import { columns } from '~/pages/acceleratorProfiles/screens/list/const';
import DeleteAcceleratorProfileModal from './DeleteAcceleratorProfileModal';

type AcceleratorProfilesTableProps = {
  acceleratorProfiles: AcceleratorKind[];
  refreshAcceleratorProfiles: () => void;
};

const AcceleratorProfilesTable: React.FC<AcceleratorProfilesTableProps> = ({
  acceleratorProfiles,
  refreshAcceleratorProfiles,
}) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = React.useState<SearchType>(SearchType.NAME);
  const [search, setSearch] = React.useState('');
  const [deleteAcceleratorProfile, setDeleteAcceleratorProfile] = React.useState<
    AcceleratorKind | undefined
  >();
  const filteredAcceleratorProfiles = acceleratorProfiles.filter((accelerator) => {
    if (!search) {
      return true;
    }

    switch (searchType) {
      case SearchType.NAME:
        return accelerator.spec.displayName.toLowerCase().includes(search.toLowerCase());
      case SearchType.IDENTIFIER:
        return accelerator.spec.identifier.toLowerCase().includes(search.toLowerCase());
      default:
        return true;
    }
  });

  const searchTypes = React.useMemo(() => [SearchType.NAME, SearchType.IDENTIFIER], []);

  return (
    <>
      <Table
        id="accelerator-profile-table"
        enablePagination
        data={filteredAcceleratorProfiles}
        columns={columns}
        emptyTableView={<DashboardEmptyTableView onClearFilters={() => setSearch('')} />}
        rowRenderer={(accelerator) => (
          <AcceleratorProfilesTableRow
            key={accelerator.metadata.name}
            accelerator={accelerator}
            handleDelete={(acceleratorProfile) => setDeleteAcceleratorProfile(acceleratorProfile)}
          />
        )}
        toolbarContent={
          <>
            <ToolbarItem>
              <DashboardSearchField
                types={searchTypes}
                searchType={searchType}
                searchValue={search}
                onSearchTypeChange={(searchType) => {
                  setSearchType(searchType);
                }}
                onSearchValueChange={(searchValue) => {
                  setSearch(searchValue);
                }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                data-id="create-accelerator-profile"
                onClick={() => navigate(`/acceleratorProfiles/create`)}
              >
                Create accelerator profile
              </Button>
            </ToolbarItem>
          </>
        }
      />
      <DeleteAcceleratorProfileModal
        acceleratorProfile={deleteAcceleratorProfile}
        onClose={(deleted) => {
          if (deleted) {
            refreshAcceleratorProfiles();
          }
          setDeleteAcceleratorProfile(undefined);
        }}
      />
    </>
  );
};

export default AcceleratorProfilesTable;
