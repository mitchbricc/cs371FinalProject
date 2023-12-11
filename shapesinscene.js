function getShapes(){
let shapes;

let shape = createSphereVertices(.25,50,50);
    let sphere = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-.6,.3,0),
        materialDiffuse:  vec4(  0.15,0.96, 0.17, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 400.0,
        collisionDistance: vec3(.05,.05,.05),
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
        collisionDistance: vec3(.05,.05,.05),
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
        collisionDistance: vec3(.05,.05,.05),
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
        collisionDistance: vec3(.05,.05,.05),
    };
    //You will not use a mesh but parametric shapes                         for ghost
    let coords = ghost.vertices[0].values;
    let indices = ghost.connectivity[0].indices;
    //Normals provided by Meshlab in json file
    let normals = ghost.vertices[1].values;
    let texcoords = 0;
    shape = {
        positions: coords,
        normals: normals,
        texcoord: texcoords,
        indices: indices,
    };
    let Ghost = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0,.4,0),scalem(.1,.1,-0.1)),
        materialDiffuse:  vec4( 0.95, 0.2, 0.2, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 0.4, 0.4, 0.4, 1.0 ),
        materialShininess: 400.0,
        collisionDistance: vec3(1.2,1.2,1.05),
    }
    //areana bounds
    // let offset = 1;
    // let arenaSize = 20
    // shape = createWallVertices(arenaSize);
    // let wall1 = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: mult(translate(arenaSize+offset,0,3),rotateY(90)),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // shape = createCubeVertices(arenaSize);
    // let wall2 = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: translate(-arenaSize+(-offset),0,0),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // //floor
    // shape = createCubeVertices(arenaSize);
    // let floor = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: translate(0,-1,0),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // shape = createCubeVertices(arenaSize);
    // let ceiling = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: translate(0,arenaSize+offset,0),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // shape = createCubeVertices(20);
    // let wall5 = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: translate(0,0,-arenaSize+(-offset)),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // shape = createCubeVertices(20);
    // let wall6 = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     translation: translate(0,0,arenaSize+offset),
    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };
    // shape = createWallVertices(10);
    // let wallTest = {
    //     shape: shape,
    //     vao: setUpVertexObject(shape),
    //     //wallsleft and right
    //     translation: mult(translate(0,0,3),rotateY(90)),
    //     //walls back and front (staay same)
    //     //translation: translate(0,0,3),
    //     //ceiling and floor
    //     //translation: mult(translate(0,0,3),rotateX(90)),

    //     materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
    //     materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
    //     materialShininess: 100.0,
    // };

    shape = createCubeVertices(40);
    let arena = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0,0,0),
        materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 100.0,
        collisionDistance: vec3(0,0,0),
    };

    shape = createWallVertices(39);
    let ceiling = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0,18,0),rotateX(90)),
        materialDiffuse:  vec4( 0.9, 0.9, 0.2, 1.0), 
        materialAmbient:  vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
        materialShininess: 100.0,
        collisionDistance: vec3(0,0,0),
    };



    
    shapes = [sphere,cone,cube,cylinder,Ghost,arena];
    //shapes = [sphere,cone,cube,cylinder,Ghost,wall1,wall2,floor,ceiling,wall5,wall6,wallTest];
    return shapes;
}