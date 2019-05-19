import { ethers, Contract, ContractFunction } from 'ethers';
// eslint-disable-next-line spaced-comment
import { IMethodOrEventCall, EventFilter, SolidoProviderType } from '@decent-bet/solido';
import { EthersSigner } from './EthersSigner';
import { EthersSettings } from './EthersSettings';
import { SolidoProvider } from '@decent-bet/solido';
import { SolidoContract, SolidoSigner } from '@decent-bet/solido';
import { SolidoTopic } from '@decent-bet/solido';
/**
 * Web3Plugin provider for Solido
 */
export class Web3Plugin extends SolidoProvider implements SolidoContract {
    private provider: ethers.providers.Provider;
    private wallet: ethers.Wallet;
    public network: string;
    private instance: ethers.Contract;
    public defaultAccount: string;
    public address: string;
    private privateKey: string;
    
    public getProviderType(): SolidoProviderType {
        return SolidoProviderType.Ethers;
    }

    onReady<T>(settings: T & EthersSettings) {
        const { privateKey, provider, network, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.provider = provider;
        this.network = network;
        this.defaultAccount = defaultAccount;
        this.instance = new ethers.Contract(
            this.contractImport.address[network], 
            this.contractImport.raw.abi as any,
            provider
        )
        this.address = this.contractImport.address[network];        
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey);
        }        
    }

    async prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]):  Promise<SolidoSigner> {
        let gas = options.gas;
        
        if (!options.gas) gas = 1000000

        // get method instance with args
        const tx: ethers.ContractTransaction = await methodCall(...args, {
            gasLimit: gas,
        });

        const signedTx = this.wallet.sign(tx);
        return new EthersSigner(this.provider, signedTx);
    }
  
      
    getAbiMethod(name: string): object {
        return this.abi.filter(i => i.name === name)[0];
    }
    
    callMethod(name: string, args: any[]): any {
        let addr;
        addr = this.contractImport.address[this.network];
        const fn: ethers.ContractFunction = this.instance.functions[name];

        return fn(...args, {
            from: addr
        });
    }
    /**
     * Gets a Web3 Method object
     * @param name method name
     */
    getMethod(
        name: string,
    ): any {
        return this.instance.functions[name] as ContractFunction;        
    }

    /**
     * Gets a Connex Event object
     * @param address contract address
     * @param eventAbi event ABI
     */
    getEvent(
        name: string,
    ): any {
        return this.instance.filter[name] as EventFilter;
    }

    public async getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]> {
        const options: any = {};
        if(eventFilter) {
            const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
            if(filter) {
                options.filter = filter;
            }

            if(blocks) {
                const { fromBlock, toBlock } = blocks
                options.toBlock = toBlock;
                options.fromBlock = fromBlock;
            }

            if(range) {
                options.range = range
            }

            if(topics) {
                options.topics = (topics as SolidoTopic).get()
            }
      
            options.order = order || 'desc';
            
            if (pageOptions) {
                options.options = pageOptions
            }
        }

        return await this.instance.getPastEvents(name, options);
    }
}
