import { KubeFastifyInstance, AcceleratorKind } from '../../../types';
import { FastifyRequest } from 'fastify';
import createError from 'http-errors';
import { translateDisplayNameForK8s } from '../../../utils/resourceUtils';

export const postAcceleratorProfile = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<{ success: boolean; error: string }> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  const body = request.body as AcceleratorKind['spec'];

  const payload: AcceleratorKind = {
    apiVersion: 'dashboard.opendatahub.io/v1',
    kind: 'AcceleratorProfile',
    metadata: {
      name: translateDisplayNameForK8s(body.displayName),
      namespace: namespace,
      annotations: {
        'opendatahub.io/modified-date': new Date().toISOString(),
      },
    },
    spec: body,
  };

  try {
    await customObjectsApi
      .createNamespacedCustomObject(
        'dashboard.opendatahub.io',
        'v1',
        namespace,
        'acceleratorprofiles',
        payload,
      )
      .catch((e) => {
        throw createError(e.statusCode, e?.body?.message);
      });
    return { success: true, error: null };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error(e, 'Unable to add accelerator profile.');
      return { success: false, error: 'Unable to add accelerator profile: ' + e.message };
    }
    throw e;
  }
};

export const deleteAcceleratorProfile = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<{ success: boolean; error: string }> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  const params = request.params as { acceleratorProfileName: string };

  try {
    await customObjectsApi
      .deleteNamespacedCustomObject(
        'dashboard.opendatahub.io',
        'v1',
        namespace,
        'acceleratorprofiles',
        params.acceleratorProfileName,
      )
      .catch((e) => {
        throw createError(e.statusCode, e?.body?.message);
      });
    return { success: true, error: null };
  } catch (e) {
    if (e.response?.statusCode === 404) {
      fastify.log.error(e, 'Unable to delete accelerator profile.');
      return { success: false, error: 'Unable to delete accelerator profile: ' + e.message };
    }
    throw e;
  }
};

export const updateAcceleratorProfile = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<{ success: boolean; error: string }> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  const params = request.params as { acceleratorProfileName: string };
  const body = request.body as Partial<AcceleratorKind['spec']>;

  try {
    const currentProfile = await customObjectsApi
      .getNamespacedCustomObject(
        'dashboard.opendatahub.io',
        'v1',
        namespace,
        'acceleratorprofiles',
        params.acceleratorProfileName,
      )
      .then((r) => r.body as AcceleratorKind)
      .catch((e) => {
        throw createError(e.statusCode, e?.body?.message);
      });

    if (body.displayName !== undefined) {
      currentProfile.spec.displayName = body.displayName;
    }
    if (body.enabled !== undefined) {
      currentProfile.spec.enabled = body.enabled;
    }
    if (body.identifier !== undefined) {
      currentProfile.spec.identifier = body.identifier;
    }
    if (body.description !== undefined) {
      currentProfile.spec.description = body.description;
    }
    if (body.tolerations !== undefined) {
      currentProfile.spec.tolerations = body.tolerations;
    }

    // Update the modified date annotation
    if (!currentProfile.metadata.annotations) {
      currentProfile.metadata.annotations = {};
    }
    currentProfile.metadata.annotations['opendatahub.io/modified-date'] = new Date().toISOString();

    await customObjectsApi
      .patchNamespacedCustomObject(
        'dashboard.opendatahub.io',
        'v1',
        namespace,
        'acceleratorprofiles',
        params.acceleratorProfileName,
        currentProfile,
        undefined,
        undefined,
        undefined,
        {
          headers: { 'Content-Type': 'application/merge-patch+json' },
        },
      )
      .catch((e) => {
        throw createError(e.statusCode, e?.body?.message);
      });
    return { success: true, error: null };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error(e, 'Unable to update accelerator profile.');
      return { success: false, error: 'Unable to update accelerator profile: ' + e.message };
    }
    throw e;
  }
};
