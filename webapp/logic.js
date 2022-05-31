const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

let walletAddress;
let signer;

async function connectWallet() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  [walletAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

  const originBalance = await provider.getBalance(walletAddress);
  const walletBalance = ethers.utils.formatEther(originBalance);

  document.getElementById('wallet-address').innerHTML = walletAddress;
  document.getElementById('wallet-balance').innerHTML = `${walletBalance.substring(0, 8)} ETH`;
}

function parseTokenURI(nftURI) {
  const data = base64.decode(nftURI.slice(29));
  const itemInfo = JSON.parse(data);
  const svg = base64.decode(itemInfo.image.slice(26));
  return {
    name: itemInfo.name,
    description: itemInfo.description,
    svg: svg,
  };
}

function getNFTDivItems(items) {
  let NFTdiv = "";
  items.forEach(item => {
    NFTdiv += ` <div class="NFT-item"> 
                  <div class="NFT-svg"> ${item.svg} </div> 
                  <div> ${item.name} </div> 
                </div>`;
  });
  return NFTdiv;
}

async function FreshMyNFT() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const NFTCount = await tokenContract.balanceOf(walletAddress);

  let items = [];
  for (let i = 0; i < NFTCount; i++) {
    const tokenId = await tokenContract.tokenOfOwnerByIndex(walletAddress, i);
    const tokenMetadataURI = await tokenContract.tokenURI(tokenId);
    items.push(parseTokenURI(tokenMetadataURI));
  }

  document.getElementById('display-my-NFT').innerHTML = getNFTDivItems(items);
};

async function mint() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const res = await tokenContract.mintTo(walletAddress);
};

async function FreshMarketNFT() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);

  let items = [];
  const activeItems = await marketContract.connect(walletAddress).fetchActiveItems();
  for (let i = 0; i < activeItems.length; i++) {
    let tokenMetadataURI = await tokenContract.tokenURI(activeItems[i].tokenId)
    items.push(parseTokenURI(tokenMetadataURI));
  }

  document.getElementById('display-my-NFT').innerHTML = getNFTDivItems(items);
};

async function sale() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const listingFee = await marketContract.getListingFee();
  const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  const tokenIdSelected = ethers.BigNumber.from(document.getElementById('sale-tokenId').value);
  await tokenContract.approve(marketAddress, tokenIdSelected);
  await marketContract.createMarketItem(tokenContractAddress, tokenIdSelected, auctionPrice, { value: listingFee });
}

async function buy() {
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const tokenIdSelected = ethers.BigNumber.from(document.getElementById('buy-tokenId').value);
  const auctionPrice = ethers.utils.parseUnits('1', 'ether');
  await marketContract.createMarketSale(tokenContractAddress, tokenIdSelected, { value: auctionPrice });
}

document.getElementById('connect-wallet').addEventListener('click', connectWallet);
document.getElementById('fresh-my-NFT').addEventListener('click', FreshMyNFT);
document.getElementById('mint').addEventListener('click', mint);
document.getElementById('fresh-market-NFT').addEventListener('click', FreshMarketNFT);
document.getElementById('sale').addEventListener('click', sale);
document.getElementById('buy').addEventListener('click', buy);