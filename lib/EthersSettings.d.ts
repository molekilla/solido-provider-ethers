import { ethers } from 'ethers';
export declare class EthersSettings {
    privateKey: string;
    provider: ethers.providers.Provider;
    network: string;
    defaultAccount: string;
}
