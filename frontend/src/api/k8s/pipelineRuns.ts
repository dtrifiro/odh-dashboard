import { k8sListResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunKind } from '~/k8sTypes';
import { PipelineRunModel } from '~/api/models';

export const listK8sPipelineRunsByLabel = async (
  namespace: string,
  label: string,
): Promise<PipelineRunKind[]> =>
  k8sListResource<PipelineRunKind>({
    model: PipelineRunModel,
    queryOptions: {
      ns: namespace,
      queryParams: { labelSelector: label },
    },
  }).then((listResource) => listResource.items);
