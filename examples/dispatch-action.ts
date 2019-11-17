import {
  SolidoModule,
} from '@decent-bet/solido';
import {
  EthersPlugin, ReactiveBindings,
} from 'solido-provider-ethers';
import { ethers } from 'ethers';
import { from, interval } from 'rxjs';
import { mergeMap, toArray, map } from 'rxjs/operators';
import { mutations } from './mutations.solido';

// Setup contract mappings
const contractMappings = [
  {
    name: 'metacoin',
    import: {
      raw: {
        abi: require('./build/contracts/MetaCoin').abi,
      },
      address: {
        'local': '0xa6Cb5B652389BB2566b957aac11D6BddFD84Dff0'
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
const ACCOUNT = '0xaE5de5dcCc277A5AC601B4b1c8679D0552ebBd97';

// Configure reactive solido store
const store = {
  state: {
    'balances': {
      metacoin: 0,
      eth: 0,
    },
  },
  mutations: mutations,
  mapEvents: {
    Transfer: {
      getter: 'balances',
      mutation: 'SET_BALANCE',
      filter: (contract: any) => {
        return [contract.defaultAccount];
      },
    }
  },
  mapActions: {
    sendCoin: {
      getter: 'balances',
      onFilter: 'Transfer',
      mutation: 'SET_BALANCE',
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

const metacoin = contracts.metacoin as EthersPlugin;
// Subscribe to store
metacoin.subscribe('balances', (data) => {
  console.log(`subscribed to balances: ${JSON.stringify(data)}`);
});

// Call action
setInterval(async () => {
  try {
    const r = await contracts.metacoin.methods.sendCoin('0x9d9075cb2776218d02ac0e6629a83b73776f9e0d', 1)
    .call({
      // need to send dispatch with mapAction name
      dispatch: 'sendCoin'
    });
  }
  catch (e) {
    console.log(e);
  }
}, 20_000);