//file that holds all the objects being created with parametric functions or mesh models
function getShapes() {
    let shapes;

    let flooroffset = -19;
    let shape; 
    //You will not use a mesh but parametric shapes                         
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
        translation: mult(translate(0, .4+flooroffset, -10), scalem(.1, .1, -0.1)),

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
    let rockSize = .04
    let rockCollisionDistance = vec3(2.9, 5, 2.25);
    //all rocks 
    let Rock1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, .4+flooroffset, -6), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16.5, .4+flooroffset, -7),(mult(rotateY(90),scalem(rockSize, rockSize, rockSize)))),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, .4+flooroffset, 17),scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16, .4+flooroffset, 17), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock5 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(16.5, .4+flooroffset, -7),(mult(rotateY(90),scalem(rockSize, rockSize, rockSize)))),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18, .4+flooroffset, -6), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(10000, .4+flooroffset, 15), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
    }
    let Rock8 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0,.4+flooroffset, -5), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: rockCollisionDistance,
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
    let orbCollisionDistance = vec3(1.3, 19.3, 1.3);
    //left front corner
    let orb1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-19, flooroffset+3.5, -19),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //right front corner orb
    let orb2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(10, flooroffset+3.5, -18.75),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //right back corner orb
    let orb3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(18.75, flooroffset+3.5, 7),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //middle of arena orb
    let orb4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0, flooroffset, -7),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //left side orb
    let orb5 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-18, flooroffset, -9),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //left back corner orb
    let orb6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-18, flooroffset, 19),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    //left side orb
    let orb7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(18, flooroffset, -9),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: orbCollisionDistance,
    };
    shape = createPlatformVertices(2);
    let PlatformCollisionDistance = vec3(1.3, 1.3, 1.3);
    //corner 1
    let Platform1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16, flooroffset-.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-17, flooroffset+.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, flooroffset+1.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-19, flooroffset+2.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    }; 
    //corner 2
    let Platform5 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.9, flooroffset-.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(16, flooroffset+.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(13, flooroffset+1.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform8 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(10, flooroffset+2.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    //corner 3
    let Platform9 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset-.5, 19), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform10 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+.5, 17), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform11 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+1.5, 15), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform12 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+2.5, 13), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    let Platform13 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+2.5, 7), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };
    //USE THIS PLATFORM FOR TESTING
    let Platform14 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(10000, flooroffset-.5, 0), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: PlatformCollisionDistance,
    };




    //list holds all shapes placed in the arena 
    shapes = [arena,ceiling,orb1, orb2,Ghost,orb3,orb4,orb5,orb6,orb7,Rock1,Rock2,Rock3,Rock4,Rock5,Rock6,Rock7,Rock8,
              Platform1,Platform2,Platform3,Platform4,Platform5,Platform6,Platform7,Platform8,Platform9,Platform10,Platform11,Platform12,Platform13,Platform14];
    
    return shapes;
}