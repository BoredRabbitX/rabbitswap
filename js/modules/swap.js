class SwapManager {
    constructor(config, state) {
        this.config = config;
        this.state = state;
        this.isHopToRab = true;
    }

    calculateSwap(value) {
        const num = parseFloat(value) || 0;
        const result = this.isHopToRab 
            ? num * this.config.SWAP_RATE 
            : num / this.config.SWAP_RATE;
        
        document.getElementById('input-to').value = result.toFixed(this.isHopToRab ? 2 : 5);
    }

    setMax() {
        const maxBalance = this.isHopToRab ? this.state.balances.hop : this.state.balances.rab;
        document.getElementById('input-from').value = maxBalance.toFixed(2);
        this.calculateSwap(maxBalance);
    }

    async executeSwap() {
        const value = document.getElementById('input-from').value;
        if (!validateInput(value)) {
            showNotification('Please enter a valid amount 🥕', 'warning');
            return;
        }
        
        if (!this.isHopToRab) {
            showNotification('Reverse swap not supported yet 🥕', 'warning');
            return;
        }
        
        try {
            showLoading('Checking allowance...');
            
            const amount = parseEther(value);
            
            const hopToken = new ethers.Contract(this.config.HOP_ADDR, [
                "function approve(address spender, uint256 amount) public returns (bool)",
                "function allowance(address owner, address spender) view returns (uint256)"
            ], this.state.signer);
            
            const currentAllowance = await hopToken.allowance(this.state.userAddress, this.config.SWAP_ADDR);
            
            if (currentAllowance.lt(amount)) {
                showLoading('Authorizing HOPx spending...');
                const txApprove = await hopToken.approve(this.config.SWAP_ADDR, ethers.constants.MaxUint256);
                await txApprove.wait();
            }
            
            showLoading('Executing swap...');
            
            const swapContract = new ethers.Contract(this.config.SWAP_ADDR, [
                "function swapHOPxforRABx(uint256 nIn) external"
            ], this.state.signer);
            
            const estimatedGas = await swapContract.estimateGas.swapHOPxforRABx(amount);
            const gasLimit = estimatedGas.mul(150).div(100);
            
            const txSwap = await swapContract.swapHOPxforRABx(amount, { gasLimit });
            
            showLoading('Confirming transaction...');
            await txSwap.wait();
            
            showNotification('🎉 Swap completed! Enjoy your carrots!', 'success');
            await this.updateBalances();
            
            document.getElementById('input-from').value = '';
            document.getElementById('input-to').value = '';
        } catch (error) {
            console.error('Swap execution error:', error);
            
            let errorMessage = 'Swap failed';
            if (error.reason) {
                errorMessage += `: ${error.reason}`;
            } else if (error.message) {
                errorMessage += `: ${error.message.split('(')[0]}`;
            }
            
            showNotification(errorMessage, 'error');
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