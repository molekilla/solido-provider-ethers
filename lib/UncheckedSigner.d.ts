import { ethers } from 'ethers';
import { TransactionRequest, TransactionResponse } from 'ethers/providers';
export declare class UncheckedJsonRpcSigner extends ethers.Signer {
    readonly signer: ethers.providers.JsonRpcSigner;
    constructor(signer: ethers.providers.JsonRpcSigner);
    getAddress(): Promise<string>;
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
    signMessage(message: string | ethers.utils.Arrayish): Promise<string>;
}
