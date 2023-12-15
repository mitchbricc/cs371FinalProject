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


function configureTexture( image, program, texture, index) {
    gl.activeTexture( gl.TEXTURE0 + index );  //0 active by default
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //Flip the Y values to match the WebGL coordinates
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    //Specify the image as a texture array:
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //Set filters and parameters
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
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
    //orb
    let image3 = new Image();
    image3.crossOrigin = "anonymous";   // ask for CORS permission
    image3.src = document.getElementById("texImage3").src; 
    image3.onload = function() {
        textures[3] = gl.createTexture();
        configureTexture( image3, program,textures[3],3 );
    }
    //platform
    let image4 = new Image();
    image4.crossOrigin = "anonymous";   // ask for CORS permission
    image4.src = document.getElementById("texImage4").src; 
    image4.onload = function() {
        textures[4] = gl.createTexture();
        configureTexture( image4, program,textures[4], 4);
    }
 
    // Retrieve the nearFar element
    nf = document.getElementById('nearFar');
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
let oldEye = vec3(eye[0],eye[1],eye[2]);
let ghostAngle = 0;
function draw() {   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gravity();
    let movements = collisionDetection(shapes); //movements tracks the directions that the player can move
    //moves ghost
    let ghostPosition = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
    ghostPosition = mult(shapes[4].translation, ghostPosition);
    let ghostx_move = eye[0] - ghostPosition[0];
    let ghosty_move = eye[1] - ghostPosition[1];
    let ghostz_move = eye[2] - ghostPosition[2];

    //rotates and moves ghost
    var angleRad = Math.atan(ghostz_move/ghostx_move);
    var angleDeg = angleRad * 180 / Math.PI;
    if(Math.sign(ghostz_move)== 1, Math.sign(ghostx_move)== -1){
        angleDeg =(90 + angleDeg) * 1;
    }
    else if(Math.sign(ghostz_move)== -1, Math.sign(ghostx_move)== -1){
        angleDeg =(-90 - angleDeg)*-1;
    }
    else if(Math.sign(ghostz_move)== -1, Math.sign(ghostx_move)== 1){
        angleDeg =360 + (90 - angleDeg)*-1;
    }
    else if(Math.sign(ghostz_move)== 1, Math.sign(ghostx_move)== 1){
        
        angleDeg =360 + (-90 - angleDeg);
    }
    var aChange =  angleDeg - ghostAngle;
     
     //fixes oscilation of ghost around player position
     let tx = Math.sign(ghostx_move) * T_STEP * .1;
     let ty = Math.sign(ghosty_move) * T_STEP * .1;
     let tz = Math.sign(ghostz_move) * T_STEP * .1
     if(Math.abs(ghostx_move) < T_STEP){
        tx = 0;
     }
     if(Math.abs(ghosty_move) < T_STEP){
        ty = 0;
     }
     if(Math.abs(ghostz_move) < T_STEP){
        tz = 0;
     }
     let chase = mult(translate(tx, ty, tz), shapes[4].translation);
     //fixes oscilation around player angle
     if(Math.abs(ghostAngle - angleDeg) > 1){
        shapes[4].translation = mult(chase, rotateY(aChange));
        ghostAngle += aChange;
        ghostAngle %= 360
     }
     else{
        shapes[4].translation = chase;
     }

    for (let i = 0; i < shapes.length; i++) {
        let modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(30, gl.canvas.width / gl.canvas.height, 1, 100);
        gl.uniformMatrix4fv(uniformProjection, false, flatten(projectionMatrix));

        modelViewMatrix = mult(modelViewMatrix, shapes[i].translation);
        gl.uniformMatrix4fv(uniformModelView, false, flatten(modelViewMatrix));

        gl.uniformMatrix4fv(uniformModel, false, flatten(shapes[i].translation));

        //shapes
        if(i == 0){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
        }
        //ceiling
        if(i == 1){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 1);
        }
        //orbs 1 and 2
        else if(i == 2 || i==3){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 3);
        }
        //ceiling
        else if(i > 4 && i < 10){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 3);
        }
        //rocks
        else if(i > 9){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
        }
        //platforms
        if(i > 17){
            gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 4);
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
    at = vec3(atx + eye[0], aty + eye[1], atz + eye[2]);
}
function updatePosition(e) {
    let xmovement = e.movementX;
    let ymovement = e.movementY;
    let angleX = xmovement * APP;
    let angleY = ymovement * APP;
    calculateAt(angleX, angleY);
    modelViewMatrix = lookAt(eye, at, up);
}

// Keystroke handler
function keydown(event) {
    oldEye = vec3(eye[0],eye[1],eye[2]);
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

