'use client';

import { client } from "../const/client";
import { contract } from "../const/contract";
import { MediaRenderer, useReadContract, useActiveAccount } from "thirdweb/react";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";

export default function Profile() {
    const account = useActiveAccount();

    const { data: contractMetadata, isLoading: isContractMetadataLaoding } = useReadContract(getContractMetadata,
        { contract: contract }
    );

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };


    const { data: ownedNFTs, isLoading: isNFTsLaoding } = useReadContract(getOwnedNFTs,
        { contract: contract, owner: account?.address || "" }
    );

    return (
        <div>
            {account && contract ? (
                <div className="contentCenter items-center justify-center">
                    {!isContractMetadataLaoding || !isNFTsLaoding ? (
                        ownedNFTs && ownedNFTs?.length > 0 ? (
                            <div className="grid">
                                {ownedNFTs?.map((nft) => (
                                    <div key={nft.metadata.id} className="NFTCard">
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="contentCenter">
                                <p className="text-2xl md:text-2xl font-semibold md:font-bold">
                                    No NFTs owned
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="contentCenter">
                            <p className="text-2xl md:text-2xl font-semibold md:font-bold">
                                Loading...
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="contentCenter">
                    <p className="text-2xl md:text-2xl font-semibold md:font-bold">
                        Connect your wallet to view your profile.
                    </p>
                </div>
            )}

        </div>
    )
}