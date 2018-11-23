var bellow_canvas = false;

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

    if (!mouseDown) {

        return;
    }

    // Rotation angles proportional to cursor displacement

    var newX = event.clientX;

    var newY = event.clientY;

    var deltaX = newX - lastMouseX;

    angleYYPanorama += radians(10 * deltaX)

    var deltaY = newY - lastMouseY;

    angleXXPanorama += radians(10 * deltaY)

    lastMouseX = newX

    lastMouseY = newY;
}

function setEventListeners(canvas) {

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;

}

var mouseDownCanvas360 = false;

var lastMouseXCanvas360 = null;

var lastMouseYCanvas360 = null;

function handleMouseDownCanvas360(event) {

    mouseDownCanvas360 = true;
    lastMouseXCanvas360 = event.clientX;
    lastMouseYCanvas360 = event.clientY;

    //console.log("lastMouseX: " + lastMouseXCanvas360);
    //console.log("lastMouseY: " + lastMouseYCanvas360);
}

function handleMouseUpCanvas360(event) {

    mouseDownCanvas360 = false;
}

function handleMouseMoveCanvas360(event) {

    if (!mouseDownCanvas360) {

        return;
    }

    // Rotation angles proportional to cursor displacement

    var newX = event.clientX;
    var newY = event.clientY;

    //console.log("newX: " + newX);
    //console.log("newY: " + newY);

    var deltaX = newX - lastMouseXCanvas360;

    angleYYPanoramaCanvas360 += radians(5 * deltaX)

    var deltaY = newY - lastMouseYCanvas360;

    angleXXPanoramaCanvas360 += radians(5 * deltaY)

    //console.log("angleXXPanoramaCanvas360: " + angleXXPanoramaCanvas360);
    //console.log("angleYYPanoramaCanvas360: " + angleYYPanoramaCanvas360);

    //console.log("Lixo: " + angleXXPanoramaCanvas360 * Math.sin(Math.PI * angleYYPanoramaCanvas360 / 180));

    //console.log("Sin: " + Math.sin(Math.PI * angleYYPanoramaCanvas360 / 180));

    lastMouseXCanvas360 = newX

    lastMouseYCanvas360 = newY;
}

function setEventListenersCanvas360(canvas) {
    canvas.onmousedown = handleMouseDownCanvas360;
    canvas.onmouseup = handleMouseUpCanvas360;
    canvas.onmousemove = handleMouseMoveCanvas360;
}

function onDown(event) {
    var cnvs = document.getElementById('my-canvas');
    var posy = event.pageY - cnvs.offsetTop;
    var posx = event.pageX - cnvs.offsetLeft;
    //console.log("x" + posx);
    //console.log("y" + posy);
    if (isDisplayingMap) {
        if ((posx > 643 && posx < 675) && (posy > 164 && posy < 180) && display_department.includes("DMAT")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DMAT-11(2).jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMAT-11(2).jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 611 && posx < 635) && (posy > 192 && posy < 205) && display_department.includes("DCPT")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DCPT-12.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DCPT-12.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 588 && posx < 629) && (posy > 216 && posy < 231) && display_department.includes("DMEC")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DMEC-22.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMEC-22.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("DEC")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DEC-28.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DEC-28.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 506 && posx < 550) && (posy > 280 && posy < 305) && display_department.includes("DG")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DG-16.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DG-16.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 447 && posx < 497) && (posy > 336 && posy < 365) && display_department.includes("CCCI")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/CCCI-40.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CCCI-40.jpg");
            tzPanorama = 0.0;
        }
        //new
        else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("DEGEIT")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DEGEIT-10.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DEGEIT-10.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 611 && posx < 635) && (posy > 192 && posy < 205) && display_department.includes("CICFANO")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/CICFANO-32.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CICFANO-32.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 588 && posx < 629) && (posy > 216 && posy < 231) && display_department.includes("DF")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DF-13.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DF-13.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("CLT")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/CLT-29.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CLT-29.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("DQ")) {
            isDisplayingMap = false;
            if(!bellow_canvas)
                initTexturePanorama(gl, 'Panorama', "Photos/DQ-15.jpg");
            else
                initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DQ-15.jpg");
            tzPanorama = 0.0;
        }

    } else {
        if ((posx < 100) && (posy < 100)) {
            isDisplayingMap = true;
            tzPanorama = 5.0;
        }
    }
    
    str = posx+", "+posy;
    alert(str);
}

function getClickCanvas() {
    var cnvs = document.getElementById('my-canvas');
    var context = cnvs.getContext('2d');
    cnvs.addEventListener('mousedown', onDown, false);
}