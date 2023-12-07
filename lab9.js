let canvas; 
let gl;

let near = -1;
let far = 1;
let left = -1;
let right = 1;
let ytop = 1;
let bottom = -1;

const T_STEP = 0.1;
const R_STEP = 10.0;
const S_STEP = 0.1;

let radius = 0.1;  //MUST NOT BE ZERO
let theta  = 0 * Math.PI/180.0;
let phi    = 0 * Math.PI/180.0;
// let theta = 0;
// let phi = 0;
let rotation_by_5_deg = 5.0 * Math.PI/180.0;

let at = vec3(0.0, 0.0, -5.0);
let up = vec3(0.0, 1.0, 0.0);
let eyeX=0, eyeY=0, eyeZ=5;
let eye = vec3(eyeX,eyeY,eyeZ);

//globals for mouse effects
let cursorHidden = false;


let uniformModelView, uniformProjection;
let modelViewMatrix, projectionMatrix;    

let centroid;  
let modelTransform;     


//DONT TOUCH
//Leave light properties and position unchanged
//Ldr, Ldg, Ldb, Lsr, Lsg, Lsb, Lar, Lag, Lab
let lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 ); // white light
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
let lightSpecular = vec4( 0.9, 0.9, 0.9, 1.0 );

//Position is in homogeneous coordinates
//If w =1.0, we are specifying a finite (x,y,z) location
//If w =0.0, light at infinity
let light1Position = vec4(1.0, 1.0, 1.0, 0.0 );
let light2Position = vec4(-1.0, -1.0, -1.0, 0.0 );



let nf;

//global variables to help us with vertex array objects
let program;
let shapelength;

let sphere;
let vaoSphere;

let cone;
let vaoCone;

let cylinder;
let vaoCylinder;

let cube;
let vaoCube;

let allShapes;
let allVao;

function configureTexture( image, program ) {
    texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );  //0 active by default
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    //Flip the Y values to match the WebGL coordinates
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    //Specify the image as a texture array:
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
         
    //Set filters and parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    //Link texture to a sampler in fragment shader
    gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
}


