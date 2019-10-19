import { IMethodOrEventCall, EventFilter, SolidoProviderType, ProviderInstance } from '@decent-bet/solido';
import { EthersSettings } from './EthersSettings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
export declare class EthersPlugin extends SolidoProvider implements SolidoContract {
    private provider;
    private wallet;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    getProviderType(): SolidoProviderType;
    describe(): string;
    onReady<T>(settings: T & EthersSettings): void;
    connect(): void;
    setInstanceOptions(settings: ProviderInstance): void;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): any;
    getEvent(name: string): any;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
