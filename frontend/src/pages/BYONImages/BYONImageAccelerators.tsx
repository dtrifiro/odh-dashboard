import {
  Spinner,
  LabelGroup,
  Label,
  StackItem,
  Stack,
  Tooltip,
  Button,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { BYONImage } from '~/types';
import { AcceleratorKind } from '~/k8sTypes';
import { FetchState } from '~/utilities/useFetchState';

type BYONImageAcceleratorsProps = {
  image: BYONImage;
  acceleratorProfiles: FetchState<AcceleratorKind[]>;
};

export const BYONImageAccelerators: React.FC<BYONImageAcceleratorsProps> = ({
  image,
  acceleratorProfiles,
}) => {
  const [data, loaded, loadError] = acceleratorProfiles;

  const recommendedAcceleratorProfiles = data.filter((accelerator) =>
    image.recommendedAcceleratorIdentifiers?.includes(accelerator.spec.identifier),
  );
  if (loadError) {
    return <>{'-'}</>;
  }

  if (!loaded) {
    return <Spinner size="sm" />;
  }

  return (
    <Stack>
      {recommendedAcceleratorProfiles.length > 0 && (
        <StackItem>
          <LabelGroup isCompact>
            {recommendedAcceleratorProfiles.map((cr) => (
              <Label key={cr.metadata.name} color="blue" variant="filled" isTruncated isCompact>
                {cr.spec.displayName}
              </Label>
            ))}
          </LabelGroup>
        </StackItem>
      )}
      <StackItem>
        {image.recommendedAcceleratorIdentifiers?.length > 0 ? (
          <Tooltip
            content={`This image is compatible with accelerators with the identifier ${image.recommendedAcceleratorIdentifiers.join(
              ', ',
            )}.`}
          >
            <Label
              color="blue"
              variant="outline"
              render={({ className, content }) => (
                <Link
                  to={
                    '/acceleratorProfiles/create?' +
                    new URLSearchParams({
                      identifiers: image.recommendedAcceleratorIdentifiers.join(','),
                    }).toString()
                  }
                  className={className}
                >
                  {content}
                </Link>
              )}
              isCompact
              icon={<PlusIcon />}
            >
              Create profile
            </Label>
          </Tooltip>
        ) : (
          <Tooltip content="To create an accelerator profile for this image, edit it to include an accelerator identifier.">
            <Button
              isAriaDisabled
              variant="link"
              className="pf-u-font-size-xs"
              isInline
              icon={<PlusIcon />}
            >
              Create profile
            </Button>
          </Tooltip>
        )}
      </StackItem>
    </Stack>
  );
};
