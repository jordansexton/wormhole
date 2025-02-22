import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

export async function signSendAndConfirm(
  wallet: WalletContextState,
  connection: Connection,
  transaction: Transaction
) {
  const signed = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid);
  return txid;
}

export async function getMultipleAccountsRPC(
  connection: Connection,
  pubkeys: PublicKey[]
): Promise<(AccountInfo<Buffer> | null)[]> {
  return getMultipleAccounts(connection, pubkeys, "finalized");
}

export const getMultipleAccounts = async (
  connection: any,
  pubkeys: PublicKey[],
  commitment: string
) => {
  return (
    await Promise.all(
      chunks(pubkeys, 99).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk, commitment)
      )
    )
  ).flat();
};

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
