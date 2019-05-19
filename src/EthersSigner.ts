import { ethers } from 'ethers';
import { SolidoSigner } from '@decent-bet/solido';


export class EthersSigner implements SolidoSigner {
    constructor(private provider: ethers.providers.Provider, private signedTransaction: any) {
    }
    async requestSigning(): Promise<any> {
        return await this.provider.sendTransaction(this.signedTransaction);
    }
}