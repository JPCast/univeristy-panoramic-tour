var gl = null; // WebGL context
var shaderProgram = null;
var triangleVertexPositionBuffer = null;
var triangleVertexColorBuffer = null;
// The GLOBAL transformation parameters
var globalAngleYY = 0.0;
var globalTz = 0.0;
// The local transformation parameters
// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;
// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;
// The scaling factors
var sx = 0.5;
var sy = 0.5;
var sz = 0.5;
// NEW - GLOBAL Animation controls
var globalRotationYY_ON = 1;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;
// NEW - Local Animation controls
var rotationXX_ON = 1;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;
var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
var rotationZZ_ON = 1;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;
// To allow choosing the way of drawing the model triangles
var primitiveType = null;
// To allow choosing the projection type
var projectionType = 0;
// For storing the vertices defining the triangles
var vertices = [
		// FRONT FACE
		-0.05, -0.05,  0.05,
		 0.05, -0.05,  0.05,
		 0.05,  0.05,  0.05,

		 0.05,  0.05,  0.05,		 
		-0.05,  0.05,  0.05,
		-0.05, -0.05,  0.05,
		
		// TOP FACE
		-0.05,  0.05,  0.05,
		 0.05,  0.05,  0.05,
		 0.05,  0.05, -0.05,

		 0.05,  0.05, -0.05,
		-0.05,  0.05, -0.05,
		-0.05,  0.05,  0.05,
		
		// BOTTOM FACE 
		-0.05, -0.05, -0.05,
		 0.05, -0.05, -0.05,
		 0.05, -0.05,  0.05,

		 0.05, -0.05,  0.05,
		-0.05, -0.05,  0.05,
		-0.05, -0.05, -0.05,
		
		// LEFT FACE 
		-0.05,  0.05,  0.05,		 
		-0.05, -0.05, -0.05,
		-0.05, -0.05,  0.05, 

		-0.05,  0.05,  0.05,
		-0.05,  0.05, -0.05,
		-0.05, -0.05, -0.05,
		
		// RIGHT FACE 
		 0.05,  0.05, -0.05,
		 0.05, -0.05,  0.05,
		 0.05, -0.05, -0.05,
		 
		 0.05,  0.05, -0.05,
		 0.05,  0.05,  0.05,
		 0.05, -0.05,  0.05,
		
		// BACK FACE 
		-0.05,  0.05, -0.05,
		 0.05, -0.05, -0.05,
		-0.05, -0.05, -0.05,
		 
		-0.05,  0.05, -0.05,
		 0.05,  0.05, -0.05,
		 0.05, -0.05, -0.05,			 
];

// And their colour

var colors = [
		 // FRONT FACE
		 1.00,  0.00,  0.00,
		 1.00,  0.00,  0.00,
		 1.00,  0.00,  0.00,
		 	
		 1.00,  1.00,  0.00,
		 1.00,  1.00,  0.00,
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE
		 0.00,  0.00,  0.00,
		 0.00,  0.00,  0.00,
		 0.00,  0.00,  0.00,
		 	
		 0.50,  0.50,  0.50,
		 0.50,  0.50,  0.50,
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE
		 0.00,  1.00,  0.00,
		 0.00,  1.00,  0.00,		 
		 0.00,  1.00,  0.00,

		 0.00,  1.00,  1.00,
		 0.00,  1.00,  1.00,
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE
		 0.00,  0.00,  1.00,
		 0.00,  0.00,  1.00,
		 0.00,  0.00,  1.00,
		 	
		 1.00,  0.00,  1.00, 
		 1.00,  0.00,  1.00,
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE
		 0.25,  0.50,  0.50,
		 0.25,  0.50,  0.50,
		 0.25,  0.50,  0.50,
		 	
		 0.50,  0.25,  0.00,
		 0.50,  0.25,  0.00,
		 0.50,  0.25,  0.00,
		 			 
		 // BACK FACE
		 0.25,  0.00,  0.75,
		 0.25,  0.00,  0.75,		 
		 0.25,  0.00,  0.75,

		 0.50,  0.35,  0.35,
		 0.50,  0.35,  0.35,
		 0.50,  0.35,  0.35,			 			 
];

function initBuffers() {	
	// Coordinates
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			
	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	// Colors
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			
	// Associating to the vertex shader	
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}

function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {
    // Pay attention to transformation order !!
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	// Drawing the contents of the vertex buffer
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	if( primitiveType == gl.LINE_LOOP ) {
		// To simulate wireframe drawing!
		// No faces are defined! There are no hidden lines!
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		var i;
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 		
	}	
}

function drawScene() {
	var pMatrix;
	var mvMatrix = mat4();
	// Clearing the frame-buffer and the depth-buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Computing the Projection Matrix
	if( projectionType == 0 ) {
		// For now, the default orthogonal view volume
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		// Global transformation !!
		globalTz = 0;
		// TO BE DONE !
		// Allow the user to control the size of the view volume
	}
	else {	
		// A standard view volume.
		// Viewer is at (0,0,0)
		// Ensure that the model is "inside" the view volume
		pMatrix = perspective( 45, 1, 0.05, 15 );
		// Global transformation !!
		globalTz = -2.5;
		// TO BE DONE !	
		// Allow the user to control the size of the view volume
	}
	// Passing the Projection Matrix to apply the current projection
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	mvMatrix = translationMatrix( 0, 0, globalTz );
	// Instantianting the current model
	drawModel( angleXX, angleYY, angleZZ, 
	           sx*0.25, sy*0.25, sz*0.25,
	           tx-0.25, ty+0.25, tz,
	           mvMatrix,
	           primitiveType );
	drawModel( angleXX, angleYY, angleZZ, 
	           sx*0.25, sy*0.25, sz*0.25,
	           tx+0.5, ty+0.25, tz,
	           mvMatrix,
	           primitiveType );
}

var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	if( lastTime != 0 ) {
		var elapsed = timeNow - lastTime;
		// Global rotation
		if( globalRotationYY_ON ) {
			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }
		// Local rotations
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

function tick() {
	requestAnimFrame(tick);
	drawScene();
	animate();
}

function initWebGL( canvas ) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		primitiveType = gl.TRIANGLES;
		gl.enable( gl.CULL_FACE );
		gl.cullFace( gl.BACK );
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function onDown() {
	cx = event.pageX;
	cy = event.pageY;
	if(cx > 0 && cy > 0) {
		window.location.href = "Picture Sphere.html";
	}
}

function getClickCanvas() {
	var cnvs = document.getElementById('my-canvas');
	//var context = cnvs.getContext('2d');
	cnvs.addEventListener('mousedown',onDown,false);
}

function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	initWebGL( canvas );
	shaderProgram = initShaders( gl );
	centroidRefinement( vertices, colors, 10 );
	moveToSphericalSurface( vertices );
	gl.enable( gl.CULL_FACE );
	gl.enable( gl.DEPTH_TEST );
	//initTexture();
	initBuffers();
	tick();
	getClickCanvas();
}


