import { NETWORKS } from '@/lib/constants/networks';
import { isConnectionActive, useWeb3 } from '@/lib/state/useWeb3';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Button,
    Checkbox,
    FormControl,
    Text,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spinner,
} from '@chakra-ui/react';
import { BigNumber, Contract, utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
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
    additionalFields?: Field[];
};

export type AddressInput = BaseInput & {
    type: 'address';
    addressType: 'account' | 'token';
};

export type Field = StringInput | TextAreaInput | TimeInput | TokenAmountInput | DropdownInput | CheckboxInput | AddressInput;

export const AddressInput = ({
    label,
    address,
    setAddress,
    defaultValue,
    placeholder,
}: {
    label: string;
    address: string;
    setAddress: (addr: string) => void;
    defaultValue?: string;
    placeholder?: string;
}) => {
    const isError = address ? !isAddress(address) : false;

    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <Input
                placeholder={placeholder ?? '0x...'}
                value={address ? address : defaultValue}
                onChange={e => setAddress(e.target.value)}
            />
            {isError && <FormErrorMessage>Invalid</FormErrorMessage>}
        </FormControl>
    );
};

export const TokenInput = ({
    label,
    // address,
    // setAddress,
    placeholder,
}: {
    label: string;
    address: string;
    setAddress: (addr: string) => void;
    placeholder?: string;
}) => {
    const { provider, walletConnection } = useWeb3();
    const [errorData, setError] = useState<{ message: string } | undefined>(undefined);
    const [tokenInfo, setTokenInfo] = useState<{ name: string; symbol: string; decimals: number } | 'loading' | 'init'>('init');
    const [address, setAddress] = useState<string>('');

    const getTokenData = useCallback(async () => {
        if (isAddress(address)) {
            setTokenInfo('loading');
            const ERC20 = new Contract(
                address,
                [
                    'function name() view returns (string)',
                    'function symbol() view returns (string)',
                    'function decimals() view returns (uint8)',
                ],
                provider,
            );
            try {
                const [name, symbol, decimals] = await Promise.all([ERC20.name(), ERC20.symbol(), ERC20.decimals()]);
                console.log(name, symbol, decimals);
                setTokenInfo({ name, symbol, decimals });
            } catch (e: any) {
                console.log(e);
                setError({ message: e.message });
            }
        } else {
            setTokenInfo('init');
        }
    }, [address, provider]);

    useEffect(() => {
        getTokenData();
    }, [address, getTokenData]);

    const error = address ? (errorData ? errorData : !isAddress(address) ? { message: 'Invalid Address' } : false) : false;

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <Input placeholder={placeholder ?? '0x...'} value={address} onChange={e => setAddress(e.target.value)} />
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
    setAmount,
    isDisabled,
    tokenDecimals,
    tokenSymbol,
}: {
    label: string;
    amount: string;
    setAmount: (amount: BigNumber) => void;
    isDisabled?: boolean;
    tokenDecimals: number;
    tokenSymbol: string;
}) => {
    const [localAmount, setLocalAmount] = useState('');

    const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalAmount(e.target.value);
        const parsed = tryParseTokenAmount(e.target.value, tokenDecimals);
        if (parsed) setAmount(parsed);
    };

    const isError = tryParseTokenAmount(localAmount, tokenDecimals) === undefined;

    return (
        <FormControl isInvalid={isError}>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <InputLeftAddon>{tokenSymbol}</InputLeftAddon>
                <Input placeholder={'0'} value={localAmount} onChange={handleAmount} />
            </InputGroup>
            {!!isError && <FormErrorMessage>Invalid token amount</FormErrorMessage>}
        </FormControl>
    );
};

export const TimeInput = ({
    label,
    // months,
    setTime,
    defaultValue,
    placeholder,
}: {
    label: string;
    // months: number;
    setTime: (t: number) => void;
    defaultValue?: number;
    placeholder?: string;
}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <NumberInput placeholder={placeholder} defaultValue={defaultValue} min={1} max={1200} onChange={(_, val) => setTime(val)}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    );
};

export const TextInput = ({
    label,
    text,
    setText,
    defaultValue,
    placeholder,
}: {
    label: string;
    text: string;
    setText: (text: string) => void;
    defaultValue?: string;
    placeholder?: string;
}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={placeholder} defaultValue={defaultValue} value={text} onChange={e => setText(e.target.value)} />
        </FormControl>
    );
};

export const DropdownInput = ({
    label,
    options,
    value,
    setValue,
    placeholder,
}: {
    label: string;
    options: string[];
    value: string | undefined;
    setValue: (val: string) => void;
    placeholder?: string;
}) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Menu matchWidth>
                <MenuButton width={'100%'} as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                    {value ? value : placeholder}
                </MenuButton>
                <MenuList>
                    {options.map((opt, i) => (
                        <MenuItem key={i} onClick={() => setValue(opt)}>
                            {opt}
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
