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
const ethers_1 = require("ethers");
const solido_1 = require("@decent-bet/solido");
const EthersSigner_1 = require("./EthersSigner");
const solido_2 = require("@decent-bet/solido");
class EthersPlugin extends solido_2.SolidoProvider {
    getProviderType() {
        return solido_1.SolidoProviderType.Ethers;
    }
    describe() {
        return `network: ${this.network}`;
    }
    onReady(settings) {
        const { privateKey, provider, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.provider = provider;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.instance = new ethers_1.ethers.Contract(this.contractImport.address[network], this.contractImport.raw.abi, provider);
        this.address = this.contractImport.address[network];
        if (privateKey) {
            this.wallet = new ethers_1.ethers.Wallet(privateKey);
        }
    }
    connect() {
        if (this.provider && this.network && this.defaultAccount) {
            this.instance = new ethers_1.ethers.Contract(this.contractImport.address[this.network], this.contractImport.raw.abi, this.provider);
            this.address = this.contractImport.address[this.network];
            if (this.privateKey) {
                this.wallet = new ethers_1.ethers.Wallet(this.privateKey);
            }
        }
        else {
            throw new Error('Missing onReady settings');
        }
    }
    setInstanceOptions(settings) {
        this.provider = settings.provider;
        if (settings.options.network) {
            this.network = settings.options.network;
        }
        if (settings.options.defaultAccount) {
            this.defaultAccount = settings.options.defaultAccount;
        }
        if (settings.options.privateKey) {
            this.privateKey = settings.options.privateKey;
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
            return new EthersSigner_1.EthersSigner(this.provider, signedTx);
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
exports.EthersPlugin = EthersPlugin;
