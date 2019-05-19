import { ethers } from 'ethers';
import { IMethodOrEventCall, EventFilter, SolidoProviderType } from '@decent-bet/solido';
import { EthersSettings } from './EthersSettings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
export declare class Web3Plugin extends SolidoProvider implements SolidoContract {
    private provider;
    private wallet;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    getProviderType(): SolidoProviderType;
    onReady<T>(settings: T & EthersSettings): void;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): ethers.ContractFunction;
    getEvent(name: string): ethers.EventFilter;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
