function start() {

    const config = {
        dotMinRad : 6,
        dotMaxRad : 20,
        defColor: `rgba(250, 10, 30, 0.9)`,
        massFactor: 0.0002,
        smooth: 0.65,
        sphereRad: 300,
        mouseSize: 100,
        maxRad: 30
    }

    const TWO_PI = 2 * Math.PI;

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let w, h, mouse, dots;

    class Dot {
        constructor() {
            this.pos = {x: mouse.x, y: mouse.y}
            this.rad = random(config.dotMinRad, config.dotMaxRad);
            this.color = config.defColor;
            this.mass = this.rad * config.massFactor;
            this.vel = {x: 0, y: 0};
        }
        draw(r, x, y) {
            this.pos.x = x || this.pos.x + this.vel.x;
            this.pos.y = y || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, r || this.rad, true, this.color);
            createCircle(this.pos.x, this.pos.y, r || this.rad, false, config.defColor);
            //console.log(this.vel);
        }
    }

    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = {x: 0, y: 0};
            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;
                
                let a = dots[i];
                let b = dots[j];

                let delta = {x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y};
                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1; // расстояние

                let force = -((dist - config.sphereRad) / dist * b.mass);

                if (j == 0) {
                    dist < config.mouseSize ? force = -((dist - config.mouseSize) * b.mass * 15) : force = a.mass;
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(250, 10, 30, ${alpha})`;
                }
                
                acc.x += delta.x * force * 15;
                acc.y += delta.y * force * 15;
            }

            dots[i].vel.x = dots[i].vel.x * config.smooth - acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth - acc.y * dots[i].mass;
        }
    }

    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        dots = [];

        mouse = {x: w / 2, y: h / 2, down: false};

    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) { dots.push(new Dot()) }
        updateDots();
        dots.map(elem => elem == dots[0] ? elem.draw(config.maxRad, mouse.x, mouse.y) : elem.draw());

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    function setPos({layerX, layerY}) {
        mouse.x = layerX;
        mouse.y = layerY;
    }

    function isDown() {
        mouse.down = !mouse.down;
    }

    canvas.addEventListener('mousemove', setPos);

    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);
   
}

start()