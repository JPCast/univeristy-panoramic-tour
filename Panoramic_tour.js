//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_28.js 
//
//  Applying a texture
//
//  Adapted from learningwebgl.com
//
//  J. Madeira - November 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context
var shaderProgram = null; 

// NEW --- Buffers
var triangleVertexPositionBuffer = null;
var triangleVertexIndexBuffer = null;
var triangleVertexTextureCoordBuffer;
var triangleVertexColorBuffer = null;

// The GLOBAL transformation parameters
var globalAngleYY = 0.0;
var globalTz = 0.0;

// GLOBAL Animation controls
var globalRotationYY_ON = 0;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 0.25;
var sy = 0.25;
var sz = 0.25;

// NEW - Animation controls
var rotationXX_ON = 0;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;
var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
var rotationZZ_ON = 0;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles
var primitiveType = null;
 
// To allow choosing the projection type
var projectionType = 1;

// NEW --- The viewer position
// It has to be updated according to the projection type
var pos_Viewer = [0.0, 0.0, 0.0, 1.0];

// NEW --- Point Light Source Features
// Directional --- Homogeneous coordinate is ZERO
var pos_Light_Source = [-5.0, 3.0, 1.0, 1.0];

// White light
var int_Light_Source = [1.0, 1.0, 1.0];

// Low ambient illumination
var ambient_Illumination = [0.3, 0.3, 0.3];
/*
// NEW --- Model Material Features
// Ambient coef.
var kAmbi = [0.2, 0.2, 0.2];

// Diffuse coef.
var kDiff = [0.6, 0.0, 0.6];

// Specular coef.
var kSpec = [0.7, 0.7, 0.7];

// Phong coef.
var nPhong = 100;
*/
// NEW --- Model Material Features
// Ambient coef.
var kAmbi = [0.0, 0.2, 1.0];

// Diffuse coef.
var kDiff = [0.5, 0.8, 1.0];

// Specular coef.
var kSpec = [1.0, 1.0, 1.0];

// Phong coef.
var nPhong = 125.0;
 
// From learningwebgl.com

// Initial model has just TWO TRIANGLES

var vertices = [
    // FRONT FACE
    -0.05, -0.05, 0.05,
    0.05, -0.05, 0.05,
    0.05, 0.05, 0.05,

    0.05, 0.05, 0.05,
    -0.05, 0.05, 0.05,
    -0.05, -0.05, 0.05,

    // TOP FACE
    -0.05, 0.05, 0.05,
    0.05, 0.05, 0.05,
    0.05, 0.05, -0.05,

    0.05, 0.05, -0.05,
    -0.05, 0.05, -0.05,
    -0.05, 0.05, 0.05,

    // BOTTOM FACE 
    -0.05, -0.05, -0.05,
    0.05, -0.05, -0.05,
    0.05, -0.05, 0.05,

    0.05, -0.05, 0.05,
    -0.05, -0.05, 0.05,
    -0.05, -0.05, -0.05,

    // LEFT FACE 
    -0.05, 0.05, 0.05,
    -0.05, -0.05, -0.05,
    -0.05, -0.05, 0.05,

    -0.05, 0.05, 0.05,
    -0.05, 0.05, -0.05,
    -0.05, -0.05, -0.05,

    // RIGHT FACE 
    0.05, 0.05, -0.05,
    0.05, -0.05, 0.05,
    0.05, -0.05, -0.05,

    0.05, 0.05, -0.05,
    0.05, 0.05, 0.05,
    0.05, -0.05, 0.05,

    // BACK FACE 
    -0.05, 0.05, -0.05,
    0.05, -0.05, -0.05,
    -0.05, -0.05, -0.05,

    -0.05, 0.05, -0.05,
    0.05, 0.05, -0.05,
    0.05, -0.05, -0.05,
];


var normals = [

    // FRONTAL TRIANGLES
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
];

var verticesMap = [
    // Front face
    -2.90, -2.90, 0,
    2.90, -2.90, 0,
    2.90, 2.90, 0,
    -2.90, 2.90, 0,
];

var textureCoordsMap = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

var cubeVertexIndicesMap = [
    0, 1, 2, 0, 2, 3,    // Front face
];

var display_department = '';
var turn = 0;
var set = 0;
         
         
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures

// From www.learningwebgl.com

