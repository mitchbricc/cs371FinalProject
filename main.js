let canvas;
let gl;

let near = -1;
let far = 1;
let left = -1;
let right = 1;
let ytop = 1;
let bottom = -1;

let radius = 0.1;  //MUST NOT BE ZERO
let theta = -40 * Math.PI / 180.0;
let phi = -35 * Math.PI / 180.0;
let rotation_by_5_deg = 5.0 * Math.PI / 180.0;

const T_STEP = 0.1;
const R_STEP = 10.0;
const S_STEP = 0.1;

//eye variables
let at = vec3(0.0, -19, 0.0);
let up = vec3(0.0, 1.0, 0.0);
let eyeX = 0, eyeY = -19, eyeZ = 5;
let eye = vec3(eyeX, eyeY, eyeZ);
//globals for mouse effects
let cursorHidden = false;

let uniformModelView, uniformProjection;
let modelViewMatrix, projectionMatrix;
let modelMatrix;

//Leave light properties and position unchanged
//Ldr, Ldg, Ldb, Lsr, Lsg, Lsb, Lar, Lag, Lab
let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0); // white light
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
let lightSpecular = vec4(0.9, 0.9, 0.9, 1.0);

//Position is in homogeneous coordinates
//If w =1.0, we are specifying a finite (x,y,z) location
//If w =0.0, light at infinity
let lightPosition = vec4(10.0, 10.0, 10.0, 0.0);
let light2Position = vec4(10.0, 10.0, -10.0, 0.0);

///Material properties with ambient, diffuse, specular                      one for each object
//You should declare these for each 3d shape; think of using arrays
let materialDiffuse = vec4(0.2, 0.2, 1.0, 1.0);
let materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
let materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
//metallic?
let materialShininess = 100.0;

let shapes;
let nf;

let orbsCollected = [];

//global variables to help us with vertex array objects
let program;

let textures = [];

function playBackgroundMusic() {
    // Initialize Web Audio API
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get the audio element
    var audioElement = document.getElementById('backgroundMusic');

    // Create an audio source from the audio element
    var audioSource = audioContext.createMediaElementSource(audioElement);

    // Connect the audio source to the audio context
    audioSource.connect(audioContext.destination);

    // Start playing the audio
    audioElement.play();
}

function configureTexture( image, program, texture, index) {
    gl.activeTexture( gl.TEXTURE0 + index );  //0 active by default
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //Flip the Y values to match the WebGL coordinates
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    //Specify the image as a texture array:
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //Set filters and parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);


    //Link texture to a sampler in fragment shader
    //gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), index);
}

