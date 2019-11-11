import { ethers } from 'ethers';
import { ReactiveContractStore } from './EthersPlugin';
export declare class EthersSettings {
    privateKey: string;
    provider: ethers.providers.Provider;
    network: string;
    defaultAccount: string;
    store: ReactiveContractStore;
}
