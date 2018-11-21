//////////////////////////////////////////////////////////////////////////////
//
//  initShaders.js 
//
//	Getting, compiling and linking the vertex and the fragment shaders
//
//  J. Madeira - October 2015 / November 2015
//
//////////////////////////////////////////////////////////////////////////////


// Getting and compiling a shader

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

//----------------------------------------------------------------------------

// Initializing the shader program

function initShadersButtonsSpheres( gl ) {
    var fragmentShader = getShader(gl, "shader-fs-buttons-spheres");
    var vertexShader = getShader(gl, "shader-vs-buttons-spheres");

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	// Coordinates 
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);



    // Vertex Normals 
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    /*
	// NEW --- The matrices
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    */
    
	return shaderProgram;
}

function initShadersMap(gl) {
    var fragmentShader = getShader(gl, "shader-fs-map");
    var vertexShader = getShader(gl, "shader-vs-map");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    // Coordinates 
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // NEW --- Texture coordinates
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    // NEW --- The sampler
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    return shaderProgram;
}


function createShader( src, type ) {
	var shader = gl_360.createShader( type );

	gl_360.shaderSource( shader, src );
	gl_360.compileShader( shader );

	if ( !gl_360.getShaderParameter( shader, gl_360.COMPILE_STATUS ) ) {
		alert( ( type == gl_360.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl_360.getShaderInfoLog( shader ) );
		return null;
	}

	return shader;
}

function initShadersPanorama(gl) {
	vertex = document.getElementById('vs').textContent;
	fragment = document.getElementById('fs').textContent;

	var program = gl.createProgram();

	var vs = createShader( vertex, gl.VERTEX_SHADER );
	var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );

	if ( vs == null || fs == null ) return null;

	gl.attachShader( program, vs );
	gl.attachShader( program, fs );

	gl.deleteShader( vs );
	gl.deleteShader( fs );

	gl.linkProgram( program );

	if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
		alert( "ERROR:\n" +
		"VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
		"ERROR: " + gl.getError() + "\n\n" +
		"- Vertex Shader -\n" + vertex + "\n\n" +
		"- Fragment Shader -\n" + fragment );

		return null;
	}

	return program;
}

	

