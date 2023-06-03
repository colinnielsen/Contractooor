/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export type AgreementStruct = {
  provider: PromiseOrValue<string>;
  client: PromiseOrValue<string>;
  atWillDays: PromiseOrValue<BigNumberish>;
  cureTimeDays: PromiseOrValue<BigNumberish>;
  legalCompulsion: PromiseOrValue<boolean>;
  moralTurpitude: PromiseOrValue<boolean>;
  bankruptcyDissolutionInsolvency: PromiseOrValue<boolean>;
  counterpartyMalfeasance: PromiseOrValue<boolean>;
  lostControlOfPrivateKeys: PromiseOrValue<boolean>;
  contractURI: PromiseOrValue<string>;
};

export type AgreementStructOutput = [
  string,
  string,
  number,
  number,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  string
] & {
  provider: string;
  client: string;
  atWillDays: number;
  cureTimeDays: number;
  legalCompulsion: boolean;
  moralTurpitude: boolean;
  bankruptcyDissolutionInsolvency: boolean;
  counterpartyMalfeasance: boolean;
  lostControlOfPrivateKeys: boolean;
  contractURI: string;
};

export interface ContractooorAgreementInterface extends utils.Interface {
  functions: {
    "agreement()": FunctionFragment;
    "atWillTerminationTimestamp(address)": FunctionFragment;
    "emergencyRecoverTokens(address)": FunctionFragment;
    "initialize(address,address,uint256,uint256,(address,address,uint16,uint16,bool,bool,bool,bool,bool,string))": FunctionFragment;
    "issueNoticeOfCure(string)": FunctionFragment;
    "issueNoticeOfMaterialBreach(string)": FunctionFragment;
    "issueNoticeOfTermination(string)": FunctionFragment;
    "materialBreachTimestamp(address)": FunctionFragment;
    "mutualConsentTerminationId()": FunctionFragment;
    "rageTerminate(uint8,string)": FunctionFragment;
    "streamId()": FunctionFragment;
    "terminateAtWill()": FunctionFragment;
    "terminateByMaterialBreach()": FunctionFragment;
    "terminateByMutualConsent(string)": FunctionFragment;
    "timesContractBreached()": FunctionFragment;
    "withdrawNoticeOfMaterialBreach(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "agreement"
      | "atWillTerminationTimestamp"
      | "emergencyRecoverTokens"
      | "initialize"
      | "issueNoticeOfCure"
      | "issueNoticeOfMaterialBreach"
      | "issueNoticeOfTermination"
      | "materialBreachTimestamp"
      | "mutualConsentTerminationId"
      | "rageTerminate"
      | "streamId"
      | "terminateAtWill"
      | "terminateByMaterialBreach"
      | "terminateByMutualConsent"
      | "timesContractBreached"
      | "withdrawNoticeOfMaterialBreach"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "agreement", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "atWillTerminationTimestamp",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "emergencyRecoverTokens",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      AgreementStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "issueNoticeOfCure",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "issueNoticeOfMaterialBreach",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "issueNoticeOfTermination",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "materialBreachTimestamp",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "mutualConsentTerminationId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rageTerminate",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "streamId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "terminateAtWill",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "terminateByMaterialBreach",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "terminateByMutualConsent",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "timesContractBreached",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawNoticeOfMaterialBreach",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "agreement", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "atWillTerminationTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emergencyRecoverTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "issueNoticeOfCure",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "issueNoticeOfMaterialBreach",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "issueNoticeOfTermination",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "materialBreachTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mutualConsentTerminationId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rageTerminate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "streamId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "terminateAtWill",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "terminateByMaterialBreach",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "terminateByMutualConsent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timesContractBreached",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawNoticeOfMaterialBreach",
    data: BytesLike
  ): Result;

