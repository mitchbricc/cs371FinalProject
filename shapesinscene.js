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
    let Rock1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, .4+flooroffset, -6), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16.5, .4+flooroffset, -7),(mult(rotateY(90),scalem(rockSize, rockSize, rockSize)))),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, .4+flooroffset, 17),scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16, .4+flooroffset, 17), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock5 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(16.5, .4+flooroffset, -7),(mult(rotateY(90),scalem(rockSize, rockSize, rockSize)))),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18, .4+flooroffset, -6), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0, .4+flooroffset, 15), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
        materialShininess: 10.0,
        collisionDistance: vec3(1.2, 1.2, 1.05),
    }
    let Rock8 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0,.4+flooroffset, -5), scalem(rockSize, rockSize, rockSize)),
        materialDiffuse: vec4(0.1, 0.1, 0.1),
        materialAmbient: vec4(0.1, 0.1, 0.1),
        materialSpecular: vec4(0.1, 0.1, 0.1),
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
        translation: translate(-19, flooroffset+3.5, -19),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(16, flooroffset+5, -18.75),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(18.75, flooroffset+3.5, 7),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(0, flooroffset, -6.5),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb5 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-18, flooroffset, -8),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(-18, flooroffset, 19),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let orb7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: translate(18, flooroffset, -7.5),
        materialDiffuse: vec4(0.15, 0.96, 0.17, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 400.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    shape = createPlatformVertices(2);
    //corner 1
    let Platform1 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-16, flooroffset-.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform2 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-17, flooroffset+.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform3 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-18, flooroffset+1.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform4 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(-19, flooroffset+2.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
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
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform6 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(16, flooroffset+1, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform7 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.9, flooroffset+2.5, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform8 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(16, flooroffset+4, -18.75), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
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
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform10 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+.5, 17), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform11 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+1.5, 15), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform12 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+2.5, 13), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform13 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(18.75, flooroffset+2.5, 7), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };
    let Platform14 = {
        shape: shape,
        vao: setUpVertexObject(shape),
        translation: mult(translate(0, flooroffset-.5, 0), rotateX(90)),
        materialDiffuse: vec4(0.9, 0.9, 0.2, 1.0),
        materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
        materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
        materialShininess: 100.0,
        collisionDistance: vec3(1.3, 19.3, 1.3),
    };





    shapes = [arena,ceiling,orb1, orb2,Ghost,orb3,orb4,orb5,orb6,orb7,Rock1,Rock2,Rock3,Rock4,Rock5,Rock6,Rock7,Rock8,
              Platform1,Platform2,Platform3,Platform4,Platform5,Platform6,Platform7,Platform8,Platform9,Platform10,Platform11,Platform12,Platform13,Platform14];
    
    return shapes;
}