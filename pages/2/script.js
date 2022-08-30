window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // canvas settings
    ctx.fillStyle = 'green'; // Bg color basically
    ctx.lineCap= 'round'; 
    ctx.shadowColor = 'rgba(0,0,0,.7)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;

    // effect settings
    let size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
    const maxLevel = 8; // depth of the fractal, or amount of times branches will split
    const branches = 2;

    let sides = 5; // number of branches
    let scale = 0.7; // how smaller than there parent branch
    let spread = 0.6; // angle of there parent branches and their segments 0.1 - 2.9 seems to be the sweet spot
    let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    let lineWidth = Math.floor(Math.random() * 20 + 10);

    // controls
    const randomizeButton = document.getElementById('randomizeButton');
    const resetButton = document.getElementById('resetButton');

    const sliderSpread = document.getElementById('spread');
    const labelSpread = document.querySelector('[for="spread"]');
    sliderSpread.addEventListener('change', (e) => {
        spread = e.target.value;
        updateSliders();
        drawFractal();
    })
    const sliderSides = document.getElementById('sides');
    const labelSides = document.querySelector('[for="sides"]');
    sliderSides.addEventListener('change', (e) => {
        sides = e.target.value;
        updateSliders();
        drawFractal();
    })

    function drawBranch(level) {
        if (level > maxLevel) return; // exits the function

        ctx.beginPath(); // begin a new path or line
        ctx.moveTo(0, 0); // Start
        ctx.lineTo(size, 0); // End
        ctx.stroke(); // Outlines the current path with the current stroke style

        for (let i = 0; i < branches; i++) {
            // With save, the following translate, rotate, and scale only affects the current drawBranch as with the restore afterwards restores back to the save which didn't have the translate, rotate, and scale
            ctx.save();
            ctx.translate(size - (size/branches) * i,0); // Makes it grow a branch from the previous one
            ctx.scale(scale, scale);

            ctx.save();
            ctx.rotate(spread);
            drawBranch(level + 1); // This creates an recursion function (in other words, function that calls itself)
            ctx.restore();

            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, size, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    

    function drawFractal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color; // Line color
        ctx.fillStyle = color;
        ctx.translate(canvas.width / 2, canvas.height / 2);

        for (let i = 0; i < sides; i++) {
                    // (Math.PI * 1) is a full circle
            ctx.rotate((Math.PI * 2) / sides); // Rotates on point
            drawBranch(0);
        }   
        ctx.restore(); // restores the latest save
        randomizeButton.style.backgroundColor = color;
    }
    drawFractal()

    function randomizeFractal() {
        sides = Math.floor(Math.random() * 7 + 2);
        scale = Math.random() * 0.4 + 0.4;
        spread = Math.random() * 2.9 + 0.1;
        color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        lineWidth = Math.floor(Math.random() * 20 + 10);
    }

    randomizeButton.addEventListener('click', () => {
        randomizeFractal();
        updateSliders();
        drawFractal();
    });

    function resetFractal() {
        sides = 5;
        scale = 0.5;
        spread = 0.7;
        color = `hsl(290, 100%, 50%)`;
        lineWidth = 15;
    }
    resetButton.addEventListener('click', () => {
        resetFractal();
        updateSliders();
        drawFractal();
    });

    function updateSliders() {
        sliderSpread.value = spread;
        labelSpread.innerText = `Spread: ${Number(spread).toFixed(1)}`

        sliderSides.value = sides;
        labelSides.innerText = `Sides: ${sides}`
    }
    updateSliders(); // When window load

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
        ctx.shadowColor = 'rgba(0,0,0,.7)';
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;
        drawFractal();
    })
})