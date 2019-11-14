# solido-provider-ethers
Solido provider for Ethers

## Examples



### Reactive
```typescript
import {
  SolidoModule,
} from '@decent-bet/solido';
import {
  EthersPlugin,
} from 'solido-provider-ethers';
import { ethers } from 'ethers';
import { from, interval } from 'rxjs';

// Setup contract mappings
const contractMappings = [
  {
    name: 'metacoin',
    import: {
      raw: {
        abi: require('./build/contracts/MetaCoin').abi,
      },
      address: {
        'local': '0x7C52ff3b19103B0197951EDc152f18C35904bf00'
      }
    },
    provider: EthersPlugin,
    enableDynamicStubs: true,
  },
];

// Create Solido Module
const solido = new SolidoModule(contractMappings);
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
const PRIVATE_KEY = '...';
const ACCOUNT = '0x0bd7637cb3d7c4ffea4d49b0bb3774657814ef48';

// Configure reactive solido store
const store = {
  state: {
    'balances': {
      metacoin: 0,
      eth: 0,
    },
  },
  mapActions: {
    sendCoin: {
      getter: 'balances',
      onFilter: 'Transfer',
      mutation: ({ contract }) => {
        const addr = contract.defaultAccount;
        return from([contract.methods.getBalanceInEth(addr),
          contract.methods.getBalance(addr)])
          .pipe(
            mergeMap(i => i),
            toArray(),
            map(i => {
              return {
                metacoin: 1*<any>i[0],
                eth: 1*<any>i[1]
              };
            })
          )
      },
    }
  }
};

// Bind contracts
const contracts = solido.bindContracts({
  'ethers': {
    provider,
    options: {
      privateKey: PRIVATE_KEY,
      defaultAccount: ACCOUNT,
      provider,
      network: 'local',
      store,
    }
  }
}).connect();

// Subscribe to store
(contracts.metacoin as any).subscribe('balances', (data) => {
  console.log(`subscribed to balances: ${data}`);
});

// Call action
setInterval(async () => {
  try {
    const r = await contracts.metacoin.methods.sendCoin('0x9d9075cb2776218d02ac0e6629a83b73776f9e0d', 1)
    .call({
      // need to send dispatch with mapAction name
      dispatch: 'sendCoin'
    });
  // console.log(r);
  }
  catch (e) {
    console.log(e);
  }
}, 20000);
```

### Lazy loading contracts
```typescript
// Create Solido Module
export const module = new SolidoModule(
  [
    {
      name: 'ConnexToken',
      import: EnergyContractImport,
      entity: EnergyTokenContract,
      provider: ConnexPlugin,
    }
  ],
);

module.addContractMapping({
      name: 'ThorifyToken',
      import: EnergyContractImport,
      enableDynamicStubs: true,
      provider: ThorifyPlugin,
});

const privateKey = '0x............';
const chainTag = '0x4a';
const defaultAccount = '0x...........';
const thorUrl = 'http://localhost:8669';

// thorify
const thor = thorify(new Web3(), thorUrl);

// connex framework node driver
const driver = await DriverNodeJS.connect(thorUrl);
const connex = new Framework(driver);
const { wallet } = driver;
wallet.add(PRIVATE_KEY);

const contracts = module.bindContracts({
  'connex': {
    provider: connex,
    options: {
      defaultAccount,
      chainTag,
      // ...connex options
    }
  },
  'thorify': {
    provider: thor,
    {
      privateKey,
      defaultAccount,
      chainTag      
    }
  }
});

// Add new contract and rebind 
module.addContractMapping({
      name: 'AstronautToken',
      import: AstronautToken,
      enableDynamicStubs: true,
      provider: ConnexPlugin,
});

module.rebind();

// Get single contract
const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');
token.connect();

// Get all contracts
interface MyContracts {
  ThorifyToken: EnergyTokenContract,
  ConnexToken: EnergyTokenContract,
}
const { ThorifyToken, ConnexToken }: MyContracts = contracts.connect();

(async () => {
  const balance = await token.balanceOf(defaultAccount);
  console.log(balance);
})();
```



### GetMethod

Returns a function method from a specific provider.

```typescript
class MyContractClass {
  @GetMethod({
    name: 'balanceOf'
  })
  public balanceOfMethod: () => any;
}

// ...
// using the method
const fn = myContractClassInstance.balanceOfMethod();
console.log(fn);
```

