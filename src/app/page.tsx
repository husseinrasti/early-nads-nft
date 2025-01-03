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
    <div className="p-4 flex items-center text-center justify-center">
      <div className="heroSection flex flex-col items-center">
        {isContractMetadataLaoding ? (
          <p>Loading...</p>
        ) : (
          <div className="collectionImage">
            <MediaRenderer
              client={client}
              src={contractMetadata?.image}
              className="rounded-xl"
            />
            <h2 className="text-2xl font-semibold mt-4">
              {contractMetadata?.name}
            </h2>
            <p className="text-lg mt-2">
              {contractMetadata?.description}
            </p>
          </div>
        )}
        <div className="flex flex-col items-center justify-center my-4">
          {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="flex flex-col text-lg font-bold my-2">
              Total NFT Supply: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
            </p>
          )}
          {account ? (
            isClaimConditionLoading || isBalanceOfNFTLoading ? (
              <p>Loading...</p>
            ) : (
              <p className="flex flex-col text-lg font-bold my-2">
                Claim per wallet: {balanceOfNFT?.toString()}/{truncateMaxClaimableSupply(claimCondition?.quantityLimitPerWallet?.toString()!)}
              </p>
            )
          ) : (
            <br />
          )}
          <div className="claimContainer items-center justify-center my-4">
            <button
              className="bg-black text-white px-4 py-2 rounded-md mr-4"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >-</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-10 text-center border border-gray-300 rounded-md bg-black text-white"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-md ml-4"
              onClick={() => setQuantity(quantity + 1)}
            >+</button>
          </div>
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
  );
}
