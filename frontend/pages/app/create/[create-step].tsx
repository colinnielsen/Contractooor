import {
    AddressInput,
    DropdownInput,
    TimeInput,
    TextInput,
    TokenAmountInput,
    TokenInput,
    DebounceCache,
} from '@/lib/components/base/Inputs';
import { PageLayout } from '@/lib/components/page';
import { AGREEMENT_TEMPLATE, CREATE_AGREEMENT_FORM, IDS, Mutable } from '@/lib/constants/agreement';
import { generateDoc, useLocalStorage } from '@/lib/helpers';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import {
    Box,
    Button,
    Center,
    Checkbox,
    Grid,
    GridItem,
    GridProps,
    Heading,
    HStack,
    Spacer,
    Spinner,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, FormikProps, useFormikContext } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';

export const CREATE_AGREEMENT_STEPS = ['service-provider', 'client', 'services', 'compensation', 'conditions', 'review'] as const;
type Steps = typeof CREATE_AGREEMENT_STEPS[number];

export const Ellipsis = () => (
    <Text fontSize={'3xl'} color="gray.600" w="100%" textAlign={'center'} pt="6" pb="12" as={GridItem} colSpan={2}>
        . . .
    </Text>
);

export const CreateAgreementGrid = ({ children, ...overrides }: { children: React.ReactNode } & GridProps) => (
    <Grid templateColumns={'1fr 2fr'} columnGap="28" rowGap={8} {...overrides}>
        {children}
    </Grid>
);

