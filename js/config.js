const CONFIG = {
    HOP_ADDR: "0xFf7FBB044170c855527735F08443A3e74C9E5580",
    RAB_ADDR: "0xae2b93bccdebf437ad00fd19ca46060ba145deb2",
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