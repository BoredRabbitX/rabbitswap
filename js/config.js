const CONFIG = {
    HOP_ADDR: "0x5bf234923b9a947ad6770dad18a04f9ae33ad3bc",
    RAB_ADDR: "0xb28c695683eb22a06dd2d1e70bda8e915eb0bc12",
    SWAP_ADDR: "0xae2b93bccdebf437ad00fd19ca46060ba145deb2",
    CHAIN_ID: "0x190bc416",
    CHAIN_NAME: "Paseo Asset Hub",
    RPC_URL: "https://testnet-passet-hub-eth-rpc.polkadot.io",
    SWAP_RATE: 200,
    CLAIM_COOLDOWN: 604800
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}