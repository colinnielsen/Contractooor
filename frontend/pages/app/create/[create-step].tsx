import { PageLayout } from '@/lib/components/page';
import { AGREEMENT_TEMPLATE } from '@/lib/constants/agreement';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Grid,
    Heading,
    HStack,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Stack,
    Text,
} from '@chakra-ui/react';
import { isAddress } from 'ethers/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const CREATE_AGREEMENT_STEPS = ['service-provider', 'client', 'services', 'compensation'] as const;
type Steps = typeof CREATE_AGREEMENT_STEPS[number];

export const AddressInput = ({
    label,
    address,
    setAddress,
    defaultValue,
    placeholder,
}: {
    label: string;
    address: string;
    setAddress: (addr: string) => void;
    defaultValue?: string;
    placeholder?: string;
}) => {
    const isError = address ? !isAddress(address) : false;

    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={placeholder ?? '0x...'} value={address ? address : defaultValue} onChange={e => setAddress(e.target.value)} />
            {isError && <FormErrorMessage>Invalid</FormErrorMessage>}
        </FormControl>
    );
};

export const TextInput = ({
    label,
    text,
    setText,
    defaultValue,
    placeholder,
}: {
    label: string;
    text: string;
    setText: (text: string) => void;
    defaultValue?: string;
    placeholder?: string;
}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={placeholder} defaultValue={defaultValue} value={text} onChange={e => setText(e.target.value)} />
        </FormControl>
    );
};

export const DropdownInput = ({
    label,
    options,
    value,
    setValue,
    placeholder,
}: {
    label: string;
    options: string[];
    value: string | undefined;
    setValue: (val: string) => void;
    placeholder?: string;
}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Menu matchWidth>
                <MenuButton width={'100%'} as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                    {value ? value : placeholder}
                </MenuButton>
                <MenuList>
                    {options.map((opt, i) => (
                        <MenuItem key={i} onClick={() => setValue(opt)}>
                            {opt}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </FormControl>
    );
};

export const ServiceProvider = () => {
    const [spData] = AGREEMENT_TEMPLATE.steps;
    const web3 = useWeb3();
    return (
        <Grid templateColumns={'1fr 2fr'}>
            <Box>
                <Heading size="md">Parties</Heading>
                <Box h="4" />
                <Heading size="sm">Service Provider</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{spData.headerText}</Text>
                <TextInput {...spData.fields[0]} text="" setText={console.log} />
                <DropdownInput
                    {...spData.fields[1]}
                    value=""
                    options={spData.fields[1].options.map(opt => opt.label)}
                    setValue={console.log}
                />
                {isWeb3Connected(web3) && (
                    <AddressInput label="Address" address="" setAddress={console.log} defaultValue={web3.walletConnection.address} />
                )}
                <Box h="4" />
                <Stack>
                    <Link href={`/app/create/${CREATE_AGREEMENT_STEPS[1]}`}>
                        <Button w="100%">Save Service Provider</Button>
                    </Link>
                    <Link href="/app">
                        <Button variant={'outline'} w="100%">
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Grid>
    );
};

export const Client = () => {
    const [, clientData] = AGREEMENT_TEMPLATE.steps;
    const web3 = useWeb3();
    return (
        <Grid templateColumns={'1fr 2fr'}>
            <Box>
                <Heading size="md">Parties</Heading>
                <Box h="4" />
                <Heading size="sm">Service Provider</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{clientData.headerText}</Text>
                <TextInput {...clientData.fields[0]} text="" setText={console.log} />
                <DropdownInput
                    {...clientData.fields[1]}
                    value=""
                    options={clientData.fields[1].options.map(opt => opt.label)}
                    setValue={console.log}
                />
                <AddressInput label="Address" address="" setAddress={console.log} />
                <Box h="4" />
                <Stack>
                    <Link href={`/app/create/${CREATE_AGREEMENT_STEPS[1]}`}>
                        <Button w="100%">Save Client</Button>
                    </Link>
                    <Link href="/app">
                        <Button variant={'outline'} w="100%">
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Grid>
    );
};

export default function Dashboard() {
    const web3 = useWeb3();
    const router = useRouter();
    const step = router.query['create-step'] as Steps | undefined;

    useEffect(() => {
        // if (!isWeb3Connected(web3)) router.push('/login');
    }, [web3]);

    return (
        <PageLayout>
            <Box h="8" />
            <Stack>
                <HStack>
                    <Heading>Agreement</Heading>
                    <Spacer />
                </HStack>
                <Box h="12" />
                {step === 'service-provider' && <ServiceProvider />}
                {step === 'client' && <Client />}
            </Stack>
        </PageLayout>
    );
}
