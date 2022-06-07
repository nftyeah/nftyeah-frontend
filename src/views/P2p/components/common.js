import { initContractsCall,send2,initContractsWeb3 } from "@/plugins/contracts"
import yeahExchange from '@/json/YeahExchange.json'
import ERC721 from '@/json/ERC721.json'
import yeahProxyRegistry from '@/json/YeahProxyRegistry.json'
import { sellOrder } from "@/plugins/request";
import { generateMixed,decimalsAbdicate } from '@/plugins/tools.js'
import Web3 from 'web3'
import Vue from 'vue'


export const getRegistryAddress = async (contractAddress,userAddress) => {
  const contract = await initContractsCall(yeahProxyRegistry.abi,contractAddress);
  return contract.methods.proxies(userAddress).call().then((result) => {
    return result;
  });
};



export const registryAddress = async (contractAddress,userAddress) => {
  let summary = 'registerProxy';
  const arg = {
    name: 'registerProxy',
    erc20: true,
    data: []
  };
  return await send2(yeahProxyRegistry.abi,contractAddress,arg,userAddress,summary);
};


export const isApprovedForAll = async(tokenAddress,userAddress,operator) => {
  const contract = await initContractsCall(ERC721.abi,tokenAddress);
  return contract.methods.isApprovedForAll(userAddress,operator).call().then((result) => {
    return result;
  });

};


export const setApprovalForAll = async (tokenAddress, operator, userAddress, summary) => {
  const arg = {
    name: 'setApprovalForAll',
    erc20: true,
    data: [operator, true]
  };
  return await send2(ERC721.abi, tokenAddress, arg, userAddress, summary)
};


export const getNonce = async(tokenAddress,userAddress) => {
  const contract = await initContractsCall(yeahExchange.abi,tokenAddress);
  return contract.methods.nonces(userAddress).call().then((result) => {
    return result;
  });
};



