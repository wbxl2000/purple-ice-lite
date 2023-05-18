# 学习 Web3 编程，或许可以从建造一个简单的 NFT Marketplace 开始

<div style="display: flex; margin: 10px 0;">
<img style="width: 18px; margin-right: 5px;" src="https://github.com/wbxl2000/purple-ice-lite/assets/57169560/34ef79cc-dc17-4d61-a518-c1ba3cb45fae"> </img>
<b> 简体中文 </b>
<span style="margin: 0 5px;"> | </span> 
<a href="https://github.com/wbxl2000/purple-ice-lite/blob/main/tutorial.md"> English</a> 
</div>

> A step-by-step guide for building a NFT marketplace decentralized application like OpenSea

本篇教程将手把手的带你搭建一个可以实现 Connect Wallet、Mint、Sale、Buy、Display 等功能的 NFT marketplace。完成之后，相信你对于 NFT 的交易过程会有更深层次的理解，并且可以借此入门智能合约的编写与 Web3 API 的使用，也可以应用这些知识开发你自己的 DApp（如为自己发行的 NFT 制作一个 Mint 页面）。

为保证良好的阅读体验，推荐你先使用一下 OpenSea 或其他主流 NFT marketplace，并且知道或者了解以下先导知识：区块链、比特币、以太坊和以太币、MetaMask、NFT、HTML、CSS、JS

以下内容分为五层：区块链 -> 智能合约 -> Web3 API -> DApp -> 用户与鉴权，每一层将会解释缘由与上一层的关系，行文将以渐进式的方式组织，逐个解决遇到的问题。

那么，我们开始吧。

## 一、用作测试的区块链

我们将要构建的 NFT marketplace 是基于区块链的，换句话说，用户的核心操作产生的数据将会被记录在区块链上，永不会被篡改。这里提到只是核心操作会被记录，是因为用户的头像、昵称等不会影响 NFT 归属权和销售动作的其他信息可以记录在传统数据库中，这样开发上更为方便，并且可以减少在区块中记录的信息量，降低运行成本。本文将聚焦在核心操作，不涉及第三方存储。

在本文开发过程中，如果要对以太坊的主链进行操作，那么我们每次测试都需要支出一笔不小的 gas 费用。如果智能合约编写失败，还会浪费区块资源。本着是学习的目的，我们可以搭建一个用作测试的区块链，不用付出真的费用也不用浪费区块资源，方便测试与调试。

使用测试区块链有两种方式，一种是使用线上的测试区块链（Testnet），如 mumbai polygon，与真正的以太坊使用方法几乎相同，区别是你可以通过特定网站给自己转账，免费获得一些 ETH，很方便的进行测试。

第二种是搭建一个本地的区块链，使用工具如 Ganache、Hardhat，两种工具都会在区块链开始运行时给出一些默认账户，里面都有足够的余额可以进行测试。

