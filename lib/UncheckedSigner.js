"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UncheckedJsonRpcSigner = void 0;
const ethers_1 = require("ethers");
class UncheckedJsonRpcSigner extends ethers_1.ethers.Signer {
    constructor(signer) {
        super();
        ethers_1.ethers.utils.defineReadOnly(this, 'signer', signer);
        ethers_1.ethers.utils.defineReadOnly(this, 'provider', signer.provider);
    }
    getAddress() {
        return this.signer.getAddress();
    }
    sendTransaction(transaction) {
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
                wait: (confirmations) => { return this.provider.waitForTransaction(hash, confirmations); }
            };
        });
    }
    signMessage(message) {
        return this.signer.signMessage(message);
    }
}
exports.UncheckedJsonRpcSigner = UncheckedJsonRpcSigner;
