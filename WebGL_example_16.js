//----------------------------------------------------------------------------
//
// Global Variables
//
var gl = null; // WebGL context
var shaderProgram = null; 
var triangleVertexPositionBuffer = null;
var triangleVertexColorBuffer = null;
// The global transformation parameters
// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;
// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;
// The scaling factors
var sx = 1.0;
var sy = 1.0;
var sz = 1.0;
// NEW - To allow choosing the way of drawing the model triangles
var primitiveType = null;
// For storing the vertices defining the triangles

var vertices = [
		// FRONT FACE
		-0.5, -0.5,  0.5,
		 0.5, -0.5,  0.5,
		 0.5,  0.5,  0.5,

		 0.5,  0.5,  0.5,
		-0.5,  0.5,  0.5,
		-0.5, -0.5,  0.5,			 
];



var colors = [
		 // FRONT FACE
		 1.00,  0.00,  0.00,
		 1.00,  0.00,  0.00,
		 1.00,  0.00,  0.00,
		 	
		 1.00,  1.00,  0.00,
		 1.00,  1.00,  0.00,
		 1.00,  1.00,  0.00,
];


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

function handleLoadedTexture(texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

var webGLTexture;

function initTexture() {
	webGLTexture1 = gl.createTexture();
	webGLTexture1.image = new Image();
	webGLTexture1.image.onload = function () {
		handleLoadedTexture(webGLTexture1)
	}
	webGLTexture1.image.src = "alameda.gif";
}


// Handling the Vertex and the Color Buffers

function initBuffers() {	
	// Coordinates
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	// triangleVertexPositionBuffer.numItems = vertices.length / 3;
	triangleVertexPositionBuffer.numItems = 6;

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

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	var mvMatrix = mult( rotationZZMatrix( angleZZ ), 
						 scalingMatrix( sx, sy, sz ) );
	mvMatrix = mult( rotationYYMatrix( angleYY ), mvMatrix );
	mvMatrix = mult( rotationXXMatrix( angleXX ), mvMatrix );
	mvMatrix = mult( translationMatrix( tx, ty, tz ), mvMatrix );
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	if(primitiveType == gl.LINE_LOOP) {  
		var i = 0;
		while(i<triangleVertexPositionBuffer.numItems){
			gl.drawArrays(primitiveType, i, 3);
			i += 3;
		}
	}	
	else {
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
	}       
}

function outputInfos(){
		
}


//----------------------------------------------------------------------------
// Handling mouse events
// Adapted from www.learningwebgl.com
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
	var primType = document.getElementById("title");
	primType.innerHTML = "Inicio";
    /*if (!mouseDown) {
	  
      return;
    } */
    primType.innerHTML = "here";
    // Rotation angles proportional to cursor displacement
    var newX = event.clientX;
    var newY = event.clientY;
    var deltaX = newX - lastMouseX;
    angleYY += radians( 10 * deltaX  )
    var deltaY = newY - lastMouseY;
    angleXX += radians( 10 * deltaY  )
    lastMouseX = newX
    lastMouseY = newY;
    drawScene();
  }

function setEventListeners(canvas){
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
	document.getElementById("scale-up-button").onclick = function(){
		// Updating
		sx *= 1.1;
		sy *= 1.1;
		sz *= 1.1;
		// Render the viewport
		drawScene();  
	};      

	document.getElementById("scale-down-button").onclick = function(){
		// Updating
		sx *= 0.9;
		sy *= 0.9;
		sz *= 0.9;
		// Render the viewport
		drawScene();  
	};

	document.getElementById("reset-button").onclick = function(){
		// The initial values
		tx = 0.0;
		ty = 0.0;
		tz = 0.0;
		angleXX = 0.0;
		angleYY = 0.0;
		angleZZ = 0.0;
		sx = 1.0;
		sy = 1.0;
		sz = 1.0;
		// Render the viewport
		drawScene();  
	};    
}

function initWebGL( canvas ) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		primitiveType = gl.TRIANGLES;		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	initWebGL( canvas );
	shaderProgram = initShaders( gl );
	setEventListeners(canvas);
	initBuffers();
	initTexture();
	drawScene();    
	outputInfos();
}


