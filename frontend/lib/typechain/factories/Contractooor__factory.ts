/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Contractooor, ContractooorInterface } from "../Contractooor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_sablier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "INCOMPATIBLE_TOKEN",
    type: "error",
  },
  {
    inputs: [],
    name: "INVALID_END_TIME",
    type: "error",
  },
  {
    inputs: [],
    name: "NOT_RECEIVER",
    type: "error",
  },
  {
    inputs: [],
    name: "NOT_SENDER_OR_RECEIVER",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [],
    name: "agreement",
    outputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "atWillDays",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "cureTimeDays",
        type: "uint16",
      },
      {
        internalType: "bool",
        name: "legalCompulsion",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "counterpartyMalfeasance",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "bankruptcyDissolutionInsolvency",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "counterpartyLostControlOfPrivateKeys",
        type: "bool",
      },
      {
        internalType: "string",
        name: "scopeOfWorkURI",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516104b73803806104b783398101604081905261002f916100fd565b61003761003d565b5061012d565b600054610100900460ff16156100a95760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811610156100fb576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b60006020828403121561010f57600080fd5b81516001600160a01b038116811461012657600080fd5b9392505050565b61037b8061013c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80637db3a9461461003b5780638129fc1c14610061575b600080fd5b61004361006b565b60405161005899989796959493929190610263565b60405180910390f35b610069610156565b005b60018054600254600380546001600160a01b03938416949383169361ffff600160a01b8504811694600160b01b81049091169360ff600160c01b8304811694600160c81b8404821694600160d01b8504831694600160d81b900490921692906100d39061030b565b80601f01602080910402602001604051908101604052809291908181526020018280546100ff9061030b565b801561014c5780601f106101215761010080835404028352916020019161014c565b820191906000526020600020905b81548152906001019060200180831161012f57829003601f168201915b5050505050905089565b600054610100900460ff16158080156101765750600054600160ff909116105b806101905750303b158015610190575060005460ff166001145b6101f75760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b6000805460ff19166001179055801561021a576000805461ff0019166101001790555b8015610260576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50565b6001600160a01b038a81168252891660208083019190915261ffff898116604084015288166060830152861515608083015285151560a083015284151560c083015283151560e083015261012061010083018190528351838201819052600092835b828110156102e257868101820151868201850183015281016102c5565b5060008583018401820152601f909101601f1916909301019091019a9950505050505050505050565b600181811c9082168061031f57607f821691505b60208210810361033f57634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220bace2ac609b5a6979a9795f17fec0ddec3fcde71d1e13d3304f9607bebf408c564736f6c63430008110033";

type ContractooorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractooorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Contractooor__factory extends ContractFactory {
  constructor(...args: ContractooorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _sablier: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Contractooor> {
    return super.deploy(_sablier, overrides || {}) as Promise<Contractooor>;
  }
  override getDeployTransaction(
    _sablier: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_sablier, overrides || {});
  }
  override attach(address: string): Contractooor {
    return super.attach(address) as Contractooor;
  }
  override connect(signer: Signer): Contractooor__factory {
    return super.connect(signer) as Contractooor__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractooorInterface {
    return new utils.Interface(_abi) as ContractooorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Contractooor {
    return new Contract(address, _abi, signerOrProvider) as Contractooor;
  }
}