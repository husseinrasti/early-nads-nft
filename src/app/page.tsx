'use client';

import { MediaRenderer, TransactionButton, useReadContract, useActiveAccount } from "thirdweb/react";
import { client } from "./const/client";
import { contract } from "./const/contract";
import { toEther } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint, balanceOf } from "thirdweb/extensions/erc721";
import { useState } from "react";

export default function Home() {
  const account = useActiveAccount();

  const [quantity, setQuantity] = useState(1);

  const { data: contractMetadata, isLoading: isContractMetadataLaoding } = useReadContract(getContractMetadata,
    { contract: contract }
  );

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply,
    { contract: contract }
  );

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint,
    { contract: contract }
  );

  const { data: claimCondition, isLoading: isClaimConditionLoading } = useReadContract(getActiveClaimCondition,
    { contract: contract }
  );

  const { data: balanceOfNFT, isLoading: isBalanceOfNFTLoading } = useReadContract(balanceOf,
    { contract: contract, owner: account?.address || "" }
  );

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  }

  const truncateMaxClaimableSupply = (supply: string) => {
    return `${supply.slice(0, 6)}`;
  };

  return (
    <div className="flex items-center text-center justify-center">
      <div className="heroSection flex flex-row items-center">
        {isContractMetadataLaoding ? (
          <p>Loading...</p>
        ) : (
          <div className="collectionImage flex flex-col">
            <MediaRenderer
              client={client}
              src={contractMetadata?.image}
              className="rounded-xl"
            />
            <div className="collectionText flex flex-row ml-8">
              <h2 className="text-2xl font-semibold mt-4">
                {contractMetadata?.name}
              </h2>
              <p className="text-m">
                {contractMetadata?.description}
              </p>
            </div>
          </div>
        )}
        <div className="mintContainer flex flex-col">
          <div className="claimContainer">
            {isClaimedSupplyLoading || isTotalSupplyLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p className="flex flex-col text-lg font-bold my-4 mr-8">
                  Total Minted: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
                </p>
              </div>
            )}
            {account && claimCondition ? (
              balanceOfNFT ? (
                isClaimConditionLoading || isBalanceOfNFTLoading ? (
                  <p>Loading...</p>
                ) : (
                  <p className="flex flex-col text-lg font-bold my-4 mr-8">
                    Mint Remaining: {balanceOfNFT?.toString()}/{truncateMaxClaimableSupply(claimCondition?.quantityLimitPerWallet?.toString()!)}
                  </p>
                )
              ) : (
                <p className="flex flex-col text-lg font-bold my-4 mr-8">
                  Claim per wallet: {truncateMaxClaimableSupply(claimCondition?.quantityLimitPerWallet?.toString()!)}
                </p>
              )
            ) : (
              <p />
            )}
          </div>
          <div className="claimContainer">
            {claimCondition && claimCondition?.quantityLimitPerWallet! > 1 ? (
              <div className="counterContainer items-center justify-center my-4 mr-8">
                <button
                  className="bg-black text-white px-4 py-2 rounded-md mr-4"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <p className="w-10 text-center border border-gray-300 rounded-md bg-black text-white">
                  {quantity}
                </p>
                <button
                  className="bg-black text-white px-4 py-2 rounded-md ml-4"
                  onClick={() => {
                    const limit = Number(claimCondition?.quantityLimitPerWallet ?? 0);
                    const balance = Number(balanceOfNFT ?? 0);
                    if (limit - balance <= quantity) {
                      alert("Quantity exceeds the allowed limit.");
                    } else {
                      setQuantity(quantity + 1);
                    }
                  }}
                >+</button>
              </div>
            ) : (
              <p />
            )}
            <TransactionButton
              transaction={() => claimTo({
                contract: contract,
                to: account?.address || "",
                quantity: BigInt(quantity),
              })}
              onTransactionConfirmed={async () => {
                alert("NFT Claimed!");
                setQuantity(1);
              }}
              onError={(error) => {
                alert(error.message);
              }}
            >
              {`Claim NFT (${getPrice(quantity)} MON)`}
            </TransactionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
