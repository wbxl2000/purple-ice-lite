const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // you deploy address

let address;
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
  address = account;
  document.getElementById('address').innerHTML = address.substring(0, 5) + "..." + address.substring(address.length - 4, address.length);
  document.getElementById('balance').innerHTML = `${balance.substring(0, 8)} ETH`;
}

async function mint() {
  tokenContract = new ethers.Contract(tokenContractAddress, BadgeToken.abi, signer);

};

document.getElementById('connectBtn').addEventListener('click', connectWallet);