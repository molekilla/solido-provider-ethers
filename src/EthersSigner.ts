import { ethers } from 'ethers';
import { SolidoSigner } from '@decent-bet/solido';


export class EthersSigner implements SolidoSigner {
    constructor(private provider: ethers.providers.Provider, private tx: any) {
    }
    async requestSigning(): Promise<any> {
        return await this.tx.wait(2);
    }
}
