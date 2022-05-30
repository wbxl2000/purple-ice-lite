const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

let walletAddress;
let balance;
let provider;
let signer;

async function connectWallet() {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const originBalance = await provider.getBalance(account);

  signer = provider.getSigner()
  console.log(account, signer, window.ethereum);
  console.log(ethers.utils.formatEther(originBalance));

  balance = ethers.utils.formatEther(originBalance);
  walletAddress = account;
  document.getElementById('address').innerHTML = walletAddress;
  document.getElementById('balance').innerHTML = `${balance.substring(0, 8)} ETH`;
}

async function mint() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const res = await tokenContract.mintTo(walletAddress);
  console.log(res);
};

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

async function FreshMyNFT() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const NFTCount = await tokenContract.balanceOf(walletAddress);
  let items = [];
  for (let i = 0; i < NFTCount; i++) {
    const tokenId = await tokenContract.tokenOfOwnerByIndex(walletAddress, i);
    let tokenMetadataURI = await tokenContract.tokenURI(tokenId)
    console.log(parseTokenURI(tokenMetadataURI));
    items.push(parseTokenURI(tokenMetadataURI));
  }
  console.log(items);
  let NFTdiv = "";
  items.forEach(item => {
    NFTdiv += `<div style="width: 100px; height: 100px; margin: 3px;"> ${item.svg} </div>`
  });
  document.getElementById('displayNFT').innerHTML = NFTdiv;
};

async function FreshMarketNFT() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  let items = [];
  const activeItems = await marketContract.connect(walletAddress).fetchActiveItems();
  for (let i = 0; i < activeItems.length; i++) {
    let tokenMetadataURI = await tokenContract.tokenURI(activeItems[i].tokenId)
    console.log(parseTokenURI(tokenMetadataURI));
    items.push(parseTokenURI(tokenMetadataURI));
  }
  console.log(items);
  let NFTdiv = "";
  items.forEach(item => {
    NFTdiv += `<div style="width: 100px; height: 100px; margin: 3px;"> ${item.svg} </div>`
  });
  document.getElementById('displayMarketNFT').innerHTML = NFTdiv;
};

async function sale() {
  const tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const listingFee = await marketContract.getListingFee();
  const auctionPrice = ethers.utils.parseUnits('1', 'ether')
  const tokenIdSelected = ethers.BigNumber.from(document.getElementById('saleTokenId').value);
  await tokenContract.approve(marketAddress, tokenIdSelected);
  await marketContract.createMarketItem(tokenContractAddress, tokenIdSelected, auctionPrice, { value: listingFee })
}

async function buy() {
  const marketContract = new ethers.Contract(marketAddress, NFTMarketplaceABI.abi, signer);
  const tokenIdSelected = ethers.BigNumber.from(document.getElementById('buyTokenId').value);
  const auctionPrice = ethers.utils.parseUnits('1', 'ether');
  await marketContract.createMarketSale(tokenContractAddress, tokenIdSelected, { value: auctionPrice })
}

document.getElementById('connectBtn').addEventListener('click', connectWallet);
document.getElementById('mint').addEventListener('click', mint);
document.getElementById('FreshMyNFTBtn').addEventListener('click', FreshMyNFT);
document.getElementById('FreshMarketNFTBtn').addEventListener('click', FreshMarketNFT);
document.getElementById('sale').addEventListener('click', sale);
document.getElementById('buy').addEventListener('click', buy);