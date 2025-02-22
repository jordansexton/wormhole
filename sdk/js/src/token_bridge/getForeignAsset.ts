import { Connection, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { Bridge__factory } from "../ethers-contracts";
import { ChainId } from "../utils";
import { LCDClient } from "@terra-money/terra.js";
import { fromUint8Array } from "js-base64";

/**
 * Returns a foreign asset address on Ethereum for a provided native chain and asset address, AddressZero if it does not exist
 * @param tokenBridgeAddress
 * @param provider
 * @param originChain
 * @param originAsset zero pad to 32 bytes
 * @returns
 */
export async function getForeignAssetEth(
  tokenBridgeAddress: string,
  provider: ethers.providers.Web3Provider,
  originChain: ChainId,
  originAsset: Uint8Array
) {
  const tokenBridge = Bridge__factory.connect(tokenBridgeAddress, provider);
  try {
    return await tokenBridge.wrappedAsset(originChain, originAsset);
  } catch (e) {
    return ethers.constants.AddressZero;
  }
}

export async function getForeignAssetTerra(
  tokenBridgeAddress: string,
  client: LCDClient,
  originChain: ChainId,
  originAsset: Uint8Array
) {
  const result: { address: string } = await client.wasm.contractQuery(tokenBridgeAddress, {
    wrapped_registry: {
      chain: originChain,
      address: fromUint8Array(originAsset),
    },
  });
  return result.address;
}

/**
 * Returns a foreign asset address on Solana for a provided native chain and asset address
 * @param connection
 * @param tokenBridgeAddress
 * @param originChain
 * @param originAsset zero pad to 32 bytes
 * @returns
 */
export async function getForeignAssetSolana(
  connection: Connection,
  tokenBridgeAddress: string,
  originChain: ChainId,
  originAsset: Uint8Array
) {
  const { wrapped_address } = await import("../solana/token/token_bridge");
  const wrappedAddress = wrapped_address(
    tokenBridgeAddress,
    originAsset,
    originChain
  );
  const wrappedAddressPK = new PublicKey(wrappedAddress);
  const wrappedAssetAccountInfo = await connection.getAccountInfo(
    wrappedAddressPK
  );
  return wrappedAssetAccountInfo ? wrappedAddressPK.toString() : null;
}
