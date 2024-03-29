import { AgreementGraphData } from '@/pages/app';
import { CreateAgreementFormData } from '@/pages/app/create/[create-step]';
import { SafeEthersSigner } from '@safe-global/safe-ethers-adapters';
import axios from 'axios';
import { BigNumber, BigNumberish, Contract, utils } from 'ethers';
import { encodeMulti } from 'ethers-multisend';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateAgreementForm } from '../constants/agreement';
import { NETWORKS } from '../constants/networks';
import { addressEquality, formToDoc, isChecked } from '../helpers';
import { isConnectionActive, useWeb3 } from '../state/useWeb3';
import { TerminationClausesStruct } from '../typechain/AgreementArbitrator';
import { AgreementArbitrator__factory } from '../typechain/factories/AgreementArbitrator__factory';
import { Poster__factory } from '../typechain/factories/Poster__factory';

export type ErrorState = { message: string };
type ProposeAgreementState = 'init' | 'loading' | { message: string };

export const propseAgreementFailed = (state: ProposeAgreementState | 'success'): state is ErrorState => {
    return typeof state === 'object' && 'message' in state;
};

export const PDF_WINDOW_WIDTH = 800;
export const PDF_WINDOW_HEIGHT = PDF_WINDOW_WIDTH * (11 / 8.5);

async function getUserPairAgreementCount(supgraphURL: string, providerAddr: string, clientAddr: string) {
    const hashConcat = providerAddr.slice(2) + clientAddr.slice(2);
    const hash = utils.keccak256(Buffer.from(hashConcat, 'hex'));

    const data = {
        query: `query GET_USERPAIR($id: String!) {
            userPair(id: $id) {
                id
                agreementCount
            }
        }`,
        variables: {
            id: hash,
        },
    };

    const response = await axios.post<{
        data: {
            userPair: {
                id: string;
                agreementCount: number;
            } | null;
        };
    }>(supgraphURL, data);
    return response.data.data.userPair?.agreementCount ?? 0;
}

export const convertHTMLToPDF = async (html: string | HTMLElement): Promise<File> => {
    const filename = `Contractooor-agreement`; //todo
    let jsPDFInstance = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [PDF_WINDOW_WIDTH, PDF_WINDOW_HEIGHT],
    });

    const pdf = await new Promise<jsPDF>(resolve =>
        jsPDFInstance.html(html, {
            filename,
            callback: resolve,
            windowWidth: PDF_WINDOW_WIDTH,
            width: PDF_WINDOW_WIDTH,
            margin: [0, 40, 40, 0],
            autoPaging: 'text',
        }),
    );

    const blob = pdf.output('blob');
    const file = new File([blob], filename, { type: 'application/pdf', lastModified: 0 });
    return file;
};

export const uploadFileToIpfs = async (file: File | string): Promise<string> => {
    const data = new FormData();
    data.append('file', new Blob([file]), 'test.html');

    const res = await axios.post<{
        IpfsHash: string;
        PinSize: number;
        Timestamp: string;
    }>('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        maxBodyLength: Infinity,
        headers: {
            Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3OTNhM2M2Zi0yNTA1LTQzOWUtYjgyMy0wZTU3YmRkMjUyNDEiLCJlbWFpbCI6ImNvbGluQG5pZWxzZW4udGVjaG5vbG9neSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMmE4ZWM1YjEzZTJmYzhiZDVkOSIsInNjb3BlZEtleVNlY3JldCI6IjkyNjMxMDY3ODI0MDMzZjQzZWM3NWU1ZmQ3ZTIxM2M4NTEzY2ZlZDE4NGQ5MDg3ZmUzNGNhMjQ1NWE5MDZjM2MiLCJpYXQiOjE2Nzc5MTYwODZ9.rkEeyBxSCzH_51eCMRwmMWZtGDZ5MjawhxvlWd6ZHUQ',
        },
    });

    return res.data.IpfsHash;
};

export const getPosterDescription = (formData: CreateAgreementFormData['values'], safeAddress: string, agreementCID: string): string => {
    const {
        'token-amount': tokenAmount,
        'token-address': tokenAddress,
        'contract-length': contractLength,
        'client-address': clientAddress,
        'sp-address': spAddress,
        'aux-token-symbol': auxTokenSymbol,
    } = formData;
    const isClient = addressEquality(clientAddress, safeAddress);
    const isServiceProvider = !isClient;

    return `Legally binding agreement to stream ${tokenAmount} of ${auxTokenSymbol} (${tokenAddress}) over ${contractLength} days from ${clientAddress}${
        isClient ? ' (this safe)' : ''
    } to ${spAddress}${
        isServiceProvider ? ' (this safe)' : ''
    }. \nView full agreement at https://contractooor.mypinata.cloud/ipfs/${agreementCID} before signing.`;
};

