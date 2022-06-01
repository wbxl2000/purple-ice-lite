const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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

function getNFTDivItems(items, type) {
  console.log(items);
  let saleDisplay = '';
  let buyDisplay = '';
  type === "sale" ? buyDisplay = "display: none" : saleDisplay = "display: none";

  let NFTdiv = "";
  items.forEach(item => {
    NFTdiv += ` <div class="NFT-item"> 
                  <div class="NFT-svg"> ${item.svg} </div> 
                  <div class="NFT-title">
                    <span> ${item.name} </span> 
                    <span class="NFT-sale-buy" style="${saleDisplay}" onclick="sale(${item.tokenId})"> sale </span>
                    <span class="NFT-sale-buy" style="${buyDisplay}" onclick="buy(${item.id})"> buy </span>
                  </div>
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
    items.push({ ...parseTokenURI(tokenMetadataURI), tokenId });
  }

  document.getElementById('display-my-NFT').innerHTML = getNFTDivItems(items, 'sale');
}

async function mint() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const res = await tokenContract.mintTo(walletAddress);
}

async function FreshMarketNFT() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);

  let items = [];
  const activeItems = await marketContract.connect(walletAddress).fetchActiveItems();
  for (let i = 0; i < activeItems.length; i++) {
    const tokenMetadataURI = await tokenContract.tokenURI(activeItems[i].tokenId);
    const id = activeItems[i].id;
    items.push({ ...parseTokenURI(tokenMetadataURI), id })
  }

  document.getElementById('display-market-NFT').innerHTML = getNFTDivItems(items, 'buy');
}

async function sale(tokenId) {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const listingFee = await marketContract.getListingFee();
  const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  await tokenContract.approve(marketAddress, tokenId);
  await marketContract.createMarketItem(tokenContractAddress, tokenId, auctionPrice, { value: listingFee });
}

async function buy(id) {
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const auctionPrice = ethers.utils.parseUnits('1', 'ether');
  await marketContract.createMarketSale(tokenContractAddress, id, { value: auctionPrice })
}

document.getElementById('connect-wallet').addEventListener('click', connectWallet);
document.getElementById('fresh-my-NFT').addEventListener('click', FreshMyNFT);
document.getElementById('mint').addEventListener('click', mint);
document.getElementById('fresh-market-NFT').addEventListener('click', FreshMarketNFT);
document.getElementById('sale').addEventListener('click', sale);
document.getElementById('buy').addEventListener('click', buy);