function handleLoadedTexture(texture) {
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;

function initTexture() {

    webGLTexture = gl.createTexture();
    webGLTexture.image = new Image();
    webGLTexture.image.onload = function () {
        handleLoadedTexture(webGLTexture)
    }
    webGLTexture.image.src = "universidade.jpg";
}

//----------------------------------------------------------------------------

// Handling the Buffers

function initBuffersButtonsSpheres() {
    gl.useProgram(shaderPrograms['ButtonsSpheres']);
    // Vertex Coordinates
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = vertices.length / 3;
    // Associating to the vertex shader
    gl.vertexAttribPointer(shaderPrograms['ButtonsSpheres'].vertexPositionAttribute,
        triangleVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);



    // Vertex Normal Vectors
    triangleVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    triangleVertexNormalBuffer.itemSize = 3;
    triangleVertexNormalBuffer.numItems = normals.length / 3;
    // Associating to the vertex shader
    gl.vertexAttribPointer(shaderPrograms['ButtonsSpheres'].vertexNormalAttribute,
        triangleVertexNormalBuffer.itemSize,
        gl.FLOAT, false, 0, 0);
}

function initBuffersMap() {
    gl.useProgram(shaderPrograms['Map']);
    // Coordinates
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesMap), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 4;

    // Textures
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordsMap), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 4;

    // Vertex indices
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndicesMap), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 6;
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModelButtonsSpheres( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
                    mvMatrix, 
                    pMatrix,
					primitiveType ) {
    // Pay attention to transformation order !!
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );

    gl.useProgram(shaderPrograms['ButtonsSpheres']);
	// Passing the Model View Matrix to apply the current transformation
    var mvUniform = gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the Projection Matrix to apply the current projection
    var pUniform = gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // Multiplying the reflection coefficents
    var ambientProduct = mult(kAmbi, ambient_Illumination);
    var diffuseProduct = mult(kDiff, int_Light_Source);
    var specularProduct = mult(kSpec, int_Light_Source);

    // Associating the data to the vertex shader
    // This can be done in a better way !!
    // Vertex Coordinates and Vertex Normal Vectors
    initBuffersButtonsSpheres();

    // Partial illumonation terms and shininess Phong coefficient
    gl.uniform3fv(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform3fv(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "diffuseProduct"),
        flatten(diffuseProduct));
    gl.uniform3fv(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "specularProduct"),
        flatten(specularProduct));
    gl.uniform1f(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "shininess"),
        nPhong);

    // NEW --- Passing the viewer position to the vertex shader
    gl.uniform4fv(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "viewerPosition"),
        flatten(pos_Viewer));

    //Position of the Light Source
    gl.uniform4fv(gl.getUniformLocation(shaderPrograms['ButtonsSpheres'], "lightPosition"),
        flatten(pos_Light_Source));

    // Drawing 
    // primitiveType allows drawing as filled triangles / wireframe / vertices
    if (primitiveType == gl.LINE_LOOP) {
        // To simulate wireframe drawing!
        // No faces are defined! There are no hidden lines!
        // Taking the vertices 3 by 3 and drawing a LINE_LOOP
        var i;
        for (i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++) {
            gl.drawArrays(primitiveType, 3 * i, 3);
        }
    }
    else {
        gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);
    }
}

