//Button handlers to be implemented
function increaseZ() {
    eye[2] += T_STEP;
    calculateAt(0,0);
}
function decreaseZ() {
    eye[2] += -T_STEP;
    calculateAt(0,0);
}
function increaseX() {
    eye[0] += T_STEP;
    calculateAt(0,0);
}
function decreaseX() {
    eye[0] += -T_STEP;
    calculateAt(0,0);
}
function increaseY() {
    eye[1] += T_STEP;
    calculateAt(0,0);
}
function decreaseY() {
    eye[0] += T_STEP;
    calculateAt(0,0);
}
//handes the cases when the user collides with the ghost 
function ghostCollision(){
    let position = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
        position = mult(shapes[4].translation, position);
        let xDistance = Math.abs(eye[0] - position[0]);
        let yDistance = Math.abs(eye[1] - position[1]);
        let zDistance = Math.abs(eye[2] - position[2]);

        let xcollision = false;
        if (xDistance <= shapes[4].collisionDistance[0]) {
            xcollision = true;
        }
        let ycollision = false;
        if (yDistance <= shapes[4].collisionDistance[1]) {
            ycollision = true;
        }
        let zcollision = false;
        if (zDistance <= shapes[4].collisionDistance[2]) {
            zcollision = true;
        }
        let collision = xcollision && ycollision && zcollision;
        if (collision) {
                let ghostPosition = vec4(shapes[4].shape.positions[0], shapes[4].shape.positions[1], shapes[4].shape.positions[2], 1);
                ghostPosition = mult(shapes[4].translation, ghostPosition);
                let ghostx_move = eye[0] - ghostPosition[0];
                let ghosty_move = eye[1] - ghostPosition[1];
                let ghostz_move = eye[2] - ghostPosition[2];
                if (Math.abs(ghostx_move) > 0.001) {
                    if (Math.sign(eye[0] - position[0]) == -1) {
                        eye[0] -= T_STEP * 5;
                    }
                    else {
                        eye[0] += T_STEP * 5;
                    }
                }
                if (Math.abs(ghosty_move) > 0.001) {
                    if(Math.sign(eye[1] - position[1]) == -1){
                        eye[1] -= T_STEP*5;
                    }
                    else{
                        eye[1] += T_STEP*5;
                    }
                }
                if (Math.abs(ghostz_move) > 0.001) {
                    if(Math.sign(eye[2] - position[2]) == -1){
                        eye[2] -= T_STEP*5;
                    }
                    else{
                        eye[2] += T_STEP*5;
                    }
                }
        }
        return collision;
    }

function collisionDetection(shapes) {
    let xneg = true, xpos = true, yneg = true, ypos = true, zneg = true, zpos = true;
    
    for (let i = 0; i < shapes.length; i++) {
        if(i==4){
            if(ghostCollision()){
                lives--;
                showLives();
            }
            i++;//skip ghost
        }
        //first vertex of the shape 
        let position;
        if(i > 9 && i < 18){
            position = vec4(shapes[i].shape.positions[0], shapes[i].shape.positions[1], shapes[i].shape.positions[2], 1);
            position = mult(shapes[i].translation, position);
        }
        else{
            position = vec4(shapes[i].shape.positions[0][0], shapes[i].shape.positions[0][1], shapes[i].shape.positions[0][2], 1);
            position = mult(shapes[i].translation, position);
        }
        let xDistance = Math.abs(eye[0] - position[0]);
        let yDistance = Math.abs(eye[1] - position[1]);
        let zDistance = Math.abs(eye[2] - position[2]);
        let xcollision = false;
        if (xDistance <= shapes[i].collisionDistance[0]) {
            xcollision = true;
            
        }
        //for platforms only
        else if((eye[0] - position[0] > -3.1 && eye[0] - position[0] < 0)&&(i > 17 && i < 33)){
            xcollision = true;
        }
        let ycollision = false;
        if (yDistance <= shapes[i].collisionDistance[1]) {
            ycollision = true;
            
        }
        let zcollision = false;
        if (zDistance <= shapes[i].collisionDistance[2]) {
            zcollision = true;
        }
        //for platforms only
        else if((eye[2] - position[2] > -3.1 && eye[2] - position[2] < 0)&&(i > 17 && i < 33)){
            zcollision = true;
        }
        let collision = xcollision && ycollision && zcollision;
        if (collision) {
            
            
            
            //orb collecting
            if(((i > 1)&&(i < 4))||((i > 4)&&(i < 10))){
                orbCollision(i);
            }
            //rock collision
            if(i > 9 && i < 18){
                eye = vec3(oldEye[0],oldEye[1],oldEye[2]);
                calculateAt(0,0);
            }
            //platform collision
            if(i > 17 && i < 33){
                isOnPlatform = false;
                platformCollision(i,position);
                
                if(isOnPlatform){
                    eye[1] = platformHeight;
                }
                else{
                    eye = vec3(oldEye[0],oldEye[1],oldEye[2]);
                    calculateAt(0,0);
                }
            }
        }
    }
    islanded();
    arenaBorders()
    return [xneg, xpos, yneg, ypos, zneg, zpos];
}
let platformHeight = 19;
let lives = 3;
function showLives(){
    document.getElementById("LivesDisplay").innerText = "lives: "+lives;
    if(lives == 0){
        alert("Game over! \n you died")
    }
}
let score = 0;
function showScore() {
    document.getElementById("ScoreDisplay").innerHTML = score;
    if(score==7){
        document.getElementById("WIN").innerHTML = "YOU WIN!!";
        stopBackgroundMusic();
    }
}
function orbCollision(i) {
    let move = shapes[i].translation
    move = mult(translate(1000,1000,1000),move)
    shapes[i].translation = move;
    score++;
    showScore();
}
function platformCollision(i,position){
    let PlatformCollisionDistance = shapes[i].collisionDistance;
    if(PlatformCollisionDistance[1]+position[1]-.2 < eye[1]){
        airborne = false;
        isOnPlatform = true;
        platformHeight = PlatformCollisionDistance[1]+position[1];
    }
        
}
function arenaBorders(){
    if(Math.abs(eye[0])>= 19){
        eye[0] = Math.sign(eye[0])*18.9;
    }
    if(Math.abs(eye[2])>= 19){
        eye[2] = Math.sign(eye[2])*18.9;
    }
    if(eye[1] < -19){
        eye[1] = -19;
    }
}
function gravity(){
    eye[1] -= T_STEP/4;
    calculateAt(0,0);
}
let airborne = false;
let isOnPlatform = false;
function jump() {
    if(!airborne){
        airborne = true;
        oldEye = vec3(eye[0],eye[1],eye[2]);
        eye[1] += 40*T_STEP;
        calculateAt(0,0);
    }
}
function islanded(){
    if(eye[1]==-19.025){
        airborne = false;
    }
}