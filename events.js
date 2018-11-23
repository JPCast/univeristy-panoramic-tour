var toggle;

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
    toggle = document.getElementById('toggle-switch');
    var cnvs = document.getElementById('my-canvas');
    var posy = event.pageY - cnvs.offsetTop;
    var posx = event.pageX - cnvs.offsetLeft;
    //console.log("x" + posx);
    //console.log("y" + posy);

    if(!toggle.checked){
        if (isDisplayingMap) {
            if ((posx > 643 && posx < 675) && (posy > 164 && posy < 180) && display_department.includes("DMAT")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DMAT-11(2).jpg");
                tzPanorama = 0.0;
            }
            else if ((posx > 611 && posx < 640) && (posy > 192 && posy < 205) && display_department.includes("DCPT")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DCPT-12.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 588 && posx < 629) && (posy > 216 && posy < 231) && display_department.includes("DMEC")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DMEC-22.jpg");
                tzPanorama = 0.0;
            }
            else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("DEC")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DEC-28.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 506 && posx < 550) && (posy > 280 && posy < 305) && display_department.includes("DG")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DG-16.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 447 && posx < 497) && (posy > 336 && posy < 365) && display_department.includes("CCCI")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/CCCI-40.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 730 && posx < 762) && (posy > 191 && posy < 209) && display_department.includes("DEGEIT")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DEGEIT-10.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 710 && posx < 745) && (posy > 220 && posy < 232) && display_department.includes("CICFANO")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/CICFANO-32.jpg");
                tzPanorama = 0.0;
            }
            else if ((posx > 673 && posx < 713) && (posy > 255 && posy < 271) && display_department.includes("DF")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DF-13.png");
                tzPanorama = 0.0;
            }
            else if ((posx > 643 && posx < 682) && (posy > 305 && posy < 325) && display_department.includes("CLT")) {
                isDisplayingMap = false;
                tzPanorama = 0.0;
                initTexturePanorama(gl, 'Panorama', "Photos/CLT-29.png");
            }
            else if ((posx > 599 && posx < 645) && (posy > 382 && posy < 405) && display_department.includes("DQ")) {
                isDisplayingMap = false;
                initTexturePanorama(gl, 'Panorama', "Photos/DQ-15.png");
                tzPanorama = 0.0;
            }
        }
        else {
            if ((posx < 100) && (posy < 100)) {
                isDisplayingMap = true;
                tzPanorama = 5.0;
            }
        }
    } else {
        document.getElementById("360 view").innerHTML = "360 degrees View";
        if ((posx > 643 && posx < 675) && (posy > 164 && posy < 180) && display_department.includes("DMAT")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMAT-11(2).jpg");
        }
        else if ((posx > 611 && posx < 640) && (posy > 192 && posy < 205) && display_department.includes("DCPT")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DCPT-12.png");
        }
        else if ((posx > 588 && posx < 629) && (posy > 216 && posy < 231) && display_department.includes("DMEC")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DMEC-22.jpg");
        }
        else if ((posx > 553 && posx < 589) && (posy > 250 && posy < 270) && display_department.includes("DEC")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DEC-28.png");
        }
        else if ((posx > 506 && posx < 550) && (posy > 280 && posy < 305) && display_department.includes("DG")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DG-16.png");
        }
        else if ((posx > 447 && posx < 497) && (posy > 336 && posy < 365) && display_department.includes("CCCI")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CCCI-40.png");
        }
        else if ((posx > 730 && posx < 762) && (posy > 191 && posy < 209) && display_department.includes("DEGEIT")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DEGEIT-10.png");
        }
        else if ((posx > 710 && posx < 745) && (posy > 220 && posy < 232) && display_department.includes("CICFANO")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CICFANO-32.jpg");
        }
        else if ((posx > 673 && posx < 713) && (posy > 255 && posy < 271) && display_department.includes("DF")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DF-13.png");
        }
        else if ((posx > 643 && posx < 682) && (posy > 305 && posy < 325) && display_department.includes("CLT")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/CLT-29.png");
        }
        else if ((posx > 599 && posx < 645) && (posy > 382 && posy < 405) && display_department.includes("DQ")) {
            initTexturePanoramaCanvas360(gl_360, 'PanoramaCanvas360', "Photos/DQ-15.png");
        }
    }
    /*
    str = posx+", "+posy;
    alert(str);
    */
}

function getClickCanvas() {
    var cnvs = document.getElementById('my-canvas');
    var context = cnvs.getContext('2d');
    cnvs.addEventListener('mousedown', onDown, false);
}