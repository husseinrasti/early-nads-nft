import { getContract } from "thirdweb";
import { client } from "./client";
import { CONTRACT_ADDRESS } from "./addresses";
import { monadChain } from "./chain";

export const contract = getContract({
  client: client,
  chain: monadChain,
  address: CONTRACT_ADDRESS
});
