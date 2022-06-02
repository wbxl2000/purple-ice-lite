# 学习 web3 编程，或许可以从建造一个简单的 NFT Marketplace 开始

> How to build an NFT marketplace DApp like OpenSea?

本篇教程将手把手的带你搭建一个可以实现 Connect Wallet、Mint、Sale、Buy、Display 等功能的 NFT marketplace。完成之后，相信你对于 NFT 的交易过程会有更深层次的理解，并且可以借此入门智能合约的编写与 Web3 API 的使用，也可以应用这些知识开发你自己的 DApp（如为自己发行的 NFT 制作一个 Mint 页面）。
> 为保证良好的阅读体验，推荐你先使用一下 OpenSea 或其他主流 NFT marketplace，并且知道或者了解以下先导知识：区块链、比特币、以太坊和以太币、MetaMask、NFT、HTML、CSS、JS

#### 系统架构概览

好了，我们的应用终于在理论上具有了可行性，下面我绘制了一个图解，可以对比以上内容进行查看。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/760200/1652810347640-07fcf0f4-7893-4c59-a62f-81af009a0829.png#clientId=u431eb1f3-9f8f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=408&id=R2DMN&margin=%5Bobject%20Object%5D&name=image.png&originHeight=776&originWidth=594&originalType=binary&ratio=1&rotation=0&showTitle=false&size=89790&status=done&style=none&taskId=uca2df87f-ebde-408c-916b-8ef08f074a7&title=&width=312)![image.png](https://cdn.nlark.com/yuque/0/2022/png/760200/1654021766289-dc69cdcf-8fb8-49bf-ad13-ffa787149fc3.png#clientId=u4b6f4194-ba58-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=370&id=ua36fd0b7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=555&originWidth=1658&originalType=binary&ratio=1&rotation=0&showTitle=false&size=85412&status=done&style=none&taskId=u5d6b5677-fc12-4733-8167-fcb528eefae&title=&width=1105.3333333333333)
那么接下来，我们将深入每一层的细节，动手实现我们的应用。

---

