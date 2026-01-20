class SwapManager {
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }

    calculateSwap(value) {
        const num = parseFloat(value) || 0;
        const result = this.state.isHopToRab 
            ? num * this.config.SWAP_RATE 
            : num / this.config.SWAP_RATE;
        
        document.getElementById('input-to').value = result.toFixed(this.state.isHopToRab ? 2 : 5);
    }

    setMax() {
        const maxBalance = this.state.isHopToRab ? this.state.balances.hop : this.state.balances.rab;
        document.getElementById('input-from').value = maxBalance.toFixed(2);
        this.calculateSwap(maxBalance);
    }

    toggleDirection() {
        this.state.isHopToRab = !this.state.isHopToRab;
        
        document.getElementById('label-from').textContent = this.state.isHopToRab ? 'From HOPx' : 'From RABx';
        document.getElementById('label-to').textContent = this.state.isHopToRab ? 'To RABx' : 'To HOPx';
        document.getElementById('balance-from').textContent = (this.state.isHopToRab ? this.state.balances.hop : this.state.balances.rab).toFixed(2);
        document.getElementById('balance-to').textContent = (this.state.isHopToRab ? this.state.balances.rab : this.state.balances.hop).toFixed(2);
        
        document.getElementById('input-from').value = '';
        document.getElementById('input-to').value = '';
    }

    async executeSwap() {
        const value = document.getElementById('input-from').value;
        if (!validateInput(value)) {
            showNotification('Please enter a valid amount', 'warning');
            return;
        }
        
        try {
            showLoading('Checking allowance...');
            
            const tokenAddr = this.state.isHopToRab ? this.config.HOP_ADDR : this.config.RAB_ADDR;
            const amount = parseEther(value);
            
            const token = new ethers.Contract(tokenAddr, [
                "function approve(address spender, uint256 amount) public returns (bool)",
                "function allowance(address owner, address spender) view returns (uint256)"
            ], this.state.signer);
            
            const currentAllowance = await token.allowance(this.state.userAddress, this.config.SWAP_ADDR);
            
            if (currentAllowance.lt(amount)) {
                showLoading('Authorizing token spending...');
                const txApprove = await token.approve(this.config.SWAP_ADDR, amount.mul(10));
                await txApprove.wait();
            }
            
            showLoading('Executing swap...');
            
            const swapContract = new ethers.Contract(this.config.SWAP_ADDR, [
                "function swapIn(uint256 a) external",
                "function swapOut(uint256 a) external"
            ], this.state.signer);
            
            const txSwap = this.state.isHopToRab
                ? await swapContract.swapIn(amount, { gasLimit: 600000 })
                : await swapContract.swapOut(amount, { gasLimit: 600000 });
            
            showLoading('Confirming transaction...');
            await txSwap.wait();
            
            showNotification('Swap completed successfully!', 'success');
            await this.updateBalances();
            
            document.getElementById('input-from').value = '';
            document.getElementById('input-to').value = '';
        } catch (error) {
            showNotification('Swap failed', 'error');
            console.error('Swap execution error:', error);
        } finally {
            hideLoading();
        }
    }

    async updateBalances() {
        try {
            const hopContract = new ethers.Contract(
                this.config.HOP_ADDR,
                ["function balanceOf(address) view returns (uint256)"],
                this.state.provider
            );
            const rabContract = new ethers.Contract(
                this.config.RAB_ADDR,
                ["function balanceOf(address) view returns (uint256)"],
                this.state.provider
            );
            
            const [hopBal, rabBal] = await Promise.all([
                hopContract.balanceOf(this.state.userAddress),
                rabContract.balanceOf(this.state.userAddress)
            ]);
            
            this.state.balances.hop = parseFloat(ethers.utils.formatEther(hopBal));
            this.state.balances.rab = parseFloat(ethers.utils.formatEther(rabBal));
            
            document.getElementById('stat-hop').textContent = this.state.balances.hop.toFixed(2);
            document.getElementById('stat-rab').textContent = this.state.balances.rab.toFixed(2);
            document.getElementById('balance-from').textContent = this.state.balances.hop.toFixed(2);
            document.getElementById('balance-to').textContent = this.state.balances.rab.toFixed(2);
        } catch (error) {
            console.error('Balance update failed:', error);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwapManager;
}