import * as React from 'react';
import { DashboardConfigKind } from '~/k8sTypes';
import { BuildStatus } from '~/types';
import { StorageClassKind } from '~/k8sTypes';

type AppContextProps = {
  buildStatuses: BuildStatus[];
  dashboardConfig: DashboardConfigKind;
  storageClasses: StorageClassKind[];
};

const defaultAppContext: AppContextProps = {
  buildStatuses: [],
  // At runtime dashboardConfig is never null -- DO NOT DO THIS usually
  dashboardConfig: null as unknown as DashboardConfigKind,
  storageClasses: [] as StorageClassKind[],
};

export const AppContext = React.createContext(defaultAppContext);

export const useAppContext = (): AppContextProps => React.useContext(AppContext);
