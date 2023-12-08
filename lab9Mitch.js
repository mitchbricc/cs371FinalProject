let canvas; 
let gl;

let near = -1;
let far = 1;
let left = -1;
let right = 1;
let ytop = 1;
let bottom = -1;

let radius = 0.1;  //MUST NOT BE ZERO
//let theta  = -40* Math.PI/180.0;
//let phi    = -35* Math.PI/180.0;
let theta  =  0;
let phi    = 0;
let rotation_by_5_deg = 5.0 * Math.PI/180.0;

let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

let uniformModelView, uniformProjection;
let modelViewMatrix, projectionMatrix;           

//Leave light properties and position unchanged
//Ldr, Ldg, Ldb, Lsr, Lsg, Lsb, Lar, Lag, Lab
let lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 ); // white light
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
let lightSpecular = vec4( 0.9, 0.9, 0.9, 1.0 );

//Position is in homogeneous coordinates
//If w =1.0, we are specifying a finite (x,y,z) location
//If w =0.0, light at infinity
let lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );

///Material properties with ambient, diffuse, specular                      one for each object
//You should declare these for each 3d shape; think of using arrays
let materialDiffuse =  vec4( 0.2, 0.2, 1.0, 1.0); 
let materialAmbient =  vec4( 1.0, 1.0, 1.0, 1.0 ); 
let materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
 //metallic?
let materialShininess = 100.0;          

//You will not use a mesh but parametric shapes                         for teapot
let coords = myMesh.vertices[0].values;
let indices = myMesh.connectivity[0].indices;
//Normals provided by Meshlab in json file
let normals = myMesh.vertices[1].values;

let nf;

//global variables to help us with vertex array objects
let program;
let shapes;

let texture;

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
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT );
    
    
    //Link texture to a sampler in fragment shader
    gl.uniform1i(gl.getUniformLocation(program, "u_textureMap"), 0);
}

function init(){
    
	//Get graphics context
    let canvas = document.getElementById( "gl-canvas" );
	let  options = {  // no need for alpha channel, but note depth buffer enabling
		alpha: false,
		depth: true  //NOTE THIS
	};

	gl = canvas.getContext("webgl2", options);
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

	//Load shaders
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

    let shape = createSphereVertices(.25,50,50);
    let sphere = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-.6,.3,0),
        materialDiffuse:  vec4(  0.15,0.96, 0.17, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 400.0,
    };
    shape = createTruncatedConeVertices(.2,0,1,50,50);
    let cone = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(.7,-.5,0),
        materialDiffuse:  vec4( 0.2, 0.2, 1.0, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 100.0,
    };
    shape = createCubeVertices(.4);
    let cube = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-.6,-.5,0),
        materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 100.0,
    };
    shape = createTruncatedConeVertices(.125,.125,.75,50,50);
    let cylinder = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0,-.4,0),
        materialDiffuse:  vec4( 0.95, 0.2, 0.2, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 0.4, 0.4, 0.4, 1.0 ),
        materialShininess: 400.0,
    };
    
    shapes = [sphere,cone,cube,cylinder];
        
    //set up uniform variables
    uniformModelView = gl.getUniformLocation(program, "u_modelViewMatrix");
    uniformProjection = gl.getUniformLocation(program, "u_projectionMatrix");

    
    //Initialize texture
    let image = new Image();
    image.crossOrigin = "anonymous";   // ask for CORS permission
    image.src = document.getElementById("texImage").src; 
    image.onload = function() {
        configureTexture( image, program );
        //draw(); // need this if not using requestAnimationFrame(..) in draw()
    }
 
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
    document.getElementById("Button12").onclick = function(){ytop *= 1.1; bottom *= 1.1;};
 
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

    
    
	// Display the current near and far values
	nf.innerHTML = 'near: ' + Math.round(near * 100)/100 + ', far: ' + Math.round(far*100)/100;
    
    //drawVertexObject(vao, shape.indices.length, materialAmbient, materialDiffuse, materialSpecular, materialShininess); 
    for(let i = 0;i<shapes.length;i++){
        let eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));

        let modelViewMatrix = lookAt( eye, at, up );
        projectionMatrix = ortho( left, right, bottom, ytop, near, far );   
        gl.uniformMatrix4fv( uniformProjection, false, flatten(projectionMatrix) );

        modelViewMatrix = mult(modelViewMatrix,shapes[i].translation);
        gl.uniformMatrix4fv( uniformModelView, false, flatten(modelViewMatrix) );
        drawVertexObject(shapes[i].vao, shapes[i].shape.indices.length, shapes[i].materialAmbient, shapes[i].materialDiffuse, shapes[i].materialSpecular, shapes[i].materialShininess,shapes[i].shape.texCoord); 
    }
    //requestAnimationFrame( draw );
}

//Loads a VAO and draws it
function drawVertexObject(vao, iLength, mA, mD, mS, s, texCoord){
    let ambientProduct = mult(lightAmbient, mA);
    let diffuseProduct = mult(lightDiffuse, mD);
    let specularProduct = mult(lightSpecular, mS);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),s);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );	
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );    
    

    gl.bindVertexArray(vao);
    gl.drawElements( gl.TRIANGLES, iLength, gl.UNSIGNED_SHORT, 0 );     
}
 
//Sets up a VAO 
function setUpVertexObject(shape){
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
    let attributeCoords  = gl.getAttribLocation(program, "a_coords"); 
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(attributeCoords);
 
    //set up normals buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STREAM_DRAW);
    let attributeNormals = gl.getAttribLocation( program, "a_normals" );
    gl.vertexAttribPointer( attributeNormals, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( attributeNormals );

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
