# purple-ice-lite

<div style="display: flex; margin: 10px 0;">
<svg style="width: 18px; margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-language" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M4 5h7"></path>
   <path d="M9 3v2c0 4.418 -2.239 8 -5 8"></path>
   <path d="M5 9c0 2.144 2.952 3.908 6.7 4"></path>
   <path d="M12 20l4 -9l4 9"></path>
   <path d="M19.1 18h-6.2"></path>
</svg>
<b> English </b>
<span style="margin: 0 5px;"> | </span> 
<a href="https://github.com/wbxl2000/purple-ice-lite/blob/main/README.zh.md"> 简体中文</a> 
</div>

<div style="display: flex; margin: 10px 0;">
<svg style="width: 18px; margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-bilibili" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M3 10a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v6a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-6z"></path>
   <path d="M8 3l2 3"></path>
   <path d="M16 3l-2 3"></path>
   <path d="M9 13v-2"></path>
   <path d="M15 11v2"></path>
</svg>
<a href="https://www.bilibili.com/video/BV1uU4y117U1/"> Demo Video</a> 
</div>

## Introduction

purple-ice-lite is a mini NFT trading market that runs on a local blockchain and can perform Connect wallet, Mint, Sale, and Buy operations. It includes

- Local blockchain
- Two smart contract source codes, testing and deployment
- A native JS-written DApp
- A tutorial that teaches you how to develop step-by-step

It is hoped that it can help you:

- Get started with writing NFT smart contracts
- Understand the transaction process of NFT
- Start developing DApp applications

## How to run

You can deploy and run this project locally quickly according to the guidelines in this section.

Directory structure:

```plain
.
├── chain                   -- Contains a local blockchain (hardhat-CLI), smart contracts (code, testing, deployment)
├── webapp                  -- Front-end application (DApp) for NFT Marketplace
├── README.md  
└── tutorial.md 
```

Steps:

1. Clone this repository to your local machine: `git clone https://github.com/wbxl2000/purple-ice-lite`
2. Navigate to the `chain` directory in the project and install the dependencies: `cd .\purple-ice-lite\chain\ && yarn`.
3. Run the local blockchain: `yarn hardhat node`. If the operation is successful, the address and private key of the test account will be output.
4. Keep the local blockchain running, open a new terminal, navigate to the `chain` directory, and deploy the contract:</br>
    `yarn hardhat run .\scripts\deploy_BadgeToken.ts --network localhost`</br>
    `yarn hardhat run .\scripts\deploy_Marketplace.ts --network localhost`</br>

    > The address generated after successful deployment is used in `./webapp/logic.js`</br>
    > The generated ABI is imported in `./webapp/index.html`</br>
    > If the contract has not been modified in the previous step, it will be automatically imported.

5. Configure MetaMask.
   - Add network: Fill in the network name as `hardhat`. The RPC address is `http://127.0.0.1:8545/`. The chain ID is `31337`, and the currency is `ETH`.
   - Import account: Import using private key. The private key will be output in the terminal when running the local blockchain. The account used to deploy the contract is `Account #0`.

6. Navigate to the `webapp` directory: `cd ../webapp`, and run anywhere or other web static services, such as Go Live.
    > The command for running anywhere quickly is: `yarn add anywhere && yarn anywhere`

7. Access purple-ice-lite in your browser. After connecting the wallet, mint an initial NFT, and then it is recommended to open two browser tabs to simulate Sale or Buy.

## How to develop

If you want to learn more, you can check the contents of the tutorial written for this project in [tutorial.md](./tutorial.md).

## License

This project is licensed under the MIT license.

