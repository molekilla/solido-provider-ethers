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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const ethers_1 = require("ethers");
const solido_1 = require("@decent-bet/solido");
const EthersSigner_1 = require("./EthersSigner");
const solido_2 = require("@decent-bet/solido");
const UncheckedSigner_1 = require("./UncheckedSigner");
class EthersPlugin extends solido_2.SolidoProvider {
    constructor() {
        super(...arguments);
        this.store = {
            mapActions: {},
            mapEvents: {},
            mutations: {},
            state: {}
        };
    }
    getProviderType() {
        return solido_1.SolidoProviderType.Ethers;
    }
    describe() {
        return `network: ${this.network}`;
    }
    onReady(settings) {
        const { privateKey, store, provider, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.provider = provider;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.instance = new ethers_1.ethers.Contract(this.contractImport.address[network], this.contractImport.raw.abi, provider);
        this.address = this.contractImport.address[network];
        if (privateKey) {
            this.wallet = new ethers_1.ethers.Wallet(privateKey, provider);
            this.instance = new ethers_1.ethers.Contract(this.contractImport.address[network], this.contractImport.raw.abi, this.wallet);
        }
        if (store) {
            this._subscriber = new rxjs_1.Subject();
            this.store = store;
            this._subscriber.subscribe((state) => {
                this.store.state = state;
            });
        }
    }
    connect() {
        if (this.provider && this.network && this.defaultAccount) {
            this.instance = new ethers_1.ethers.Contract(this.contractImport.address[this.network], this.contractImport.raw.abi, this.provider);
            this.address = this.contractImport.address[this.network];
            if (this.privateKey === 'metamask' || this.privateKey === 'provider') {
                const randomwallet = ethers_1.ethers.Wallet.createRandom();
                this.wallet = randomwallet.connect(this.provider);
                const signer = new UncheckedSigner_1.UncheckedJsonRpcSigner(this.provider.getSigner());
                this.instance = new ethers_1.ethers.Contract(this.contractImport.address[this.network], this.contractImport.raw.abi, signer);
            }
            else if (this.privateKey) {
                this.wallet = new ethers_1.ethers.Wallet(this.privateKey, this.provider);
                this.instance = new ethers_1.ethers.Contract(this.contractImport.address[this.network], this.contractImport.raw.abi, this.wallet);
            }
            if (this.store) {
                this._subscriber = new rxjs_1.Subject();
                this._subscriber.subscribe((state) => {
                    this.store.state = state;
                });
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
        if (settings.options.store) {
            this._subscriber = new rxjs_1.Subject();
            this.store = settings.options.store;
        }
    }
    dispatchEvent(name) {
        let cancellable = null;
        const mapEvent = this.store.mapEvents[name];
        if (mapEvent) {
            const evt = this.instance.filters[name](...mapEvent.filter(this));
            const cb = (...args) => __awaiter(this, void 0, void 0, function* () {
                let mutation = mapEvent.mutation;
                if (typeof mapEvent.mutation === 'string') {
                    mutation = this.store.mutations[mapEvent.mutation];
                }
                try {
                    const mutateRes = yield mutation([...args], this).toPromise();
                    this._subscriber.next(Object.assign(Object.assign({}, this.store.state), { [mapEvent.getter]: mutateRes }));
                }
                catch (e) {
                    console.log('mutation error');
                }
            });
            this.instance.on(evt, cb);
            cancellable = () => {
                this.instance.removeListener(evt, cb);
            };
        }
        return cancellable;
    }
    prepareSigning(methodCall, options, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let gas = options.gas;
            if (!options.gas)
                gas = 100000;
            const tx = yield methodCall(...args, {
                gasLimit: gas,
                gasPrice: options.gasPrice || 21000
            });
            const mapActionName = options.dispatch;
            const mapAction = this.store.mapActions[mapActionName];
            if (mapAction) {
                let evt = this.instance.filters[mapAction.onFilter]();
                if (this.instance.listenerCount(mapAction.onFilter) === 0) {
                    this.instance.removeAllListeners(evt);
                    this.instance.on(evt, (...params) => __awaiter(this, void 0, void 0, function* () {
                        let mutation = mapAction.mutation;
                        if (typeof mapAction.mutation === 'string') {
                            mutation = this.store.mutations[mapAction.mutation];
                        }
                        try {
                            const mutateRes = yield mutation([...params], this).toPromise();
                            this._subscriber.next(Object.assign(Object.assign({}, this.store.state), { [mapAction.getter]: mutateRes }));
                        }
                        catch (e) {
                            console.log('mutation error');
                        }
                    }));
                }
            }
            return new EthersSigner_1.EthersSigner(this.provider, tx);
        });
    }
    subscribe(key, fn) {
        if (Object.keys(this.store.state).find(i => i === key)) {
            this._subscriber.pipe(operators_1.pluck(key)).subscribe(fn);
        }
    }
    getAbiMethod(name) {
        return this.abi.filter(i => i.name === name)[0];
    }
    callMethod(name, args) {
        let addr;
        addr = this.contractImport.address[this.network];
        const fn = this.instance.functions[name];
        return fn(...args);
    }
    getMethod(name) {
        return this.instance.functions[name];
    }
    getEvent(name) {
        return this.instance.filter[name];
    }
    getEvents(name, eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Use getEvent(eventName) and query using Ethers API');
        });
    }
}
exports.EthersPlugin = EthersPlugin;
