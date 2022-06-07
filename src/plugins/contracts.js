import { chainNetwork } from '@/contants/index.js';
import ERC20 from '@/json/ERC20.json';
import store from '@/store'
import Vue from 'vue'
import i18n from "@/plugins/i18n"
import Web3 from 'web3'
export const web3Call = new Web3();
export const web3Send = new Web3();


export const getChainId = async () => {
    try {
        if(!window.ethereum){
            store.dispatch('setNetwork', parseInt(store.state.network));
            return parseInt(store.state.network);
        }
        let ethereum = window.ethereum;
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        const chainIdNumber = Web3.utils.hexToNumber(chainId);
        store.dispatch('setNetwork', chainIdNumber);
        console.log('chainIdNumber:'+chainIdNumber)
        if(chainIdNumber != 1) {
            const hash = window.location.href.indexOf('nftDetail') > -1;
            store.commit('SET_NETWORKDIALOGSHOW', hash);
        }else {
            store.commit('SET_NETWORKDIALOGSHOW', false);
        }
        let url;
        chainNetwork.map(e => {
            if (String(e.chainId) === String(store.state.network)) {
                let index = Math.floor(Math.random() * e.rpcUrls.length);
                url = e.rpcUrls[index];
            }
        });

        if(chainIdNumber === 1){
            url = window.ethereum;
        }
        console.log(url)
        await web3Call.setProvider(url);
        await web3Send.setProvider(window.ethereum);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}
export const initContractsWeb3 = async () => {
    return web3Send;
}


export const initContractsCall = async (abi, contractAddress) => {
    if(!contractAddress) return false;
    let contract = await new web3Call.eth.Contract(abi, contractAddress);
    return contract
}


export const initContractsSend = async (abi, contractAddress) => {
    let contract = await new web3Send.eth.Contract(abi, contractAddress);
    return contract
}

export const send = async (abi, contractAddress, arg, address, summary) => {
    if(!address){
        Vue.prototype.$message({
            message: 'Please log in',
            type: 'warning'
        });
        return false;
    }
    let contract = new web3Send.eth.Contract(abi, contractAddress);
    await new Promise(resolve => setTimeout(resolve, 1 * 500));
    let gas;
    try {
        gas = await contract.methods[arg.name](...arg.data).estimateGas({ from: address });
        gas = parseInt(gas * 1.6);
        console.log('gas:' + gas)
    } catch (error) {
        console.log(error)
        gas = 2500000;
    }
    if (!arg.erc20) {
        gas = 2500000;
    }
    let sendArg = {
        value: !arg.erc20 ? arg.data : undefined,
        from: address,
        gas,
    };
    arg.data = !arg.erc20 ? [] : arg.data;
    return await new Promise(resolve => {
        contract.methods[arg.name](...arg.data)
        .send(sendArg, async (e, o) => {
            console.log(e, o)
            let hash = o;
            if(!hash) resolve(false);
            addTransaction({ hash, summary, status: 1, address });

            if(window.transactionInterval)
                clearInterval(window.transactionInterval);
            window.transactionInterval = setInterval(() => {
                transationVerify(resolve)
            }, 1000)
        })
        .then((result) => {
            console.log(result)
            let hash = result.transactionHash;
            if(!hash) resolve(false);
            addTransaction({ hash, summary, status: 2, address });
            resolve(true)
            clearInterval(window.transactionInterval);
            window.transactionInterval = null;
        })
        .catch((result) => {
            console.log(result)
            let hash = result.receipt && result.receipt.transactionHash;
            if(!hash) resolve(false);

            addTransaction({ hash, summary, status: 3, address });
            resolve(false)
            clearInterval(window.transactionInterval);
            window.transactionInterval = null;
        });
    }) 
}

export const send2 = async (abi, contractAddress, arg, address, summary) => {
    if(!address){
        Vue.prototype.$message({
            message: 'Please log in',
            type: 'warning'
        });
        return false;
    }
    let contract = new web3Send.eth.Contract(abi, contractAddress);
    await new Promise(resolve => setTimeout(resolve, 1 * 500));
    let gas;
    try {
        gas = await contract.methods[arg.name](...arg.data).estimateGas({ from: address,value: arg.value });
        gas = parseInt(gas * 1.6);
        console.log('gas:' + gas)
    } catch (error) {
        console.log(error);
        gas = 2500000;
    }
    let sendArg = {
        value: arg.value,
        from: address,
        gas,
    };
    arg.data = !arg.erc20 ? [] : arg.data;
    console.log(arg.data);
    return await new Promise(resolve => {
        contract.methods[arg.name](...arg.data)
        .send(sendArg)
        .then((result) => {
            console.log(result);
            resolve(true)
        })
        .catch((result) => {
            console.log(result);
            resolve(false);
        });
    });
}

export const transationVerify = async (resolve) => {
    let transation = localStorage.getItem('transation');
    let transationCatch = transation ? JSON.parse(transation) : [];
    let transactionCloneStatus = [];
    let success;
    transationCatch.map(o => {
        transactionCloneStatus.push(o.status)
    });
    if (transactionCloneStatus.indexOf(1) > -1) {
        success = false;
    }
    if (transactionCloneStatus.indexOf(1) === -1) {
        success = true;
    }
    console.log(success);
    if (success) {
        clearInterval(window.transactionInterval)
        resolve(true);
    }

}

export const changeErc20Contracts = async (e) => {
    if(!ethereum) return false;
    await web3Send.setProvider(window.ethereum);
    let contract = await new web3Send.eth.Contract(ERC20.abi, e);
    return contract;
}


export const addTransaction = async (e) => {

    if (typeof e.hash !== 'string') return;

    let transation = localStorage.getItem('transation');
    let transationCatch = transation ? JSON.parse(transation) : [];
    let transationObj = {
        chainId: parseInt(store.state.network),
        address: e.address,
        hash: e.hash,
        summary: e.summary,
        status: e.status // 1 pending 2 success 3 error
    }

    let repeat = false;
    transationCatch.map((o, i) => {
        if (o.hash === e.hash) {
            transationCatch[i] = transationObj;
            repeat = true;
        }
    })

    if (!repeat) transationCatch.push(transationObj)

    store.dispatch('setTransation', transationCatch);
    
}
