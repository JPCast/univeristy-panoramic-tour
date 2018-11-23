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
var isDisplayingMap = true;
var gl = null; // WebGL context
var gl_360 = null; // WebGL context
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
var tzButtonX = 0.0;
var tzPanorama = 5.0;
var tzPanoramaCanvas360 = 0.0;

// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The rotation angles in degrees of panorama photos
var angleXXPanorama = 0.0;
var angleYYPanorama = 0.0;
var angleZZPanorama = 0.0;

// The rotation angles in degrees of panorama photos in canvas 360
var angleXXPanoramaCanvas360 = 0.0;
var angleYYPanoramaCanvas360 = 0.0;
var angleZZPanoramaCanvas360 = 0.0;

// The scaling factors
var sx = 0.35;
var sy = 0.35;
var sz = 0.35;

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

var display_department = '';
var turn = 0;


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

function handleLoadedTexture(gl, texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function handleLoadedTexturePanorama(glTmp, texture) {

    glTmp.bindTexture(glTmp.TEXTURE_2D, texture);
    glTmp.pixelStorei(glTmp.UNPACK_FLIP_Y_WEBGL, true);
    glTmp.texImage2D(glTmp.TEXTURE_2D, 0, glTmp.RGBA, glTmp.RGBA, glTmp.UNSIGNED_BYTE, texture.image);
    glTmp.texParameteri(glTmp.TEXTURE_2D, glTmp.TEXTURE_MAG_FILTER, glTmp.LINEAR);
    glTmp.texParameteri(glTmp.TEXTURE_2D, glTmp.TEXTURE_MIN_FILTER, glTmp.LINEAR);
    glTmp.texParameteri(glTmp.TEXTURE_2D, glTmp.TEXTURE_WRAP_S, glTmp.CLAMP_TO_EDGE);
    glTmp.texParameteri(glTmp.TEXTURE_2D, glTmp.TEXTURE_WRAP_T, glTmp.CLAMP_TO_EDGE);
    glTmp.bindTexture(glTmp.TEXTURE_2D, null);
}

var webGLTextureMap;
function initTextureMap(gl) {
    gl.useProgram(shaderPrograms['Map']);
    webGLTextureMap = gl.createTexture();
    webGLTextureMap.image = new Image();
    webGLTextureMap.image.onload = function () {
        handleLoadedTexture(gl, webGLTextureMap)
    }
    webGLTextureMap.image.src = "universidade.jpg";
}

var webGLTexturePanorama;
function initTexturePanorama(glTmp, shaderName, picturePath) {
    glTmp.useProgram(shaderPrograms[shaderName]);
    webGLTexturePanorama = glTmp.createTexture();
    webGLTexturePanorama.image = new Image();
    webGLTexturePanorama.image.onload = function () {
        handleLoadedTexturePanorama(glTmp, webGLTexturePanorama)
    }
    webGLTexturePanorama.image.src = picturePath;
}

var webGLTexturePanoramaCanvas360;
function initTexturePanoramaCanvas360(glTmp, shaderName, picturePath) {
    glTmp.useProgram(shaderPrograms[shaderName]);
    webGLTexturePanoramaCanvas360 = glTmp.createTexture();
    webGLTexturePanoramaCanvas360.image = new Image();
    webGLTexturePanoramaCanvas360.image.onload = function () {
        handleLoadedTexturePanorama(glTmp, webGLTexturePanoramaCanvas360)
    }
    webGLTexturePanoramaCanvas360.image.src = picturePath;
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

function initBuffersButtonX() {
    gl.useProgram(shaderPrograms['ButtonsSpheres']);
    // Vertex Coordinates
    buttonXVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buttonXVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesXButton), gl.STATIC_DRAW);
    buttonXVertexPositionBuffer.itemSize = 3;
    buttonXVertexPositionBuffer.numItems = verticesXButton.length / 3;
    // Associating to the vertex shader
    gl.vertexAttribPointer(shaderPrograms['ButtonsSpheres'].vertexPositionAttribute,
        buttonXVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);



    // Vertex Normal Vectors
    buttonXVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buttonXVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsXButton), gl.STATIC_DRAW);
    buttonXVertexNormalBuffer.itemSize = 3;
    buttonXVertexNormalBuffer.numItems = normalsXButton.length / 3;
    // Associating to the vertex shader
    gl.vertexAttribPointer(shaderPrograms['ButtonsSpheres'].vertexNormalAttribute,
        buttonXVertexNormalBuffer.itemSize,
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
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndicesMap), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 6;
}