这里我们选择的方式是第二种，搭建一个本地的区块链。使用的工具是 [Hardhat 脚手架](https://hardhat.org/getting-started/)，可以直接在脚手架项目里运行一个本地区块链、编译合约、部署合约等操作，使用方式更简单且足够我们使用了。

此项目命名为 `purple-ice-lite`，之后所有操作均在此目录进行。

```shell
mkdir purple-ice-lite && cd ./purple-ice-lite
```

首先创建文件夹 `purple-ice-lite/chain`，用来管理区块链和智能合约

```shell
mkdir chain && cd ./chain
```

用 yarn 和 hardhat 进行初始化

```shell
yarn init -y
yarn add -D hardhat
yarn hardhat
```

hardhat 初始化程序会弹出一下指引，这里使用的是 advanced + ts 的版本

```plain
? What do you want to do? ... 
  Create a basic sample project
  Create an advanced sample project
> Create an advanced sample project that uses TypeScript
  Create an empty hardhat.config.js
  Quit
```

指引中继续选择添加 `.gitignore`

```plain
√ Do you want to add a .gitignore? (Y/n) · y
```

此时可以移动 `.gitignore` 文件到上一层 `purple-ice-lite` 目录下，方便对整个项目进行管理。

以上初始化指引完成之后，在命令行中会提示安装所需要的依赖，复制它并且运行安装。例如我此处弹出的为

```shell
yarn add --dev "hardhat@^2.9.6" "@nomiclabs/hardhat-waffle@^2.0.0" "ethereum-waffle@^3.0.0" "chai@^4.2.0" "@nomiclabs/hardhat-ethers@^2.0.0" "ethers@^5.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "dotenv@^16.0.0" "eslint@^7.29.0" "eslint-config-prettier@^8.3.0" "eslint-config-standard@^16.0.3" "eslint-plugin-import@^2.23.4" "eslint-plugin-node@^11.1.0" "eslint-plugin-prettier@^3.4.0" "eslint-plugin-promise@^5.1.0" "hardhat-gas-reporter@^1.0.4" "prettier@^2.3.2" "prettier-plugin-solidity@^1.0.0-beta.13" "solhint@^3.3.6" "solidity-coverage@^0.7.16" "@typechain/ethers-v5@^7.0.1" "@typechain/hardhat@^2.3.0" "@typescript-eslint/eslint-plugin@^4.29.1" "@typescript-eslint/parser@^4.29.1" "@types/chai@^4.2.21" "@types/node@^12.0.0" "@types/mocha@^9.0.0" "ts-node@^10.1.0" "typechain@^5.1.2" "typescript@^4.5.2"
```

此时等依赖安装完，我们便完成了初始化部分，接下来运行本地的区块链

```shell
yarn hardhat node
```

运行后会输出一些默认的账户，便是成功运行了🎉

我们可以使用 MetaMask 进行一些简单的配置，可视化地显示这个区块链上账户的状态。

1. 连接此区块链网络：点击 MetaMask 「网络」选项中的「添加网络」，网络名称填入 Hardhat，RPC 地址为：`http://127.0.0.1:8545/`，链 ID 为：`31337`，货币为 `ETH`。

2. 导入账户：点击 MetaMask 右上角头像的「导入账户」，选择私钥的方式，将之前 Hardhat 输出的 Account #0 的 Private Key 导入，即可看到当前账户的余额。

到这里，我们运行起了一个区块链作为底层，那么如何在区块链上存放和修改数据呢？特别的是，我们还需要这些操作是去中心化的，这意味着它们需要「自动」来完成，而不是某人或者某中心来完成。

比特币区块链的特性很难解决我们的需求，而以太坊区块链有不同的数据存放模式，并且引入了「智能合约」的概念，从而可以很好的支持这一点。此处便是智能合约的用武之地。

智能合约是运行在以太坊区块链上的一段代码和数据，可以使用 solidity 语言编写。这段代码中的函数可以被外部调用，来实现逻辑判断、存储数据、转账、与其他智能合约交互等功能，这样就保证了任何人都可以访问这段代码，通过执行固定的、不可篡改的逻辑来对区块链上的数据进行操作。

## 二、在区块链上发布一个 NFT 项目

作为 NFT marketplace 我们要有交易的货物，现在我们将创造一个 NFT 项目，并且将其数据存放和发布到我们刚刚构建的区块链上。

创造一个 NFT 项目即编写和部署一个智能合约，让存放在区块链上的代码自动标识 NFT 的归属权与交易。当然我们可以从头编写，但更推荐的是继承已有的代币标准，减少一些重复的工作量，也能更好的被其他平台识别。

ERC-721 便是其中一个 NFT 代币标准，它是一段写好的智能合约代码，我们的 NFT 智能合约代码可以直接继承它，获得已经写好的一些通用的代码。ERC-721 还有一些扩展类型，如 ERC721Enumerable，新增了一些枚举函数，更方便地获取 NFT 数据。

这里为了方便展示 NFT 数据使用了 ERC721Enumerable，但每次枚举会产生大量的 gas 费用，所以不要在正式项目中使用，正式项目可以选择更实惠的代币标准。

OpenZeppelin Contracts 是一个包括最常用的 ERC 标准的实现的智能合约代码库，我们此次从它中引入所需要的代码。

首先我们在项目中安装 `@openzeppelin/contracts` solidity 库

```shell
yarn add @openzeppelin/contracts
```

修改项目中的示例智能合约名称，将 `purple-ice-lite/chain/contracts/Greeter.sol` 修改为 `purple-ice-lite/chain/contracts/BadgeToken.sol`

智能合约代码内容继承自 ERC721Enumerable，添加了三个函数

- 每新建一个 NFT，它的 tokenId 就会自动增加 1
- mintTo 函数，可以调用此来进行铸造新的 NFT
- tokenURI() 用来返回 NFT 的基本信息，如名称、描述、图片等，这里图片使用 base64 编码了一个 svg 图片在 NFT 基本信息内。

全部代码在 [BadgeToken.sol](https://github.com/wbxl2000/purple-ice-lite/blob/main/chain/contracts/BadgeToken.sol)，参考了[这篇文章](https://dev.to/yakult/tutorial-build-a-nft-marketplace-dapp-like-opensea-3ng9#task2)的实现，可以去此文章原文链接查看编写细节。

编译智能合约代码

```shell
yarn hardhat compile
```

接下来我们将为此合约编写单元测试，保证合约按照预期进行。

在 `purple-ice-lite/chain/test` 文件夹中创建 `BadgeToken.test.ts`，内容链接在这里 [BadgeToken.test.ts](https://github.com/wbxl2000/purple-ice-lite/blob/main/chain/test/BadgeToken.test.ts)。

代码里面使用了 `base-64`包，安装后运行测试

```shell
yarn add -D base-64
yarn hardhat test test\BadgeToken.test.ts
```

将会看到测试的结果

```plain
BadgeToken
  ✔ Should has the correct name and symbol  (41ms)                        
  ✔ Should tokenId start from 1 and auto increment (100ms)                
  ✔ Should mint a token with event                                        
  ✔ Should mint a token with desired tokenURI (log result for inspection) (137ms)
  ✔ Should mint 10 token with desired tokenURI (893ms)
```

在编写完智能合约并且能够按照预期运行之后，我们就可以将它部署在区块链上了。

编写部署脚本，在 `purple-ice-lite/chain/scripts` 中添加部署文件 `deploy_BadgeToken.ts`，内容为 [deploy_BadgeToken.ts]()

运行部署脚本

```shell
yarn hardhat run .\scripts\deploy_BadgeToken.ts --network localhost
```

注意，此时需要本地区块链是运行状态，即已执行 `yarn hardhat node`。

部署成功后会返回部署的合约地址，NFT 上链完成。

## 三、NFT maketplace 智能合约的编写

在区块链上有了 NFT，我们就可以进行 NFT 交易了，这里使用智能合约来控制交易过程。当发生交易时，交易动作去触发区块链上的智能合约代码，然后智能合约来自动完成交易。

在 `purple-ice-lite/chain/contracts` 目录下创建新的合约文件 `NFTMarketplace.sol`。

定义每一个市场中的货物结构为

```solidity
struct MarketItem {
  uint id;
  address nftContract;
  uint256 tokenId;
  address payable seller;
  address payable buyer;
  uint256 price;
  State state;
}
```

需要注意的一点是，每一个 item 的 id 不等于每一个 NFT 的 tokenId，在创建时是索引的 tokenId，在购买时则索引的是 item 的 id。

每个货物有三个状态

```solidity
enum State { Created, Release, Inactive }
```

交易货物的过程便是创建货物和修改货物状态的过程。为实现这些操作，我们创建了三个核心函数来改变市场中的货物数据

```solidity
function createMarketItem(address nftContract,uint256 tokenId,uint256 price) payable 
function deleteMarketItem(uint256 itemId) public
function createMarketSale(address nftContract,uint256 id) public payable
```

同时还创建了三个查询函数方便查询 NFT marketplace 中的货物信息

```solidity
function fetchActiveItems() public view returns (MarketItem[] memory) 
function fetchMyPurchasedItems() public view returns (MarketItem[] memory)
function fetchMyCreatedItems() public view returns (MarketItem[] memory) 
```

其中，在这个合约中规定了，如果想要上架货物，需要给 NFT marketplace 创建者 (我们，也就是默认的 Account #0) listing fee 上架费用，转账 0.025 ether。

```solidity
uint256 public listingFee = 0.025 ether;
function getListingFee() public view returns (uint256) 
```

销售者的动作路径为

- 授权自己的 NFT 操作权限给 NFT marketplace
- 花费指定的 listing fee 上架 NFT
- （等待购买者）
- 获得购买者的支付的代币

购买者的动作路径为

- 支付价格购买某个 NFT
- NFT marketplace 智能合约将会自动执行
  - 给此 NFT 的销售者转账
  - 将 NFT 的归属权转让给购买者
  - 给市场拥有者转账 listing fee
  - 修改 NFT marketplace 中的货物状态

全部代码在 [NFTMarketplace.sol](https://github.com/wbxl2000/purple-ice-lite/blob/main/chain/contracts/NFTMarketplace.sol) 中，以上内容参考自[这篇文章](https://dev.to/yakult/tutorial-build-a-nft-marketplace-dapp-like-opensea-3ng9#task4)。

同样，我们也需要为 NFT marketplace 编写单元测试保证其按照预期进行，在 `purple-ice-lite/chain/test` 中添加单元测试代码 [NFTMarketplace.test.ts](https://github.com/wbxl2000/purple-ice-lite/blob/main/chain/test/NFTMarketplace.test.ts)，并运行单元测试

```shell
yarn hardhat test .\test\NFTMarketplace.test.ts
```

测试通过后可部署到区块链上

```shell
yarn hardhat run .\scripts\deploy_Marketplace.ts --network localhost 
```

部署成功后会返回部署地址。

## 四、Web3 API

至此，我们的 NFT 项目和 NFT marketplace 都已经可以正常运行在区块链上。我们通过调用对应的智能合约接口（函数）便可以实现 NFT marketplace 的逐项功能。但是，如何调用？这段代码是经过编译之后以二进制形式存放于区块链上的，我们无法通过其他语言直接调用。

所幸的是，已经有许多库可以帮助我们更轻松地调用智能合约了。这些库解析了区块链上的智能合约，并简化了业务层代码与区块链的交互，使得我们无需了解操纵区块链的技术细节也可以使用它。

如对于 Python 项目，可以使用 web3.py 来使用 Python 语言跟区块链和其上的智能合约进行交互。此处我们将要构建一个 DApp 网页来实现 NFT marketplace，因此需要选择适用于 Javascript 语言的 Web3 API 库，最常见的两个为 Web3.js 和 ether.js，两者均可以实现我们想要的功能，这里因为笔者对 ethers.js 的 API 更熟悉一些，所以用它来作为前端与区块链之间的桥梁。

接下来我们便可以书写业务层代码了，即与用户实际产生交互的 HTML 网页，我们只需要在 Javascript 代码中，根据用户的操作，执行对应的逻辑，调用智能合约的接口，智能合约再操纵区块链上的信息，即完成了根据用户的操作读写区块链上的内容。


## 五、给用户书写前端页面

此处我们选择制作一个简单的 NFT marketplace demo，使用的是原生 Javascript，可方便的将代码迁移到任何框架中。可查看[演示视频](https://www.bilibili.com/video/BV1uU4y117U1/)。

全部代码在[这里](https://github.com/wbxl2000/purple-ice-lite/tree/main/webapp)，目录结构是这样的：

```plain
./webapp
├── contractsABIs  
├── base64.js
├── index.html  
└── logic.js
```

其中，`index.html` 是 NFT marketplace 的页面，主要逻辑在 `logic.js`， 解码 NFT 数据时会用到 `base64.js`，连接智能合约时会用到 `contractsABIs` 里面的内容。

其中 `contractsABIs` 文件夹里的是两个智能合约的 ABI，也就是接口定义，比如可以调用的方法和参数等，是在智能合约编译时生成的，位置在 `purple-ice-lite/chain/artifacts/contracts/` 对应合约的对应 json 文件，这里手动添加了个赋值变量改成了 js 文件，方便引入和使用。

在 `logic.js` 中，首先需要填入 NFT 项目智能合约和 NFT marketplace 智能合约的部署地址，分别在第一行和第二行。

在 `logic.js` 中，不同的功能对应不同的函数，主要有

``` javascript
async function connectWallet(); // 连接钱包
async function FreshMyNFT(); // 刷新我的 NFT 余额
async function mint(); // 铸造新的 NFT
async function FreshMarketNFT();// 刷新 NFT Marketplace 货物状态
async function sale(tokenId); // 出售当前 tokenId 的 NFT
async function buy(id); // 购买当前 id 的 NFT
```

这些函数逻辑非常简单，分为通用的两步

1. 使用 ethers.js 与区块链交互
2. 将处理后的数据反映到 UI 层上

在第 1 步中，我们会遇到如何鉴权的问题，也就是我们需要确认某位用户做出的操作是他自己做的。这里实际上是这样的解决的：在连接钱包时可以获取一个 signer 的对象，调用需要鉴权的智能合约接口时，需要传入 signer 用做唤起 MetaMask 浏览器插件，引导用户点击进行签名，进行签名后，这笔交易（操作）才会被真正的执行。

代码操纵资产的权利实际上还是加密货币钱包赋予的，而操纵加密钱包是用户的行为。

所以，总结一下，当用户交互前端页面 DApp 时，页面 UI 层面的逻辑会调用 Web3 API 的方法，此时根据需要可以唤起浏览器插件签名以确认用户的身份，确认成功之后，Web3 API 的方法调用智能合约的接口，然后修改或者查询区块链上的数据。

操作成功后，因为没有增加监听接口，所以需要手动刷新 NFT 状态来查看变化情况。

## 小结

在以上内容的基础上，可以继续使用 Hardhat 或者 Truffle 等工具，做好网络配置和准备好一些费用之后，将智能合约发布到真实的区块链上。

在本篇文章中，我们大致了解了 NFT 和 NFT marketplace 的运作方式，尝试入门了 Web3 编程，相信有了这些铺垫，如果你要为自己的 NFT 项目写一个 Mint 页面一定没有问题了。

本文到这里就结束了，限于篇幅很多内容没有太深入，更多内容可以查看下方的参考链接，有谬误之处，欢迎指正。

希望能够通过这种方式帮你更好的理解 web3 与 NFT，感谢你的认真阅读。

保证自己的资金安全，祝你玩的开心~


## 参考资料

1. [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
2. [Using Ethereum blockchain to store and query pharmacogenomics data via smart contracts](https://bmcmedgenomics.biomedcentral.com/articles/10.1186/s12920-020-00732-x)
3. [以太坊白皮书](https://github.com/ethereum/wiki/wiki/%5B%E4%B8%AD%E6%96%87%5D-%E4%BB%A5%E5%A4%AA%E5%9D%8A%E7%99%BD%E7%9A%AE%E4%B9%A6#%E6%B6%88%E6%81%AF%E5%92%8C%E4%BA%A4%E6%98%93)
4. [Getting Deep Into Ethereum: How Data Is Stored In Ethereum?](https://hackernoon.com/getting-deep-into-ethereum-how-data-is-stored-in-ethereum-e3f669d96033)
5. [myfirstnft.info ](https://myfirstnft.info/)
6. [ETH.Build: An Educational Sandbox For Web3... And Much More.](https://eth.build/)
7. [【译】完全理解以太坊智能合约](https://learnblockchain.cn/2018/01/04/understanding-smart-contracts/)
8. [站在Web3.0 理解IPFS是什么](https://learnblockchain.cn/2018/12/12/what-is-ipfs/)
9. [比特币和区块链啥原理？矿机挖矿咋回事？李永乐老师讲比特币(1)](https://youtu.be/g_fSistU3MQ) 
10. [比特币交易如何防伪？私钥公钥地址啥意思？李永乐老师讲比特币(2)](https://www.youtube.com/watch?v=pbAVauYsqP0)
11. [有没有想过比特币（和其他加密货币）是如何工作的？ 3Blue1Brown](https://youtu.be/bBC-nXj3Ng4)
12. [Coding an NFT crypto collectible in 3 days (DAY 1)](https://youtu.be/GAFh2Z5VtgM) 
13. [How to implement an ERC721 Token and connect it to OpenSea (DAY 2)](https://www.youtube.com/watch?v=75D0JjX7EZg) 
14. [Creating a dApp and migrating to the Ethereum Mainnet (DAY 3)](https://www.youtube.com/watch?v=EnIrWNFwN-U)
15. [Web3 Tutorial: Build an NFT marketplace DApp like Opensea](https://dev.to/yakult/tutorial-build-a-nft-marketplace-dapp-like-opensea-3ng9)
16. [Web3 Tutorial: build DApp with Hardhat, React and ethers.js](https://dev.to/yakult/a-tutorial-build-dapp-with-hardhat-react-and-ethersjs-1gmi)
17. [I Cloned OpenSea in 2 Hours - Building a Cross-Chain NFT Marketplace FULL COURSE](https://youtu.be/WZWCzsB1xUE)
18. [How to Build a Full Stack NFT Marketplace on Ethereum with Polygon and Next.js - [2021 Tutorial]](https://youtu.be/GKJBEEXUha0)
19. [Code an NFT Marketplace like OpenSea Step-by-Step [ERC-721, Solidity]](https://youtu.be/2bjVWclBD_s)
20. [区块链黑暗森林自救手册](https://github.com/slowmist/Blockchain-dark-forest-selfguard-handbook/blob/main/README_CN.md)
21. [Web3 生存指南之防骗反诈安全手册V1.0](https://e7qjl676i8.feishu.cn/docs/doccn2rvEMHefBYKvyTVRGwe7Pf)

（完）
