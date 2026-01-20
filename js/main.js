const state = {
    userAddress: null,
    provider: null,
    signer: null,
    balances: { hop: 0, rab: 0 }
};

let walletManager, claimManager, swapManager, canvasBackground;

function init() {
    canvasBackground = new CanvasBackground('bg-canvas');
    canvasBackground.start();

    walletManager = new WalletManager(CONFIG, state);
    claimManager = new ClaimManager(CONFIG, state);
    swapManager = new SwapManager(CONFIG, state);

    setupEventListeners();
    
    window.addEventListener('resize', () => canvasBackground.init());
}

function setupEventListeners() {
    window.handleNetwork = () => walletManager.connectNetwork();
    window.handleWallet = async () => {
        const connected = await walletManager.connectWallet();
        if (connected) {
            await swapManager.updateBalances();
            walletManager.setupAccountListener(() => swapManager.updateBalances());
        }
    };
    
    window.initiateClaim = () => claimManager.initiateClaim();
    window.executeClaim = () => claimManager.executeClaim();
    window.calculateSwap = (value) => swapManager.calculateSwap(value);
    window.setMax = () => swapManager.setMax();
    window.executeSwap = () => swapManager.executeSwap();
}

document.addEventListener('DOMContentLoaded', init);