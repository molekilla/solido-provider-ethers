import { ethers } from 'ethers';
import { SolidoSigner } from '@decent-bet/solido';
export declare class EthersSigner implements SolidoSigner {
    private provider;
    private tx;
    constructor(provider: ethers.providers.Provider, tx: any);
    requestSigning(): Promise<any>;
}
