# purple-ice-lite

简体中文 | [English](./README-en_US.md)

[演示视频]()

## Introduction

purple-ice-lite 是一个运行在本地区块链上的迷你的 NFT 交易市场，它包括

- [hardhat-cli]() 创建的本地区块链
- 两个智能合约（BadgeToken 与 NFT-Marketplace）
- 一个用 js 编写的前端应用
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
├── chain                   -- 包含 hardhat 工程(本地区块链)、智能合约(代码、测试、部署)
├── webapp                  -- NFT Marketplace 的前端应用(DApp)
├── README.md  
├── tutorial.md  
└── README-en_US.md 
```

cd chain
yarn hardhat node
两次 deploy
