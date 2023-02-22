import { AddressInput, DropdownInput, TimeInput, TextInput, TokenAmountInput, TokenInput } from '@/lib/components/base/Inputs';
import { PageLayout } from '@/lib/components/page';
import { AGREEMENT_TEMPLATE } from '@/lib/constants/agreement';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { Box, Button, Checkbox, Grid, GridItem, GridProps, Heading, HStack, Spacer, Stack, Text, Textarea } from '@chakra-ui/react';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const CREATE_AGREEMENT_STEPS = ['service-provider', 'client', 'services', 'compensation', 'conditions', 'review'] as const;
type Steps = typeof CREATE_AGREEMENT_STEPS[number];

export const Ellipsis = () => (
    <Text fontSize={'3xl'} color="gray.600" w="100%" textAlign={'center'} pt="6" pb="12">
        . . .
    </Text>
);

const CreateAgreementGrid = ({ children, ...overrides }: { children: React.ReactNode } & GridProps) => (
    <Grid templateColumns={'1fr 2fr'} columnGap="28" rowGap={8} {...overrides}>
        {children}
    </Grid>
);

export const ServiceProvider = () => {
    const [spData] = AGREEMENT_TEMPLATE.steps;
    const web3 = useWeb3();
    return (
        <CreateAgreementGrid>
            <Box>
                <Heading size="xl">Parties</Heading>
                <Box h="4" />
                <Heading size="md">Service Provider</Heading>
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
                <TextInput {...spData.fields[2]} text="" setText={console.log} />
            </Stack>
        </CreateAgreementGrid>
    );
};

export const Client = () => {
    const [, clientData] = AGREEMENT_TEMPLATE.steps;
    return (
        <CreateAgreementGrid>
            <Box>
                <Heading size="xl">Parties</Heading>
                <Box h="4" />
                <Heading size="md">Client</Heading>
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
                <TextInput {...clientData.fields[2]} text="" setText={console.log} />
                <AddressInput label="Address" address="" setAddress={console.log} />
            </Stack>
        </CreateAgreementGrid>
    );
};

export const Services = () => {
    const [, , services] = AGREEMENT_TEMPLATE.steps;
    return (
        <CreateAgreementGrid>
            <Box>
                <Heading size="xl">Services</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{services.headerText}</Text>
                <Textarea {...services.fields[0]} value="" rows={15} onChange={console.log} />
            </Stack>
        </CreateAgreementGrid>
    );
};

export const Compensation = () => {
    const [, , , compensation] = AGREEMENT_TEMPLATE.steps;
    return (
        <CreateAgreementGrid>
            <Box>
                <Heading size="xl">Compensation</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{compensation.headerText}</Text>
                <DropdownInput
                    {...compensation.fields[0]}
                    value=""
                    options={compensation.fields[0].options.map(opt => opt.label)}
                    setValue={console.log}
                />
                <TokenInput {...compensation.fields[1]} address="" setAddress={console.log} />
                <TokenAmountInput {...compensation.fields[2]} amount="" setAmount={console.log} tokenDecimals={18} tokenSymbol={'WETH'} />
                <TimeInput {...compensation.fields[3]} setTime={console.log} />
            </Stack>
        </CreateAgreementGrid>
    );
};

export const TerminationConditions = () => {
    const [
        ,
        ,
        ,
        ,
        {
            headerText,
            fields: [mutualConsent, materialBreach, atWill, rageTerminate],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <CreateAgreementGrid rowGap={8}>
            <Heading size="xl" alignSelf={'center'}>
                Termination Conditions
            </Heading>
            <Text fontSize={'18px'}>{headerText}</Text>

            <HStack justifySelf={'self-end'}>
                <Checkbox />
                <Text fontSize={'20px'} fontWeight="bold">
                    {mutualConsent.label}
                    {/* TODO: form control? */}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{mutualConsent.explaination}</Text>

            <HStack justifySelf={'self-end'}>
                <Checkbox />
                <Text fontSize={'20px'} fontWeight="bold">
                    {materialBreach.label}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{materialBreach.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...materialBreach.additionalFields[0]} setTime={console.log} />
            </GridItem>

            <HStack justifySelf={'self-end'}>
                <Checkbox />
                <Text fontSize={'20px'} fontWeight="bold">
                    {atWill.label}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{atWill.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...atWill.additionalFields[0]} setTime={console.log} />
            </GridItem>
            <HStack justifySelf={'self-end'}>
                <Checkbox />
                <Text fontSize={'20px'} fontWeight="bold">
                    {rageTerminate.label}
                </Text>
            </HStack>

            <Text fontSize={'18px'}>{rageTerminate.explaination}</Text>
            <Stack spacing="6" as={GridItem} gridColumnStart={2}>
                <HStack alignItems={'center'}>
                    <Checkbox />
                    <Text fontSize={'18px'}>{rageTerminate.additionalFields[0].explaination}</Text>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox />
                    <Text fontSize={'18px'}>{rageTerminate.additionalFields[1].explaination}</Text>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox />
                    <Text fontSize={'18px'}>{rageTerminate.additionalFields[2].explaination}</Text>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox />
                    <Text fontSize={'18px'}>{rageTerminate.additionalFields[3].explaination}</Text>
                </HStack>
            </Stack>
        </CreateAgreementGrid>
    );
};

export default function Dashboard() {
    const web3 = useWeb3();
    const router = useRouter();
    const step = router.query['create-step'] as Steps | undefined;
    const stepI = step ? CREATE_AGREEMENT_STEPS.indexOf(step) : undefined;

    useEffect(() => {
        // if (!isWeb3Connected(web3)) router.push('/login');
    }, [web3]);

    return (
        <PageLayout>
            <Box h="8" />
            <Stack>
                <HStack>
                    <Heading size="2xl">{step === 'review' ? 'Review ' : ''}Agreement</Heading>
                    <Spacer />
                </HStack>
                <Box h="12" />
                <Box maxW={'866px'} alignSelf="center">
                    {step === 'service-provider' && <ServiceProvider />}
                    {step === 'client' && <Client />}
                    {step === 'services' && <Services />}
                    {step === 'compensation' && <Compensation />}
                    {step === 'conditions' && <TerminationConditions />}
                    {step !== 'review' && stepI && (
                        <>
                            <Box h="4" />
                            <Stack>
                                <Link href={`/app/create/${CREATE_AGREEMENT_STEPS[stepI + 1]}`}>
                                    <Button w="100%">Save {step}</Button>
                                </Link>
                                <Link href={stepI == 0 ? '/app' : CREATE_AGREEMENT_STEPS[stepI - 1]}>
                                    <Button variant={'outline'} w="100%">
                                        Cancel
                                    </Button>
                                </Link>
                            </Stack>
                        </>
                    )}

                    {step === 'review' && (
                        <Stack>
                            <ServiceProvider />
                            <Ellipsis />
                            <Client />
                            <Ellipsis />
                            <Services />
                            <Ellipsis />
                            <Compensation />
                            <Ellipsis />
                            <TerminationConditions />

                            <Box h='12' />
                            <CreateAgreementGrid>
                                <Heading size="xl" alignSelf={'center'}>
                                    Preview Agreement
                                </Heading>
                                <Text fontSize={'18px'}>{AGREEMENT_TEMPLATE.previewText}</Text>
                            </CreateAgreementGrid>
                        </Stack>
                    )}
                </Box>
            </Stack>
        </PageLayout>
    );
}
