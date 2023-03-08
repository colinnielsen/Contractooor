import { CreateAgreementFormData } from '@/pages/app/create/[create-step]';
import axios from 'axios';
import { utils } from 'ethers';
import jsPDF from 'jspdf';
import { useState } from 'react';
import { NETWORKS } from '../constants/networks';
import { generateDoc } from '../helpers';
import { isConnectionActive, useWeb3 } from '../state/useWeb3';
import { TerminationClausesStruct } from '../typechain/AgreementArbitrator';
import { AgreementArbitrator__factory } from '../typechain/factories/AgreementArbitrator__factory';

type ErrorState = { message: string };
type ProposeAgreementState = 'init' | 'loading' | { message: string };

export const propseAgreementFailed = (state: ProposeAgreementState): state is ErrorState => {
    return typeof state === 'object' && 'message' in state;
};

export const PDF_WINDOW_WIDTH = 800;
export const PDF_WINDOW_HEIGHT = PDF_WINDOW_WIDTH * (11 / 8.5);

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

export const useProposeAgreement = (formData: CreateAgreementFormData) => {
    const { provider, walletConnection } = useWeb3();
    const [state, setState] = useState<'init' | 'loading' | 'success' | { message: string }>('init');

    const proposeAgreement = async () => {
        setState('loading');
        try {
            if (!isConnectionActive(walletConnection)) throw new Error('not connected');

            const html = await generateDoc(provider, formData.values);
            // const pdf = await convertHTMLToPDF(html);
            const cid = await uploadFileToIpfs(html);
            console.log({ cid });
            const AgreementArbitrator = AgreementArbitrator__factory.connect(
                NETWORKS[walletConnection.chainId].agreementArbitrator,
                walletConnection.signer,
            );
            const terminationConditions: TerminationClausesStruct = {
                atWillDays: !!formData.values['at-will'] ? formData.values['at-will'] : 30, //TODO
                bankruptcyDissolutionInsolvency: formData.values['bankruptcy-dissolution-insolvency'] === 'x',
                counterpartyMalfeasance: formData.values['moral-turpitude'] === 'x',
                cureTimeDays: !!formData.values['notice-period'] ? formData.values['notice-period'] : 30, //TODO
                moralTurpitude: formData.values['moral-turpitude'] === 'x',
                legalCompulsion: formData.values['legal-compulsion'] === 'x',
                lostControlOfPrivateKeys: formData.values['lost-control-of-private-keys'] === 'x',
            };
            console.log([
                1,
                formData.values['sp-address'],
                formData.values['client-address'],
                cid,
                +formData.values['contract-length'] * 30 * 86400,
                formData.values['token-address'],
                utils.parseUnits(formData.values['token-amount'], 18), //TODO
                terminationConditions,
            ]);

            const tx = await AgreementArbitrator.agreeTo(
                1,
                formData.values['sp-address'],
                formData.values['client-address'],
                cid,
                +formData.values['contract-length'] * 30 * 86400,
                formData.values['token-address'],
                utils.parseUnits(formData.values['token-amount'], 18), //TODO
                terminationConditions,
            );
            const res = await tx.wait();
            setState('success');
            return res;
        } catch (e: any) {
            const iface = new utils.Interface(AgreementArbitrator__factory.abi);
            const error = e?.error?.data?.originalError?.data;
            const errorMessage = error ? iface.parseError(error) : e.message;
            console.log(errorMessage);
            console.error(e);
            setState({ message: errorMessage });
        }
    };

    return {
        state,
        proposeAgreement,
    };
};
