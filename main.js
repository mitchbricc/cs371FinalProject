"use strict";

let gl;  // The WebGL graphics context.

//Global variables for colors and coordinates

//The model transform
let uniformModelView, uniformProjection;
let modelMatrix, modelViewMatrix, projectionMatrix;

let uniformColor;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

// Constants for the step values for translation, rotation and scaling
const T_STEP = 0.1;
const R_STEP = 5.0;
const S_STEP = 0.1;

let xAxis = 0;
let yAxis = 1;
let zAxis = 2;

let theta_for_rotation_of_model = [ 0, 0, 0 ];	// Angles of rotation for each axis

let coords=[];
let indices = [];

//Initialize the program
function init() {

	//Get graphics context
    let canvas = document.getElementById( "gl-canvas" );
	let  options = {  // no need for alpha channel, but note depth buffer enabling
		alpha: false,
		depth: true  //NOTE THIS
	};

	gl = canvas.getContext("webgl2", options);
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

	//Load shaders
	let program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
    
    let shape = createSphereVertices(0.5,30,30, 0, Math.PI, 0,2*Math.PI);
    //let shape = createTruncatedConeVertices(0.3,0,1.0,15,10,false,false);
    //let shape = createTruncatedConeVertices(0.3,0.3,1.0,15,10,true,false);
   
    coords = shape.positions;
    indices = shape.indices;
 
    //set up vertices buffer
    let bufferCoords = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coords), gl.STREAM_DRAW);

    let attributeCoords  = gl.getAttribLocation(program, "a_coords");
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(attributeCoords);
 
    //set up index buffer
    let bufferIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
    // Uint16Array here must match gl.UNSIGNED_BYTE in drawElements call
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);  
    
    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");
    uniformColor = gl.getUniformLocation(program, "u_color");
    
    modelMatrix= mat4();     
    projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
    
    //set up screen
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 
    gl.clearColor(0, 0, 0, 1); 
    
    //Enable depth testing    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);  
    
	//call draw to render content
	draw();
}

//Draws the contents of the canvas
 function draw() { 
    //Clear screen and depth buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //send uniform data
    modelViewMatrix = modelMatrix;
    modelViewMatrix = mult(modelViewMatrix, rotateX(theta_for_rotation_of_model[xAxis]));
    modelViewMatrix = mult(modelViewMatrix, rotateY(theta_for_rotation_of_model[yAxis]));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(theta_for_rotation_of_model[zAxis]));
    
    gl.uniformMatrix4fv(uniformModelView, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(uniformProjection, false, flatten(projectionMatrix));
    
    //render:  this needs to change for the cube    
    gl.uniform4fv(uniformColor, flatten(red));    
    gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 ); 
    gl.uniform4fv(uniformColor, flatten(black));
    gl.drawElements( gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0 );


}

//Rotations
function rX(){
    theta_for_rotation_of_model[xAxis] += R_STEP;
    draw();
}
function rY(){
    theta_for_rotation_of_model[yAxis] += R_STEP;
    draw();
}
function rZ(){
    theta_for_rotation_of_model[zAxis] += R_STEP;
    draw();
}
/////////////////////////
//Translate
function left(){
    modelMatrix = mult(translate(-T_STEP,0.0,0.0),modelMatrix);
    draw();
}

function right(){
    modelMatrix = mult(translate(T_STEP,0.0,0.0),modelMatrix);
    draw();
}

function down(){
    modelMatrix = mult(translate(0.0,-T_STEP,0.0),modelMatrix);
    draw();
}

function up(){
    modelMatrix = mult(translate(0.0,T_STEP,0.0),modelMatrix);
    draw();
}

//-------------------------
//Scaling
function larger(){
    modelMatrix = mult(scalem(1.0 + S_STEP, 1.0 + S_STEP, 1.0 + S_STEP),modelMatrix);    
    draw();
}
function smaller(){
    modelMatrix = mult(scalem(1.0 - S_STEP, 1.0 - S_STEP, 1.0 - S_STEP),modelMatrix);    
    draw();
}
//Reset 
function reset(){
    modelMatrix = mat4();
    theta_for_rotation_of_model = [ 0, 0, 0 ];
    draw();
}

///////////////////////////////////////////////////////////////////////////
//3D drawing

