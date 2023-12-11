function getShapes() {
    let shapes;

    let flooroffset = -19;
    let shape = createSphereVertices(.25, 50, 50);
    let sphere = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-.6, .3+flooroffset, 0),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(.05, .05, .05),
    };
    shape = createTruncatedConeVertices(.2, 0, 1, 50, 50);
    let cone = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(.7, -.5+flooroffset, 0),
        materialDiffuse: vec4(0.2, 0.2, 1.0, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(.05, .05, .05),
    };
    shape = createCubeVertices(.4);
    let cube = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-.6, -.5+flooroffset, 0),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(.05, .05, .05),
    };
    shape = createTruncatedConeVertices(.125, .125, .75, 50, 50);
    let cylinder = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0, -.4+flooroffset, 0),
        materialDiffuse: vec4(0.95, 0.2, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(0.4, 0.4, 0.4, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(.05, .05, .05),
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
        translation: mult(translate(0, .4+flooroffset, 0), scalem(.1, .1, -0.1)),
        materialDiffuse: vec4(0.392, 0.784, 0.588),
        materialAmbient: vec4(0.196, 0.392, 0.294),
        materialSpecular: vec4(0.588, 1, 0.784),
        materialShininess: 30.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    //rock 
    coords = rock.vertices[0].values;
    indices = rock.connectivity[0].indices;
    cnormals = rock.vertices[1].values;
    texcoords = 0;
    shape = {
        positions: coords,
        normals: normals,
        texcoord: texcoords,
        indices: indices,
    };
    let Rock = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-3, .4+flooroffset, 0), scalem(.01, .01, .01)),
        materialDiffuse: vec4(0.471, 0.471, 0.471),
        materialAmbient: vec4(0.314, 0.314, 0.314),
        materialSpecular: vec4(0.784, 0.784, 0.784),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    
    shape = createCubeVertices(40);
    let arena = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0, 0, 0),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(0, 0, 0),
    };

    shape = createWallVertices(39);
    let ceiling = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0, 18, 0), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(0, 0, 0),
    };
    shape = createSphereVertices(.3, 50, 50);
    let orb1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-5, flooroffset, 0),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-5, flooroffset, 0),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(0, 0, 0),
    };




    shapes = [sphere, cone, cube, cylinder, Ghost,ceiling, arena, orb1];
    //shapes = [sphere,cone,cube,cylinder,Ghost,wall1,wall2,floor,ceiling,wall5,wall6,wallTest];
    return shapes;
}