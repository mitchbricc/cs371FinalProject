"use strict";

//declarations
let gl;  // The WebGL graphics context.
let canvas;

//Constants for the step value for rotation
const R_STEP = 10.0;
const T_STEP = 0.5;

let modelViewMatrix, projectionMatrix;
let uniformModelViewMatrix, uniformProjectionMatrix;

let at = vec3(0.0, 0.0, -5.0);
let up = vec3(0.0, 1.0, 0.0);

let eyeX=0, eyeY=0, eyeZ=5;
let eye = vec3(eyeX,eyeY,eyeZ);

//globals for mouse effects
let mouseOldX, mouseOldY,mouseX,mouseY; 
let cursorHidden = false;



//Global variables for colors and coordinates
 let coords = [
    // Three triangles on the right
    vec4(0.75,  1.0,  -4.0,  1.0), 
    vec4(0.25, -1.0,  -4.0, 1.0),  
    vec4(1.25, -1.0,  -4.0,  1.0), 

    vec4(0.75,  1.0,  -2.0, 1.0),  
    vec4(0.25, -1.0,  -2.0, 1.0),  
    vec4(1.25, -1.0,  -2.0, 1.0),  

    vec4(0.75,  1.0,   0.0, 1.0),  
    vec4(0.25, -1.0,   0.0, 1.0), 
    vec4(1.25, -1.0,   0.0, 1.0), 

   // Three triangles on the left
   vec4(-0.75,  1.0,  -4.0,  1.0), 
   vec4(-1.25, -1.0,  -4.0,  1.0), 
   vec4(-0.25, -1.0,  -4.0,  1.0),

   vec4(-0.75,  1.0,  -2.0,  1.0),
   vec4(-1.25, -1.0,  -2.0,  1.0), 
   vec4(-0.25, -1.0,  -2.0,  1.0), 

   vec4(-0.75,  1.0,   0.0, 1.0),  
   vec4(-1.25, -1.0,   0.0, 1.0),  
   vec4(-0.25, -1.0,   0.0, 1.0)
];
let colors = [
  //right
  [0.4,  1.0,  0.4, 1.0], // The back green one
  [0.4,  1.0,  0.4, 1.0],
  [1.0,  0.4,  0.4, 1.0], 

  [1.0,  1.0,  0.4, 1.0], // The middle yellow one
  [1.0,  1.0,  0.4, 1.0],
  [1.0,  0.4,  0.4, 1.0], 

  [0.4,  0.4,  1.0, 1.0], // The front blue one 
  [0.4,  0.4,  1.0, 1.0],
  [1.0,  0.4,  0.4, 1.0], 

  //left
  [0.4,  1.0,  0.4, 1.0], // The back green one
  [0.4,  1.0,  0.4, 1.0],
  [1.0,  0.4,  0.4, 1.0], 

  [1.0,  1.0,  0.4, 1.0], // The middle yellow one
  [1.0,  1.0,  0.4, 1.0],
  [1.0,  0.4,  0.4, 1.0], 

  [0.4,  0.4,  1.0, 1.0],  // The front blue one 
  [0.4,  0.4,  1.0, 1.0],
  [1.0,  0.4,  0.4, 1.0]
];
//Initialize the program.  This function is called after the page has been loaded.
function init() {
    

	//Get graphics context
    canvas = document.getElementById( "gl-canvas" );

    //to start listening for user input
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
          unadjustedMovement: true,
        });
      });

	let  options = {  // no need for alpha channel in this program; depth buffer is needed
		alpha: false,
		depth: true
	};

	gl = canvas.getContext("webgl2", options);
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

	//Load shaders
	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
    
    //set up vertices buffer
    let bufferCoords = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coords), gl.STREAM_DRAW);

    let attributeCoords  = gl.getAttribLocation(program, "a_coords");
    gl.vertexAttribPointer(attributeCoords, 4, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(attributeCoords);
    
    //set up color buffer
    let bufferColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColors);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STREAM_DRAW);

    let attributeColors = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(attributeColors, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeColors);
   
    //set up uniform variables
    uniformModelViewMatrix = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjectionMatrix = gl.getUniformLocation(program, "u_projectionMatrix");
    
    //initialize matrices
    eye = vec3(eyeX,eyeY,eyeZ);
    modelViewMatrix = lookAt(eye, at , up);    
    projectionMatrix = perspective( 30, gl.canvas.width/gl.canvas.height, 1, 100 );
    
    //set up screen
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 
    gl.clearColor(0, 0, 0, 1); 
    
    //Enable depth testing    
    gl.enable(gl.DEPTH_TEST);
    
	//call draw to render content
	draw();
}
//Draws the contents of the canvas
 function draw() { 
    //Clear screen and depth buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //send uniform data 
    gl.uniformMatrix4fv(uniformModelViewMatrix, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(uniformProjectionMatrix, false, flatten(projectionMatrix));
    
    //render
    gl.drawArrays( gl.TRIANGLES, 0, coords.length);
}
//Button handlers to be implemented
function increaseZ(){
    modelViewMatrix = mult(translate(0,0,-T_STEP),modelViewMatrix);
    draw();
}
function decreaseZ(){
    modelViewMatrix = mult(translate(0,0,T_STEP),modelViewMatrix);
    draw();
}
function increaseX(){
    modelViewMatrix = mult(translate(-T_STEP,0,0),modelViewMatrix);
    draw();
}
function decreaseX(){
    modelViewMatrix = mult(translate(T_STEP,0,0),modelViewMatrix);
    draw();
}
function increaseY(){
    modelViewMatrix = mult(translate(0,-T_STEP,0),modelViewMatrix);
    draw();
}
function decreaseY(){
    modelViewMatrix = mult(translate(0,T_STEP,0),modelViewMatrix);
    draw();
}
function arcU(){ 
    if(at[0]== eye[0]&&at[2]==eye[2]){
        //document.getElementById("demo2").innerHTML = "over";
        eye[2] += .001;
    }
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    //document.getElementById("demo").innerHTML = (eye[0] - at[0]).toLocaleString() +","+(eye[1] - at[1]).toLocaleString()+","+(eye[2] - at[2]).toLocaleString();
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateX(R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
    
}

function arcD(){ 
    if(at[0]== eye[0]&&at[2]==eye[2]){
        eye[2] += .001;
    }
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateX(-R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
}

function arcL(){ 
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateY(R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
}

function arcR(){ 
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateY(-R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
}

function arcCW(){ 
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateZ(R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
}

function arcCCW(){ 
    let li = lookAt(eye, at, up);
    let a = mult(li,vec4(at[0],at[1],at[2],1));
    modelViewMatrix = mult(translate(-a[0],-a[1],-a[2]),modelViewMatrix);
    modelViewMatrix = mult(rotateZ(-R_STEP),modelViewMatrix);
    modelViewMatrix = mult(translate(a[0],a[1],a[2]),modelViewMatrix);
    eye = getEyePosition(modelViewMatrix);
    draw();
}

function reset(x,y){
    // eyeX = 0;
    // eyeY = 0;
    // eyeZ = 5;
    // let eye = vec3(eyeX,eyeY,eyeZ);
    eye = vec3(x,y,eye[2]);
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}


//-------------------Utility Methods-----------------------------
//Extract the new eye coordinates from the modelview matrix. This can be done as follows:
//Recall that [last column of modelview matrix] = [u, v, n].[-e_x, -e_y,-e_z]^T
//So [-e_x, -e_y, -e_z]^T = [u, v, n]^-1 . [last column]
//Use the inverse3 method in CS371utils.js and the multM3V3 utility method provided here
function getEyePosition( mv ){
    let u = vec3(mv[0][0],mv[0][1],mv[0][2]);       
    let v = vec3(mv[1][0],mv[1][1],mv[1][2]); 
    let n = vec3(mv[2][0],mv[2][1],mv[2][2]); 
    let t = vec3(mv[0][3],mv[1][3],mv[2][3]);

    let axesInv = inverse3([u,v,n]);
    let eye = multM3V3(axesInv,t);
    return vec3(-eye[0],-eye[1],-eye[2]);
}

//Use the new eye position to update the last column of the modelviewmatrix passed in as the first parameter
//The last column becomes [-eye.u, -eye.v, -eye.n]
//Use the dot(...) method in CS371utils.js
function setEyePosition( mv, eye ){
    let u = vec3(mv[0][0],mv[0][1],mv[0][2]);       
    let v = vec3(mv[1][0],mv[1][1],mv[1][2]); 
    let n = vec3(mv[2][0],mv[2][1],mv[2][2]); 

    let negEye = vec3(-eye[0], -eye[1], -eye[2]);
    mv[0][3] = dot(negEye,u);
    mv[1][3] = dot(negEye,v);
    mv[2][3] = dot(negEye,n);
}

//Utility method to left multiply a 3x1 vector by a 3x3 matrix
function multM3V3( u, v ) {
    let result = [];
    result[0] = u[0][0]*v[0] + u[0][1]*v[1] + u[0][2]*v[2];
    result[1] = u[1][0]*v[0] + u[1][1]*v[1] + u[1][2]*v[2];
    result[2] = u[2][0]*v[0] + u[2][1]*v[1] + u[2][2]*v[2];
    return result;
}


function lockChangeAlert() {
    if (document.pointerLockElement === canvas) {
        //document.getElementById("demo").innerHTML = "lock";
        cursorHidden = true;
        canvas.addEventListener( "mousemove", updatePosition, false);
        document.getElementById("demo").innerHTML = "lock:"+glX+","+glY;
    } 
    else {
        document.getElementById("demo").innerHTML = "unlock";
        cursorHidden = false;
        canvas.removeEventListener("mousemove",updatePosition,false);
    }
  }
  const lookDistance = 10;
  let APP = 30/600;
  let eyeAngleX=180,eyeAngleY=0;
  function calculateAt(angleX,angleY){
    eyeAngleX += angleX;
    eyeAngleY += angleY;
    if(eyeAngleY>89){
        eyeAngleY = 89;
    }
    if(eyeAngleY<-89){
        eyeAngleY = -89;
    }
    

    let atx = lookDistance * Math.sin(radians(-eyeAngleX)) * Math.cos(radians(eyeAngleY));
    let aty = lookDistance * Math.sin(radians(-eyeAngleY));
    let atz = lookDistance * Math.cos(radians(eyeAngleX));
    document.getElementById("demo2").innerHTML = eyeAngleY;
    at = vec3(atx + eye[0],aty + eye[1],atz + eye[2]);
}
  function updatePosition(e) {
    let angleX = e.movementX*APP;
    let angleY = e.movementY*APP;
    calculateAt(angleX,angleY);
    //document.getElementById("demo2").innerHTML = at;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}