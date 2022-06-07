export const langList = [
  {
    key: 'en-US',
    name: 'EN'
  },
  {
    key: 'ko-KR',
    name: '한국어',
  }
];

export const chainNetwork = [
  {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency:
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      },
    rpcUrls: ['https://mainnet.infura.io/v3/6335e3979fb14713814f850f052011fc'],
    blockExplorerUrls: ['https://etherscan.io'],
    themeName: 'ethereum',
    themeNameShow: 'Ethereum',
    aliasName: 'ETH',
    yeahProxyRegistry: '0x1Dd4affC01CFDAaCC90b355C2Dcc32d4a04967C6',
    yeahExchange: '0xCf9461984B12C7840304122F13a3C9b1088F4805',
    merkleValidatorAddress: '0x237F6b73Cf88F5568840Ed5f2491e16eDE724035',
    feeRecipient: '0xF5CE5167f5CFeD78C7228925142C9AF356F1fa6A',

    env: ['development', 'production']
  },
  {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency:
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      },
    rpcUrls: ['https://rinkeby.infura.io/v3/d363d254b81941a18f38f27683e50292'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    themeName: 'eth',
    themeNameShow: 'eth TEST',
    aliasName: 'ETH',
    yeahProxyRegistry: '0x757789228614Ed6e5fD2a503B796F66191A21ec5',
    yeahExchange: '0x1E29140322b5a0D8aEF70b69a7A58121a83B9B3d',
    merkleValidatorAddress: '0xDdd168612DBf77B2aBC255faC026350aB983b9C0',
    feeRecipient: '0x5a9F1C523BBc63c3e148FAfdcAB9025eC4792e03',
    env: ['development']
  }
];
