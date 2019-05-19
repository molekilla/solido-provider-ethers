var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from 'ethers';
import { SolidoProviderType } from '@decent-bet/solido';
import { EthersSigner } from './EthersSigner';
import { SolidoProvider } from '@decent-bet/solido';
export class Web3Plugin extends SolidoProvider {
    getProviderType() {
        return SolidoProviderType.Ethers;
    }
    onReady(settings) {
        const { privateKey, provider, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.provider = provider;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.instance = new ethers.Contract(this.contractImport.address[network], this.contractImport.raw.abi, provider);
        this.address = this.contractImport.address[network];
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey);
        }
    }
    prepareSigning(methodCall, options, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let gas = options.gas;
            if (!options.gas)
                gas = 1000000;
            const tx = yield methodCall(...args, {
                gasLimit: gas,
            });
            const signedTx = this.wallet.sign(tx);
            return new EthersSigner(this.provider, signedTx);
        });
    }
    getAbiMethod(name) {
        return this.abi.filter(i => i.name === name)[0];
    }
    callMethod(name, args) {
        let addr;
        addr = this.contractImport.address[this.network];
        const fn = this.instance.functions[name];
        return fn(...args, {
            from: addr
        });
    }
    getMethod(name) {
        return this.instance.functions[name];
    }
    getEvent(name) {
        return this.instance.filter[name];
    }
    getEvents(name, eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {};
            if (eventFilter) {
                const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
                if (filter) {
                    options.filter = filter;
                }
                if (blocks) {
                    const { fromBlock, toBlock } = blocks;
                    options.toBlock = toBlock;
                    options.fromBlock = fromBlock;
                }
                if (range) {
                    options.range = range;
                }
                if (topics) {
                    options.topics = topics.get();
                }
                options.order = order || 'desc';
                if (pageOptions) {
                    options.options = pageOptions;
                }
            }
            return yield this.instance.getPastEvents(name, options);
        });
    }
}
