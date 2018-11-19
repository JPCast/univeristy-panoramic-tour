var canvas_360, 
gl_360, 
picture, picture_texture,
buffer, 
vertex_shader, fragment_shader, currentProgram,
vertex_position, 
parameters = {	start_time	: new Date().getTime(), 
				time		: 0, 
				screenWidth	: 0, 
				screenHeight: 0 },
currentlyDragging = false,
currentDragX = 0, currentDragY = 0,
startDragX = 0, startDragY = 0,
xSpeed = 0, ySpeed = 0,
yaw = 0, pitch = 0, fov = 80;

function init(preview_url) {
	//picture = document.querySelector( 'picture' );

    //picture.src = preview_url;			

	canvas_360 = document.getElementById("360-canvas");
					
	vertex_shader = document.getElementById('vs').textContent;
	fragment_shader = document.getElementById('fs').textContent;				
	
	// Initialise WebGL
	try {
		gl_360 = canvas_360.getContext( 'experimental-webgl' );
	} catch( error ) { }

	if ( !gl_360 ) {
		throw "cannot create webgl context";
	}

	// Create Vertex buffer (2 triangles)
	buffer = gl_360.createBuffer();
	gl_360.bindBuffer( gl_360.ARRAY_BUFFER, buffer );
	gl_360.bufferData( gl_360.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl_360.STATIC_DRAW );

	// Create texture for picture
	createTexture( preview_url );

	// Create Program
	currentProgram = createProgram( vertex_shader, fragment_shader );

	handleResize();
	window.addEventListener( 'resize', handleResize, false );
	
	// Initialise interaction
	canvas_360.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	canvas_360.onmousemove = handleMouseMove;
	canvas_360.ondblclick = handleDoubleClick;				
}

function render() {
	if ( !currentProgram ) return;

	parameters.time = new Date().getTime() - parameters.start_time;

	gl_360.clear( gl_360.COLOR_BUFFER_BIT | gl_360.DEPTH_BUFFER_BIT );

	// Load program into GPU
	gl_360.useProgram( currentProgram );
	
	gl_360.bindTexture(gl_360.TEXTURE_2D, picture_texture);

	// Set values to program variables
    gl_360.uniform2f(gl_360.getUniformLocation(currentProgram, 'resolution'), parameters.screenWidth, parameters.screenHeight);
    gl_360.uniform1f(gl_360.getUniformLocation(currentProgram, 'fov'), 80);

    gl_360.uniform1f(gl_360.getUniformLocation(currentProgram, 'yaw'), yaw);        // ao eliminar não dá para mexer para os lados
	gl_360.uniform1f( gl_360.getUniformLocation( currentProgram, 'pitch' ), -pitch );	// ao eliminar não dá para mexer para cima ou para baixo

	// Render geometry
	gl_360.bindBuffer( gl_360.ARRAY_BUFFER, buffer );
	gl_360.vertexAttribPointer( vertex_position, 2, gl_360.FLOAT, false, 0, 0 );
	gl_360.enableVertexAttribArray( vertex_position );
	gl_360.drawArrays( gl_360.TRIANGLES, 0, 6 );
	gl_360.disableVertexAttribArray( vertex_position );
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


function createProgram( vertex, fragment ) {

	var program = gl_360.createProgram();

	var vs = createShader( vertex, gl_360.VERTEX_SHADER );
	var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl_360.FRAGMENT_SHADER );

	if ( vs == null || fs == null ) return null;

	gl_360.attachShader( program, vs );
	gl_360.attachShader( program, fs );

	gl_360.deleteShader( vs );
	gl_360.deleteShader( fs );

	gl_360.linkProgram( program );

	if ( !gl_360.getProgramParameter( program, gl_360.LINK_STATUS ) ) {
		alert( "ERROR:\n" +
		"VALIDATE_STATUS: " + gl_360.getProgramParameter( program, gl_360.VALIDATE_STATUS ) + "\n" +
		"ERROR: " + gl_360.getError() + "\n\n" +
		"- Vertex Shader -\n" + vertex + "\n\n" +
		"- Fragment Shader -\n" + fragment );

		return null;
	}

	return program;
}


function createTexture( image_src ) {
	picture_texture = gl_360.createTexture();
	picture_texture.image = new Image();
	
	picture_texture.image.onload = function() {
		gl_360.bindTexture(gl_360.TEXTURE_2D, picture_texture);
		gl_360.pixelStorei(gl_360.UNPACK_FLIP_Y_WEBGL, true);
		gl_360.texImage2D(gl_360.TEXTURE_2D, 0, gl_360.RGBA, gl_360.RGBA, gl_360.UNSIGNED_BYTE, picture_texture.image);
		gl_360.texParameteri(gl_360.TEXTURE_2D, gl_360.TEXTURE_MAG_FILTER, gl_360.LINEAR);
		gl_360.texParameteri(gl_360.TEXTURE_2D, gl_360.TEXTURE_MIN_FILTER, gl_360.LINEAR);
		gl_360.texParameteri(gl_360.TEXTURE_2D, gl_360.TEXTURE_WRAP_S, gl_360.CLAMP_TO_EDGE);
		gl_360.texParameteri(gl_360.TEXTURE_2D, gl_360.TEXTURE_WRAP_T, gl_360.CLAMP_TO_EDGE);
		gl_360.bindTexture(gl_360.TEXTURE_2D, null);
	}

	picture_texture.image.src = image_src;
}



function handleResize( event ) {
	//The next two lines resize the canvas_360 to the whole windows size
	canvas_360.width = window.innerWidth;
	canvas_360.height = window.innerHeight;

	parameters.screenWidth = canvas_360.width;
	parameters.screenHeight = canvas_360.height;

	gl_360.viewport( 0, 0, canvas_360.width, canvas_360.height );
}


function handleDoubleClick(event) {
	var isInFullScreen = (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen);
	if(!isInFullScreen) {
		if (canvas_360.requestFullscreen) {
			canvas_360.requestFullscreen();
		} else if (canvas_360.mozRequestFullScreen) {
			canvas_360.mozRequestFullScreen();
		} else if (canvas_360.webkitRequestFullscreen) {
			canvas_360.webkitRequestFullscreen();
		}			
	} else {
		if(document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}


function handleMouseDown(event) {
	startDragX = event.clientX;
	startDragY = event.clientY;

	currentDragX = event.clientX;
	currentDragY = event.clientY;
	currentlyDragging = true;
	return false;
}


function handleMouseUp(event) {
	currentlyDragging = false;
	return false;
}


function handleMouseMove(event) {
	if(currentlyDragging) {
		currentDragX = event.clientX;
		currentDragY = event.clientY;
	}
	return false;
}


function handleMouse() {
	if (currentlyDragging) {
		xSpeed = (currentDragX - startDragX) / 100;
		ySpeed = (currentDragY - startDragY) / 100;	
	}else {
		xSpeed *= 0.8;
		ySpeed *= 0.8;
	}
	
	yaw += xSpeed;
	pitch += ySpeed;
}

function run_panoramic_view() {
	init("Photos/DMAT-11(2).jpg"); //names have changed meanwhile
}