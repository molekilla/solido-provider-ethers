import { ethers } from 'ethers';
import { Wallet } from 'xdvplatform-wallet';
import { ReactiveContractStore } from './EthersPlugin';

export class EthersSettings {
    walletProvider?: Wallet;
    privateKey: string;
    provider: ethers.providers.Provider;    
    network: string;
    defaultAccount: string;
    store?: ReactiveContractStore;
}