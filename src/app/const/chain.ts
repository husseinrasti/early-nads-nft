import { defineChain } from "thirdweb";

export const monadChain = defineChain({
    id: 20143,
    rpc: "https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a",
    nativeCurrency: {
        name: "Monad",
        symbol: "MON",
        decimals: 18,
    },
});