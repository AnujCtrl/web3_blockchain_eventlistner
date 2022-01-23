const express = require('express');
const app = express();
app.get('/', (req,res)=>{
  res.sendFile(__dirname + "index.html");
});


const Web3 = require('web3');
const client = require('node-rest-client-promise').Client();
const INFURA_KEY = "06ebba0649ff407fba5806452b711405"; // Insert your own key here :)
const ETHERSCAN_API_KEY = "BPAHVSX3J7K5ZU7RZ7CZ8HH3QNDB64JRPK";
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/'  +  INFURA_KEY);
const AAVE_CONTRACT_ADDRESS = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
const TEL_CONTRACT_ADDRESS = "0x467Bccd9d29f223BcE8043b84E8C8B282827790F";
const USDC_CONTRACT_ADDRESS ="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" ;
const HEX_CONTRACT_ADDRESS ="0x2b591e99afe9f32eaa6214f7b7629768c40eeb39" ;
const SHIB_CONTRACT_ADDRESS ="0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" ;
const MATIC_CONTRACT_ADDRESS ="0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" ;
const UST_CONTRACT_ADDRESS ="0xa47c8bf37f92abed4a126bda807a7b7498661acd" ;
const UNI_CONTRACT_ADDRESS ="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" ;

let STARTBLOCK=14064600
const FILE= 'TOKENBLOCK.json';

let TOKEN_BLOCK = new Map();
TOKEN_BLOCK.set('AAVE',14064468);
TOKEN_BLOCK.set('TEL',0);
TOKEN_BLOCK.set('USDC',0);
TOKEN_BLOCK.set('HEX',0);
TOKEN_BLOCK.set('SHIB',0);
TOKEN_BLOCK.set('MATIC',0);
TOKEN_BLOCK.set('UST',0);
TOKEN_BLOCK.set('UNI',0);

const delay = ms => new Promise(res => setTimeout(res, ms));

const jsonfile = require('jsonfile')

async function getContractAbi(contract_adr) {
    const etherescan_response = await client.getPromise(`http://api.etherscan.io/api?module=contract&action=getabi&address=${contract_adr}&apikey=${ETHERSCAN_API_KEY}`)
    const CONTRACT_ABI = JSON.parse(etherescan_response.data.result);
    // console.log("CONTRACT_ABI reached")
    return CONTRACT_ABI;
}

async function eventQuery(contract_adr){
  const CONTRACT_ABI = await getContractAbi(contract_adr);
  // console.log("event query called")
  const contract = new web3.eth.Contract(CONTRACT_ABI, contract_adr);
  return new Promise((resolve,reject)=>{
    contract.getPastEvents('allEvents',{ fromBlock: STARTBLOCK}, function(error, event){ 
     try{
         const temp=event[event.length-1];
         console.log(temp['blockNumber'])
        resolve(temp['blockNumber']);}
      catch(e){reject()}
      if (error){}
      });
    })
}
// eventQuery(CONTRACT_ADDRESS).then((res)=>{
//   console.log(res)
// });
async function start(){
  while(true){
  //TEL
  await eventQuery(TEL_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('TEL',res);
    STARTBLOCK=res;
    }).catch((res)=>{});  

  //AAVE
  await eventQuery(AAVE_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('AAVE',res);
    }).catch((res)=>{});  

  //USDC
  await eventQuery(USDC_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('USDC',res);
    }).catch((res)=>{}); 

  //HEX
  await eventQuery(HEX_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('HEX',res);
    }).catch((res)=>{}); 
  //SHIB
  await eventQuery(SHIB_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('SHIB',res);
    }).catch((res)=>{}); 

   await delay(2000);
  //MATIC
  await eventQuery(MATIC_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('MATIC',res);
    }).catch((res)=>{});  
  //UST
  await eventQuery(UST_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('UST',res);
    }).catch((res)=>{});  
  //UNI
  await eventQuery(UNI_CONTRACT_ADDRESS).then((res)=>{
    TOKEN_BLOCK.set('UNI',res);
    }).catch((res)=>{});  

  json = Object.fromEntries(TOKEN_BLOCK);
  jsonfile.writeFile(FILE,json,function(err){if (err) console.error})
}}


start();