export const getApproveERC20Transaction = (_tokenAddress: string, _spender: string, amount: BigNumberish) => {
    const tokenAddress = utils.getAddress(_tokenAddress);
    const spender = utils.getAddress(_spender);
    return {
        to: tokenAddress,
        value: '0',
        operation: 0,
        data: new utils.Interface([
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                name: 'approve',
                outputs: [
                    {
                        internalType: 'bool',
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ]).encodeFunctionData('approve', [spender, amount]),
    };
};

const MIN_AT_WILL_TERMINATION_DAYS = 30;
const MIN_CURE_TIME_DAYS = 30;
export const useProposeAgreement = (
    formData: CreateAgreementFormData,
    initialFieldValues?: CreateAgreementForm,
    agreement?: AgreementGraphData,
) => {
    const { provider, walletConnection } = useWeb3();
    const router = useRouter();
    const [state, setState] = useState<'init' | 'loading' | 'success' | { message: string }>('init');
    const [approvedAmount, setApprovedAmount] = useState<BigNumber>(BigNumber.from(0));
    const [label, setLabel] = useState<'init' | 'loading' | { label: string; hideButton?: boolean }>('init');

    const getApprovedAmount = useCallback(
        async (token: string, owner: string, spender: string): Promise<BigNumber> => {
            const ERC20 = new Contract(
                token,
                ['function allowance(address owner, address spender) external view returns (uint256)'],
                provider,
            );
            return await ERC20.allowance(owner, spender);
        },
        [provider],
    );

    const currentFieldValues = formData.values;

    const hasAlreadyBeenProposed = !!initialFieldValues;

    const formDataDiffers = useMemo(
        () =>
            !initialFieldValues
                ? false
                : Object.entries(initialFieldValues).some(
                      ([key, initialValue]) => initialValue != currentFieldValues[key as keyof CreateAgreementForm].toString(),
                  ),
        [currentFieldValues, initialFieldValues],
    );

    const token = formData.values['token-address'];
    const tokenDecimals = formData.values['aux-token-decimals'];
    const agreementAmount = formData.values['token-amount'];
    const clientAddress = formData.values['client-address'];
    const serviceProviderAddress = formData.values['sp-address'];

    const viewingPartyType = !isConnectionActive(walletConnection)
        ? 'not-connected'
        : addressEquality(walletConnection.address, clientAddress)
        ? 'client'
        : addressEquality(walletConnection.address, serviceProviderAddress)
        ? 'service-provider'
        : 'observer';

    useEffect(() => {
        if (
            isConnectionActive(walletConnection) &&
            walletConnection.walletType === 'EOA' &&
            addressEquality(walletConnection.address, clientAddress) &&
            token
        ) {
            getApprovedAmount(token, walletConnection.address, NETWORKS[walletConnection.chainId].agreementArbitrator).then(
                setApprovedAmount,
            );
        }
    }, [agreementAmount, walletConnection, token, clientAddress, getApprovedAmount]);
    const isUnderApproved = approvedAmount.lt(utils.parseUnits(agreementAmount, tokenDecimals));

    useEffect(() => {
        console.debug({
            hasAlreadyBeenProposed,
            isUnderApproved,
            tokenDecimals,
            viewingPartyType,
            formDataDiffers,
            lastProposer: agreement?.lastProposer,
        });
        if (
            viewingPartyType === 'not-connected' ||
            viewingPartyType === 'observer' ||
            (isConnectionActive(walletConnection) &&
                addressEquality(walletConnection.address, agreement?.lastProposer ?? '') &&
                !formDataDiffers) // if there are no changes since the viewer last proposed
        ) {
            setLabel({ label: '', hideButton: true });
            return;
        }
        let label = '';

        if (!hasAlreadyBeenProposed) {
            label = 'Propose Agreement';
        } else {
            if (
                viewingPartyType === 'client' &&
                isConnectionActive(walletConnection) &&
                walletConnection.walletType === 'EOA' &&
                isUnderApproved
            )
                label = 'Approve Token and ';

            if (formDataDiffers) label += 'Counter-Propose Agreement';
            else label += 'Agree to Contract';
        }

        setLabel({ label });
    }, [hasAlreadyBeenProposed, isUnderApproved, tokenDecimals, viewingPartyType, walletConnection, formDataDiffers, agreement]);

    const proposeAgreement = async () => {
        setState('loading');
        try {
            if (!isConnectionActive(walletConnection)) throw new Error('not connected');

            const html = await formToDoc(provider, formData.values, false);
            // const pdf = await convertHTMLToPDF(html);
            const cid = await uploadFileToIpfs(html);

            const AgreementArbitrator = AgreementArbitrator__factory.connect(
                NETWORKS[walletConnection.chainId].agreementArbitrator,
                walletConnection.signer,
            );

            const ERC20 = new Contract(
                token,
                ['function approve(address spender, uint256 amount) external returns (bool)'],
                walletConnection.signer,
            );

            const terminationConditions: TerminationClausesStruct = {
                atWillDays: isChecked(formData.values['at-will']) ? formData.values['notice-period'] : 0,
                bankruptcyDissolutionInsolvency: isChecked(formData.values['bankruptcy-dissolution-insolvency']),
                counterpartyMalfeasance: isChecked(formData.values['moral-turpitude']),
                cureTimeDays: !!formData.values['remedy-period'] ? formData.values['remedy-period'] : 0,
                moralTurpitude: isChecked(formData.values['moral-turpitude']),
                legalCompulsion: isChecked(formData.values['legal-compulsion']),
                lostControlOfPrivateKeys: isChecked(formData.values['lost-control-of-private-keys']),
            };
            console.log('terminationConditions', terminationConditions);

            const nonce =
                hasAlreadyBeenProposed && agreement
                    ? agreement.agreementNonce
                    : await getUserPairAgreementCount(
                          NETWORKS[walletConnection.chainId].subgraphURL,
                          formData.values['sp-address'],
                          formData.values['client-address'],
                      );
            console.log('nonce', nonce);

            const args = [
                nonce,
                formData.values['sp-address'],
                formData.values['client-address'],
                cid,
                +formData.values['contract-length'] * 86400,
                formData.values['token-address'],
                utils.parseUnits(formData.values['token-amount'], formData.values['aux-token-decimals']), // TODO
                terminationConditions,
            ] as const;
            console.log({ args });

            if (walletConnection.walletType === 'EOA') {
                if (viewingPartyType === 'client' && isUnderApproved) {
                    const approvalTx = await ERC20.approve(NETWORKS[walletConnection.chainId].agreementArbitrator, args[6]);
                    await approvalTx.wait();
                }
                const agreeToTx = await AgreementArbitrator.agreeTo.apply(undefined, [...args]);
                await agreeToTx.wait();
            } else {
                const safeAddress = utils.getAddress(walletConnection.address);
                const { safeSDK, safeServiceClient, chainId } = walletConnection;
                const safeTransactionData = encodeMulti([
                    {
                        to: NETWORKS[chainId].poster,
                        value: '0',
                        data: new utils.Interface(Poster__factory.abi).encodeFunctionData('post', [
                            getPosterDescription(formData.values, safeAddress, cid),
                            '',
                        ]),
                    },
                    ...(viewingPartyType === 'client' && isUnderApproved
                        ? [getApproveERC20Transaction(token, NETWORKS[chainId].agreementArbitrator, args[6])]
                        : []),
                    {
                        to: NETWORKS[chainId].agreementArbitrator,
                        value: '0',
                        data: new utils.Interface(AgreementArbitrator__factory.abi).encodeFunctionData('agreeTo', args),
                    },
                ]);
                const nonce = await safeServiceClient.getNextNonce(safeAddress);
                console.log({ safeTransactionData });
                const safeTransaction = await safeSDK.createTransaction({ safeTransactionData, options: { nonce } });
                console.log({ safeTransaction });
                const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
                console.log({ safeTxHash });
                const senderSignature = await safeSDK.signTypedData(safeTransaction);
                console.log({ senderSignature });

                await safeServiceClient.proposeTransaction({
                    safeAddress,
                    safeTransactionData: {
                        ...safeTransaction.data,
                        value: '0',
                    },
                    safeTxHash,
                    senderAddress: walletConnection.EOAAddress,
                    senderSignature: senderSignature.data,
                });
                console.log('proposed');

                // @ts-ignore
                const safeSigner = new SafeEthersSigner(safeSDK, safeServiceClient, walletConnection.signer);

                const res = await safeSigner.buildTransactionResponse(safeTxHash, safeTransaction.data);
                console.log('awaiting');
                await res.wait();
                console.log('completed');
            }
            setTimeout(() => router.push('/app'), 3000);
            setState('success');
        } catch (e: any) {
            const iface = new utils.Interface(AgreementArbitrator__factory.abi);
            const data = e?.error?.data?.originalError?.data;
            const message = e?.error?.message;

            const errorMessage = message ? message : data ? iface.parseError(data) : e.message;
            console.log(errorMessage);
            console.error(e);
            setState({ message: errorMessage });
        }
    };

    return {
        state,
        label,
        proposeAgreement,
    };
};
