import { DispatcherArgs, EthersPlugin } from "solido-provider-ethers";
import { from } from "rxjs";
import { mergeMap, toArray, map } from "rxjs/operators";

export const mutations = {
    SET_BALANCE: (e: DispatcherArgs, contract: EthersPlugin) => {
        const addr = contract.defaultAccount;
        return from([contract.methods.getBalanceInEth(addr),
        contract.methods.getBalance(addr)])
            .pipe(
                mergeMap(i => i),
                toArray(),
                map(i => {
                    return {
                        metacoin: 1 * <any>i[0],
                        eth: 1 * <any>i[1]
                    };
                })
            )
    }
}