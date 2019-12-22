import { ethers } from 'ethers';

import { TransactionRequest, TransactionResponse } from 'ethers/providers';

export class UncheckedJsonRpcSigner extends ethers.Signer {
    readonly signer: ethers.providers.JsonRpcSigner;

    constructor(signer: ethers.providers.JsonRpcSigner) {
        super();
        ethers.utils.defineReadOnly(this, 'signer', signer);
        ethers.utils.defineReadOnly(this, 'provider', signer.provider);
    }

    getAddress(): Promise<string> {
        return this.signer.getAddress();
    }

    sendTransaction(transaction:TransactionRequest): Promise<TransactionResponse> {
        return this.signer.sendUncheckedTransaction(transaction).then((hash) => {
            return {
                hash: hash,
                nonce: null,
                gasLimit: null,
                gasPrice: null,
                data: null,
                value: null,
                chainId: null,
                confirmations: 0,
                from: null,
                wait: (confirmations?: number) => { return this.provider.waitForTransaction(hash, confirmations); }
            };
        });
    }

    signMessage(message: string | ethers.utils.Arrayish): Promise<string> {
        return this.signer.signMessage(message);
    }
}