function drawModelMap(angleXX, angleYY, angleZZ,
    sx, sy, sz,
    tx, ty, tz,
    mvMatrix,
    pMatrix,
    primitiveType) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));

    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));

    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));

    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    gl.useProgram(shaderPrograms['Map']);

    // Passing the Model View Matrix to apply the current transformation
    var mvUniform = gl.getUniformLocation(shaderPrograms['Map'], "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the Projection Matrix to apply the current projection
    var pUniform = gl.getUniformLocation(shaderPrograms['Map'], "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // Passing the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderPrograms['Map'].vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // NEW --- Textures
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderPrograms['Map'].textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
    gl.uniform1i(shaderPrograms['Map'].samplerUniform, 0);

    // The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS 
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if( projectionType == 0 ) {
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
        tz = 0;

        // NEW --- The viewer is on the ZZ axis at an indefinite distance
        pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
        pos_Viewer[2] = 1.0; 
	}
	else {	
		
		pMatrix = perspective( 45, 1, 0.05, 10 );
        tz = -2.25;

        // NEW --- The viewer is on (0,0,0)
        pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
        pos_Viewer[3] = 1.0;  
	}

    if(display_department.includes("DMAT")){
        // Instance --- Departamento de matemática
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.1, sy * 0.1, sz * 0.1,
            tx + 0.1, ty + 0.30, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if(display_department.includes("DCPT")){
        // Instance --- Departamento Território
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.11, sy * 0.11, sz * 0.11,
            tx + 0.07, ty + 0.25, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if(display_department.includes("DMEC")){
    	// Instance --- Departamento mecanica
    	drawModelButtonsSpheres( angleXX, -angleYY, angleZZ, 
            sx * 0.12, sy * 0.12, sz * 0.12,
    	           tx + 0.03, ty + 0.20, tz,
            mvMatrix,
            pMatrix,
    	           primitiveType );
    }
	
    if(display_department.includes("DEG")){
        // Instance --- Departamento ???
        drawModelButtonsSpheres( angleXX, -angleYY, -angleZZ, 
            sx * 0.13, sy * 0.13, sz * 0.13,
                   tx - 0.02, ty + 0.12, tz,
            mvMatrix,
            pMatrix,
                   primitiveType );
    }

    // Instance --- civil ???
    drawModelButtonsSpheres( angleXX, -angleYY, angleZZ,  // CW rotations
        sx * 0.14, sy * 0.14, sz * 0.14,
               tx - 0.08, ty + 0.04, tz,
        mvMatrix,
               pMatrix,
        primitiveType);

    // Instance --- Departamento ???
    drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,  // CW rotations
        sx * 0.15, sy * 0.15, sz * 0.15,
        tx - 0.16, ty - 0.08, tz,
        mvMatrix,
        pMatrix,
        primitiveType);

    // Map
    drawModelMap(0.0, 0.0, 0.0,
        sx, sy, sz,
        tx, ty, tz,
        mvMatrix,
        pMatrix,
        primitiveType);
	           
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		if( rotationXX_ON ) {

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
	    }
	}
	
	lastTime = timeNow;
}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

function handleKeys() {
	if (currentlyPressedKeys[33]) {
		// Page Up
		sx *= 0.9;
		sz = sy = sx;
	}

	if (currentlyPressedKeys[34]) {	
		// Page Down
		sx *= 1.1;
		sz = sy = sx;
	}

	if (currentlyPressedKeys[37]) {	
		// Left cursor key
		if( rotationYY_ON == 0 ) {
			rotationYY_ON = 1;
		}  
		rotationYY_SPEED -= 0.25;
	}

	if (currentlyPressedKeys[39]) {	
		// Right cursor key
		if( rotationYY_ON == 0 ) {
			rotationYY_ON = 1;
		}  
		rotationYY_SPEED += 0.25;
	}

	if (currentlyPressedKeys[38]) {
		// Up cursor key
		if( rotationXX_ON == 0 ) {
			rotationXX_ON = 1;
		}  	
		rotationXX_SPEED -= 0.25;
	}

	if (currentlyPressedKeys[40]) {
		// Down cursor key
		if( rotationXX_ON == 0 ) {
			rotationXX_ON = 1;
		}  
		rotationXX_SPEED += 0.25;
	}
}

// Timer

function tick() {
	requestAnimFrame(tick);
	// NEW --- Processing keyboard events 
	handleKeys();
    drawScene();
	animate();
    if(set){
        handleMouse();
        render();
    }
}

function setEventListeners( canvas ){

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    /*document.getElementById("reset-button").onclick = function(){
        clearPanorama();
        set = 0;
    };      */
}

function onDown(event) {
    var cnvs = document.getElementById('my-canvas');
    var posy = event.pageY - cnvs.offsetTop;
    var posx = event.pageX - cnvs.offsetLeft;
	if((posx > 623 && posx < 635) && (posy > 225 && posy < 619)) {
		//window.location.href = "Picture Sphere.html";
        set = 1;
		run_panoramic_view("Photos/DMAT-11(2).jpg");
	}
    else if((posx > 606 && posx < 622) && (posy > 236 && posy < 645)) {
        //window.location.href = "Picture Sphere.html";
        set = 1;
        run_panoramic_view("Photos/DCPT-12.jpg");
    }
    else if((posx > 577 && posx < 603) && (posy > 253 && posy < 264)) {
        //window.location.href = "Picture Sphere.html";
        set = 1;
        run_panoramic_view("Photos/DMEC-22.jpg");
    }
    else if((posx > 549 && posx < 579) && (posy > 279 && posy < 291)) {
        //window.location.href = "Picture Sphere.html";
        set = 1;
        run_panoramic_view("Photos/DEC-28.jpg");
    }
    /*
    str = posx+", "+posy;
    alert(str);*/
}

function getClickCanvas() {
	var cnvs = document.getElementById('my-canvas');
	var context = cnvs.getContext('2d');
	cnvs.addEventListener('mousedown',onDown,false);
}

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: The Depth-Buffer is DISABLED
		
		// Enable it !
		
		gl.enable( gl.DEPTH_TEST );
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function getValue(){
    if(turn==1){
        display_department = '';
    }
    var checks = document.getElementsByClassName('checks');
    for ( i = 0; i < 4; i++) {
        if ( checks[i].checked === true ) {
            display_department += checks[i].value + " ";
        }
    }
    if(turn==0){
        turn = 1;
    }
}

//----------------------------------------------------------------------------
var shaderPrograms = [];
function runWebGL() {
    var checks = document.getElementsByClassName('checks');
    for ( i = 0; i < 4; i++) {
        checks[i].checked = true;
        display_department += checks[i].value + " ";
    }

	var canvas = document.getElementById("my-canvas");
	initWebGL( canvas );
    shaderPrograms['ButtonsSpheres'] = initShadersButtonsSpheres(gl);
    shaderPrograms['Map'] = initShadersMap(gl);

    centroidRefinement(vertices, 6);
    moveToSphericalSurface(vertices);
    computeVertexNormals(vertices, normals);

    setEventListeners(canvas);
    initBuffersButtonsSpheres();
    initBuffersMap();
	initTexture();
	tick();		// A timer controls the rendering / animation  
	getClickCanvas();
}