function init() {
    showLives();
    window.onload = playBackgroundMusic();
    //Get graphics context
    canvas = document.getElementById("gl-canvas");
    let options = {  // no need for alpha channel, but note depth buffer enabling
        alpha: false,
        depth: true  //NOTE THIS
    };

    gl = canvas.getContext("webgl2", options);
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    //to start listening for user input
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
            unadjustedMovement: true,
        });
    });
    // Register the event handler to be called on key press
    window.addEventListener("keydown", keydown, false);

 

    //Load shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    shapes = getShapes();

    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");
    uniformModel = gl.getUniformLocation(program, "u_modelMatrix");


    //Initialize texture
    //brick
    let image = new Image();
    image.crossOrigin = "anonymous";   // ask for CORS permission
    image.src = document.getElementById("texImage0").src; 
    image.onload = function() {
        textures[0] = gl.createTexture();
        configureTexture( image, program,textures[0],0);
    }
    //stars
    let image1 = new Image();
    image1.crossOrigin = "anonymous";   // ask for CORS permission
    image1.src = document.getElementById("texImage1").src; 
    image1.onload = function() {
        textures[1] = gl.createTexture();
        configureTexture( image1, program,textures[1],1 );
    }
    //rock
    let image2 = new Image();
    image2.crossOrigin = "anonymous";   // ask for CORS permission
    image2.src = document.getElementById("texImage2").src; 
    image2.onload = function() {
        textures[2] = gl.createTexture();
        configureTexture( image2, program,textures[2],2 );
    }
 
    // Retrieve the nearFar element
    nf = document.getElementById('nearFar');
    // buttons for moving viewer and changing size
    // 

    //set up screen
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);

    //Enable depth testing    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    draw();
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let movements = collisionDetection(eye, shapes); //movements tracks the directions that the player can move
    //document.getElementById("demo").innerHTML = movements;

    //moves ghost
    let ghostPosition = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
    ghostPosition = mult(shapes[4].translation, ghostPosition);
    let ghostx_move = eye[0] - ghostPosition[0];
    let ghosty_move = eye[1] - ghostPosition[1];
    let ghostz_move = eye[2] - ghostPosition[2];

    shapes[4].translation = mult(translate(Math.sign(ghostx_move) * T_STEP * .01, Math.sign(ghosty_move) * T_STEP * .01, Math.sign(ghostz_move) * T_STEP * .01), shapes[4].translation);


    // Display the current near and far values
    nf.innerHTML = 'near: ' + Math.round(near * 100) / 100 + ', far: ' + Math.round(far * 100) / 100;

    //drawVertexObject(vao, shape.indices.length, materialAmbient, materialDiffuse, materialSpecular, materialShininess); 
    for (let i = 0; i < shapes.length; i++) {
        let modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(30, gl.canvas.width / gl.canvas.height, 1, 100);
        gl.uniformMatrix4fv(uniformProjection, false, flatten(projectionMatrix));

        modelViewMatrix = mult(modelViewMatrix, shapes[i].translation);
        gl.uniformMatrix4fv(uniformModelView, false, flatten(modelViewMatrix));

        gl.uniformMatrix4fv(uniformModel, false, flatten(shapes[i].translation));

        
        //shapes
        if(i < 3){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
        }
        //arena
        else if(i == 5){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
        }
        //ceiling
        else if(i == 6){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 1);
        }
        //rocks
        else if(i == 7){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 2);
        }
        else{
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
        }

        drawVertexObject(shapes[i].vao, shapes[i].shape.indices.length, shapes[i].materialAmbient, shapes[i].materialDiffuse, shapes[i].materialSpecular, shapes[i].materialShininess, shapes[i].shape.texCoord);
    }
    requestAnimationFrame(draw);
}

//Loads a VAO and draws it
function drawVertexObject(vao, iLength, mA, mD, mS, s, texCoord) {
    let ambientProduct = mult(lightAmbient, mA);
    let diffuseProduct = mult(lightDiffuse, mD);
    let specularProduct = mult(lightSpecular, mS);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), s);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform4fv(gl.getUniformLocation(program, "light2Position"), flatten(light2Position));

    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, iLength, gl.UNSIGNED_SHORT, 0);
}

//Sets up a VAO 
function setUpVertexObject(shape) {
    let indices = shape.indices;
    let vertices = shape.positions;
    let normals = shape.normals;
    let texCoord = shape.texcoord;

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    //set up index buffer, if using
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);

    //For each attribute (e.g. each of vertices, normal, color, etc.)

    //set up vertices buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STREAM_DRAW);
    let attributeCoords = gl.getAttribLocation(program, "a_coords");
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeCoords);

    //set up normals buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STREAM_DRAW);
    let attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.vertexAttribPointer(attributeNormals, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeNormals);

    let tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);

    let texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);


    //finalize the vao; not required, but considered good practice
    gl.bindVertexArray(null);
    return vao;
}

function lockChangeAlert() {
    if (cursorHidden == false) {
        cursorHidden = true;
        canvas.addEventListener("mousemove", updatePosition, false);
    }
    else {
        cursorHidden = false;
        canvas.removeEventListener("mousemove", updatePosition, false);
    }
}
const lookDistance = 10;
let APP = 30 / 600;
let eyeAngleX = 180, eyeAngleY = 0;
function calculateAt(angleX, angleY) {
    eyeAngleX += angleX;
    eyeAngleY += angleY;
    if (eyeAngleY > 89) {
        eyeAngleY = 89;
    }
    if (eyeAngleY < -89) {
        eyeAngleY = -89;
    }
    //convert polar to xyz
    let atx = lookDistance * Math.sin(radians(-eyeAngleX)) * Math.cos(radians(eyeAngleY));
    let aty = lookDistance * Math.sin(radians(-eyeAngleY));
    let atz = lookDistance * Math.cos(radians(eyeAngleX));
    document.getElementById("demo2").innerHTML = eyeAngleY;
    at = vec3(atx + eye[0], aty + eye[1], atz + eye[2]);
}
function updatePosition(e) {
    let angleX = e.movementX * APP;
    let angleY = e.movementY * APP;
    calculateAt(angleX, angleY);
    document.getElementById("demo2").innerHTML = at;
    modelViewMatrix = lookAt(eye, at, up);
}