function initBuffersPanorama(glTmp) {
    glTmp.useProgram(shaderPrograms['Panorama']);
    // Coordinates
    panoramaVertexPositionBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaVertexPositionBuffer);
    glTmp.bufferData(glTmp.ARRAY_BUFFER, new Float32Array(verticesPanorama), glTmp.STATIC_DRAW);
    panoramaVertexPositionBuffer.itemSize = 3;
    panoramaVertexPositionBuffer.numItems = vertices.length / 3;;

    // Textures
    panoramaVertexTextureCoordBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaVertexTextureCoordBuffer);
    glTmp.bufferData(glTmp.ARRAY_BUFFER, new Float32Array(textureCoordsPanorama), glTmp.STATIC_DRAW);
    panoramaVertexTextureCoordBuffer.itemSize = 2;
    panoramaVertexTextureCoordBuffer.numItems = 4;

    // Vertex indices
    panoramaVertexIndexBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ELEMENT_ARRAY_BUFFER, panoramaVertexIndexBuffer);
    glTmp.bufferData(glTmp.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndicesPanorama), glTmp.STATIC_DRAW);
    panoramaVertexIndexBuffer.itemSize = 1;
    panoramaVertexIndexBuffer.numItems = vertexIndicesPanorama.length;
}

function initBuffersPanoramaCanvas360(glTmp) {
    glTmp.useProgram(shaderPrograms['PanoramaCanvas360']);
    // Coordinates
    panoramaCanvas360VertexPositionBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaCanvas360VertexPositionBuffer);
    glTmp.bufferData(glTmp.ARRAY_BUFFER, new Float32Array(verticesPanorama), glTmp.STATIC_DRAW);
    panoramaCanvas360VertexPositionBuffer.itemSize = 3;
    panoramaCanvas360VertexPositionBuffer.numItems = vertices.length / 3;;

    // Textures
    panoramaCanvas360VertexTextureCoordBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaCanvas360VertexTextureCoordBuffer);
    glTmp.bufferData(glTmp.ARRAY_BUFFER, new Float32Array(textureCoordsPanorama), glTmp.STATIC_DRAW);
    panoramaCanvas360VertexTextureCoordBuffer.itemSize = 2;
    panoramaCanvas360VertexTextureCoordBuffer.numItems = 4;

    // Vertex indices
    panoramaCanvas360VertexIndexBuffer = glTmp.createBuffer();
    glTmp.bindBuffer(glTmp.ELEMENT_ARRAY_BUFFER, panoramaCanvas360VertexIndexBuffer);
    glTmp.bufferData(glTmp.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndicesPanorama), glTmp.STATIC_DRAW);
    panoramaCanvas360VertexIndexBuffer.itemSize = 1;
    panoramaCanvas360VertexIndexBuffer.numItems = vertexIndicesPanorama.length;
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModelButtonsSpheres(angleXX, angleYY, angleZZ,
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

function drawModelButtonX(angleXX, angleYY, angleZZ,
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
    initBuffersButtonX();

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
        for (i = 0; i < buttonXVertexPositionBuffer.numItems / 3; i++) {
            gl.drawArrays(primitiveType, 3 * i, 3);
        }
    }
    else {
        gl.drawArrays(primitiveType, 0, buttonXVertexPositionBuffer.numItems);
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
    gl.bindTexture(gl.TEXTURE_2D, webGLTextureMap);
    gl.uniform1i(shaderPrograms['Map'].samplerUniform, 0);

    // The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS 
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawModelPanorama(glTmp, angleXX, angleYY, angleZZ,
    sx, sy, sz,
    tx, ty, tz,
    mvMatrix,
    pMatrix,
    primitiveType) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

    

    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));
    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));

    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    glTmp.useProgram(shaderPrograms['Panorama']);

    // Passing the Model View Matrix to apply the current transformation
    var mvUniform = glTmp.getUniformLocation(shaderPrograms['Panorama'], "uMVMatrix");
    glTmp.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the Projection Matrix to apply the current projection
    var pUniform = glTmp.getUniformLocation(shaderPrograms['Panorama'], "uPMatrix");
    glTmp.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // Passing the buffers
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaVertexPositionBuffer);
    glTmp.vertexAttribPointer(shaderPrograms['Panorama'].vertexPositionAttribute, panoramaVertexPositionBuffer.itemSize, glTmp.FLOAT, false, 0, 0);

    // NEW --- Textures
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaVertexTextureCoordBuffer);
    glTmp.vertexAttribPointer(shaderPrograms['Panorama'].textureCoordAttribute, panoramaVertexTextureCoordBuffer.itemSize, glTmp.FLOAT, false, 0, 0);
    glTmp.activeTexture(glTmp.TEXTURE0);
    glTmp.bindTexture(glTmp.TEXTURE_2D, webGLTexturePanorama);
    glTmp.uniform1i(shaderPrograms['Panorama'].samplerUniform, 0);

    // The vertex indices
    glTmp.bindBuffer(glTmp.ELEMENT_ARRAY_BUFFER, panoramaVertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS 
    glTmp.drawElements(glTmp.TRIANGLES, panoramaVertexIndexBuffer.numItems, glTmp.UNSIGNED_SHORT, 0);
}

