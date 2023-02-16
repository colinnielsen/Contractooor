import { ChainID, NETWORKS } from '@/lib/constants/networks';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { IconButton, Link } from '@chakra-ui/react';

export const ViewSafeButton = ({ chainId, safeAddress }: { chainId: ChainID; safeAddress: string }) => {
    return (
        <IconButton
            aria-label="inspect address"
            as={Link}
            icon={<ExternalLinkIcon />}
            mt="-4px"
            href={NETWORKS[chainId].safeLink + safeAddress}
            isExternal
            variant="ghost"
            size="xs"
        />
    );
};
