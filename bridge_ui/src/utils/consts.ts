import {
  ChainId,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
} from "@certusone/wormhole-sdk";
import { clusterApiUrl } from "@solana/web3.js";
import { getAddress } from "ethers/lib/utils";

export type Cluster = "devnet" | "testnet" | "mainnet";
export const CLUSTER: Cluster =
  process.env.REACT_APP_CLUSTER === "mainnet"
    ? "mainnet"
    : process.env.REACT_APP_CLUSTER === "testnet"
    ? "testnet"
    : "devnet";
export interface ChainInfo {
  id: ChainId;
  name: string;
}
export const CHAINS =
  CLUSTER === "testnet"
    ? [
        {
          id: CHAIN_ID_ETH,
          name: "Ethereum",
        },
        {
          id: CHAIN_ID_SOLANA,
          name: "Solana",
        },
      ]
    : [
        {
          id: CHAIN_ID_BSC,
          name: "Binance Smart Chain",
        },
        {
          id: CHAIN_ID_ETH,
          name: "Ethereum",
        },
        {
          id: CHAIN_ID_SOLANA,
          name: "Solana",
        },
        {
          id: CHAIN_ID_TERRA,
          name: "Terra",
        },
      ];
export type ChainsById = { [key in ChainId]: ChainInfo };
export const CHAINS_BY_ID: ChainsById = CHAINS.reduce((obj, chain) => {
  obj[chain.id] = chain;
  return obj;
}, {} as ChainsById);
export const WORMHOLE_RPC_HOST =
  CLUSTER === "testnet"
    ? "https://wormhole-v2-testnet-api.certus.one"
    : "http://localhost:8080";
export const ETH_NETWORK_CHAIN_ID =
  CLUSTER === "mainnet" ? 1 : CLUSTER === "testnet" ? 5 : 1337;
export const SOLANA_HOST =
  CLUSTER === "testnet" ? clusterApiUrl("testnet") : "http://localhost:8899";
export const TERRA_HOST = {
  URL: "http://localhost:1317",
  chainID: "columbus-4",
  name: "localterra",
};
export const ETH_TEST_TOKEN_ADDRESS = getAddress(
  CLUSTER === "testnet"
    ? "0xcEE940033DA197F551BBEdED7F4aA55Ee55C582B"
    : "0x67B5656d60a809915323Bf2C40A8bEF15A152e3e"
);
export const ETH_BRIDGE_ADDRESS = getAddress(
  CLUSTER === "testnet"
    ? "0x44F3e7c20850B3B5f3031114726A9240911D912a"
    : "0xC89Ce4735882C9F0f0FE26686c53074E09B0D550"
);
export const ETH_TOKEN_BRIDGE_ADDRESS = getAddress(
  CLUSTER === "testnet"
    ? "0xa6CDAddA6e4B6704705b065E01E52e2486c0FBf6"
    : "0x0290FB167208Af455bB137780163b7B7a9a10C16"
);
export const SOL_TEST_TOKEN_ADDRESS =
  CLUSTER === "testnet"
    ? "6uzMjLkcTwhYo5Fwx9DtVtQ7VRrCQ7bTUd7rHXTiPDXp"
    : "2WDq7wSs9zYrpx2kbHDA4RUTRch2CCTP6ZWaH4GNfnQQ";
export const SOL_BRIDGE_ADDRESS =
  CLUSTER === "testnet"
    ? "Brdguy7BmNB4qwEbcqqMbyV5CyJd2sxQNUn6NEpMSsUb"
    : "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o";
export const SOL_TOKEN_BRIDGE_ADDRESS =
  CLUSTER === "testnet"
    ? "A4Us8EhCC76XdGAN17L4KpRNEK423nMivVHZzZqFqqBg"
    : "B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE";
export const TERRA_TEST_TOKEN_ADDRESS =
  "terra13nkgqrfymug724h8pprpexqj9h629sa3ncw7sh";
export const TERRA_BRIDGE_ADDRESS =
  "terra18vd8fpwxzck93qlwghaj6arh4p7c5n896xzem5";
export const TERRA_TOKEN_BRIDGE_ADDRESS =
  "terra174kgn5rtw4kf6f938wm7kwh70h2v4vcfd26jlc";
// "terra10pyejy66429refv3g35g2t7am0was7ya7kz2a4";

export const COVALENT_API_KEY = process.env.REACT_APP_COVALENT_API_KEY
  ? process.env.REACT_APP_COVALENT_API_KEY
  : "";

export const COVALENT_GET_TOKENS_URL = (
  chainId: ChainId,
  walletAddress: string
) => {
  let chainNum = "";
  if (chainId === CHAIN_ID_ETH) {
    chainNum = COVALENT_ETHEREUM_MAINNET;
  }

  return `https://api.covalenthq.com/v1/${chainNum}/address/${walletAddress}/balances_v2/?key=${COVALENT_API_KEY}`;
};

export const COVALENT_ETHEREUM_MAINNET = "1";
