import { defineChain } from "thirdweb";

export const monadChain = defineChain({
    id: 41454,
    rpc: "https://devnet1.monad.xyz/rpc/8XQAiNSsPCrIdVttyeFLC6StgvRNTdf",
    nativeCurrency: {
        name: "Monad",
        symbol: "MON",
        decimals: 18,
    },
});