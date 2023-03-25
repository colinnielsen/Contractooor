import { AddressInput, DropdownInput, TextInput, TimeInput, TokenAmountInput, TokenInput } from '@/lib/components/base/Inputs';
import { AGREEMENT_TEMPLATE, CreateAgreementForm, CREATE_AGREEMENT_FORM, IDS, Mutable } from '@/lib/constants/agreement';
import { formToDoc } from '@/lib/helpers';
import { convertHTMLToPDF, useProposeAgreement } from '@/lib/hooks/useProposeAgreement';
import { useWeb3 } from '@/lib/state/useWeb3';
import { CreateAgreementFormData } from '@/pages/app/create/[create-step]';
import { Box, Button, chakra, Checkbox, Grid, GridItem, GridProps, Heading, HStack, Stack, Text, Textarea } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

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

export const ServiceProvider = ({ formik, showHeader = true }: { formik: CreateAgreementFormData; showHeader?: boolean }) => {
    const [
        {
            headerText,
            label,
            fields: [legalName, legalStructure, jurisdiction, address],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <>
            {showHeader && (
                <Box>
                    <Heading size="xl">Parties</Heading>
                    <Box h="4" />
                    <Heading size="md">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'}>
                {showHeader ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
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

export const Client = ({ formik, showHeader = true }: { formik: CreateAgreementFormData; showHeader?: boolean }) => {
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
            {showHeader && (
                <Box>
                    <Heading size="xl">Parties</Heading>
                    <Box h="4" />
                    <Heading size="md">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'}>
                {showHeader ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
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

export const Services = ({ formik, showHeader = true }: { formik: CreateAgreementFormData; showHeader?: boolean }) => {
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
            {showHeader && (
                <Box>
                    <Heading size="xl">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'}>
                {showHeader ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
                <Textarea {...services} {...formik.getFieldProps(services.id)} rows={15} />
            </Stack>
        </>
    );
};

export const Compensation = ({ formik, showHeader = true }: { formik: CreateAgreementFormData; showHeader?: boolean }) => {
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
            {showHeader && (
                <Box>
                    <Heading size="xl">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'}>
                {showHeader ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
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

export const TerminationConditions = ({ formik, showHeader = true }: { formik: CreateAgreementFormData; showHeader?: boolean }) => {
    const { setValues } = useFormikContext<typeof CREATE_AGREEMENT_FORM>();
    const [
        ,
        ,
        ,
        ,
        {
            headerText,
            label,
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
            {showHeader && (
                <>
                    <Heading size="xl" alignSelf={'center'}>
                        Termination Conditions
                    </Heading>
                    <Text fontSize={'18px'}>{headerText}</Text>
                </>
            )}
            {!showHeader && (
                <GridItem colSpan={2} as={Stack} spacing="6">
                    <Heading size="md">Termination Conditions</Heading>
                    <hr />
                </GridItem>
            )}

            <HStack justifySelf={'self-end'}>
                <Checkbox
                    {...formik.getFieldProps(mutualConsent.id)}
                    isDisabled
                    onChange={check(mutualConsent.id)}
                    isChecked={isChecked(mutualConsent.id)}
                />
                <Text fontSize={'20px'} fontWeight="bold">
                    {mutualConsent.label}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{mutualConsent.explaination}</Text>

            <HStack justifySelf={'self-end'}>
                <Checkbox
                    {...formik.getFieldProps(materialBreach.id)}
                    isDisabled
                    onChange={check(materialBreach.id)}
                    isChecked={isChecked(materialBreach.id)}
                />
                <Text fontSize={'20px'} fontWeight="bold">
                    {materialBreach.label}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{materialBreach.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...remedyPeriod} {...formik.getFieldProps(remedyPeriod.id)} />
            </GridItem>

            <HStack justifySelf={'self-end'}>
                <Checkbox {...formik.getFieldProps(atWill.id)} onChange={check(atWill.id)} isChecked={isChecked(atWill.id)} />
                <Text fontSize={'20px'} fontWeight="bold">
                    {atWill.label}
                </Text>
            </HStack>
            <Text fontSize={'18px'}>{atWill.explaination}</Text>
            <GridItem colStart={2}>
                <TimeInput {...noticePeriod} {...formik.getFieldProps(noticePeriod.id)} />
            </GridItem>
            <HStack justifySelf={'self-end'}>
                <Text fontSize={'20px'} fontWeight="bold">
                    {rageTerminate.label}
                </Text>
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

export const ReviewAgreement = ({
    formik,
    initialFieldValues,
}: {
    formik: CreateAgreementFormData;
    initialFieldValues?: CreateAgreementForm;
}) => {
    const { provider } = useWeb3();
    const [doc, setDoc] = useState<string | undefined>();
    const { state, proposeAgreement, label } = useProposeAgreement(formik, initialFieldValues);

    const getDoc = useCallback(async () => {
        const doc = await formToDoc(provider, formik.values);
        const pdf = await convertHTMLToPDF(doc);
        const urlObject = URL.createObjectURL(pdf);
        setDoc(urlObject);
    }, [formik.values, provider]);

    useEffect(() => {
        getDoc();
    }, [getDoc]);

    return (
        <>
            <ServiceProvider formik={formik} showHeader={false} />
            <Client formik={formik} showHeader={false} />
            <Services formik={formik} showHeader={false} />
            <Compensation formik={formik} showHeader={false} />
            <TerminationConditions formik={formik} showHeader={false} />

            <Box h="12" as={GridItem} colSpan={2} />
            <Heading size="xl" alignSelf={'center'}>
                Preview Agreement
            </Heading>
            <Text fontSize={'18px'}>{AGREEMENT_TEMPLATE.previewText}</Text>
            <GridItem colSpan={2}>
                <Stack alignItems="center">
                    <Button maxW="60%" onClick={() => proposeAgreement()} isLoading={state === 'loading' || typeof label !== 'object'}>
                        {typeof label !== 'object' ? '...' : label.label}
                    </Button>
                    {doc && (
                        <>
                            <chakra.iframe borderWidth={'1px'} src={doc} minH="80vh" w="full" onLoad={() => URL.revokeObjectURL(doc)} />
                        </>
                    )}
                </Stack>
            </GridItem>
        </>
    );
};
