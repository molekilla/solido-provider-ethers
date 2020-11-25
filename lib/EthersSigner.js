"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthersSigner = void 0;
class EthersSigner {
    constructor(provider, signer, wallet, tx) {
        this.provider = provider;
        this.signer = signer;
        this.wallet = wallet;
        this.tx = tx;
    }
    canUse() {
        return __awaiter(this, void 0, void 0, function* () {
            let ticket = null;
            const init = this.accepted;
            return new Promise((resolve) => {
                resolve(true);
            });
        });
    }
    requestSigning() {
        return __awaiter(this, void 0, void 0, function* () {
            const estimate = yield this.provider.estimateGas(this.tx);
            this.wallet.onRequestPassphraseSubscriber.next({
                type: 'request_tx',
                payload: {
                    tx: this.tx,
                    estimate
                }
            });
            const canUseIt = yield this.canUse();
            if (canUseIt) {
                const signed = yield this.signer.sign(this.tx);
                const resp = yield this.provider.sendTransaction(signed);
                yield resp.wait(2);
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.EthersSigner = EthersSigner;
