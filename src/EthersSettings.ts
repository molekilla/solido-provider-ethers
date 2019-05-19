import { ethers } from 'ethers';

export class EthersSettings {
    privateKey: string;
    provider: ethers.providers.Provider;    
    network: string;
    defaultAccount: string;
}