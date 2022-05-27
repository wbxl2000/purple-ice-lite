const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // you deploy address

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
  document.getElementById('address').innerHTML = walletAddress.substring(0, 5) + "..." + walletAddress.substring(walletAddress.length - 4, walletAddress.length);
  document.getElementById('balance').innerHTML = `${balance.substring(0, 8)} ETH`;
}

async function mint() {
  tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
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
  tokenContract = new ethers.Contract(tokenContractAddress, BadgeTokenABI.abi, signer);
  const b = await tokenContract.balanceOf(walletAddress);
  console.warn(b);
  let items = [];
  for (let i = 0; i < b; i++) {
    const tokenId = await tokenContract.tokenOfOwnerByIndex(walletAddress, i);
    let tokenMetadataURI = await tokenContract.tokenURI(tokenId)
    console.log(parseTokenURI(tokenMetadataURI));
    items.push(parseTokenURI(tokenMetadataURI));
  }
  console.log(items);
  document.getElementById('displayMyNFT').innerHTML = items.map(item => `<div style="width: 100px; height: 100px;"> ${item.svg} </div>`);
};

document.getElementById('connectBtn').addEventListener('click', connectWallet);
document.getElementById('mint').addEventListener('click', mint);
document.getElementById('FreshMyNFTBtn').addEventListener('click', FreshMyNFT);