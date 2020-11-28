import { IMethodOrEventCall, EventFilter, SolidoProviderType, ProviderInstance } from '@decent-bet/solido';
import { EthersSettings } from './EthersSettings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
import { Wallet } from 'xdvplatform-wallet';
export declare type DispatcherArgs = object | [];
export interface MapAction {
    [key: string]: {
        getter: string;
        onFilter: string;
        mutation: string | ((e: DispatcherArgs, contract: EthersPlugin) => any);
    };
}
export interface MapEvent {
    [key: string]: {
        getter: string;
        mutation: string;
    };
}
export interface Mutation {
    [key: string]: (e: DispatcherArgs, contract: EthersPlugin) => any;
}
export interface ReactiveContractStore {
    mapActions?: MapAction;
    mapEvents?: MapEvent;
    mutations: Mutation;
    state: object;
}
export interface ReactiveBindings {
    dispatchEvent(name: string, filter: any[]): () => {};
    subscribe(name: string, callback: () => {}): void;
}
export declare class EthersPlugin extends SolidoProvider implements SolidoContract, ReactiveBindings {
    private provider;
    private wallet;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    private store;
    private _subscriber;
    walletProvider: Wallet;
    getProviderType(): SolidoProviderType;
    describe(): string;
    onReady<T>(settings: T & EthersSettings): void;
    connect(): void;
    setInstanceOptions(settings: ProviderInstance): void;
    dispatchEvent(name: string, filter: any[]): () => {};
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    subscribe(key: string, fn: any): void;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): any;
    getEvent(name: string): any;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