// Keystroke handler
function keydown(event) {
    document.getElementById("demo").innerHTML = event.code;
    switch (event.code) {
        case "KeyW":
            decreaseZ();
            break;
        case "KeyS":
            increaseZ();
            break;
        case "KeyA":
            decreaseX();
            break;
        case "KeyD":
            increaseX();
            break;
        case "Space":
            jump();
            break;
        default: return; // Skip drawing if no effective action
    }
}
function jump() {

}

//Button handlers to be implemented
function increaseZ() {
    eye[2] += T_STEP;
}
function decreaseZ() {
    eye[2] += -T_STEP;
}
function increaseX() {
    eye[0] += T_STEP;
}
function decreaseX() {
    eye[0] += -T_STEP;
}
function increaseY() {
    eye[1] += T_STEP;
}
function decreaseY() {
    eye[0] += T_STEP;
}
function ghostCollision(){
    let position = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
        position = mult(shapes[4].translation, position);
        let xDistance = Math.abs(eye[0] - position[0]);
        let yDistance = Math.abs(eye[1] - position[1]);
        let zDistance = Math.abs(eye[2] - position[2]);

        let xcollision = false;
        if (xDistance <= shapes[4].collisionDistance[0]) {
            xcollision = true;
        }
        let ycollision = false;
        if (yDistance <= shapes[4].collisionDistance[1]) {
            ycollision = true;
        }
        let zcollision = false;
        if (zDistance <= shapes[4].collisionDistance[2]) {
            zcollision = true;
        }
        let collision = xcollision && ycollision && zcollision;
        if (collision) {
                let ghostPosition = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
                ghostPosition = mult(shapes[4].translation, ghostPosition);
                let ghostx_move = eye[0] - ghostPosition[0];
                let ghosty_move = eye[1] - ghostPosition[1];
                let ghostz_move = eye[2] - ghostPosition[2];
                if (Math.abs(ghostx_move) > 0.001) {
                    if (Math.sign(eye[0] - position[0]) == -1) {
                        eye[0] -= T_STEP * 5;
                    }
                    else {
                        eye[0] += T_STEP * 5;
                    }
                }
                if (Math.abs(ghosty_move) > 0.001) {
                    if(Math.sign(eye[1] - position[1]) == -1){
                        eye[1] -= T_STEP*5;
                    }
                    else{
                        eye[1] += T_STEP*5;
                    }
                }
                if (Math.abs(ghostz_move) > 0.001) {
                    if(Math.sign(eye[2] - position[2]) == -1){
                        eye[2] -= T_STEP*5;
                    }
                    else{
                        eye[2] += T_STEP*5;
                    }
                }
        }
        return collision;
    }

function collisionDetection(eye, shapes) {
    let xneg = true, xpos = true, yneg = true, ypos = true, zneg = true, zpos = true;
    if(ghostCollision()){
        lives--;
        showLives();
    }
    
    for (let i = 0; i < shapes.length; i++) {
        if(i==4){
            i++;//skip ghost
        }
        let position = vec4(shapes[i].shape.positions[0][0], shapes[i].shape.positions[0][1], shapes[i].shape.positions[0][2], 1);
        position = mult(shapes[i].translation, position);
        let xDistance = Math.abs(eye[0] - position[0]);
        let yDistance = Math.abs(eye[1] - position[1]);
        let zDistance = Math.abs(eye[2] - position[2]);
        if(i == shapes.length-1){
            //document.getElementById("demo2").innerHTML = xDistance;
        }
        let xcollision = false;
        if (xDistance <= shapes[i].collisionDistance[0]) {
            xcollision = true;
            
        }
        let ycollision = false;
        if (yDistance <= shapes[i].collisionDistance[1]) {
            ycollision = true;
            
        }
        let zcollision = false;
        if (zDistance <= shapes[i].collisionDistance[2]) {
            zcollision = true;
        }
        let collision = xcollision && ycollision && zcollision;
        if (collision) {
            switch(i) {
                case 7:
                  orbCollision();
                  break;
                default:
                  
              }
        }
    }
    return [xneg, xpos, yneg, ypos, zneg, zpos];
}
let lives = 3;
function showLives(){
    document.getElementById("demo").innerText = "lives: "+lives;
}
let score = 0;
function showScore() {
    document.getElementById("ScoreDisplay").innerHTML = score;
}
function orbCollision() {
    score++;
    showScore();
}