### Read

Executes a `call` and returns a response.

```typescript
class MyContractClass {
  @Read()
  public balanceOf: (address: string) => Promise<any>;
}

// ...
// using the read
const balance = await myContractClassInstance.balanceOf(address);
console.log(balance);
```

### Write

Executes a signing flow, which consists of:

* Prepares signing, eg for Connex displays the signing popup window.
* Send

```typescript
class MyContractClass {
  @Write({
    name: 'transfer',
    gas: 1_190_000,
    gasPriceCoef: 0
  })
  public transferMethod: (sendTo: string, wei: BigNumber) => Promise<any>;
}

// ...
// using the write
const tx = await myContractClassInstance.transferMethod(
  '0x........',
  new BigNumber(1 ** 6)
).request({
  gas: 500_000
});
console.log(tx);
```

`request` accepts an object with:

* `gas`: Gas limit
* `gasPriceCoef`: Gas price coefficient
* `from`: From address

### GetEvents

Executes a log event query and returns an array of typed logs.

```typescript
class MyContractClass {
  @GetEvents({
    name: 'Transfer',
    blocks: {
      fromBlock: 0,
      toBlock: 'latest'
    },
    order: 'desc',
    pageOptions: { limit: 10, offset: 0 }
  })
  public getTransferEvents: (
    fnOptions?: EventFilter<any>
  ) => Promise<ThorifyLog[]>;
  // The return type can by ThorifyLog or Connex.Thor.Event depending of the driver used in the contract.
}

// ...
// get the events
// you can pass the same EventFilter object in every call to change the options
const events = await myContractClassInstance.getTransferEvents({
  pageOptions: { limit: 10, offset: 10 }
});
console.log(events);
```

### Short module syntax

When you need to enable any contracts to support more than one provider, use the short module syntax. The provider name will be appended to the name.

```typescript
export const module = new SolidoModule(
  [
    {
      name: 'Token',
      import: EnergyContractImport,
    }
  ],
  ThorifyPlugin, ConnexPlugin, Web3Plugin, TronWebPlugin, QtumPlugin
);

const contracts = module.bindContracts();

const token = contracts.getContract<Web3Plugin>('Web3Token');

const balance = await token.methods.balanceOf();
```

### Dynamic Contract Entities

To let Solido generate Read, Write and Event methods, set `enableDynamicStubs: true` in contract mapping entry and use `GetDynamicContract` to get the contract. The generated stubs are available in `contract.methods`.

```typescript
export const module = new SolidoModule(
  [
    {
      name: 'ThorifyToken',
      import: EnergyContractImport,
      enableDynamicStubs: true
    }
  ],
  ThorifyPlugin
);

const contracts = module.bindContracts();

const token = contracts.getDynamicContract('ThorifyToken');

const balance = await token.methods.balanceOf();

const transferEvent = await token.events.Transfer(); // Returns an event object dependending on provider
```

### Topic Queries

You can query any log event call with a fluent topic query. A contract event signatures are define in `contract.topics`.

```typescript
// build query
let topicQuery = new ConnexSolidoTopic();
topicQuery.topic(0, energy.topics.Transfer.signature);

// set filter options
const filterOptions: EventFilter<any> = {
  pageOptions: {
    limit: 100,
    offset: 0
  },
  topics: topicQuery
};

const logs = await energy.logTransfer(filterOptions);
```

### Connex specific utilities - RxJS operators

#### blockConfirmationUntil

Waits for a block confirmation. Useful for waiting a confirmation and then request the transaction log.

```typescript
const response: any = await energy.logTransfer();
const blockConfirmation = blockConfirmationUntil(response.txid);
const subscription = blockConfirmation
  .pipe(switchMap(_ => response))
  .subscribe((log: any) => {
    // ... code goes here
  });
```

### Plugins

* (Vechain) Connex: [Solido Connex](https://github.com/decent-bet/solido-provider-connex)
* (Vechain) Thorify: [Solido Thorify](https://github.com/decent-bet/solido-provider-thorify)
* (Ethereum) Web3: [Solido Web3](https://github.com/decent-bet/solido-provider-web3)
* Vue/Vuex: [Vuex Solido](https://github.com/decent-bet/vuex-solido)
* Contract import generator for Truffle: [Connex Entity Builder](https://github.com/decent-bet/connex-entity-builder)
