# purple-ice-lite

[演示视频](https://www.bilibili.com/video/BV1uU4y117U1/)

## Introduction

purple-ice-lite 是一个运行在本地区块链上的迷你的 NFT 交易市场，可以实现 Connect wallet、Mint、Sale、Buy 操作，它包括

- 本地区块链
- 两个智能合约源码、测试、部署
- 一个原生 JS 编写的 DApp
- 一份手把手教你开发的教程

希望可以帮助你：

- 入门 NFT 智能合约的编写
- 理解 NFT 的交易过程
- 开始 DApp 应用的开发

你可以根据 [How to run](#how-to-run) 中的指引，在本地快速部署并运行本项目。

如果想要深一步了解，可以查看 [为本项目编写的手把手教程](./tutorial.md) 中的内容。

## How to run

目录：

```plain
.
├── chain                   -- 包含 本地区块链(hardhat-CLI)、智能合约(代码、测试、部署)
├── webapp                  -- NFT Marketplace 的前端应用(DApp)
├── README.md  
├── tutorial.md  
└── README-en_US.md 
```

步骤：
1. 克隆本仓库到本地 `git clone https://github.com/wbxl2000/purple-ice-lite`
2. 进入项目中的 `chain` 目录，并安装依赖 `cd .\purple-ice-lite\chain\ && yarn`
3. 运行本地区块链 `yarn hardhat node`，运行成功会输出测试账户的地址和私钥
4. 保持本地区块链的运行状态，新开一个终端，同样进入到 chain 目录下，进行合约部署</br>
    `yarn hardhat run .\scripts\deploy_BadgeToken.ts --network localhost`</br>
    `yarn hardhat run .\scripts\deploy_Marketplace.ts --network localhost`</br>

    > 部署成功产生的地址被 `./webapp/logic.js` 所使用，</br>
    > 部署成功产生的ABI被 `./webapp/index.html` 所引入。</br>
    > 如果前面步骤未对合约做修改，则已默认导入。

5. 配置 MetaMask
   - 添加网络：网络名称填入 hardhat，RPC地址为：`http://127.0.0.1:8545/`，链 ID 为：`31337`，货币为 `ETH`
   - 导入账户：使用私钥的方式导入，私钥在运行本地区块链时会在终端输出，部署合约所使用的账户是 `Account #0`

6. 进入 `webapp` 目录 `cd ../webapp`，并且运行 anywhere 或者其他 web 静态服务，如 Go Live
    > 快速运行 anywhere 的命令为：`yarn add anywhere && yarn anywhere`

7. 在浏览器中访问 purple-ice-lite，连接钱包后，进行 Mint 初始 NFT，然后推荐开启两个浏览器模拟 Sale 或者 Buy。
