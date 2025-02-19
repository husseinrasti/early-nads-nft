import { defineChain } from "thirdweb";

export const monadChain = defineChain({
    id: 10143,
    rpc: "https://testnet-rpc.monad.xyz/",
    nativeCurrency: {
        name: "Monad",
        symbol: "MON",
        decimals: 18,
    },
});