// set up / global vars
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// color of particles
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.width);
gradient.addColorStop(0, '#906807');
gradient.addColorStop(0.25, '#f8ebc6');
gradient.addColorStop(0.5, '#f0cc60');
gradient.addColorStop(0.75, '#f8ebc6');
gradient.addColorStop(1, '#906807');
ctx.fillStyle = gradient;
ctx.strokeStyle = '#fff4e8';


// each particle object
class Particle {
    constructor(effect, speedValue, isSpecial = false) {
        this.isSpecial = isSpecial;
        this.speedValue = speedValue;
        this.effect = effect;
        // size of particle
        this.radius = Math.random() * 8 + 1;
        // location of particle
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        // speed of particle
        this.vx = Math.random() * parseInt(this.speedValue) - 0.5;
        this.vy = Math.random() * parseInt(this.speedValue) - 0.5;

    }
    draw(context) {
        // all colors Math.random() * 360 
        // context.fillStyle = 'hsl(' + this.x * 0.5 + ', 100%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    // user clicks particle, particle gets bigger 
    influenceNearbyParticles() {
        const nearbyParticles = effect.particles.filter(particle => {
            const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
            return distance < 100;
        });

        nearbyParticles.forEach(particle => {
            this.changeColor();
            if (this.radius <= 300 ) {
                this.radius += 1;
            } else {
                this.radius -= 299;
            }
        });
    }
    changeColor() {
        this.fillStyle = 'hsl(47, 94%, 79%)';
    }
    // for animation
    update() {
        if (this.effect.mouse.pressed = true) {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            if (distance < this.effect.mouse.radius) {
                // gives us a sense of direction
                const angle = Math.atan2(dy, dx);
                // moves particles away in a circle shape
                this.x += Math.cos(angle);
                this.y += Math.sin(angle);
            }

        }

        // right n left boundary with user input/mouse click
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius) {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }
        // top n bottom boundary
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius;
            this.vy *= -1;
        }

        this.x += this.vx;
        this.y += this.vy;

    }
    reset() {
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}


// the brain
class Effect {
    constructor(canvas, context, speedValue) {
        this.isPaused = false;
        this.speedValue = speedValue;
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numofParticles = 500;
        this.createParticles();

        // moues data/info
        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 150
        }
        // resize window
        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        // mouse move & click
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed = true) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }

        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }

    // pause on/off
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    handleMouseClick() {
        window.addEventListener('click', (e) => {
            const mouseX = e.x;
            const mouseY = e.y;
            console.log(mouseX, mouseY);

            const clickedParticle = this.particles.find(particle => {
                const distance = Math.hypot(particle.x - mouseX, particle.y - mouseY);
                return distance < particle.radius;
            });

            if (clickedParticle && clickedParticle.isSpecial) {
                clickedParticle.influenceNearbyParticles();
            }
        });
    }
    // adds particles into an array
    createParticles() {
        for (let i = 0; i < this.numofParticles; i++) {
            this.particles.push(new Particle(this, this.speedValue, true));
        }
    }
    handleParticles(context) {
        this.connectParticles(context);

        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context) {
        const maxDistance = 80;
        // comparing particles in an array 
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                // drawing lines if they are within the maxDistance
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();

                }

            }
        }
    }
    // when screen resizes
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.width);
        gradient.addColorStop(0, '#906807');
        gradient.addColorStop(0.5, '#f0cc60');
        gradient.addColorStop(1, '#906807');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#fff4e8';
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}


let speedValue = 2;
let effect = new Effect(canvas, ctx, speedValue);
effect.handleMouseClick();

// makes em move!
function animate() {
    if (!effect.isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.handleParticles(ctx);
    }
    requestAnimationFrame(animate);
}
animate();

// pause particles
window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        effect.togglePause();
    }
});

// getting user input from slider and reloading system with that input
document.addEventListener('DOMContentLoaded', function () {
    var speedInput = document.getElementById('speed');

    speedInput.addEventListener('input', function () {
        var speedValue = parseInt(speedInput.value)


        effect = new Effect(canvas, ctx, speedValue)
    });
});


// hides & opens controls div
function hideControls() {
    hide = document.getElementById('hide');
    closeControls = document.getElementById('controls');
    open = document.getElementById('open');

    closeControls.style.display = 'none';
    open.style.display = 'block';
}
function openControls() {
    closeControls = document.getElementById('controls');
    open = document.getElementById('open');

    closeControls.style.display = 'block';
    open.style.display = 'none';
}