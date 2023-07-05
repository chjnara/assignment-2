let gl;
let program;
let projectionMatrix;
let vertexCount = 36;
let modelViewMatrix;
let far = 1;
let right = 1;
let bottom = -1;
let ytop = 1;
let left= -1;
let near = -1;
let eye = [0, 0, 0.1];
let at = [0, 0, 0];
let up = [0, 1, 0];

let theta= 0.1; //gonna use for the rotation

onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('No webgl for you');
        return;
    }

    program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0.5);

    let vertices = [
        -1, -1, 1,
        -1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        -1, -1, -1,
        -1, 1, -1,
        1, 1, -1,
        1, -1, -1,
    ];

    let indices = [
        0, 3, 1,
        1, 3, 2,
        4, 7, 5,
        5, 7, 6,
        3, 7, 2,
        2, 7, 6,
        4, 0, 5,
        5, 0, 1,
        1, 2, 5,
        5, 2, 6,
        0, 3, 4,
        4, 3, 7,
    ];

    let colors = [
        0, 0, 0,
        0, 0, 1,
        0, 1, 0,
        0, 1, 1,
        1, 0, 0,
        1, 0, 1,
        1, 1, 0,
        1, 1, 1,
    ];

    // You should get rid of the line below eventually
    vertices = scale(0.5, vertices); 

    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);

    let iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

    render();
    document.addEventListener('keydown', handleKeyDown);
};


function render() { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let projection= ortho(left, right, bottom, ytop, near, far);
    let mvm = lookAt(eye, at, up);
    let modelViewProjectionMatrix= mult (projection, mvm);

    gl.uniformMatrix4fv(modelViewMatrix, false,
    flatten(modelViewProjectionMatrix));

    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}


function handleKeyDown(event)
 {
let zoomSpeed= 0.1;
    switch (event.key) {
       case't':
        eye= vec3(0, 1, 0);
        // for the top view
           break;
        case 'l':
            eye= vec3(-0.1, 0 , 0);
            //for the left view
            break;
        case 'f':
            eye= vec3(0, 0, 0.1);
            //for the front view
            break;
         case 'd':
                rotateCamera(theta);
                //for rotating the camera in the clockwise
            break;
        case 'a':
                rotateCamera(-theta);
                //for rotating the camera in the counter-clockwise
            break;   
        case 'i':
            projectionMatrix=mult(ortho(-1,1,-1,1-1,1), translate(0,0,-1))   ;
            //for the isometric view
            break;
        case 's' : //   for zooming out
        left = left - zoomSpeed;
            right = right + zoomSpeed;
                bottom = bottom - zoomSpeed;
                        ytop = ytop + zoomSpeed;
             break;
        case 'w': //for zooming in
        left = left + zoomSpeed;
            right = right - zoomSpeed;
                bottom = bottom + zoomSpeed;
                        ytop = ytop - zoomSpeed;
             break;
    }
    render();
}


function rotateCamera(angle) {

    let rotationMatrix = rotate(-angle, up);
    eye= multMat4Vec3(rotationMatrix, eye);

}


function multMat4Vec3(mat, vec) {
    let result =[];

    for(let i = 0; i<3; i++)
    {
        let sum=0;
        for (let j=0; j<3; j++)
        {
sum += mat[i][j] * vec[j];
        }
        result.push(sum);
    }

    return result;
}