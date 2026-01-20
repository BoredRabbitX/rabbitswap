class WalletManager {
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }

    async connectNetwork() {
        try {
            showLoading('Connecting to network...');
            
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: this.config.CHAIN_ID,
                    chainName: this.config.CHAIN_NAME,
                    nativeCurrency: { name: 'PAS', symbol: 'PAS', decimals: 18 },
                    rpcUrls: [this.config.RPC_URL]
                }]
            });
            
            showNotification('Network connected successfully', 'success');
            return true;
        } catch (error) {
            showNotification('Failed to connect network', 'error');
            console.error('Network connection error:', error);
            return false;
        } finally {
            hideLoading();
        }
    }

    async connectWallet() {
        try {
            showLoading('Connecting wallet...');
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.state.userAddress = accounts[0];
            this.state.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.state.signer = this.state.provider.getSigner();
            
            document.getElementById('setup-screen').style.display = 'none';
            document.getElementById('terminal-screen').style.display = 'block';
            document.getElementById('welcome-section').style.display = 'none';
            document.getElementById('wallet-address').textContent = formatAddress(this.state.userAddress);
            document.getElementById('connection-status').classList.add('connected');
            
            showNotification('Wallet connected', 'success');
            return true;
        } catch (error) {
            showNotification('Failed to connect wallet', 'error');
            console.error('Wallet connection error:', error);
            return false;
        } finally {
            hideLoading();
        }
    }

    setupAccountListener(callback) {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    this.state.userAddress = accounts[0];
                    document.getElementById('wallet-address').textContent = formatAddress(this.state.userAddress);
                    if (callback) callback();
                } else {
                    location.reload();
                }
            });
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WalletManager;
}