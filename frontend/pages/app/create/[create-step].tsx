import {
    Client,
    Compensation,
    CreateAgreementGrid,
    ReviewAgreement,
    ServiceProvider,
    Services,
    TerminationConditions,
} from '@/lib/components/agreement-slides';
import { DebounceCache } from '@/lib/components/base/Inputs';
import { PageLayout } from '@/lib/components/page';
import { CREATE_AGREEMENT_FORM } from '@/lib/constants/agreement';
import { useLocalStorage } from '@/lib/helpers';
import { isWeb3Connected, useWeb3 } from '@/lib/state/useWeb3';
import { Box, Button, Center, Heading, HStack, Spacer, Spinner, Stack } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const CREATE_AGREEMENT_STEPS = ['service-provider', 'client', 'services', 'compensation', 'conditions', 'review'] as const;
type Steps = typeof CREATE_AGREEMENT_STEPS[number];

export type CreateAgreementFormData = FormikProps<typeof CREATE_AGREEMENT_FORM>;

const CREATE_AGREEMENT_CACHE_STORAGE_KEY = 'create-agreement-form';

export default function Create() {
    const web3 = useWeb3();
    const router = useRouter();
    const step = router.query['create-step'] as Steps | undefined;
    const stepI = step ? CREATE_AGREEMENT_STEPS.indexOf(step) : undefined;
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
                            initialValues={{
                                ...(initialValues ?? CREATE_AGREEMENT_FORM),
                                'sp-address': web3.walletConnection.address,
                                'material-breach': 'x',
                                'mutual-consent': 'x',
                            }}
                            onSubmit={console.log}
                        >
                            {formik => (
                                <CreateAgreementGrid templateColumns={step === 'review' ? 'repeat(2, 1fr)' : '1fr 2fr'}>
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

                                    {step === 'review' && <ReviewAgreement formik={formik} />}
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
