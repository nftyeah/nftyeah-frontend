import store from '@/store'
import { getChainId } from "@/plugins/contracts.js";
if(window.ethereum){
    let ethereum = window.ethereum;
    ethereum.autoRefreshOnNetworkChange = true;
    ethereum.on('networkChanged', async (e) => {
        const back = await getChainId();
        store.dispatch('setNetwork', e);
    })
    ethereum.on('accountsChanged', (e) => {
        console.log(e)
        store.commit('SET_ADDRESS', e[0]);
    })
}

export default {};