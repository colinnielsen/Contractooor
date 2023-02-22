import { Field } from '../components/base/Inputs';
import { NETWORKS } from './networks';

export type AgreementStep = {
    id: string;
    label: string;
    headerText: string;
    fields: Field[];
};
type AgreementTemplate = {
    steps: AgreementStep[];
};

export const AGREEMENT_TEMPLATE = {
    steps: [
        {
            id: 'service-provider',
            label: 'Service Provider',
            headerText:
                'Parties are the entities involved in and bound by the terms of this agreement. Service Provider is the entity rendering services. Decentralized Autonomous Organization is the entity receiving services. Jurisdiction is the legal system under which the service provider is governed. This includes the laws used to interpret and enforce the terms of the agreement, as well as the court system with authority to hear disputes arising from the agreement.',
            fields: [
                { type: 'string', id: 'sp-legal-name', label: 'Legal Name', placeholder: 'Name of Service Provider' },
                {
                    type: 'dropdown',
                    id: 'sp-legal-structure',
                    label: 'Type of Organization',
                    placeholder: 'Select Business Structure',
                    options: [
                        { id: 'llc', label: 'LLC' },
                        { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
                        { id: 'corporation', label: 'Corporation' },
                        { id: 'wyoming-dao', label: 'Wyoming DAO' },
                    ],
                },
                {
                    type: 'string',
                    id: 'sp-jurisdiction',
                    label: 'Jurisdiction',
                    placeholder: 'Legal System',
                },
                {
                    type: 'address',
                    id: 'sp-eth-address',
                    label: 'Wallet Address',
                    addressType: 'account',
                    placeholder: '0x...',
                },
            ],
        },
        {
            id: 'client',
            label: 'Client',
            headerText:
                'Parties are the entities involved in and bound by the terms of this agreement. Service Provider is the entity rendering services. Decentralized Autonomous Organization is the entity receiving services. Jurisdiction is the legal system under which the service provider is governed. This includes the laws used to interpret and enforce the terms of the agreement, as well as the court system with authority to hear disputes arising from the agreement.',
            fields: [
                { type: 'string', id: 'client-legal-name', label: 'Legal Name', placeholder: 'Name of client' },
                {
                    type: 'dropdown',
                    id: 'client-legal-structure',
                    label: 'Type of Organization',
                    placeholder: 'Select Business Structure',
                    options: [
                        { id: 'llc', label: 'LLC' },
                        { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
                        { id: 'corporation', label: 'Corporation' },
                        { id: 'wyoming-dao', label: 'Wyoming DAO' },
                    ],
                },
                {
                    type: 'string',
                    id: 'client-jurisdiction',
                    label: 'Jurisdiction',
                    placeholder: 'Legal System',
                },
                {
                    type: 'address',
                    id: 'client-eth-address',
                    label: 'Wallet Address',
                    addressType: 'account',
                    placeholder: '0x...',
                },
            ],
        },
        {
            id: 'services',
            label: 'Services',
            headerText:
                'Services refer to the specific actions or tasks that the Service Provider agrees to perform for the Decentralized Autonomous Organization. These services may include, but are not limited to, rendering a product or service or providing consulting.',
            fields: [
                {
                    id: 'description-of-services',
                    label: 'Description of Services',
                    type: 'textarea',
                    placeholder: "Describe the SP's deliverables",
                },
            ],
        },
        {
            id: 'compensation',
            label: 'Compensation',
            headerText:
                'Compensation refers to the payment or remuneration the Decentralized Autonomous Organization (Payor) agrees to provide the Service Provider (Recipient) in exchange for goods, services, or performance under the agreement. This compensation takes the form of streaming the number of ERC-20 tokens indicated with the token address. The stream begins when the contract is minted and continues until the end date.',
            fields: [
                {
                    id: 'network',
                    type: 'dropdown',
                    label: 'Network',
                    options: Object.values(NETWORKS).map(network => ({
                        id: network.id,
                        label: network.label,
                    })),
                    placeholder: 'Select Network',
                },
                {
                    id: 'token-address',
                    type: 'address',
                    label: 'Payment Token Address',
                    addressType: 'token',
                    placeholder: '0x...',
                },
                {
                    id: 'token-amount',
                    type: 'token-amount',
                    label: 'Number of Tokens',
                    placeholder: 'Enter number of tokens',
                },
                {
                    id: 'contract-length',
                    type: 'time',
                    subtype: 'months',
                    label: 'Length of Contract (months)',
                    placeholder: 'MM',
                },
            ],
        },
        {
            id: 'conditions',
            label: 'Compensation',
            headerText:
                'Termination conditions refer to the circumstances under which this agreement may be terminated, stopping the compensation stream and discharging the parties obligations to perform under the agreement before the completion of its term. Material breach and mutual Consent and are mandatory. At will and rage terminate are optional.',
            fields: [
                {
                    id: 'mutual-consent',
                    label: 'Mutual Consent',
                    type: 'checkbox',
                    explaination: 'This allows the agreement to be terminated when both parties sign termination transactions.',
                },
                {
                    id: 'material-breach',
                    label: 'Material Breach',
                    type: 'checkbox',
                    explaination:
                        'This allows a party to terminate the agreement when the other party fails to fulfill their obligations under the agreement, following notice and a period of time to remedy the failure.',
                    additionalFields: [
                        {
                            type: 'time',
                            id: 'remedy-period',
                            label: 'Remedy Period (in days)',
                            placeholder: '30',
                            subtype: 'days',
                        },
                    ],
                },
                {
                    id: 'at-will',
                    label: 'At Will',
                    type: 'checkbox',
                    explaination:
                        'This allows a single party to terminate the agreement after a specified period of time from when notice is given.',
                    additionalFields: [
                        {
                            type: 'time',
                            id: 'notice-period',
                            label: 'Notice Period (in days)',
                            placeholder: '60',
                            subtype: 'days',
                        },
                    ],
                },
                {
                    id: 'rage-terminate',
                    label: 'Rage Terminate',
                    type: 'checkbox',
                    explaination:
                        'This allows a single party to immediately terminate the agreement only in the event of specific exigent circumstances. Select the conditions under which this agreement may be terminated.',
                    additionalFields: [
                        {
                            id: 'lost-control-of-private-keys',
                            type: 'checkbox',
                            label: 'Loss of Private Keys',
                            explaination: 'Counterparty has lost exclusive access to private key controlling compensation stream',
                        },
                        {
                            id: 'moral-turpitude',
                            type: 'checkbox',
                            label: 'Crimes of Moral Turpitude',
                            explaination:
                                'Counterparty has been criminally indicted, internationally sanctioned, or credibly accused of fraud or a crime of moral turpitude',
                        },
                        {
                            id: 'bankruptcy-dissolution-insolvency',
                            type: 'checkbox',
                            label: 'Bankruptcy / Dissolution / Insolvency',
                            explaination:
                                'Counterparty has entered bankruptcy or receivership, or has lost a license, certification or other requirement necessary to its performance under the agreement',
                        },
                        {
                            id: 'legal-compulsion',
                            type: 'checkbox',
                            label: 'Legal Compulsion',
                            explaination:
                                'Terminating party has formed a good faith belief that continued performance of its obligations under the agreement exposes it to serious legal liability',
                        },
                    ],
                },
            ],
        },
    ],
    previewText:
        'Preview agreement allows parties to become familiar with the terms of the agreement, identify any potential issues or concerns, and make any necessary changes or negotiations before it becomes final. Previewing helps ensure both parties understand and agree to the terms, and can help to prevent misunderstandings or disputes from arising later on.',
} as const;
