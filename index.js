const Web3 = require('web3');
const client = require('node-rest-client-promise').Client();
const INFURA_KEY = "06ebba0649ff407fba5806452b711405"; // Insert your own key here :)
const ETHERSCAN_API_KEY = "BPAHVSX3J7K5ZU7RZ7CZ8HH3QNDB64JRPK";
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/'  +  INFURA_KEY);
const WETH_CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const BNB_CONTRACT_ADDRESS = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
const USDC_CONTRACT_ADDRESS ="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" ;
const HEX_CONTRACT_ADDRESS ="0x2b591e99afe9f32eaa6214f7b7629768c40eeb39" ;
const SHIB_CONTRACT_ADDRESS ="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" ;
const MATIC_CONTRACT_ADDRESS ="0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" ;
const UST_CONTRACT_ADDRESS ="0xa47c8bf37f92abed4a126bda807a7b7498661acd" ;
const CRO_CONTRACT_ADDRESS ="0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b" ;
const TRON_CONTRACT_ADDRESS ="0xe1be5d3f34e89de342ee97e6e90d405884da6c67" ;
const UNI_CONTRACT_ADDRESS ="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" ;

// const etherescan_url = `http://api.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
let TOKEN_BLOCK = new Map();
TOKEN_BLOCK.set('WETH',0);
TOKEN_BLOCK.set('BNB',0);
TOKEN_BLOCK.set('USDC',0);
TOKEN_BLOCK.set('HEX',0);
TOKEN_BLOCK.set('SHIB',0);
TOKEN_BLOCK.set('MATIC',0);
TOKEN_BLOCK.set('UST',0);
TOKEN_BLOCK.set('CRO',0);
TOKEN_BLOCK.set('TRON',0);
TOKEN_BLOCK.set('UNI',0);


async function getContractAbi(contract_adr) {
    const etherescan_response = await client.getPromise(`http://api.etherscan.io/api?module=contract&action=getabi&address=${contract_adr}&apikey=${ETHERSCAN_API_KEY}`)
    const CONTRACT_ABI = JSON.parse(etherescan_response.data.result);
    console.log("CONTRACT_ABI reached")
    return CONTRACT_ABI;
}

async function eventQuery(contract_adr){
  const CONTRACT_ABI = await getContractAbi(contract_adr);
  console.log("event query called")
  const contract = new web3.eth.Contract(CONTRACT_ABI, contract_adr);
  return new Promise((resolve,reject)=>{
    contract.getPastEvents('allEvents', function(error, event){ 
      resolve(event.at(-1)['blockNumber']);
      if (error){reject(error);}
      });
    })
}
// eventQuery(CONTRACT_ADDRESS).then((res)=>{
//   console.log(res)
// });
async function start(){
  //WETH
  await eventQuery(WETH_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('WETH',res);
    }).catch((res)=>{});  
  console.log("weth done");
  //BNB
  await eventQuery(BNB_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('BNB',res);
    }); 
  console.log("bnb done");
  //USDC
  await eventQuery(USDC_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('USDC',res);
    }).catch((res)=>{console.log(res)}); 
  console.log("usdc done");
  //HEX
  await eventQuery(HEX_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('HEX',res);
    }).catch((res)=>{console.log(res)}); 
  console.log("hex done");
  //SHIB
  await eventQuery(SHIB_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('SHIB',res);
    }).catch((res)=>{console.log(res)}); 
  console.log("shib done")
  //MATIC
  await eventQuery(MATIC_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('MATIC',res);
    }).catch((res)=>{console.log(res)});  
  console.log("matic done")
  //UST
  await eventQuery(UST_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('UST',res);
    }).catch((res)=>{console.log(res)});  
  console.log("ust done")
  //CRO
  await eventQuery(CRO_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('CRO',res);
    }).catch((res)=>{console.log(res)}); 
  console.log("cro done")
  //TRON
  await eventQuery(TRON_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('TRON',res);
    }).catch((res)=>{console.log(res)});  
  console.log("tron done")
  //UNI
  await eventQuery(UNI_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('UNI',res);
    }).catch((res)=>{console.log(res)});  
  console.log("uni done");

  console.log(TOKEN_BLOCK)
}


  start();
while(false){
  // setTimeout(() => { console.log("World!"); }, 2000);
  // console.log(TOKEN_BLOCK)
}