//Modified from webgl2fundamentals.org
function createSphereVertices(
    radius,
    subdivisionsAxis,
    subdivisionsHeight,
    opt_startLatitudeInRadians,
    opt_endLatitudeInRadians,
    opt_startLongitudeInRadians,
    opt_endLongitudeInRadians) {
        
    if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
        throw new Error('subdivisionAxis and subdivisionHeight must be > 0');
    }

    opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
    opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
    opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
    opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

    let latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
    let longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

    // We are going to generate our sphere by iterating through its
    // spherical coordinates and generating 2 triangles for each quad on a
    // ring of the sphere.
    let numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
    let positions = [];
    let normals   = [];
    let texcoords = [];

    // Generate the individual vertices in our vertex buffer.
    for (let y = 0; y <= subdivisionsHeight; y++) {
        for (let x = 0; x <= subdivisionsAxis; x++) {
          // Generate a vertex based on its spherical coordinates
          let u = x / subdivisionsAxis;
          let v = y / subdivisionsHeight;
          let theta = longRange * u + opt_startLongitudeInRadians;
          let phi = latRange * v + opt_startLatitudeInRadians;
          let sinTheta = Math.sin(theta);
          let cosTheta = Math.cos(theta);
          let sinPhi = Math.sin(phi);
          let cosPhi = Math.cos(phi);
          let ux = cosTheta * sinPhi;
          let uy = cosPhi;
          let uz = sinTheta * sinPhi;
          
          positions.push(vec3(radius * ux, radius * uy, radius * uz));
          normals.push(vec3(ux, uy, uz));
          texcoords.push(vec2(1 - u, v));
        }
    }

    let numVertsAround = subdivisionsAxis + 1;
    let indices = [];
    for (let x = 0; x < subdivisionsAxis; x++) {    
        for (let y = 0; y < subdivisionsHeight; y++) {      
          // Make triangle 1 of quad.
          indices.push((y + 0) * numVertsAround + x);
          indices.push((y + 0) * numVertsAround + x + 1);
          indices.push((y + 1) * numVertsAround + x);

          // Make triangle 2 of quad.
          indices.push((y + 1) * numVertsAround + x);
          indices.push((y + 0) * numVertsAround + x + 1);
          indices.push((y + 1) * numVertsAround + x + 1);
        }
    }

    return {
        positions: positions,
        normal: normals,
        texcoord: texcoords,
        indices: indices,
    };
    
}

//Modified from webgl2fundamentals.org
function createTruncatedConeVertices(
    bottomRadius,
    topRadius,
    height,
    radialSubdivisions,
    verticalSubdivisions,
    opt_topCap,
    opt_bottomCap) {
        
    if (radialSubdivisions < 3) {
        throw new Error('radialSubdivisions must be 3 or greater');
    }

    if (verticalSubdivisions < 1) {
        throw new Error('verticalSubdivisions must be 1 or greater');
    }

    let topCap = (opt_topCap === undefined) ? true : opt_topCap;
    let bottomCap = (opt_bottomCap === undefined) ? true : opt_bottomCap;

    let extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

    let numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
    let positions = [];
    let normals   = [];
    let texcoords = [];
    let indices   = [];

    let vertsAroundEdge = radialSubdivisions + 1;

    // The slant of the cone is constant across its surface
    let slant = Math.atan2(bottomRadius - topRadius, height);
    let cosSlant = Math.cos(slant);
    let sinSlant = Math.sin(slant);

    let start = topCap ? -2 : 0;
    let end = verticalSubdivisions + (bottomCap ? 2 : 0);

    for (let yy = start; yy <= end; ++yy) {
        let v = yy / verticalSubdivisions;
        let y = height * v;
        let ringRadius;
        
        if (yy < 0) {
            y = 0;
            v = 1;
            ringRadius = bottomRadius;
        } else if (yy > verticalSubdivisions) {
            y = height;
            v = 1;
            ringRadius = topRadius;
        } else {
            ringRadius = bottomRadius +
                (topRadius - bottomRadius) * (yy / verticalSubdivisions);
        }
        
        if (yy === -2 || yy === verticalSubdivisions + 2) {
          ringRadius = 0;
          v = 0;
        }
        y -= height / 2;
        for (let ii = 0; ii < vertsAroundEdge; ++ii) {
            let sin = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
            let cos = Math.cos(ii * Math.PI * 2 / radialSubdivisions);
            positions.push(vec3(sin * ringRadius, y, cos * ringRadius));
            if (yy < 0) {
                normals.push(vec3(0, -1, 0));
            } else if (yy > verticalSubdivisions) {
                normals.push(vec3(0, 1, 0));
            } else if (ringRadius === 0.0) {
                normals.push(vec3(0, 0, 0));
            } else {
                normals.push(vec3(sin * cosSlant, sinSlant, cos * cosSlant));
            }
            texcoords.push(vec2((ii / radialSubdivisions), 1 - v));
        }
    }

    for (let yy = 0; yy < verticalSubdivisions + extra; ++yy) {  
        for (let ii = 0; ii < radialSubdivisions; ++ii) {  
            indices.push(vertsAroundEdge * (yy + 0) + 0 + ii);
            indices.push(vertsAroundEdge * (yy + 0) + 1 + ii);
            indices.push(vertsAroundEdge * (yy + 1) + 1 + ii);
            indices.push(vertsAroundEdge * (yy + 0) + 0 + ii);
            indices.push(vertsAroundEdge * (yy + 1) + 1 + ii);
            indices.push(vertsAroundEdge * (yy + 1) + 0 + ii);
        }
    }
    
    return {
        positions: positions,
        normal: normals,
        texcoord: texcoords,
        indices: indices,
    };
    
}

