export function initCanvas() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return; // Disable all canvas interactions and rendering on touch devices
    
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; 
      my = e.clientY;
    });

    /* ── Custom Cursor ── */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let rx = 0, ry = 0;
    
    if (dot && ring) {
        function animateCursor() {
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    /* ── Hero Parallax ── */
    const heroGrad1 = document.querySelector('.hero-gradient');
    const heroGrad2 = document.querySelector('.hero-gradient-2');
    const heroSec   = document.getElementById('hero');
    const gorb1 = document.getElementById('gorb1');
    const gorb2 = document.getElementById('gorb2');
    const gorb3 = document.getElementById('gorb3');

    document.addEventListener('mousemove', e => {
        const nx = (e.clientX / window.innerWidth  - 0.5);
        const ny = (e.clientY / window.innerHeight - 0.5);
        if (heroSec && heroSec.getBoundingClientRect().bottom > 0) {
            if(heroGrad1) heroGrad1.style.transform = `translate(${nx * -50}px, ${ny * -50}px)`;
            if(heroGrad2) heroGrad2.style.transform = `translate(${nx *  35}px, ${ny *  35}px)`;
        }
        if(gorb1) gorb1.style.transform = `translate(${nx * -30}px, ${ny * -30}px)`;
        if(gorb2) gorb2.style.transform = `translate(${nx *  25}px, ${ny *  25}px)`;
        if(gorb3) gorb3.style.transform = `translate(${nx * -18}px, ${ny *  18}px)`;
    });

    /* ── Hero Canvas Particles ── */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r  = Math.random() * 1.5 + 0.5;
                this.a  = Math.random() * 0.5 + 0.1;
            }
            update() {
                const cr = canvas.getBoundingClientRect();
                const mdx = this.x - (mx - cr.left);
                const mdy = this.y - (my - cr.top);
                const md  = Math.sqrt(mdx * mdx + mdy * mdy);
                const repelR = 130;
                if (md < repelR && md > 0) {
                    const f = (repelR - md) / repelR;
                    this.vx += (mdx / md) * f * 1.2;
                    this.vy += (mdy / md) * f * 1.2;
                }
                this.vx *= 0.94; this.vy *= 0.94;
                const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (spd > 3.5) { this.vx = (this.vx / spd) * 3.5; this.vy = (this.vy / spd) * 3.5; }
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,212,255,${this.a})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist/120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    /* ── Global Full-Page Particles ── */
    const gc = document.getElementById('global-canvas');
    if (gc) {
        const gctx = gc.getContext('2d');
        let gW, gH, gParticles = [];

        function gResize() {
            gW = gc.width  = window.innerWidth;
            gH = gc.height = window.innerHeight;
        }
        gResize();
        window.addEventListener('resize', gResize);

        const colours = [
            [0, 212, 255],
            [255, 107, 53],
            [0, 230, 118]
        ];

        class GP {
            constructor() { this.init(); }
            init() {
                this.x  = Math.random() * gW;
                this.y  = Math.random() * gH;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.r  = Math.random() * 1.2 + 0.3;
                this.a  = Math.random() * 0.18 + 0.04;
                this.c  = colours[Math.floor(Math.random() * colours.length)];
            }
            update() {
                const mdx = this.x - mx;
                const mdy = this.y - my;
                const md  = Math.sqrt(mdx * mdx + mdy * mdy);
                const repelR = 120;
                if (md < repelR && md > 0) {
                    const f = (repelR - md) / repelR;
                    this.vx += (mdx / md) * f * 0.8;
                    this.vy += (mdy / md) * f * 0.8;
                }
                this.vx *= 0.96; this.vy *= 0.96;
                const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (spd > 2.5) { this.vx = (this.vx / spd) * 2.5; this.vy = (this.vy / spd) * 2.5; }
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -10) this.x = gW + 10;
                if (this.x > gW + 10) this.x = -10;
                if (this.y < -10) this.y = gH + 10;
                if (this.y > gH + 10) this.y = -10;
            }
            draw() {
                const [r, g, b] = this.c;
                gctx.beginPath();
                gctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                gctx.fillStyle = `rgba(${r},${g},${b},${this.a})`;
                gctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) gParticles.push(new GP());

        function gDraw() {
            gctx.clearRect(0, 0, gW, gH);
            gParticles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < gParticles.length; i++) {
                for (let j = i + 1; j < gParticles.length; j++) {
                    const dx   = gParticles[i].x - gParticles[j].x;
                    const dy   = gParticles[i].y - gParticles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const [r, g, b] = gParticles[i].c;
                        gctx.beginPath();
                        gctx.moveTo(gParticles[i].x, gParticles[i].y);
                        gctx.lineTo(gParticles[j].x, gParticles[j].y);
                        gctx.strokeStyle = `rgba(${r},${g},${b},${0.04 * (1 - dist / 100)})`;
                        gctx.lineWidth = 0.4;
                        gctx.stroke();
                    }
                }
            }
            requestAnimationFrame(gDraw);
        }
        gDraw();
    }
}