  events: {
    "AgreementTerminated(address,uint8)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "RageTermination(address,string,uint8)": EventFragment;
    "TerminationProposalDeleted(address,string,uint8)": EventFragment;
    "TerminationProposed(address,string,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AgreementTerminated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RageTermination"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TerminationProposalDeleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TerminationProposed"): EventFragment;
}

export interface AgreementTerminatedEventObject {
  terminator: string;
  reason: number;
}
export type AgreementTerminatedEvent = TypedEvent<
  [string, number],
  AgreementTerminatedEventObject
>;

export type AgreementTerminatedEventFilter =
  TypedEventFilter<AgreementTerminatedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface RageTerminationEventObject {
  terminator: string;
  terminationInfo: string;
  reason: number;
}
export type RageTerminationEvent = TypedEvent<
  [string, string, number],
  RageTerminationEventObject
>;

export type RageTerminationEventFilter = TypedEventFilter<RageTerminationEvent>;

export interface TerminationProposalDeletedEventObject {
  proposer: string;
  information: string;
  initialTerminationReason: number;
}
export type TerminationProposalDeletedEvent = TypedEvent<
  [string, string, number],
  TerminationProposalDeletedEventObject
>;

export type TerminationProposalDeletedEventFilter =
  TypedEventFilter<TerminationProposalDeletedEvent>;

export interface TerminationProposedEventObject {
  proposer: string;
  terminationInfo: string;
  reason: number;
}
export type TerminationProposedEvent = TypedEvent<
  [string, string, number],
  TerminationProposedEventObject
>;

export type TerminationProposedEventFilter =
  TypedEventFilter<TerminationProposedEvent>;

export interface ContractooorAgreement extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ContractooorAgreementInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    agreement(
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        number,
        number,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        string
      ] & {
        provider: string;
        client: string;
        atWillDays: number;
        cureTimeDays: number;
        legalCompulsion: boolean;
        moralTurpitude: boolean;
        bankruptcyDissolutionInsolvency: boolean;
        counterpartyMalfeasance: boolean;
        lostControlOfPrivateKeys: boolean;
        contractURI: string;
      }
    >;

    atWillTerminationTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    emergencyRecoverTokens(
      streamToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _sablier: PromiseOrValue<string>,
      streamToken: PromiseOrValue<string>,
      tokensToStream: PromiseOrValue<BigNumberish>,
      termLength: PromiseOrValue<BigNumberish>,
      _agreement: AgreementStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    issueNoticeOfCure(
      cureInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    issueNoticeOfMaterialBreach(
      breachInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    issueNoticeOfTermination(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    materialBreachTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    mutualConsentTerminationId(overrides?: CallOverrides): Promise<[string]>;

    rageTerminate(
      reason: PromiseOrValue<BigNumberish>,
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    streamId(overrides?: CallOverrides): Promise<[BigNumber]>;

    terminateAtWill(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    terminateByMaterialBreach(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    terminateByMutualConsent(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    timesContractBreached(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdrawNoticeOfMaterialBreach(
      withdrawalReason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  agreement(
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      number,
      number,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      string
    ] & {
      provider: string;
      client: string;
      atWillDays: number;
      cureTimeDays: number;
      legalCompulsion: boolean;
      moralTurpitude: boolean;
      bankruptcyDissolutionInsolvency: boolean;
      counterpartyMalfeasance: boolean;
      lostControlOfPrivateKeys: boolean;
      contractURI: string;
    }
  >;

  atWillTerminationTimestamp(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  emergencyRecoverTokens(
    streamToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _sablier: PromiseOrValue<string>,
    streamToken: PromiseOrValue<string>,
    tokensToStream: PromiseOrValue<BigNumberish>,
    termLength: PromiseOrValue<BigNumberish>,
    _agreement: AgreementStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  issueNoticeOfCure(
    cureInfo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  issueNoticeOfMaterialBreach(
    breachInfo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  issueNoticeOfTermination(
    terminationInfo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  materialBreachTimestamp(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  mutualConsentTerminationId(overrides?: CallOverrides): Promise<string>;

  rageTerminate(
    reason: PromiseOrValue<BigNumberish>,
    terminationInfo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  streamId(overrides?: CallOverrides): Promise<BigNumber>;

  terminateAtWill(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  terminateByMaterialBreach(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  terminateByMutualConsent(
    terminationInfo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  timesContractBreached(overrides?: CallOverrides): Promise<BigNumber>;

  withdrawNoticeOfMaterialBreach(
    withdrawalReason: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    agreement(
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        number,
        number,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        string
      ] & {
        provider: string;
        client: string;
        atWillDays: number;
        cureTimeDays: number;
        legalCompulsion: boolean;
        moralTurpitude: boolean;
        bankruptcyDissolutionInsolvency: boolean;
        counterpartyMalfeasance: boolean;
        lostControlOfPrivateKeys: boolean;
        contractURI: string;
      }
    >;

    atWillTerminationTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    emergencyRecoverTokens(
      streamToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      _sablier: PromiseOrValue<string>,
      streamToken: PromiseOrValue<string>,
      tokensToStream: PromiseOrValue<BigNumberish>,
      termLength: PromiseOrValue<BigNumberish>,
      _agreement: AgreementStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    issueNoticeOfCure(
      cureInfo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    issueNoticeOfMaterialBreach(
      breachInfo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    issueNoticeOfTermination(
      terminationInfo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    materialBreachTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mutualConsentTerminationId(overrides?: CallOverrides): Promise<string>;

    rageTerminate(
      reason: PromiseOrValue<BigNumberish>,
      terminationInfo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    streamId(overrides?: CallOverrides): Promise<BigNumber>;

    terminateAtWill(overrides?: CallOverrides): Promise<void>;

    terminateByMaterialBreach(overrides?: CallOverrides): Promise<void>;

    terminateByMutualConsent(
      terminationInfo: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    timesContractBreached(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawNoticeOfMaterialBreach(
      withdrawalReason: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AgreementTerminated(address,uint8)"(
      terminator?: PromiseOrValue<string> | null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): AgreementTerminatedEventFilter;
    AgreementTerminated(
      terminator?: PromiseOrValue<string> | null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): AgreementTerminatedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "RageTermination(address,string,uint8)"(
      terminator?: PromiseOrValue<string> | null,
      terminationInfo?: null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): RageTerminationEventFilter;
    RageTermination(
      terminator?: PromiseOrValue<string> | null,
      terminationInfo?: null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): RageTerminationEventFilter;

    "TerminationProposalDeleted(address,string,uint8)"(
      proposer?: PromiseOrValue<string> | null,
      information?: null,
      initialTerminationReason?: PromiseOrValue<BigNumberish> | null
    ): TerminationProposalDeletedEventFilter;
    TerminationProposalDeleted(
      proposer?: PromiseOrValue<string> | null,
      information?: null,
      initialTerminationReason?: PromiseOrValue<BigNumberish> | null
    ): TerminationProposalDeletedEventFilter;

    "TerminationProposed(address,string,uint8)"(
      proposer?: PromiseOrValue<string> | null,
      terminationInfo?: null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): TerminationProposedEventFilter;
    TerminationProposed(
      proposer?: PromiseOrValue<string> | null,
      terminationInfo?: null,
      reason?: PromiseOrValue<BigNumberish> | null
    ): TerminationProposedEventFilter;
  };

  estimateGas: {
    agreement(overrides?: CallOverrides): Promise<BigNumber>;

    atWillTerminationTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    emergencyRecoverTokens(
      streamToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      _sablier: PromiseOrValue<string>,
      streamToken: PromiseOrValue<string>,
      tokensToStream: PromiseOrValue<BigNumberish>,
      termLength: PromiseOrValue<BigNumberish>,
      _agreement: AgreementStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    issueNoticeOfCure(
      cureInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    issueNoticeOfMaterialBreach(
      breachInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    issueNoticeOfTermination(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    materialBreachTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mutualConsentTerminationId(overrides?: CallOverrides): Promise<BigNumber>;

    rageTerminate(
      reason: PromiseOrValue<BigNumberish>,
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    streamId(overrides?: CallOverrides): Promise<BigNumber>;

    terminateAtWill(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    terminateByMaterialBreach(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    terminateByMutualConsent(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    timesContractBreached(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawNoticeOfMaterialBreach(
      withdrawalReason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    agreement(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    atWillTerminationTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    emergencyRecoverTokens(
      streamToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _sablier: PromiseOrValue<string>,
      streamToken: PromiseOrValue<string>,
      tokensToStream: PromiseOrValue<BigNumberish>,
      termLength: PromiseOrValue<BigNumberish>,
      _agreement: AgreementStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    issueNoticeOfCure(
      cureInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    issueNoticeOfMaterialBreach(
      breachInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    issueNoticeOfTermination(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    materialBreachTimestamp(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mutualConsentTerminationId(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rageTerminate(
      reason: PromiseOrValue<BigNumberish>,
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    streamId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    terminateAtWill(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    terminateByMaterialBreach(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    terminateByMutualConsent(
      terminationInfo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    timesContractBreached(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawNoticeOfMaterialBreach(
      withdrawalReason: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