export const ServiceProvider = ({ formik }: { formik: FormikProps<typeof CREATE_AGREEMENT_FORM> }) => {
    const [
        {
            headerText,
            label,
            fields: [legalName, legalStructure, jurisdiction, address],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <>
            <Box>
                <Heading size="xl">Parties</Heading>
                <Box h="4" />
                <Heading size="md">{label}</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{headerText}</Text>
                <TextInput {...legalName} {...formik.getFieldProps(legalName.id)} />
                <DropdownInput
                    {...legalStructure}
                    {...formik.getFieldProps(legalStructure.id)}
                    options={legalStructure.options as Mutable<typeof legalStructure['options']>}
                />
                <TextInput {...jurisdiction} {...formik.getFieldProps(jurisdiction.id)} />
                <AddressInput {...address} {...formik.getFieldProps(address.id)} />
            </Stack>
        </>
    );
};

export const Client = ({ formik }: { formik: FormikProps<typeof CREATE_AGREEMENT_FORM> }) => {
    const [
        ,
        {
            headerText,
            label,
            fields: [legalName, legalStructure, jurisdiction, address],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <>
            <Box>
                <Heading size="xl">Parties</Heading>
                <Box h="4" />
                <Heading size="md">{label}</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{headerText}</Text>
                <TextInput {...legalName} {...formik.getFieldProps(legalName.id)} />
                <DropdownInput
                    {...legalStructure}
                    {...formik.getFieldProps(legalStructure.id)}
                    options={legalStructure.options as Mutable<typeof legalStructure['options']>}
                />
                <TextInput {...jurisdiction} {...formik.getFieldProps(jurisdiction.id)} />
                <AddressInput {...address} {...formik.getFieldProps(address.id)} />
            </Stack>
        </>
    );
};

export const Services = ({ formik }: { formik: FormikProps<typeof CREATE_AGREEMENT_FORM> }) => {
    const [
        ,
        ,
        {
            headerText,
            label,
            fields: [services],
        },
    ] = AGREEMENT_TEMPLATE.steps;
    return (
        <>
            <Box>
                <Heading size="xl">{label}</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{headerText}</Text>
                <Textarea {...services} {...formik.getFieldProps(services.id)} rows={15} />
            </Stack>
        </>
    );
};

export const Compensation = ({ formik }: { formik: FormikProps<typeof CREATE_AGREEMENT_FORM> }) => {
    const [
        ,
        ,
        ,
        {
            headerText,
            label,
            fields: [network, token, tokenAmount, time],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <>
            <Box>
                <Heading size="xl">{label}</Heading>
                <Box h="4" />
            </Box>
            <Stack spacing={'6'}>
                <Text fontSize={'18px'}>{headerText}</Text>
                <DropdownInput
                    {...network}
                    {...formik.getFieldProps(network.id)}
                    options={network.options as Mutable<typeof network['options']>}
                />
                <TokenInput {...token} {...formik.getFieldProps(token.id)} />
                <TokenAmountInput {...tokenAmount} {...formik.getFieldProps(tokenAmount.id)} tokenDecimals={18} tokenSymbol={'WETH'} />
                <TimeInput {...time} {...formik.getFieldProps(time.id)} />
            </Stack>
        </>
    );
};

export const TerminationConditions = ({ formik }: { formik: FormikProps<typeof CREATE_AGREEMENT_FORM> }) => {
    const { setValues } = useFormikContext<typeof CREATE_AGREEMENT_FORM>();
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
    const {
        additionalFields: [remedyPeriod],
    } = materialBreach;
    const {
        additionalFields: [noticePeriod],
    } = atWill;
    const {
        additionalFields: [lossOfKeys, moralTurpitude, bankruptcyEtc, legalCompulsion],
    } = rageTerminate;
    const rageTerminateIds = [lossOfKeys.id, moralTurpitude.id, bankruptcyEtc.id, legalCompulsion.id];

    const check = (id: string) => (e: ChangeEvent<HTMLInputElement>) => setValues(prev => ({ ...prev, [id]: e.target.checked ? 'x' : '' }));
    const isChecked = (id: IDS) => formik.values[id] === 'x';

    return (
        <>
            <Heading size="xl" alignSelf={'center'}>
                Termination Conditions
            </Heading>
            <Text fontSize={'18px'}>{headerText}</Text>

            <HStack justifySelf={'self-end'}>
                <Checkbox
                    {...formik.getFieldProps(mutualConsent.id)}
                    onChange={check(mutualConsent.id)}
                    isChecked={isChecked(mutualConsent.id)}
                >
                    <Text fontSize={'20px'} fontWeight="bold">
                        {mutualConsent.label}
                    </Text>
                </Checkbox>
            </HStack>
            <Text fontSize={'18px'}>{mutualConsent.explaination}</Text>

            <HStack justifySelf={'self-end'}>
                <Checkbox
                    {...formik.getFieldProps(materialBreach.id)}
                    onChange={check(materialBreach.id)}
                    isChecked={isChecked(materialBreach.id)}
                >
                    <Text fontSize={'20px'} fontWeight="bold">
                        {materialBreach.label}
                    </Text>
                </Checkbox>
            </HStack>
            <Text fontSize={'18px'}>{materialBreach.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...remedyPeriod} {...formik.getFieldProps(remedyPeriod.id)} />
            </GridItem>

            <HStack justifySelf={'self-end'}>
                <Checkbox {...formik.getFieldProps(atWill.id)} onChange={check(atWill.id)} isChecked={isChecked(atWill.id)}>
                    <Text fontSize={'20px'} fontWeight="bold">
                        {atWill.label}
                    </Text>
                </Checkbox>
            </HStack>
            <Text fontSize={'18px'}>{atWill.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...noticePeriod} {...formik.getFieldProps(noticePeriod.id)} />
            </GridItem>
            <HStack justifySelf={'self-end'}>
                <Checkbox isChecked={rageTerminateIds.some(id => !!formik.values[id])} _hover={{ cursor: 'not-allowed' }}>
                    <Text fontSize={'20px'} fontWeight="bold">
                        {rageTerminate.label}
                    </Text>
                </Checkbox>
            </HStack>

            <Text fontSize={'18px'}>{rageTerminate.explaination}</Text>
            <Stack spacing="6" as={GridItem} gridColumnStart={2}>
                <HStack alignItems={'center'}>
                    <Checkbox {...formik.getFieldProps(lossOfKeys.id)} onChange={check(lossOfKeys.id)} isChecked={isChecked(lossOfKeys.id)}>
                        <Text fontSize={'18px'}>{lossOfKeys.explaination}</Text>
                    </Checkbox>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox
                        {...formik.getFieldProps(moralTurpitude.id)}
                        onChange={check(moralTurpitude.id)}
                        isChecked={isChecked(moralTurpitude.id)}
                    >
                        <Text fontSize={'18px'}>{moralTurpitude.explaination}</Text>
                    </Checkbox>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox
                        {...formik.getFieldProps(bankruptcyEtc.id)}
                        onChange={check(bankruptcyEtc.id)}
                        isChecked={isChecked(bankruptcyEtc.id)}
                    >
                        <Text fontSize={'18px'}>{bankruptcyEtc.explaination}</Text>
                    </Checkbox>
                </HStack>
                <HStack alignItems={'center'}>
                    <Checkbox
                        {...formik.getFieldProps(legalCompulsion.id)}
                        onChange={check(legalCompulsion.id)}
                        isChecked={isChecked(legalCompulsion.id)}
                    >
                        <Text fontSize={'18px'}>{legalCompulsion.explaination}</Text>
                    </Checkbox>
                </HStack>
            </Stack>
        </>
    );
};

const CREATE_AGREEMENT_CACHE_STORAGE_KEY = 'create-agreement-form';

export default function Create() {
    const web3 = useWeb3();
    const router = useRouter();
    const step = router.query['create-step'] as Steps | undefined;
    const stepI = step ? CREATE_AGREEMENT_STEPS.indexOf(step) : undefined;
    const [doc, setDoc] = useState<string | undefined>();
    const [initialValues] = useLocalStorage<typeof CREATE_AGREEMENT_FORM>(CREATE_AGREEMENT_CACHE_STORAGE_KEY);

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
                    {isWeb3Connected(web3) ? (
                        <Formik
                            initialValues={{ ...(initialValues ?? CREATE_AGREEMENT_FORM), 'sp-address': web3.walletConnection.address }}
                            onSubmit={values => {
                                alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            {formik => (
                                <CreateAgreementGrid>
                                    {step === 'service-provider' && <ServiceProvider formik={formik} />}
                                    {step === 'client' && <Client formik={formik} />}
                                    {step === 'services' && <Services formik={formik} />}
                                    {step === 'compensation' && <Compensation formik={formik} />}
                                    {step === 'conditions' && <TerminationConditions formik={formik} />}
                                    {step !== 'review' && stepI !== undefined && (
                                        <>
                                            <Box h="4" />
                                            <Stack>
                                                <Link href={`/app/create/${CREATE_AGREEMENT_STEPS[stepI + 1]}`}>
                                                    <Button w="100%">Save {_.startCase(step)}</Button>
                                                </Link>
                                                <Link href={stepI == 0 ? '/app' : CREATE_AGREEMENT_STEPS[stepI - 1]}>
                                                    <Button variant={'outline'} w="100%">
                                                        {stepI === 0 ? 'Cancel' : 'Back'}
                                                    </Button>
                                                </Link>
                                            </Stack>
                                        </>
                                    )}

                                    <>{console.log(formik.values)}</>
                                    {step === 'review' && (
                                        <>
                                            <GridItem colSpan={2}>
                                                <Button onClick={() => generateDoc(web3.provider, formik.values).then(setDoc)}>
                                                    Test Create
                                                </Button>
                                                {doc && <div dangerouslySetInnerHTML={{ __html: doc }} style={{ minHeight: '100vh' }} />}
                                            </GridItem>
                                            <ServiceProvider formik={formik} />
                                            <Ellipsis />
                                            <Client formik={formik} />
                                            <Ellipsis />
                                            <Services formik={formik} />
                                            <Ellipsis />
                                            <Compensation formik={formik} />
                                            <Ellipsis />
                                            <TerminationConditions formik={formik} />

                                            <Box h="12" as={GridItem} colSpan={2} />
                                            <Heading size="xl" alignSelf={'center'}>
                                                Preview Agreement
                                            </Heading>
                                            <Text fontSize={'18px'}>{AGREEMENT_TEMPLATE.previewText}</Text>

                                            <Box />
                                        </>
                                    )}
                                    <DebounceCache storageKey={CREATE_AGREEMENT_CACHE_STORAGE_KEY} val={formik.values} delay={1000} />
                                </CreateAgreementGrid>
                            )}
                        </Formik>
                    ) : (
                        <Center h="full">
                            <Spinner />
                        </Center>
                    )}
                </Box>
            </Stack>
        </PageLayout>
    );
}