function init(){
    
	//Get graphics context
    canvas = document.getElementById( "gl-canvas" );
	let  options = {  // no need for alpha channel, but note depth buffer enabling
		alpha: false,
		depth: true  //NOTE THIS
	};

	gl = canvas.getContext("webgl2", options);
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    //to start listening for user input
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    canvas.addEventListener("click", async () => {
        await canvas.requestPointerLock({
          unadjustedMovement: true,
        });
      });
      // Register the event handler to be called on key press
    window.addEventListener("keydown",keydown,false);

	//Load shaders
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

    modelTransform=mat4();
    
 
    //This sets the shape variable to be the data from the mesh file
    //For the lab, you should replace the shape variable with perhaps an array
    //and populate  the array with the various parametric shapes   
    
    //create each shape object with modified shape methods, noticed that when you translate the shape it changes the lighting
    shape = createSphereVertices(0.2,30,30, 0, Math.PI, 0,2*Math.PI);
    shapelength = shape.indices.length;
    sphere = {
        shape: shape,
        translation: translate(0,0,0),
        materialDiffuse:  vec4( .05, 1, .05, 1), 
        materialAmbient:  vec4( .05, 1, .05, 1), 
        materialSpecular: vec4( .8, 1, .8, 1),
        materialShininess: 100.0,
        length: shapelength,
    }

    shape = createTruncatedConeVertices(0.2,0,0.7,15,10,true,true);
    shapelength = shape.indices.length;
    cone = {
        shape: shape,
        translation: translate(.7,-.5,0),
        materialDiffuse:  vec4( 0.2, 0.2, 1.0, 1), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1), 
        materialSpecular: vec4( .2, .2, .2, 1),
        materialShininess: 10.0,
        length: shapelength,
    }

    shape = createTruncatedConeVertices(0.2,0.2,0.8,15,10,true,true);
    shapelength = shape.indices.length;
    cylinder = {
        shape: shape,
        translation: translate(0,-.4,0),
        materialDiffuse:  vec4( 1, .1, .1, 1), 
        materialAmbient:  vec4( 1, .8, .8, 1), 
        materialSpecular: vec4( 1, 1, 1, 1),
        materialShininess: 100.0,
        length: shapelength,
    }

    shape = createCubeVertices(.4);
    shapelength = shape.indices.length;
    cube = {
        shape: shape,
        translation: translate(-.6,-.5,0),
        materialDiffuse: vec4( 1, 1, 0.01, 1), 
        materialAmbient: vec4( 1, 1, 0.01, 1 ),
        materialSpecular: vec4( 1, 1, 0.01, 1 ),
        materialShininess: 10.0,
        length: shapelength,
    }

    //array to use in draw method loop
    //allShapes = [sphere,cone,cylinder,cube];
    allShapes = [sphere];

   
    //setViewParams(coords); // Attempt to size the viewing window based on object's coords from mesh file; don't need this if drawing parametric shapes
    
    //set up vertex array object:
    //you will need to set up multiple such vertex array objects for the lab       
    //vaoSphere = setUpVertexObject(sphere);
    vaoSphere = setUpVertexObject(sphere.shape);
    vaoCone = setUpVertexObject(cone.shape);
    vaoCylinder = setUpVertexObject(cylinder.shape);
    vaoCube = setUpVertexObject(cube.shape);

    //array to use in draw method loop
    allVao = [vaoSphere,vaoCone,vaoCylinder,vaoCube];
      
    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");
 
 
    // Retrieve the nearFar element
	nf = document.getElementById('nearFar');
    // buttons for moving viewer and changing size
    document.getElementById("Button1").onclick = function(){near  *= 1.02};
    document.getElementById("Button2").onclick = function(){near *= 0.98};
    document.getElementById("Button13").onclick = function(){far *= 1.02;};
    document.getElementById("Button14").onclick = function(){far *= 0.98;};    
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    document.getElementById("Button5").onclick = function(){theta += rotation_by_5_deg;};
    document.getElementById("Button6").onclick = function(){theta -= rotation_by_5_deg;};
    document.getElementById("Button7").onclick = function(){phi += rotation_by_5_deg;};
    document.getElementById("Button8").onclick = function(){phi -= rotation_by_5_deg;};
    document.getElementById("Button9").onclick = function(){left  *= 0.9; right *= 0.9;};
    document.getElementById("Button10").onclick = function(){left *= 1.1; right *= 1.1;};
    document.getElementById("Button11").onclick = function(){ytop  *= 0.9; bottom *= 0.9;};
    

 
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

function draw(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //document.getElementById("demo").innerHTML = eye;
    let modelViewMatrix = lookAt( eye, at, up );
    modelViewMatrix = mult(modelTransform,modelViewMatrix);
    projectionMatrix = perspective( 30, gl.canvas.width/gl.canvas.height, 1, 100 );   
    gl.uniformMatrix4fv( uniformProjection, false, flatten(projectionMatrix) );
    
	// Display the current near and far values
	nf.innerHTML = 'near: ' + Math.round(near * 100)/100 + ', far: ' + Math.round(far*100)/100;
    
    //For the lab, you will need to draw multiple vertex array objects
    //The default parametric shapes all draw at the origin; you may need to use model matrices for each of them to place them in the scene
    //These model matrices should be combined with the view matrix to get the modelview matrix for each shape
    //loop to go through each shape and draw them on screen
    for(let i = 0; i<allShapes.length; i++){
        //modelViewMatrix = mult(modelViewMatrix,allShapes[i].translation);
        gl.uniformMatrix4fv( uniformModelView, false, flatten(modelViewMatrix) );
        drawVertexObject(allVao[i], allShapes[i].length, allShapes[i].materialAmbient, allShapes[i].materialDiffuse, allShapes[i].materialSpecular, allShapes[i].materialShininess); 
    }

    requestAnimationFrame( draw );
}

