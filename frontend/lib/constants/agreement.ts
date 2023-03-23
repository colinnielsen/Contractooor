import { CheckboxInput, Field } from '../components/base/Inputs';
import { NETWORKS } from './networks';

export type AgreementStep = {
    stepId: string;
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
            stepId: 'service-provider',
            label: 'Service Provider',
            headerText:
                'Parties are the entities involved in and bound by the terms of this agreement. Services Provider is the entity rendering services. Client is the entity receiving services. Jurisdiction is the legal system under which the party is registered.',
            fields: [
                { type: 'string', id: 'sp-legal-name', label: 'Legal Name', placeholder: 'Name of Services Provider' },
                {
                    type: 'dropdown',
                    id: 'sp-legal-structure',
                    label: 'Type of Organization',
                    placeholder: 'Select Business Structure',
                    options: [
                        { id: 'llc', label: 'LLC' },
                        { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
                        { id: 'c-corp', label: 'C-Corp' },
                        { id: 's-corp', label: 'S-Corp' },
                        { id: 'partnership', label: 'Partnership' },
                        { id: 'ltd', label: 'LTD' },
                        { id: 'gmbh', label: 'GmBH' },
                        { id: 'wyoming-dao', label: 'Wyoming DAO' },
                    ],
                },
                {
                    type: 'string',
                    id: 'sp-jurisdiction',
                    label: 'Jurisdiction',
                    placeholder: 'Legal Jurisdiction',
                },
                {
                    type: 'address',
                    id: 'sp-address',
                    label: 'Wallet Address',
                    addressType: 'account',
                    placeholder: '0x...',
                },
            ],
        },
        {
            stepId: 'client',
            label: 'Client',
            headerText:
                'Parties are the entities involved in and bound by the terms of this agreement. Service Provider is the entity rendering services. Client is the entity receiving services. Jurisdiction is the legal system under which the Client is registered.',
            fields: [
                { type: 'string', id: 'client-legal-name', label: 'Legal Name', placeholder: 'Name of Client' },
                {
                    type: 'dropdown',
                    id: 'client-legal-structure',
                    label: 'Type of Organization',
                    placeholder: 'Select Business Structure',
                    options: [
                        { id: 'llc', label: 'LLC' },
                        { id: 'sole-proprietorship', label: 'Sole Proprietorship' },
                        { id: 'c-corp', label: 'C-Corp' },
                        { id: 's-corp', label: 'S-Corp' },
                        { id: 'partnership', label: 'Partnership' },
                        { id: 'ltd', label: 'LTD' },
                        { id: 'gmbh', label: 'GmBH' },
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
                    id: 'client-address',
                    label: 'Wallet Address',
                    addressType: 'account',
                    placeholder: '0x...',
                },
            ],
        },
        {
            stepId: 'services',
            label: 'Services',
            headerText:
                'Services refer to the specific actions or tasks that the Services Provider agrees to perform for the Client. These services may include but are not limited to rendering a professional service or providing consultation.',
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
            stepId: 'compensation',
            label: 'Compensation',
            headerText:
                'Compensation refers to the payment or remuneration the Client (Payor) agrees to provide the Service Provider (Recipient) in exchange for the Services specified in the agreement. This Compensation takes the form of a stream of specified ERC-20 tokens on a particular network. The stream begins when the contract is countersigned and continues until the end date.',
            fields: [
                {
                    id: 'network',
                    type: 'dropdown',
                    label: 'Network',
                    options: [
                        {
                            id: NETWORKS[1].id,
                            label: NETWORKS[1].label,
                        },
                        {
                            id: NETWORKS[5].id,
                            label: NETWORKS[5].label,
                        },
                    ],
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
            stepId: 'conditions',
            label: 'Rage Terminate',
            headerText:
                'Termination conditions refer to the circumstances under which this agreement may be terminated, stopping the compensation stream and discharging the Parties of their obligations to perform under the agreement before the completion of its term. Material breach and mutual consent are mandatory. At will and rage terminate are optional.',
            fields: [
                {
                    id: 'mutual-consent',
                    label: 'Mutual Consent',
                    type: 'checkbox',
                    explaination: 'This allows the agreement to be terminated when both parties sign termination transactions.',
                    additionalFields: [],
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
                        'This allows a single party to immediately terminate the agreement only in the event of specific exigent circumstances. Select the conditions under which this agreement may be rage terminated.',
                    additionalFields: [
                        {
                            id: 'lost-control-of-private-keys',
                            type: 'checkbox',
                            label: 'Loss of Private Keys',
                            explaination: 'Counterparty has lost exclusive access to private key controlling compensation stream',
                            additionalFields: [],
                        },

                        {
                            id: 'moral-turpitude',
                            type: 'checkbox',
                            label: 'Crimes of Moral Turpitude',
                            explaination:
                                'Counterparty has been criminally indicted, internationally sanctioned, or credibly accused of fraud or a crime of moral turpitude',

                            additionalFields: [],
                        },
                        {
                            id: 'bankruptcy-dissolution-insolvency',
                            type: 'checkbox',
                            label: 'Bankruptcy / Dissolution / Insolvency',
                            explaination:
                                'Counterparty has entered bankruptcy or receivership, or has lost a license, certification or other requirement necessary for its performance under the agreement',

                            additionalFields: [],
                        },
                        {
                            id: 'legal-compulsion',
                            type: 'checkbox',
                            label: 'Legal Compulsion',
                            explaination:
                                'Terminating party has formed a good faith belief that continued performance of its obligations under the agreement exposes it to serious legal liability',

                            additionalFields: [],
                        },
                    ],
                },
            ],
        },
    ],
    previewText:
        'Preview the agreement for accuracy, and make any necessary changes before an offer or counteroffer is submitted to the counterparty.',
} as const;

export type AllInputs = typeof AGREEMENT_TEMPLATE['steps'][number]['fields'][number];
export type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T;

export type FIELD_IDS<T extends CheckboxInput | Exclude<Field, CheckboxInput>> = T extends CheckboxInput
    ? T['additionalFields'][number]['id'] | T['id']
    : T['id'];
export type IDS = FIELD_IDS<Mutable<AllInputs>>;

export const ALL_FIELD_IDS = AGREEMENT_TEMPLATE.steps.reduce<IDS[]>(
    (acc, s) => [
        ...acc,
        ...s.fields.flatMap(field => ('additionalFields' in field ? [field.id, ...field.additionalFields.map(sub => sub.id)] : [field.id])),
    ],
    [],
);

export type AuxFormData = { 'aux-token-symbol': string; 'aux-token-decimals': number; 'aux-token-name': string };

export type CreateAgreementForm = Record<IDS, string> & AuxFormData;

export const CREATE_AGREEMENT_FORM = ALL_FIELD_IDS.reduce<CreateAgreementForm>((acc, id) => ({ ...acc, [id]: '' }), {
    'aux-token-name': '',
    'aux-token-symbol': '',
    'aux-token-decimals': 0,
} as CreateAgreementForm);

export const NON_FORM_IDS = ['contractooor-url', 'token-name', 'sablier-url'] as const;

export const DOC_IDS = [...ALL_FIELD_IDS, ...NON_FORM_IDS] as const;

export type DOC_DATA = {
    [k in typeof DOC_IDS[number]]: string;
};
