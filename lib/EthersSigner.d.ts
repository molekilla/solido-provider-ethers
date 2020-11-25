import { ethers } from 'ethers';
import { SolidoSigner } from '@decent-bet/solido';
import { Wallet } from 'xdvplatform-wallet';
export declare class EthersSigner implements SolidoSigner {
    private provider;
    private signer;
    private wallet;
    private tx;
    accepted: any;
    constructor(provider: ethers.providers.Provider, signer: ethers.Wallet, wallet: Wallet, tx: ethers.utils.Transaction);
    canUse(): Promise<unknown>;
    requestSigning(): Promise<any>;
}
