class ClaimManager {
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }

    async initiateClaim() {
        try {
            showLoading('Checking claim eligibility...');
            
            const contract = new ethers.Contract(
                this.config.HOP_ADDR,
                ["function lastClaim(address) view returns (uint256)"],
                this.state.provider
            );
            
            const lastClaim = await contract.lastClaim(this.state.userAddress);
            const nextClaim = parseInt(lastClaim) + this.config.CLAIM_COOLDOWN;
            const now = Math.floor(Date.now() / 1000);
            
            if (now < nextClaim && parseInt(lastClaim) !== 0) {
                this.showCountdown(nextClaim);
            } else {
                this.startPoH();
            }
        } catch (error) {
            showNotification('Failed to check claim status', 'error');
            console.error('Claim initiation error:', error);
        } finally {
            hideLoading();
        }
    }

    showCountdown(nextClaim) {
        document.getElementById('btn-claim-init').style.display = 'none';
        document.getElementById('claim-countdown').style.display = 'block';
        
        setInterval(() => {
            const diff = nextClaim - Math.floor(Date.now() / 1000);
            if (diff <= 0) {
                location.reload();
                return;
            }
            
            const days = Math.floor(diff / 86400);
            const hours = Math.floor((diff % 86400) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            
            document.getElementById('countdown-timer').textContent = 
                `${days}D ${hours}H ${minutes}M ${seconds}S`;
        }, 1000);
    }

    startPoH() {
        document.getElementById('btn-claim-init').style.display = 'none';
        document.getElementById('poh-container').style.display = 'block';
        
        const icons = ['🥕', '🐰', '🥬', '🌽', '🍅', '🥔', '🥦', '🫛'];
        const target = [...icons].sort(() => 0.5 - Math.random()).slice(0, 4);
        document.getElementById('poh-target').textContent = target.join(' ');
        
        const grid = document.getElementById('poh-grid');
        grid.innerHTML = '';
        
        let step = 0;
        const shuffled = [...icons].sort(() => 0.5 - Math.random());
        
        shuffled.forEach(icon => {
            const cell = document.createElement('div');
            cell.className = 'poh-cell';
            cell.textContent = icon;
            cell.disabled = false;
            
            cell.onclick = () => {
                if (icon === target[step]) {
                    step++;
                    cell.classList.add('selected');
                    cell.disabled = true;
                    cell.classList.add('jump-animation');
                    
                    setTimeout(() => cell.classList.remove('jump-animation'), 500);
                    
                    if (step === 4) {
                        document.getElementById('poh-container').style.display = 'none';
                        document.getElementById('btn-final-claim').style.display = 'block';
                        showNotification('🎉 Carrots collected!', 'success');
                    }
                } else {
                    showNotification('Wrong carrot! Try again 🥕', 'warning');
                    this.startPoH();
                }
            };
            
            grid.appendChild(cell);
        });
    }

    async executeClaim() {
        try {
            showLoading('Executing claim...');
            
            const contract = new ethers.Contract(
                this.config.HOP_ADDR,
                ["function claimToken() external"],
                this.state.signer
            );
            
            const tx = await contract.claimToken({ gasLimit: 300000 });
            
            showLoading('Confirming transaction...');
            await tx.wait();
            
            showNotification('Claim successful!', 'success');
            setTimeout(() => location.reload(), 2000);
        } catch (error) {
            showNotification('Claim failed', 'error');
            console.error('Claim execution error:', error);
        } finally {
            hideLoading();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaimManager;
}