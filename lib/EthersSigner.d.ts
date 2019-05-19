import { ethers } from 'ethers';
import { SolidoSigner } from '@decent-bet/solido';
export declare class EthersSigner implements SolidoSigner {
    private provider;
    private signedTransaction;
    constructor(provider: ethers.providers.Provider, signedTransaction: any);
    requestSigning(): Promise<any>;
}
