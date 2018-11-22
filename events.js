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

    var deltaX = newX - lastMouseXCanvas360;

    angleYYPanoramaCanvas360 += radians(10 * deltaX)

    var deltaY = newY - lastMouseYCanvas360;

    angleXXPanoramaCanvas360 += radians(10 * deltaY)

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
        if ((posx > 623 && posx < 635) && (posy > 225 && posy < 619) && display_department.includes("DMAT")) {
            isDisplayingMap = false;
            initTexturePanorama(gl, 'Panorama', "Photos/DMAT-11(2).jpg");
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMAT-11(2).jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 606 && posx < 622) && (posy > 236 && posy < 645) && display_department.includes("DCPT")) {
            isDisplayingMap = false;
            initTexturePanorama(gl, 'Panorama', "Photos/DCPT-12.jpg");
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DCPT-12.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 577 && posx < 603) && (posy > 253 && posy < 264) && display_department.includes("DMEC")) {
            isDisplayingMap = false;
            initTexturePanorama(gl, 'Panorama', "Photos/DMEC-22.jpg");
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMEC-22.jpg");
            tzPanorama = 0.0;
        }
        else if ((posx > 549 && posx < 579) && (posy > 279 && posy < 291) && display_department.includes("DEC")) {
            isDisplayingMap = false;
            initTexturePanorama(gl, 'Panorama', "Photos/DEC-28.jpg");
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DEC-28.jpg");
            tzPanorama = 0.0;
        }

    } else {
        if ((posx < 100) && (posy < 100)) {
            isDisplayingMap = true;
            tzPanorama = 5.0;
        }
    }
    /*
    str = posx+", "+posy;
    alert(str);*/
}

function getClickCanvas() {
    var cnvs = document.getElementById('my-canvas');
    var context = cnvs.getContext('2d');
    cnvs.addEventListener('mousedown', onDown, false);
}