#### 用作测试的区块链
我们将要构建的 NFT marketplace 是基于区块链的，换句话说，用户的核心操作产生的数据将会被记录在区块链上，永不会被篡改。这里提到只是核心操作会被记录，是因为用户的头像、昵称等不会影响 NFT 归属权和销售动作的其他信息可以记录在传统数据库中，更为方便且减少在区块中记录的信息量，降低运行成本。本文将聚焦在核心操作。
在本文开发过程中，我们需要对区块链的数据进行实际的修改，如果要对 ETH 的主链进行操作，那么我们每次操作都需要支出一笔不小的gas费用。如果智能合约编写失败，还会浪费区块资源，本着是学习的目的，我们可以搭建一个用作测试的区块链，不用付出真的费用也不用浪费区块资源，方便测试与debug。
使用测试区块链有两种方式，一种是使用线上的测试区块链（Testnet），如mumbai polygon，与真正的以太坊使用方法几乎相同，区别是你可以通过特定网站给自己转账，免费获得一些ETH，很方便的进行测试。
第二种是搭建一个本地的区块链，使用工具如 ganache、hardhat，两种方式都会在区块链开始运行时给出一些默认账户，里面都有足够的余额可以进行测试。
这里我们选择的方式是第二种，搭建一个本地的区块链，使用的工具是 hardhat 脚手架，可以直接在脚手架项目里运行一个本地区块链、编译合约、部署合约等等操作，使用方式更简单且足够我们使用了。[hardhat 文档地址](https://hardhat.org/getting-started/)
此项目命名为 purple-ice-lite，之后所有操作均在此目录进行。
创建名为 chain 的文件夹，用来管理区块链和智能合约。
```
mkdir chain && cd ./chain
yarn init -y
yarn add -D hardhat
yarn hardhat #初始化hardhat项目
```
```
? What do you want to do? ... 
  Create a basic sample project
  Create an advanced sample project
> Create an advanced sample project that uses TypeScript
  Create an empty hardhat.config.js
  Quit
```
添加 gitignore 但是移动到外层文件夹中，与整个项目合并
```
√ Do you want to add a .gitignore? (Y/n) · y
```
运行完之后在命令行紧接着会提示安装所需要的依赖，我这里的如下，你可以复制自己弹出的
```
yarn add --dev "hardhat@^2.9.6" "@nomiclabs/hardhat-waffle@^2.0.0" "ethereum-waffle@^3.0.0" "chai@^4.2.0" "@nomiclabs/hardhat-ethers@^2.0.0" "ethers@^5.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "dotenv@^16.0.0" "eslint@^7.29.0" "eslint-config-prettier@^8.3.0" "eslint-config-standard@^16.0.3" "eslint-plugin-import@^2.23.4" "eslint-plugin-node@^11.1.0" "eslint-plugin-prettier@^3.4.0" "eslint-plugin-promise@^5.1.0" "hardhat-gas-reporter@^1.0.4" "prettier@^2.3.2" "prettier-plugin-solidity@^1.0.0-beta.13" "solhint@^3.3.6" "solidity-coverage@^0.7.16" "@typechain/ethers-v5@^7.0.1" "@typechain/hardhat@^2.3.0" "@typescript-eslint/eslint-plugin@^4.29.1" "@typescript-eslint/parser@^4.29.1" "@types/chai@^4.2.21" "@types/node@^12.0.0" "@types/mocha@^9.0.0" "ts-node@^10.1.0" "typechain@^5.1.2" "typescript@^4.5.2"
```
此时可以执行命令来启动本地区块链，并且在命令行会显示测试账户
```
yarn hardhat node
```
现在可以使用 MetaMask 连接到此区块链
点击 MetaMask 「网络」选项中的「添加网络」，网络名称填入 hardhat，RPC地址为：`[http://127.0.0.1:8545/](http://127.0.0.1:8545/)`，链 ID 为：31337，货币为 ETH
即可连接区块链网络。
接下来可以尝试导入账户
点击 MetaMask 右上角头像的「导入账户」，选择私钥的方式，将之前 hardhat 输出的 Account #0 的 Private Key 导入，即可看到当前账户的余额。

现在我们有了区块链作为基础的底层，那么如何在区块链上做存放和修改数据这些操作呢？特别的是，我们还需要这些操作是去中心化的，这意味着它们需要「自动」来完成，而不是某人或者某中心来完成。
比特币区块链的特性很难解决我们的需求，而以太坊区块链有不同的数据存放模式，并且引入了「智能合约」的概念，从而可以很好的支持这一点。此处便是智能合约的用武之地。
智能合约是运行在以太坊区块链上的一段代码和数据，这段代码中的函数可以被外部调用，来实现逻辑判断、存储数据、转账、与其他智能合约交互等功能，这样就保证了任何人都可以访问这段代码，通过执行固定的、不可篡改的逻辑来实现某项功能。
#### 将 NFT 发布到区块链上
作为 NFT marketplace 我们要有交易的货物，现在我们将创造一个NFT，并且将其存放和发布到刚刚我们构建的区块链上。
创造NFT这种货物即部署一个表示这个NFT的智能合约，当然我们可以从头编写，但更推荐的是直接「继承」已有的代币标准，减少一些重复的工作量，也能更好的让其他人识别。
这里有不同的标准，比如 ERC-20 ERC-721 ERC-1155。20 是常见的同质化代币、721是NFT，1155可以「结合？」被用作游戏中。
这里我们使用的是 721 标准，并且添加一个一个扩展 可枚举的，主要区别是 xxx，并且多了一个 xxx 函数，这个函数如果用在实际区块链中，会有一些浪费区块资源，因为完全可以写在第三方数据库里（要便宜的多），并且很容易根据区块链的历史记录验证真伪。
首先我们在项目中安装@openzeppelin/contracts solidity 库
`yarn add @openzeppelin/contracts`
将智能合约代码 /contracts/Greeter.sol 修改为 /contracts/BadgeToken.sol 
然后修改代码，继承ERC721，补充部分函数，全部代码如下：
（函数功能已经补充在注释中，也推荐去看 [link](https://dev.to/yakult/tutorial-build-a-nft-marketplace-dapp-like-opensea-3ng9#task2)）记录 contract 改动的地方
> 递增的tokenid，tokenURI返回的图片是一个base64加密的 svg

```
// contracts/NFTMarketplace.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
//
// adapt and edit from (Nader Dabit):
//    https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/Market.sol

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemCounter; //start from 1
    Counters.Counter private _itemSoldCounter;

    address payable public marketowner;
    uint256 public listingFee = 0.025 ether;

    enum State {
        Created,
        Release,
        Inactive
    }

    struct MarketItem {
        uint256 id;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable buyer;
        uint256 price;
        State state;
    }

    mapping(uint256 => MarketItem) private marketItems;

    event MarketItemCreated(
        uint256 indexed id,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price,
        State state
    );

    event MarketItemSold(
        uint256 indexed id,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price,
        State state
    );

    constructor() {
        marketowner = payable(msg.sender);
    }

    /**
     * @dev Returns the listing fee of the marketplace
     */
    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    /**
     * @dev create a MarketItem for NFT sale on the marketplace.
     *
     * List an NFT.
     */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingFee, "Fee must be equal to listing fee");

        _itemCounter.increment();
        uint256 id = _itemCounter.current();

        marketItems[id] = MarketItem(
            id,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            State.Created
        );

        require(
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "NFT must be approved to market"
        );

        // change to approve mechanism from the original direct transfer to market
        // IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            id,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            State.Created
        );
    }

    /**
     * @dev delete a MarketItem from the marketplace.
     *
     * de-List an NFT.
     *
     * todo ERC721.approve can't work properly!! comment out
     */
    function deleteMarketItem(uint256 itemId) public nonReentrant {
        require(itemId <= _itemCounter.current(), "id must <= item count");
        require(
            marketItems[itemId].state == State.Created,
            "item must be on market"
        );
        MarketItem storage item = marketItems[itemId];

        require(
            IERC721(item.nftContract).ownerOf(item.tokenId) == msg.sender,
            "must be the owner"
        );
        require(
            IERC721(item.nftContract).getApproved(item.tokenId) ==
                address(this),
            "NFT must be approved to market"
        );

        item.state = State.Inactive;

        emit MarketItemSold(
            itemId,
            item.nftContract,
            item.tokenId,
            item.seller,
            address(0),
            0,
            State.Inactive
        );
    }

    /**
     * @dev (buyer) buy a MarketItem from the marketplace.
     * Transfers ownership of the item, as well as funds
     * NFT:         seller    -> buyer
     * value:       buyer     -> seller
     * listingFee:  contract  -> marketowner
     */
    function createMarketSale(address nftContract, uint256 id)
        public
        payable
        nonReentrant
    {
        MarketItem storage item = marketItems[id]; //should use storge!!!!
        uint256 price = item.price;
        uint256 tokenId = item.tokenId;

        require(msg.value == price, "Please submit the asking price");
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "NFT must be approved to market"
        );

        item.buyer = payable(msg.sender);
        item.state = State.Release;
        _itemSoldCounter.increment();

        IERC721(nftContract).transferFrom(item.seller, msg.sender, tokenId);
        payable(marketowner).transfer(listingFee);
        item.seller.transfer(msg.value);

        emit MarketItemSold(
            id,
            nftContract,
            tokenId,
            item.seller,
            msg.sender,
            price,
            State.Release
        );
    }

    /**
     * @dev Returns all unsold market items
     * condition:
     *  1) state == Created
     *  2) buyer = 0x0
     *  3) still have approve
     */
    function fetchActiveItems() public view returns (MarketItem[] memory) {
        return fetchHepler(FetchOperator.ActiveItems);
    }

    /**
     * @dev Returns only market items a user has purchased
     * todo pagination
     */
    function fetchMyPurchasedItems() public view returns (MarketItem[] memory) {
        return fetchHepler(FetchOperator.MyPurchasedItems);
    }

    /**
     * @dev Returns only market items a user has created
     * todo pagination
     */
    function fetchMyCreatedItems() public view returns (MarketItem[] memory) {
        return fetchHepler(FetchOperator.MyCreatedItems);
    }

    enum FetchOperator {
        ActiveItems,
        MyPurchasedItems,
        MyCreatedItems
    }

    /**
     * @dev fetch helper
     * todo pagination
     */
    function fetchHepler(FetchOperator _op)
        private
        view
        returns (MarketItem[] memory)
    {
        uint256 total = _itemCounter.current();

        uint256 itemCount = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (isCondition(marketItems[i], _op)) {
                itemCount++;
            }
        }

        uint256 index = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 1; i <= total; i++) {
            if (isCondition(marketItems[i], _op)) {
                items[index] = marketItems[i];
                index++;
            }
        }
        return items;
    }

    /**
     * @dev helper to build condition
     *
     * todo should reduce duplicate contract call here
     * (IERC721(item.nftContract).getApproved(item.tokenId) called in two loop
     */
    function isCondition(MarketItem memory item, FetchOperator _op)
        private
        view
        returns (bool)
    {
        if (_op == FetchOperator.MyCreatedItems) {
            return
                (item.seller == msg.sender && item.state != State.Inactive)
                    ? true
                    : false;
        } else if (_op == FetchOperator.MyPurchasedItems) {
            return (item.buyer == msg.sender) ? true : false;
        } else if (_op == FetchOperator.ActiveItems) {
            return
                (item.buyer == address(0) &&
                    item.state == State.Created &&
                    (IERC721(item.nftContract).getApproved(item.tokenId) ==
                        address(this)))
                    ? true
                    : false;
        } else {
            return false;
        }
    }
}

```
运行 `yarn hardhat compile`，如果不报错，则成功编译合约。
接下来我们将为此合约编写单元测试，保证其能够正常运行。我们需要一些单元测试才能保证我们的合约和应用能够按照预期进行。
前面提到我们可以通过 hardhat 来操纵，hardhat 有 ether 的插件，可以很方便的帮助我们书写 js 版本的单元测试。这里主要测试一些行为，也是借鉴，里面还提到了系统测试，那么我们也来进行，完善这个NFT marketplace 项目。
在 test 文件夹中创建 `BadgeToken.test.ts`，内容为一般的单元测试写法，全部代码为：**link**

代码里面使用了 `base-64`包，先安装它：`yarn add --dev base-64`
使用 hardhat 运行此测试脚本：`yarn hardhat test test\BadgeToken.test.ts`
将会看到测试的结果
```
  BadgeToken                                                                
    ✔ Should has the correct name and symbol  (41ms)                        
    ✔ Should tokenId start from 1 and auto increment (100ms)                
    ✔ Should mint a token with event                                        
    ✔ Should mint a token with desired tokenURI (log result for inspection) (137ms)
    ✔ Should mint 10 token with desired tokenURI (893ms)
```
下一步则是将智能合约部署到区块链上
编写部署脚本，在 scripts 中添加 文件 `deploy_BadgeToken.ts`，内容为：**link**
运行部署脚本 `yarn hardhat run .\scripts\deploy_BadgeToken.ts --network localhost`
（注意，此时需要本地区块链是运行状态，即已执行 `yarn hardhat node`）
这里参考了xxx的实现，是一个比较简单的NFT，有tokenid，还有svg，也就是图片是存在自身之中的，没有放到ipfs里，当然也可以进行一些扩展，比如xxx，拍卖等，由于不是本文的重点，这里不再做过多展开。
目前合约与区块链已经可以正常运行了，为了能够给用户使用，现在我们需要有一个web应用来承载这些功能。
#### 交易货物 - NFT maketplace 智能合约的编写
然后我们就可以进行 NFT 交易了，这里使用智能合约来控制交易过程。当发生交易时，交易动作去触发区块链上的智能合约动作，然后智能合约来自动完成交易。
分别在 `contracts`目录下创建新的合约文件 `NFTMarketplace.sol`，代码在：**link**
在 `test` 目录下创建此合约的测试文件 `NFTMarketplace.test.ts`，代码在：**link**
在 `scripts` 目录下创建部署脚本 `deploy_Marketplace.ts`，代码在：**link**
依次执行
`yarn hardhat test .\test\NFTMarketplace.test.ts` 
`yarn hardhat run .\scripts\deploy_Marketplace.ts --network localhost`
则将其部署到了区块链上
这里只是其中一种实现，也是借鉴，可以写的更完善一些，也可以结合第三方的数据库。通过这几个函数，我们就可以完成查询、上架、购买等市场的操作。
假设我们现在已经有了支持买卖 NFT 的智能合约运行在以太坊区块链上，那么我们如何访问这段代码（即调用智能合约）？注意，这段代码是经过编译之后以二进制形式存放于区块链上的，我们无法通过其他语言直接调用。
所幸的是，已经有许多库可以帮助我们更轻松地调用智能合约了。这些库解析了区块链上的智能合约，并简化了业务层代码与区块链的交互，使得我们无需了解操纵区块链的技术细节也可以使用它。
接下来我们便可以书写业务层代码了，即与用户实际产生交互的 HTML 网页，我们只需要在 JS 代码中，根据用户的操作，通过库来调用智能合约的接口，智能合约再操纵区块链上的信息，即完成了根据用户的操作读写区块链上的内容。
#### 给用户书写前端页面
目前已经有一些库可以帮找我们操纵区块链，最常见的两个为 Web3.js ether.js，两者均可以实现我们想要的功能，这里因为笔者对 ethers 的 API 更熟悉一些，所以用它来作为前端与区块链之间的桥梁。
此处我们选择制作一个简单的 demo，使用了原生js，可方便的迁移到任何框架中
**创建工程**
在 `chain`的上级目录中，创建 webapp 文件夹
`cd .. && mkdir webapp && cd mkdir webapp`
创建 html js css 等文件（此处可以不那么详细，只介绍工程）
**连接钱包**

铸造mint，这一步已经能单独当一个应用了，也就是一些NFT项目的首页
上架
购买

看似我们的应用经过这几层已经快要完成了，但其实还有一件事情我们没有解决：如何鉴权？也就是我们需要确认某位用户做出的操作是他自己做的。这里我们需要借助加密货币钱包的帮助。在需要确认你的身份时，会唤起用户对此操作进行签名（如唤起浏览器插件，需要确保是用户本人在点击），进行签名后，这笔交易（操作）才会被真正的执行，加密货币钱包赋予了代码操纵资产的权利。
#### 小结
已经大致了解了 NFT 和 市场的运作方式，相信你为NFT项目写一个mint页面一定没有问题了。
可以继续使用 hardhat 或者 truffle 等工具发布到真实的区块链上（其实就是换个区块链地址和做一些配置工作和花一些钱）
希望能够通过这种方式帮你更好的理解这些东西，感谢你的认真阅读。
（完）


---

#### 参考与学习资料：
> 数据存储
> [https://bmcmedgenomics.biomedcentral.com/articles/10.1186/s12920-020-00732-x](https://bmcmedgenomics.biomedcentral.com/articles/10.1186/s12920-020-00732-x)
> [https://github.com/ethereum/wiki/wiki/%5B%E4%B8%AD%E6%96%87%5D-%E4%BB%A5%E5%A4%AA%E5%9D%8A%E7%99%BD%E7%9A%AE%E4%B9%A6#%E6%B6%88%E6%81%AF%E5%92%8C%E4%BA%A4%E6%98%93](https://github.com/ethereum/wiki/wiki/%5B%E4%B8%AD%E6%96%87%5D-%E4%BB%A5%E5%A4%AA%E5%9D%8A%E7%99%BD%E7%9A%AE%E4%B9%A6#%E6%B6%88%E6%81%AF%E5%92%8C%E4%BA%A4%E6%98%93)
> [https://hackernoon.com/getting-deep-into-ethereum-how-data-is-stored-in-ethereum-e3f669d96033](https://hackernoon.com/getting-deep-into-ethereum-how-data-is-stored-in-ethereum-e3f669d96033)


[https://myfirstnft.info/](https://myfirstnft.info/)
智能合约如何在以太坊区块链上运行：https://learnblockchain.cn/2018/01/04/understanding-smart-contracts/
ipfs: https://learnblockchain.cn/2018/12/12/what-is-ipfs/
可视化教学 https://eth.build/
比特币与区块链原理：李永乐（1）https://youtu.be/g_fSistU3MQ （2）https://www.youtube.com/watch?v=pbAVauYsqP0
NFT 商业科普：Ethan 劉呈顥 https://youtu.be/ZYou8GorD4M
比特币是如何工作的：3Blue1Brown https://youtu.be/bBC-nXj3Ng4
以太坊（非技术）：https://youtu.be/26kR2vUbbJo 前半部分
[Kie Codes](https://www.youtube.com/c/KieCodes) [Coding an NFT crypto collectible in 3 days (DAY 1)](https://youtu.be/GAFh2Z5VtgM)(DAY 2)(DAY 3) 
[fangjun](https://dev.to/yakult) [Web3 Tutorial: Build an NFT marketplace DApp like Opensea](https://dev.to/yakult/tutorial-build-a-nft-marketplace-dapp-like-opensea-3ng9)
2 [Web3 Tutorial: Build an NFT marketplace DApp like Opensea](https://dev.to/yakult/a-tutorial-build-dapp-with-hardhat-react-and-ethersjs-1gmi)
[I Cloned OpenSea in 2 Hours - Building a Cross-Chain NFT Marketplace FULL COURSE](https://youtu.be/WZWCzsB1xUE)
[How to Build a Full Stack NFT Marketplace on Ethereum with Polygon and Next.js - [2021 Tutorial]](https://youtu.be/GKJBEEXUha0)
[Code an NFT Marketplace like OpenSea Step-by-Step [ERC-721, Solidity]](https://youtu.be/2bjVWclBD_s)

区块链黑暗森林自救手册: https://github.com/slowmist/Blockchain-dark-forest-selfguard-handbook/blob/main/README_CN.md
Web3 生存指南之防骗反诈安全手册V1.0：https://e7qjl676i8.feishu.cn/docs/doccn2rvEMHefBYKvyTVRGwe7Pf
