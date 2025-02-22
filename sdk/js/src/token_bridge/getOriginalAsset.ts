import { Connection, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { arrayify, zeroPad } from "ethers/lib/utils";
import { TokenImplementation__factory } from "../ethers-contracts";
import {
  ChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
} from "../utils";
import { getIsWrappedAssetEth } from "./getIsWrappedAsset";
import { LCDClient } from "@terra-money/terra.js";
import { canonicalAddress } from "../terra";

export interface WormholeWrappedInfo {
  isWrapped: boolean;
  chainId: ChainId;
  assetAddress: Uint8Array;
}

/**
 * Returns a origin chain and asset address on {originChain} for a provided Wormhole wrapped address
 * @param tokenBridgeAddress
 * @param provider
 * @param wrappedAddress
 * @returns
 */
export async function getOriginalAssetEth(
  tokenBridgeAddress: string,
  provider: ethers.providers.Web3Provider,
  wrappedAddress: string
): Promise<WormholeWrappedInfo> {
  const isWrapped = await getIsWrappedAssetEth(
    tokenBridgeAddress,
    provider,
    wrappedAddress
  );
  if (isWrapped) {
    const token = TokenImplementation__factory.connect(
      wrappedAddress,
      provider
    );
    const chainId = (await token.chainId()) as ChainId; // origin chain
    const assetAddress = await token.nativeContract(); // origin address
    return {
      isWrapped: true,
      chainId,
      assetAddress: arrayify(assetAddress),
    };
  }
  return {
    isWrapped: false,
    chainId: CHAIN_ID_ETH,
    assetAddress: arrayify(wrappedAddress),
  };
}

export async function getOriginalAssetTerra(
  client: LCDClient,
  wrappedAddress: string
): Promise<WormholeWrappedInfo> {
  const result: {
    asset_address: string;
    asset_chain: ChainId;
    bridge: string;
  } = await client.wasm.contractQuery(wrappedAddress, {
    wrapped_asset_info: {},
  });
  if (result) {
    return {
      isWrapped: true,
      chainId: result.asset_chain,
      assetAddress: new Uint8Array(Buffer.from(result.asset_address, "base64")),
    };
  }
  return {
    isWrapped: false,
    chainId: CHAIN_ID_TERRA,
    assetAddress: zeroPad(canonicalAddress(wrappedAddress), 32),
  };
}

/**
 * Returns a origin chain and asset address on {originChain} for a provided Wormhole wrapped address
 * @param connection
 * @param tokenBridgeAddress
 * @param mintAddress
 * @returns
 */
export async function getOriginalAssetSol(
  connection: Connection,
  tokenBridgeAddress: string,
  mintAddress: string
): Promise<WormholeWrappedInfo> {
  if (mintAddress) {
    // TODO: share some of this with getIsWrappedAssetSol, like a getWrappedMetaAccountAddress or something
    const { parse_wrapped_meta, wrapped_meta_address } = await import(
      "../solana/token/token_bridge"
    );
    const wrappedMetaAddress = wrapped_meta_address(
      tokenBridgeAddress,
      new PublicKey(mintAddress).toBytes()
    );
    const wrappedMetaAddressPK = new PublicKey(wrappedMetaAddress);
    const wrappedMetaAccountInfo = await connection.getAccountInfo(
      wrappedMetaAddressPK
    );
    if (wrappedMetaAccountInfo) {
      const parsed = parse_wrapped_meta(wrappedMetaAccountInfo.data);
      return {
        isWrapped: true,
        chainId: parsed.chain,
        assetAddress: parsed.token_address,
      };
    }
  }
  return {
    isWrapped: false,
    chainId: CHAIN_ID_SOLANA,
    assetAddress: new Uint8Array(32),
  };
}