export const signOrder = async (nftAddress,nftId,userAddress,exchange,registryAdd,basePrice,listingTime,expirationTime,nonce,taker,
                                merkleValidatorAddress, feeRecipient) => {
  const web3Send = await initContractsWeb3();



  const nftIdHex = Web3.utils.stripHexPrefix(Web3.utils.numberToHex(nftId));
  let callData = '0xfb16a595';
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(userAddress, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(nftAddress, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(nftIdHex, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('c0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  console.log(callData);


  let salt = generateMixed(77);
  const msgParams = JSON.stringify({
    primaryType: "Order",
    types: {
      Order: [
        {
          name: "exchange",
          type: "address"
        },
        {
          name: "maker",
          type: "address"
        },
        {
          name: "taker",
          type: "address"
        },
        {
          name: "makerRelayerFee",
          type: "uint256"
        },
        {
          name: "takerRelayerFee",
          type: "uint256"
        },
        {
          name: "makerProtocolFee",
          type: "uint256"
        },
        {
          name: "takerProtocolFee",
          type: "uint256"
        },
        {
          name: "feeRecipient",
          type: "address"
        },
        {
          name: "feeMethod",
          type: "uint8"
        },
        {
          name: "side",
          type: "uint8"
        },
        {
          name: "saleKind",
          type: "uint8"
        },
        {
          name: "target",
          type: "address"
        },
        {
          name: "howToCall",
          type: "uint8"
        },
        {
          name: "calldata",
          type: "bytes"
        },
        {
          name: "replacementPattern",
          type: "bytes"
        },
        {
          name: "staticTarget",
          type: "address"
        },
        {
          name: "staticExtradata",
          type: "bytes"
        },
        {
          name: "paymentToken",
          type: "address"
        },
        {
          name: "basePrice",
          type: "uint256"
        },
        {
          name: "extra",
          type: "uint256"
        },
        {
          name: "listingTime",
          type: "uint256"
        },
        {
          name: "expirationTime",
          type: "uint256"
        },
        {
          name: "salt",
          type: "uint256"
        },
        {
          name: "nonce",
          type: "uint256"
        }
      ],
      EIP712Domain: [
        {
          name: "name",
          type: "string"
        },
        {
          name: "version",
          type: "string"
        },
        {
          name: "chainId",
          type: "uint256"
        },
        {
          name: "verifyingContract",
          type: "address"
        }
      ]
    },
    domain: {
      name: "Yeah Exchange Contract",
      version: "1.0",
      chainId: 4,
      verifyingContract: exchange,
    },
    message: {
      exchange: exchange,
      maker: userAddress,
      taker: taker,
      makerRelayerFee: "0",
      takerRelayerFee: "0",
      makerProtocolFee: "0",
      takerProtocolFee: "0",
      feeRecipient: feeRecipient,
      feeMethod: "1",
      side: "1",
      saleKind: "0",
      target: merkleValidatorAddress,
      howToCall: "1",
      calldata: callData,
      replacementPattern: "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      staticTarget: "0x0000000000000000000000000000000000000000",
      staticExtradata: "0x",
      paymentToken: "0x0000000000000000000000000000000000000000",
      basePrice: basePrice,
      extra: "0",
      listingTime: listingTime,
      expirationTime: expirationTime,
      salt: salt,
      nonce: nonce
    }
  });

  const from = userAddress;
  const params = [from, msgParams];
  const method = 'eth_signTypedData_v4';
  console.log(msgParams)
  const result = await web3Send.currentProvider.send(
    {
      method,
      params,
      from,
    },
    function (err, result) {
      if (err) return false;
      if (result.error) return false;
      return result.result;
    }
  );

  if(!result) {
    return false;
  }

  console.log(result);
  let r = result.slice(0,66);
  let s = '0x'+result.slice(66,130);
  let v = web3Send.utils.hexToNumber('0x'+result.slice(130,132));

  let dataSign = {
    exchange: exchange,
    maker: userAddress,
    taker: taker,
    makerRelayerFee: "0",
    takerRelayerFee: "0",
    makerProtocolFee: "0",
    takerProtocolFee: "0",
    feeRecipient: feeRecipient,
    feeMethod: "1",
    side: "1",
    saleKind: "0",
    target: merkleValidatorAddress,
    howToCall: "1",
    calldata: callData,
    replacementPattern: "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    staticTarget: "0x0000000000000000000000000000000000000000",
    staticExtradata: "0x",
    paymentToken: "0x0000000000000000000000000000000000000000",
    basePrice: basePrice,
    extra: "0",
    listingTime: listingTime,
    expirationTime: expirationTime,
    salt: salt,
    nonce: nonce,
    metadata:{
      asset: {
        id: nftId,
        address: nftAddress
      }
    },
    r,
    s,
    v
  };
  const order = await sellOrder(dataSign);
  console.log(order)
  if (order && order.code && order.code !== 1) {
    Vue.prototype.$notify({
      title: 'prompt',
      message: order.message,
      type: 'error',
      duration: 3000
    });
    return false;
  }
  return true;
};


export const cancelOrder = async (exchange,userAddress ,orderDetail) => {

  let taker = orderDetail.taker;
  if (orderDetail.taker === '') {
    taker = "0x0000000000000000000000000000000000000000";
  }
  const basePrice = decimalsAbdicate(orderDetail.basePrice);
  const addrs = [
    orderDetail.exchange,
    orderDetail.maker,
    taker,
    orderDetail.feeRecipient,
    orderDetail.target,
    orderDetail.staticTarget,
    orderDetail.paymentToken,
  ];
  const uints = [
    orderDetail.makerRelayerFee,
    orderDetail.takerRelayerFee,
    orderDetail.makerProtocolFee,
    orderDetail.takerProtocolFee,
    basePrice,
    orderDetail.extra,
    orderDetail.listingTimeParam,
    orderDetail.expirationTimeParam,
    orderDetail.salt,
  ];

  const feeMethod = orderDetail.feeMethod;
  const side = orderDetail.side;
  const saleKind = orderDetail.saleKind;
  const howToCall = orderDetail.howToCall;
  const calldata = orderDetail.calldata;
  const replacementPattern = orderDetail.replacementPattern;
  const staticExtradata = orderDetail.staticExtradata;
  const v = orderDetail.v;
  const r = orderDetail.r;
  const s = orderDetail.s;

  const summary = 'cancelOrder';

  const arg = {
    name: 'cancelOrder_',
    erc20: true,
    data: [addrs, uints,feeMethod, side, saleKind, howToCall, calldata, replacementPattern, staticExtradata, v, r, s]
  };
  return await send2(yeahExchange.abi, exchange, arg, userAddress, summary)

};


export const buyOrder = async(exchange,userAddress ,orderDetail) => {
  let taker = orderDetail.taker;
  if (orderDetail.taker === '') {
    taker = "0x0000000000000000000000000000000000000000";
  }
  const basePrice = decimalsAbdicate(orderDetail.basePrice);
  let salt = generateMixed(77);
  console.log(orderDetail.listingTimeParam);
  console.log(orderDetail.expirationTimeParam);

  const listingTime = orderDetail.listingTimeParam;
  const expirationTime = orderDetail.expirationTimeParam;

  let buyExpirationTime = orderDetail.expirationTimeParam + 600;
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const addrs = [
    orderDetail.exchange,
    userAddress,
    orderDetail.maker,
    zeroAddress,
    orderDetail.target,
    orderDetail.staticTarget,
    orderDetail.paymentToken,

    orderDetail.exchange,
    orderDetail.maker,
    taker,
    orderDetail.feeRecipient,
    orderDetail.target,
    orderDetail.staticTarget,
    orderDetail.paymentToken,
  ];

  const uints = [
    orderDetail.makerRelayerFee,
    orderDetail.takerRelayerFee,
    orderDetail.makerProtocolFee,
    orderDetail.takerProtocolFee,
    basePrice,
    orderDetail.extra,
    0,
    buyExpirationTime,
    salt,

    orderDetail.makerRelayerFee,
    orderDetail.takerRelayerFee,
    orderDetail.makerProtocolFee,
    orderDetail.takerProtocolFee,
    basePrice,
    orderDetail.extra,
    listingTime,
    expirationTime,
    orderDetail.salt,
  ];
  const feeMethodsSidesKindsHowToCalls = [

    orderDetail.feeMethod,
    0,
    orderDetail.saleKind,
    orderDetail.howToCall,

    orderDetail.feeMethod,
    orderDetail.side,
    orderDetail.saleKind,
    orderDetail.howToCall,
  ];

  // calldata
  const nftIdHex = Web3.utils.stripHexPrefix(Web3.utils.numberToHex(orderDetail.tokenId));
  let callData = '0xfb16a595';
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(userAddress, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(orderDetail.address, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft(nftIdHex, 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('c0', 64));
  callData+=Web3.utils.stripHexPrefix(Web3.utils.padLeft('0', 64));
  console.log(callData);
  const calldataBuy = callData;
  const calldataSell = orderDetail.calldata;
  const replacementPatternBuy = '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  const replacementPatternSell = orderDetail.replacementPattern;
  const staticExtradataBuy = '0x';
  const staticExtradataSell = '0x';

  const vs = [
    orderDetail.v,
    orderDetail.v
  ];
  const rssMetadata = [
    orderDetail.r,
    orderDetail.s,
    orderDetail.r,
    orderDetail.s,
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  ];

  const summary = 'buy Nft';
  
  const arg = {
    name: 'orderMatch',
    erc20: true,
    value: basePrice,
    data: [addrs, uints,feeMethodsSidesKindsHowToCalls, calldataBuy, calldataSell, replacementPatternBuy, replacementPatternSell,
      staticExtradataBuy, staticExtradataSell, vs, rssMetadata]
  };
  console.log(arg)
  return await send2(yeahExchange.abi, exchange, arg, userAddress, summary)


};

export const getNftOwner = async(nftAddress,nftId) => {
  const contract = await initContractsCall(ERC721.abi,nftAddress);

  const arg = {
    name: 'owner',
    erc20: true,
    data: [nftId]
  };
  console.log(arg)

  return contract.methods.ownerOf(nftId).call().then((result) => {
    return result;
  });

};

