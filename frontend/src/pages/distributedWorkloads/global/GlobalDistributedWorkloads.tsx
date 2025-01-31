import * as React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { byName, ProjectsContext } from '~/concepts/projects/ProjectsContext';
import InvalidProject from '~/concepts/projects/InvalidProject';
import ApplicationsPage from '~/pages/ApplicationsPage';
import { DistributedWorkloadsContextProvider } from '~/concepts/distributedWorkloads/DistributedWorkloadsContext';
import { DistributedWorkloadsTabConfig } from '~/pages/distributedWorkloads/global/useDistributedWorkloadsTabs';
import DistributedWorkloadsNoProjects from '~/pages/distributedWorkloads/global/DistributedWorkloadsNoProjects';
import GlobalDistributedWorkloadsTabs from '~/pages/distributedWorkloads/global/GlobalDistributedWorkloadsTabs';

const title = 'Workload Metrics';
const description = 'Monitor the metrics of your active resources.';

type GlobalDistributedWorkloadsProps = {
  activeTab: DistributedWorkloadsTabConfig;
  getInvalidRedirectPath: (namespace: string) => string;
};

const GlobalDistributedWorkloads: React.FC<GlobalDistributedWorkloadsProps> = ({
  activeTab,
  getInvalidRedirectPath,
}) => {
  const { namespace } = useParams<{ namespace: string }>();
  const { projects, preferredProject } = React.useContext(ProjectsContext);

  if (projects.length === 0) {
    return (
      <ApplicationsPage
        {...{ title, description }}
        loaded
        empty
        emptyStatePage={<DistributedWorkloadsNoProjects />}
      />
    );
  }

  if (activeTab.projectSelectorMode !== null) {
    if (!namespace && (activeTab.projectSelectorMode === 'singleProjectOnly' || preferredProject)) {
      // No namespace is in the path and either this tab requires one or we have a preferred one to go to
      const redirectProject = preferredProject ?? projects[0];
      return <Navigate to={getInvalidRedirectPath(redirectProject.metadata.name)} replace />;
    }
    if (namespace && !projects.find(byName(namespace))) {
      // This tab allows or requires a namespace but was given an invalid one.
      return (
        <ApplicationsPage
          {...{ title, description }}
          loaded
          empty
          emptyStatePage={
            <InvalidProject namespace={namespace} getRedirectPath={getInvalidRedirectPath} />
          }
        />
      );
    }
  }

  // We're all good, either no namespace is required or we have a valid one
  return (
    <ApplicationsPage {...{ title, description }} loaded empty={false}>
      <DistributedWorkloadsContextProvider namespace={namespace}>
        <GlobalDistributedWorkloadsTabs activeTabId={activeTab.id} />
      </DistributedWorkloadsContextProvider>
    </ApplicationsPage>
  );
};

export default GlobalDistributedWorkloads;