function drawModelPanoramaCanvas360(glTmp, angleXXCanvas360, angleYYCanvas360, angleZZCanvas360,
    sx, sy, sz,
    tx, ty, tz,
    mvMatrix,
    pMatrix,
    primitiveType) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

    

    mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYYCanvas360));
    mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZCanvas360));
    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXXCanvas360));

    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    glTmp.useProgram(shaderPrograms['PanoramaCanvas360']);

    // Passing the Model View Matrix to apply the current transformation
    var mvUniform = glTmp.getUniformLocation(shaderPrograms['PanoramaCanvas360'], "uMVMatrix");
    glTmp.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the Projection Matrix to apply the current projection
    var pUniform = glTmp.getUniformLocation(shaderPrograms['PanoramaCanvas360'], "uPMatrix");
    glTmp.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // Passing the buffers
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaCanvas360VertexPositionBuffer);
    glTmp.vertexAttribPointer(shaderPrograms['PanoramaCanvas360'].vertexPositionAttribute, panoramaCanvas360VertexPositionBuffer.itemSize, glTmp.FLOAT, false, 0, 0);

    // NEW --- Textures
    glTmp.bindBuffer(glTmp.ARRAY_BUFFER, panoramaCanvas360VertexTextureCoordBuffer);
    glTmp.vertexAttribPointer(shaderPrograms['PanoramaCanvas360'].textureCoordAttribute, panoramaCanvas360VertexTextureCoordBuffer.itemSize, glTmp.FLOAT, false, 0, 0);
    glTmp.activeTexture(glTmp.TEXTURE0);
    glTmp.bindTexture(glTmp.TEXTURE_2D, webGLTexturePanoramaCanvas360);
    glTmp.uniform1i(shaderPrograms['PanoramaCanvas360'].samplerUniform, 0);

    // The vertex indices
    glTmp.bindBuffer(glTmp.ELEMENT_ARRAY_BUFFER, panoramaCanvas360VertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS 
    glTmp.drawElements(glTmp.TRIANGLES, panoramaCanvas360VertexIndexBuffer.numItems, glTmp.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

    var pMatrix;

    var mvMatrix = mat4();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl_360.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (projectionType == 0) {
        pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
        tz = 0;

        // NEW --- The viewer is on the ZZ axis at an indefinite distance
        pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
        pos_Viewer[2] = 1.0;
    }
    else {

        pMatrix = perspective(45, 1, 0.05, 10);
        tz = -2.25;

        // NEW --- The viewer is on (0,0,0)
        pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
        pos_Viewer[3] = 1.0;
    }

    if (display_department.includes("DMAT")) {
        // Instance --- Departamento de matemática
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.1, sy * 0.1, sz * 0.1,
            tx + 0.14, ty + 0.43, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DCPT")) {
        // Instance --- Departamento Território
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.11, sy * 0.11, sz * 0.11,
            tx + 0.10, ty + 0.35, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DMEC")) {
        // Instance --- Departamento mecanica
        drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,
            sx * 0.12, sy * 0.12, sz * 0.12,
            tx + 0.06, ty + 0.28, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DEC")) {
        // Instance --- Departamento ???
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,
            sx * 0.13, sy * 0.13, sz * 0.13,
            tx + 0.0, ty + 0.18, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DG")) {
        // Instance --- civil ???
        drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,  // CW rotations
            sx * 0.14, sy * 0.14, sz * 0.14,
            tx - 0.07, ty + 0.08, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("CCCI")) {
        // Instance --- Departamento ???
        drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,  // CW rotations
            sx * 0.15, sy * 0.15, sz * 0.15,
            tx - 0.16, ty - 0.08, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DEGEIT")) {
        // Instance --- Departamento de matemática
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.1, sy * 0.1, sz * 0.1,
            tx + 0.28, ty + 0.35, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("CICFANO")) {
        // Instance --- Departamento Território
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,  // CW rotations
            sx * 0.11, sy * 0.11, sz * 0.11,
            tx + 0.25, ty + 0.27, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DF")) {
        // Instance --- Departamento mecanica
        drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,
            sx * 0.12, sy * 0.12, sz * 0.12,
            tx + 0.20, ty + 0.16, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("CLT")) {
        // Instance --- Departamento ???
        drawModelButtonsSpheres(angleXX, -angleYY, -angleZZ,
            sx * 0.13, sy * 0.13, sz * 0.13,
            tx + 0.15, ty + 0.02, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    if (display_department.includes("DQ")) {
        // Instance --- civil ???
        drawModelButtonsSpheres(angleXX, -angleYY, angleZZ,  // CW rotations
            sx * 0.14, sy * 0.14, sz * 0.14,
            tx + 0.08, ty - 0.2, tz,
            mvMatrix,
            pMatrix,
            primitiveType);
    }

    // Map
    drawModelMap(0.0, 0.0, 0.0,
        sx, sy, sz,
        tx, ty, tz,
        mvMatrix,
        pMatrix,
        primitiveType);

    // Panorama
    drawModelPanorama(gl, -angleXXPanorama * Math.cos(radians(angleYYPanorama)), -angleYYPanorama, angleXXPanorama * Math.sin(radians(angleYYPanorama)),
        sx, sy, sz,
        tx, ty, tzPanorama,
        mvMatrix,
        pMatrix,
        primitiveType);

    // Panorama canvas 360
    drawModelPanoramaCanvas360(gl_360, -angleXXPanoramaCanvas360 * Math.cos(radians(angleYYPanoramaCanvas360)), -angleYYPanoramaCanvas360, angleXXPanoramaCanvas360 * Math.sin(radians(angleYYPanoramaCanvas360)),
        sx, sy, sz,
        tx, ty, tzPanoramaCanvas360,
        mvMatrix,
        pMatrix,
        primitiveType);

    drawModelButtonX(0.0, angleYY, 0.0,
        sx*0.007, sy*0.0125, sz*0.0125,
        tx - 0.037, ty + 0.035, tzPanorama-0.1,
        mvMatrix,
        pMatrix,
        primitiveType);
    //tx-0.148, ty+0.14, tzButtonX-0.4,
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {

    var timeNow = new Date().getTime();

    if (lastTime != 0) {

        var elapsed = timeNow - lastTime;

        if (rotationXX_ON) {

            angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
        }

        if (rotationYY_ON) {

            angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
        }

        if (rotationZZ_ON) {

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
        if (rotationYY_ON == 0) {
            rotationYY_ON = 1;
        }
        rotationYY_SPEED -= 0.25;
    }

    if (currentlyPressedKeys[39]) {
        // Right cursor key
        if (rotationYY_ON == 0) {
            rotationYY_ON = 1;
        }
        rotationYY_SPEED += 0.25;
    }

    if (currentlyPressedKeys[38]) {
        // Up cursor key
        if (rotationXX_ON == 0) {
            rotationXX_ON = 1;
        }
        rotationXX_SPEED -= 0.25;
    }

    if (currentlyPressedKeys[40]) {
        // Down cursor key
        if (rotationXX_ON == 0) {
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
}





function initWebGL(canvas) {
    try {

        // Create the WebGL context

        // Some browsers still need "experimental-webgl"

        var glTmp = canvas.getContext("webgl");

        // DEFAULT: The viewport occupies the whole canvas 

        // DEFAULT: The viewport background color is WHITE

        // NEW - Drawing the triangles defining the model

        primitiveType = glTmp.TRIANGLES;

        // DEFAULT: The Depth-Buffer is DISABLED

        // Enable it !

        glTmp.enable(glTmp.DEPTH_TEST);

        return glTmp;

    } catch (e) {
    }
    if (!glTmp) {
        alert("Could not initialise WebGL, sorry! :-(");
    }
}

function getValue() {
    if (turn == 1) {
        display_department = '';
    }
    var checks = document.getElementsByClassName('checks');
    for (i = 0; i < 11; i++) {
        if (checks[i].checked === true) {
            display_department += checks[i].value + " ";
        }
    }
    if (turn == 0) {
        turn = 1;
    }
}

//----------------------------------------------------------------------------
var shaderPrograms = [];
function runWebGL() {
    var checks = document.getElementsByClassName('checks');
    for (i = 0; i < 11; i++) {
        checks[i].checked = true;
        display_department += checks[i].value + " ";
    }

    var canvas = document.getElementById("my-canvas");
    var canvas_360 = document.getElementById("360-canvas");

    gl = initWebGL(canvas);
    gl_360 = initWebGL(canvas_360);

    shaderPrograms['ButtonsSpheres'] = initShadersButtonsSpheres(gl);
    shaderPrograms['Map'] = initShadersMap(gl);
    shaderPrograms['Panorama'] = initShadersPanorama(gl);
    shaderPrograms['PanoramaCanvas360'] = initShadersPanorama(gl_360);

    centroidRefinement(vertices, 6);
    moveToSphericalSurface(vertices);
    computeVertexNormals(vertices, normals);

    setEventListeners(canvas);
    setEventListenersCanvas360(canvas_360);

    initBuffersButtonsSpheres();
    initBuffersButtonX();
    initBuffersMap();
    initBuffersPanorama(gl);
    initBuffersPanoramaCanvas360(gl_360);

    initTextureMap(gl);
    //initTexturePanorama("Photos/DCPT-12.jpg"); Textura é inicializada ao clicar  numa esfera

    tick();		// A timer controls the rendering / animation  

    getClickCanvas();
}