//Loads a VAO and draws it
function drawVertexObject(vao, iLength, mA, mD, mS, s){
    let ambientProduct = mult(lightAmbient, mA);
    let diffuseProduct = mult(lightDiffuse, mD);
    let specularProduct = mult(lightSpecular, mS);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),s);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "light1Position"), flatten(light1Position) );    
    gl.uniform4fv(gl.getUniformLocation(program, "light2Position"), flatten(light2Position) );    

    
    gl.bindVertexArray(vao);
    gl.drawElements( gl.TRIANGLES, iLength, gl.UNSIGNED_SHORT, 0 );     
}
 
//Sets up a VAO 
function setUpVertexObject(shape){
    let indices = shape.indices;
    let vertices = shape.positions;
    let normals = shape.normals;
    let texture = shape.texcoord;
 
    vao = gl.createVertexArray(); 
    gl.bindVertexArray(vao); 
    
    //set up index buffer, if using
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);
    
    //For each attribute (e.g. each of vertices, normal, color, etc.)
 
    //set up vertices buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STREAM_DRAW);
    let attributeCoords  = gl.getAttribLocation(program, "a_coords"); 
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(attributeCoords);
 
    //set up normals buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STREAM_DRAW);
    let attributeNormals = gl.getAttribLocation( program, "a_normals" );
    gl.vertexAttribPointer( attributeNormals, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( attributeNormals );

    //set up textures buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texture), gl.STATIC_DRAW);
    let texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    //Initialize texture
    let image = new Image();
    image.src = document.getElementById("texImage").src; 
    image.onload = function() {
        configureTexture( image, program );
    }
    
    //finalize the vao; not required, but idered good practice
    gl.bindVertexArray(null); 
    return vao;
}
function upT(){
    modelTransform = mult(translate(0.0,T_STEP,0.0),modelTransform);
    draw();
}
function leftT(){
    modelTransform = mult(translate(-T_STEP,0.0,0.0),modelTransform);
    draw();
}

function rightT(){
    modelTransform = mult(translate(T_STEP,0.0,0.0),modelTransform);
    draw();
}
function downT(){
    modelTransform = mult(translate(0.0,-T_STEP,0.0),modelTransform);
    draw();
}
function frontT(){
    modelTransform = mult(translate(0.0,0.0,T_STEP),modelTransform);
    draw();
}
function backT(){
    modelTransform = mult(translate(0.0,0.0,-T_STEP),modelTransform);
    draw();
}
function larger(){
    modelTransform = mult(scalem(1.0 + S_STEP, 1.0 + S_STEP, 1.0 + S_STEP),modelTransform);    
    draw();
}
function smaller(){
    modelTransform = mult(scalem(1.0 - S_STEP, 1.0 - S_STEP, 1.0 - S_STEP),modelTransform);    
    draw();
}
function rX(){
    modelTransform = mult(rotateX(R_STEP),modelTransform);
    draw();
}
function rY(){
    modelTransform = mult(rotateY(R_STEP),modelTransform);
    draw();
}
function rZ(){
    modelTransform = mult(rotateZ(R_STEP),modelTransform);
    draw();
}
//Reset
function reset(){
    modelTransform = mat4();
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
//end of code from Professor in lab9
function lockChangeAlert() {
    if (cursorHidden == false) {
        document.getElementById("demo").innerHTML = "lock";
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
    //convert polar to xyz
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
    document.getElementById("demo2").innerHTML = at;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
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
        default:return; // Skip drawing if no effective action
    }
}
function jump(){

}
let score = 4;
function drawScore() {

    document.getElementById("demo2").innerHTML = "score?";
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("score: goes here", canvas.width - 65, 20);
  }

//Button handlers to be implemented
function increaseZ(){
    eye[2] += T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}
function decreaseZ(){
    eye[2] += -T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}
function increaseX(){
    eye[0] += T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}
function decreaseX(){
    eye[0] += -T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}
function increaseY(){
    eye[1] += T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}
function decreaseY(){
    eye[0] += T_STEP;
    modelViewMatrix = lookAt(eye, at, up);
    draw();
}




//COLORS NEED TO BE RETAINED
//COMBINE COlor with texture color in html 