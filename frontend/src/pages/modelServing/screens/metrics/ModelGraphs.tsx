import * as React from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import MetricsChart from '~/pages/modelServing/screens/metrics/MetricsChart';
import {
  ModelMetricType,
  ModelServingMetricsContext,
} from '~/pages/modelServing/screens/metrics/ModelServingMetricsContext';
import { ContextResourceData, PrometheusQueryRangeResultValue } from '~/types';
import { SUCCESS_FAIL_CHART_THEME } from '~/pages/modelServing/screens/metrics/const';
import { per100 } from './utils';

const ModelGraphs: React.FC = () => {
  const { data } = React.useContext(ModelServingMetricsContext);

  return (
    <Stack hasGutter>
      <StackItem>
        <MetricsChart
          metrics={[
            {
              name: 'Successful',
              metric: data[
                ModelMetricType.REQUEST_COUNT_SUCCESS
              ] as ContextResourceData<PrometheusQueryRangeResultValue>,
              translatePoint: per100,
            },
            {
              name: 'Failed',
              metric: data[
                ModelMetricType.REQUEST_COUNT_FAILED
              ] as ContextResourceData<PrometheusQueryRangeResultValue>,
              translatePoint: per100,
            },
          ]}
          title="Http requests (x100)"
          theme={SUCCESS_FAIL_CHART_THEME}
        />
      </StackItem>
    </Stack>
  );
};

export default ModelGraphs;