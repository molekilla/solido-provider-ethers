import { Observable } from 'rxjs';
import { IMethodOrEventCall, EventFilter, SolidoProviderType, ProviderInstance } from '@decent-bet/solido';
import { EthersSettings } from './EthersSettings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
export interface MapAction {
    [key: string]: {
        getter: string;
        onFilter: string;
        mutation: (data: object) => Observable<object>;
    };
}
export interface ReactiveContractStore {
    mapActions?: MapAction;
    state: object;
}
export declare class EthersPlugin extends SolidoProvider implements SolidoContract {
    private provider;
    private wallet;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    private store;
    private _subscriber;
    getProviderType(): SolidoProviderType;
    describe(): string;
    onReady<T>(settings: T & EthersSettings): void;
    connect(): void;
    setInstanceOptions(settings: ProviderInstance): void;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    subscribe(key: string, fn: any): import("rxjs").Subscription;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): any;
    getEvent(name: string): any;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
