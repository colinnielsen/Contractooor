import { CREATE_AGREEMENT_FORM } from '@/lib/constants/agreement';
import { NETWORKS } from '@/lib/constants/networks';
import { getTokenInfo, useLocalStorage } from '@/lib/helpers';
import { isConnectionActive, useWeb3 } from '@/lib/state/useWeb3';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputProps,
    InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputProps,
    NumberInputStepper,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

export type InputType = 'string' | 'dropdown' | 'time' | 'token-amount' | 'checkbox' | 'address' | 'textarea';

export type BaseInput = {
    id: string;
    label: string;
    placeholder: string;
    type: InputType;
};

export type StringInput = BaseInput & {
    type: 'string';
};

export type TokenAmountInput = BaseInput & {
    type: 'token-amount';
};

export type TextAreaInput = BaseInput & {
    type: 'textarea';
};

export type TimeInput = BaseInput & {
    type: 'time';
    subtype: 'days' | 'months' | 'years';
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
    explaination?: string;
    additionalFields: Field[];
};

export type AddressInput = BaseInput & {
    type: 'address';
    addressType: 'account' | 'token';
};

export type Field = StringInput | TextAreaInput | TimeInput | TokenAmountInput | DropdownInput | CheckboxInput | AddressInput;

const ethAddressRegex = new RegExp(/^0x[a-fA-F0-9]$/);

export const AddressInput = ({ label, ...input }: { label: string } & InputProps) => {
    const isError = (input.value as string).length === 40 ? ethAddressRegex.test(input.value as string) : false; //TODO
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        input.onChange!(e);
    };

    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={'0x...'} {...input} onChange={handleChange} />
            {isError && <FormErrorMessage>Invalid</FormErrorMessage>}
        </FormControl>
    );
};

export const TokenInput = ({
    label,
    ...input
}: {
    label: string;
} & InputProps) => {
    const { value: address } = input;
    const { setValues } = useFormikContext<typeof CREATE_AGREEMENT_FORM>();
    const { provider, walletConnection } = useWeb3();
    const [errorData, setError] = useState<{ message: string } | undefined>(undefined);
    const [tokenInfo, setTokenInfo] = useState<{ name: string; symbol: string; decimals: number } | 'loading' | 'init'>('init');

    const getTokenData = useCallback(async () => {
        if (typeof address === 'string' && isAddress(address)) {
            setTokenInfo('loading');
            try {
                const { name, symbol, decimals } = await getTokenInfo(provider, address);
                setTokenInfo({ name, symbol, decimals });
                setValues(prev => ({ ...prev, 'aux-token-symbol': symbol, 'aux-token-decimals': decimals, 'aux-token-name': name }));
                setError(undefined);
            } catch (e: any) {
                console.log(e);
                setError({ message: e.message });
                setTokenInfo('init');
            }
        } else {
            setTokenInfo('init');
        }
    }, [address, provider]);

    useEffect(() => {
        getTokenData();
    }, [address, getTokenData]);

    const error = address
        ? errorData
            ? errorData
            : typeof address === 'string' && !isAddress(address)
            ? { message: 'Invalid Address' }
            : false
        : false;

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <Input placeholder={input.placeholder ?? '0x...'} {...input} />
                <InputRightElement>{tokenInfo === 'loading' && <Spinner />}</InputRightElement>
            </InputGroup>

            {!!error ? (
                <FormErrorMessage>{error.message}</FormErrorMessage>
            ) : (
                typeof tokenInfo !== 'string' &&
                isConnectionActive(walletConnection) && (
                    <FormHelperText color={'green'}>
                        {tokenInfo.symbol} token on {NETWORKS[walletConnection.chainId].label}
                    </FormHelperText>
                )
            )}
        </FormControl>
    );
};

const tryParseTokenAmount = (amount: string, tokenDecimals: number) => {
    try {
        return utils.parseUnits(amount, tokenDecimals);
    } catch (e: any) {}
};

export const TokenAmountInput = ({
    label,
    tokenDecimals,
    tokenSymbol,
    ...input
}: {
    label: string;
    tokenDecimals: number;
    tokenSymbol: string;
} & InputProps) => {
    const [localAmount, setLocalAmount] = useState('');

    const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
        const fieldVal = e.target.value;
        const validCharacterInput = new RegExp(/^[+]?(?:\d+|\d*\.\d+|\.\d*|\d+\.)$/);

        const [char1, char2] = fieldVal.split('');
        if ((char1 === '0' && char2 === '0') || (fieldVal != '' && !validCharacterInput.test(fieldVal))) return;

        setLocalAmount(e.target.value);

        const parsed = tryParseTokenAmount(e.target.value, tokenDecimals);
        if (parsed) input.onChange!(e);
    };

    const isError = localAmount === '' ? false : tryParseTokenAmount(localAmount, tokenDecimals) === undefined;

    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <InputLeftAddon>{tokenSymbol}</InputLeftAddon>
                <Input {...input} value={!isError ? input.value : localAmount} onChange={handleAmount} />
            </InputGroup>
            {!!isError && <FormErrorMessage>Invalid token amount</FormErrorMessage>}
        </FormControl>
    );
};

export const TimeInput = ({
    label,
    ...input
}: {
    label: string;
} & NumberInputProps) => {
    const { setValues } = useFormikContext<typeof CREATE_AGREEMENT_FORM>();

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <NumberInput {...input} onChange={str => setValues(prev => ({ ...prev, [input.id!]: str }))} min={1} max={1200}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    );
};

export const TextInput = ({ label, defaultValue, ...input }: { label: string; defaultValue?: string } & InputProps) => {
    return (
        <FormControl>
            <FormLabel htmlFor={input.id}>{label}</FormLabel>
            <Input name={input.id} {...input} />
        </FormControl>
    );
};

export const DropdownInput = ({ label, options, ...input }: { label: string; options: DropdownInput['options'] } & InputProps) => {
    if (!input.id) throw new Error('DropdownInput must have an id');
    const { setValues } = useFormikContext<typeof CREATE_AGREEMENT_FORM>();

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Menu matchWidth>
                <MenuButton width={'100%'} as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                    {input.value ? input.value : input.placeholder}
                </MenuButton>
                <MenuList>
                    {options.map((opt, i) => (
                        <MenuItem
                            key={i}
                            onClick={() =>
                                setValues(prev => ({
                                    ...prev,
                                    [input.id!]: opt.label,
                                }))
                            }
                        >
                            {opt.label}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </FormControl>
    );
};

export const CheckboxInput = ({
    label,
    checked: checked,
    setChecked,
    placeholder,
}: {
    label: string;
    checked: boolean;
    setChecked: (val: boolean) => void;
    placeholder?: string;
}) => (
    <>
        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
        <Text fontSize={'18px'}></Text>
    </>
);

export const DebounceCache = <T extends any>({ val, delay, storageKey }: { val: any; storageKey: string; delay: number }) => {
    const [, cache] = useLocalStorage<T>(storageKey);

    const debounce = useCallback(
        _.debounce((val: T) => {
            cache(val);
        }, delay),
        [cache, delay],
    );

    useEffect(() => {
        debounce(val);
    }, [debounce, val]);

    return null;
};
