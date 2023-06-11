import { AddressInput, DropdownInput, TextInput, TimeInput, TokenAmountInput, TokenInput } from '@/lib/components/base/Inputs';
import { AGREEMENT_TEMPLATE, CreateAgreementForm, CREATE_AGREEMENT_FORM, IDS, Mutable } from '@/lib/constants/agreement';
import { formToDoc } from '@/lib/helpers';
import { convertHTMLToPDF, propseAgreementFailed, useProposeAgreement } from '@/lib/hooks/useProposeAgreement';
import { useWeb3 } from '@/lib/state/useWeb3';
import { AgreementGraphData, ParsedForm } from '@/pages/app';
import { CreateAgreementFormData } from '@/pages/app/create/[create-step]';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    chakra,
    Checkbox,
    Grid,
    GridItem,
    GridProps,
    Heading,
    HStack,
    Icon,
    Stack,
    Text,
    Textarea,
    Tooltip,
} from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

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

export const ServiceProvider = ({ formik, reviewVariant = false }: { formik: CreateAgreementFormData; reviewVariant?: boolean }) => {
    const [
        {
            headerText,
            label,
            fields: [legalName, legalStructure, jurisdiction, address],
        },
    ] = AGREEMENT_TEMPLATE.steps;

    return (
        <>
            {!reviewVariant && (
                <Box>
                    <Heading size="xl">Parties</Heading>
                    <Box h="4" />
                    <Heading size="md">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'} overflowX={reviewVariant ? 'auto' : 'initial'}>
                {!reviewVariant ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
                <TextInput {...legalName} {...formik.getFieldProps(legalName.id)} reviewVariant={reviewVariant} />
                <DropdownInput
                    {...legalStructure}
                    {...formik.getFieldProps(legalStructure.id)}
                    options={legalStructure.options as Mutable<(typeof legalStructure)['options']>}
                    reviewVariant={reviewVariant}
                />
                <TextInput {...jurisdiction} {...formik.getFieldProps(jurisdiction.id)} reviewVariant={reviewVariant} />
                <AddressInput {...address} {...formik.getFieldProps(address.id)} reviewVariant={reviewVariant} />
            </Stack>
        </>
    );
};

export const Client = ({ formik, reviewVariant = false }: { formik: CreateAgreementFormData; reviewVariant?: boolean }) => {
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
            {!reviewVariant && (
                <Box>
                    <Heading size="xl">Parties</Heading>
                    <Box h="4" />
                    <Heading size="md">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'} overflowX={reviewVariant ? 'auto' : 'initial'}>
                {!reviewVariant ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
                <TextInput {...legalName} {...formik.getFieldProps(legalName.id)} reviewVariant={reviewVariant} />
                <DropdownInput
                    {...legalStructure}
                    {...formik.getFieldProps(legalStructure.id)}
                    options={legalStructure.options as Mutable<(typeof legalStructure)['options']>}
                    reviewVariant={reviewVariant}
                />
                <TextInput {...jurisdiction} {...formik.getFieldProps(jurisdiction.id)} reviewVariant={reviewVariant} />
                <AddressInput {...address} {...formik.getFieldProps(address.id)} reviewVariant={reviewVariant} />
            </Stack>
        </>
    );
};

export const Services = ({ formik, reviewVariant = false }: { formik: CreateAgreementFormData; reviewVariant?: boolean }) => {
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
            {!reviewVariant && (
                <Box>
                    <Heading size="xl">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'}>
                {!reviewVariant ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
                <Textarea {...services} {...formik.getFieldProps(services.id)} rows={reviewVariant ? 10 : 15} />
            </Stack>
        </>
    );
};

export const Compensation = ({ formik, reviewVariant = false }: { formik: CreateAgreementFormData; reviewVariant?: boolean }) => {
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
            {!reviewVariant && (
                <Box>
                    <Heading size="xl">{label}</Heading>
                    <Box h="4" />
                </Box>
            )}
            <Stack spacing={'6'} overflow="auto">
                {!reviewVariant ? <Text fontSize={'18px'}>{headerText}</Text> : <Heading size="md">{label}</Heading>}
                <hr />
                <DropdownInput
                    {...network}
                    {...formik.getFieldProps(network.id)}
                    options={network.options as Mutable<(typeof network)['options']>}
                    reviewVariant={reviewVariant}
                />
                <TokenInput {...token} {...formik.getFieldProps(token.id)} reviewVariant={reviewVariant} />
                <TokenAmountInput
                    {...tokenAmount}
                    {...formik.getFieldProps(tokenAmount.id)}
                    tokenDecimals={18}
                    tokenSymbol={formik.values['aux-token-symbol'] ?? '...'}
                />
                <TimeInput {...time} {...formik.getFieldProps(time.id)} reviewVariant={reviewVariant} />
            </Stack>
        </>
    );
};

export const TerminationConditions = ({ formik, reviewVariant = false }: { formik: CreateAgreementFormData; reviewVariant?: boolean }) => {
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
            {!reviewVariant && (
                <>
                    <Heading size="xl" alignSelf={'center'}>
                        Termination Conditions
                    </Heading>
                    <Text fontSize={'18px'}>{headerText}</Text>
                </>
            )}
            {!!reviewVariant && (
                <GridItem colSpan={2} as={Stack} spacing="6">
                    <Heading size="md">Termination Conditions</Heading>
                    <hr />
                </GridItem>
            )}

            {reviewVariant ? (
                <GridItem colSpan={2} justifyContent="end">
                    <HStack>
                        <Checkbox
                            {...formik.getFieldProps(mutualConsent.id)}
                            isDisabled
                            onChange={check(mutualConsent.id)}
                            isChecked={isChecked(mutualConsent.id)}
                        />
                        <Text fontSize={'20px'} fontWeight="bold">
                            {mutualConsent.label}
                        </Text>
                        <Tooltip label={mutualConsent.explaination} placement="top">
                            <Icon as={QuestionOutlineIcon} />
                        </Tooltip>
                    </HStack>
                </GridItem>
            ) : (
                <>
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
                </>
            )}

            {reviewVariant ? (
                <GridItem colSpan={2}>
                    <HStack>
                        <Checkbox
                            {...formik.getFieldProps(materialBreach.id)}
                            isDisabled
                            onChange={check(materialBreach.id)}
                            isChecked={isChecked(materialBreach.id)}
                        />
                        <Text fontSize={'20px'} fontWeight="bold" whiteSpace={'nowrap'}>
                            {materialBreach.label}
                        </Text>
                        <Tooltip label={materialBreach.explaination} placement="top">
                            <Icon as={QuestionOutlineIcon} />
                        </Tooltip>
                        <Box w="20px" />
                        <TimeInput {...remedyPeriod} {...formik.getFieldProps(remedyPeriod.id)} maxW="150px" reviewVariant />
                    </HStack>
                </GridItem>
            ) : (
                <>
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
                </>
            )}

            {reviewVariant ? (
                <GridItem colSpan={2}>
                    <HStack justifySelf={'self-end'}>
                        <Checkbox {...formik.getFieldProps(atWill.id)} onChange={check(atWill.id)} isChecked={isChecked(atWill.id)}>
                            <Text fontSize={'20px'} fontWeight="bold" whiteSpace={'nowrap'}>
                                {atWill.label}
                            </Text>
                        </Checkbox>
                        <Tooltip label={atWill.explaination} placement="top">
                            <Icon as={QuestionOutlineIcon} />
                        </Tooltip>
                        <Box w="20px" />
                        <TimeInput {...noticePeriod} {...formik.getFieldProps(noticePeriod.id)} maxW="150px" reviewVariant />
                    </HStack>
                </GridItem>
            ) : (
                <>
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
                </>
            )}

            <HStack justifySelf={reviewVariant ? 'start' : 'self-end'}>
                <Text fontSize={'20px'} fontWeight="bold">
                    {rageTerminate.label}
                </Text>
                {reviewVariant && (
                    <Tooltip label={rageTerminate.explaination} placement="top">
                        <Icon as={QuestionOutlineIcon} />
                    </Tooltip>
                )}
            </HStack>
            {!reviewVariant ? <Text fontSize={'18px'}>{rageTerminate.explaination}</Text> : <div />}

            <Stack spacing="6" as={GridItem} gridColumnStart={reviewVariant ? 1 : 2} colSpan={reviewVariant ? 2 : 1}>
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
    agreement,
    initialFieldValues,
}: {
    formik: CreateAgreementFormData;
    agreement?: AgreementGraphData;
    initialFieldValues?: CreateAgreementForm;
}) => {
    const { provider } = useWeb3();
    const [doc, setDoc] = useState<string | undefined>();
    const { state, proposeAgreement, label } = useProposeAgreement(formik, initialFieldValues, agreement);

    const debounceCreate = useCallback(
        _.debounce(async (val: CreateAgreementForm) => {
            const doc = await formToDoc(provider, val, true);
            const pdf = await convertHTMLToPDF(doc);
            const urlObject = URL.createObjectURL(pdf);
            setDoc(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return urlObject;
            });
        }, 1000),
        [],
    );

    useEffect(() => {
        debounceCreate(formik.values);
    }, [debounceCreate, formik.values]);

    return (
        <>
            <ServiceProvider formik={formik} reviewVariant />
            <Client formik={formik} reviewVariant />
            <Services formik={formik} reviewVariant />
            <Compensation formik={formik} reviewVariant />
            <TerminationConditions formik={formik} reviewVariant />

            <Box h="12" as={GridItem} colSpan={2} />
            <Heading size="xl" alignSelf={'center'}>
                Preview Agreement
            </Heading>
            <Text fontSize={'18px'}>{AGREEMENT_TEMPLATE.previewText}</Text>
            <GridItem colSpan={2}>
                <Stack alignItems="center">
                    <Button
                        maxW="60%"
                        onClick={() => proposeAgreement()}
                        isLoading={state === 'loading' || typeof label !== 'object'}
                        visibility={typeof label === 'object' && label.hideButton ? 'hidden' : 'visible'}
                    >
                        {typeof label !== 'object' ? '...' : label.label}
                    </Button>
                    {propseAgreementFailed(state) && (
                        <Text color={'red'} fontWeight="semibold">
                            {state.message}
                        </Text>
                    )}

                    {doc && (
                        <>
                            <chakra.iframe borderWidth={'1px'} src={doc} minH="80vh" w="full" />
                        </>
                    )}
                </Stack>
            </GridItem>
        </>
    );
};
