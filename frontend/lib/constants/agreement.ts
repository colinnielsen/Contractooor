import { NETWORKS } from './networks';

type InputType = 'string' | 'dropdown' | 'months' | 'token-amount' | 'checkbox' | 'address' | 'textarea';

type BaseInput = {
    id: string;
    label: string;
    placeholder: string;
    type: InputType;
};

type StringInput = BaseInput & {
    type: 'string';
};

type TokenAmountInput = BaseInput & {
    type: 'token-amount';
};

type TextAreaInput = BaseInput & {
    type: 'textarea';
};

type MonthInput = BaseInput & {
    type: 'months';
};

export type DropdownInput = BaseInput & {
    type: 'dropdown';
    options: {
        id: string;
        label: string;
    }[];
};

export type CheckboxInput = Omit<BaseInput, 'placeholder'> & {
    type: 'checkbox';
    options: {
        id: string;
        label: string;
    }[];
};

export type AddressInput = BaseInput & {
    type: 'address';
    addressType: 'account' | 'token';
};

export type Field = StringInput | TextAreaInput | MonthInput | TokenAmountInput | DropdownInput | CheckboxInput | AddressInput;

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
                { type: 'string', id: 'sr-legal-name', label: 'Legal Name', placeholder: 'Name of client' },
                {
                    type: 'dropdown',
                    id: 'sr-legal-structure',
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
                    id: 'sr-jurisdiction',
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
                    type: 'months',
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
            fields: [],
        },
    ],
} as const;
