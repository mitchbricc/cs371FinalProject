

function rX(modelTransform){
    modelTransform = mult(rotateX(R_STEP),modelTransform);
    draw();
}
function rY(modelTransform){
    modelTransform = mult(rotateY(R_STEP),modelTransform);
    draw();
}
function rZ(modelTransform){
    modelTransform = mult(rotateZ(R_STEP),modelTransform);
    draw();
}
/////////////////////////
//Translate
function moveLeft(modelTransform){
    modelTransform = mult(translate(-T_STEP,0.0,0.0),modelTransform);
    draw();
}

function moveRight(modelTransform){
    modelTransform = mult(translate(T_STEP,0.0,0.0,0.0),modelTransform);
    draw();
}

function moveDown(modelTransform){
    modelTransform = mult(translate(0.0,-T_STEP,0.0),modelTransform);
    draw();
}

function moveUp(modelTransform){
    modelTransform = mult(translate(0.0,T_STEP,0.0),modelTransform);
    draw();
}
//------------------------
//These functions currently have no visible effects
function front(modelTransform){
    modelTransform = mult(translate(0.0,0.0,T_STEP),modelTransform);
    draw();
}
function back(modelTransform){
    modelTransform = mult(translate(0.0,0.0,-T_STEP),modelTransform);
    draw();
}
//-------------------------
//Scaling
function larger(modelTransform){
    modelTransform = mult(scalem(1.0 + S_STEP, 1.0 + S_STEP, 1.0 + S_STEP),modelTransform);    
    draw();
}
function smaller(modelTransform){
    modelTransform = mult(scalem(1.0 - S_STEP, 1.0 - S_STEP, 1.0 - S_STEP),modelTransform);    
    draw();
}
//Reset
function reset(modelTransform){
    modelTransform = mat4();
    draw();
}
