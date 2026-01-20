class CanvasBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        const count = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 20000));
        
        for(let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                size: Math.random() * 4 + 2,
                type: Math.random() > 0.3 ? 'carrot' : 'rabbit'
            });
        }
    }

    drawParticle(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        
        if (p.type === 'carrot') {
            this.ctx.font = `${p.size * 2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🥕', 0, 0);
        } else {
            this.ctx.font = `${p.size * 2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('🐰', 0, 0);
        }
        
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if(p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            this.drawParticle(p);
            
            for(let j = i + 1; j < this.particles.length; j++) {
                const dx = p.x - this.particles[j].x;
                const dy = p.y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if(dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 140, 0, ${(1 - dist / 120) * 0.4})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasBackground;
}