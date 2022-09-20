//Get the data attribute from the label (in the handlebar). If there is an error, it will contain the neccessary keyword for the canvas css classs
let sigMissing = $(".signature").data("error");

// Create a canvas with the css class if available (red border)
$("#label-for-canvas").after(`<canvas id="sigField" name="sigField" class="canvas ${sigMissing}"></canvas>`);

// Get and set the dimensions of the canvas according to the main container (times 2 for higher internal canvas resolution)
let canvas = document.getElementById("sigField");
let container = document.getElementsByClassName("container");
canvas.width = 2*(container[0].offsetWidth*0.82);
canvas.height = canvas.width/3;
let image;
let canvasUrl;


// Initialize canvas context
const ctx = canvas.getContext("2d");

// Reduce the "extermal" size of the canvas by 2
canvas.style.width = canvas.width/2;
canvas.style.height = canvas.height/2;
    
// Get the position of the cnavas on the page
const sigField = $("#sigField");
let sigFieldOffsetY = sigField.offset().top;
let sigFieldOffsetX = sigField.offset().left;

// If the window gets resized, resize the canvas accordingly and update the position
$(window).on("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = 2*(container[0].offsetWidth * 0.82);
    canvas.height = canvas.width / 3;
    canvas.style.width = canvas.width / 2;
    canvas.style.height = canvas.height / 2;
    sigFieldOffsetY = sigField.offset().top;
    sigFieldOffsetX = sigField.offset().left;
    // If there was already a signature in the image variable, than redraw it after resizing
    if (image){
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    }
    

}

// Variables for cursor tracking
let mouseIsDown = false;
let mouseXStart;
let mouseYStart;


// Event Listeners (start and "change" drawing action)
$("#sigField").on("mousedown", startTracking).on("touchstart", startTracking);
$(document).on("mousemove", recordSignature).on("touchmove", recordSignature);




// Start the tracking process

function startTracking(event) {
    event.preventDefault();
    // Create event listener for end of drawing action
    $(document).on("mouseup", stopRecordingSignature).on("touchend", stopRecordingSignature);
    // Get start position of drawing for mouse...
    if (!event.changedTouches) {
        mouseXStart = (event.pageX - sigFieldOffsetX)*2;
        mouseYStart = (event.pageY - sigFieldOffsetY)*2;
        mouseIsDown = true;
        ctx.lineWidth = canvas.height/30;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mouseXStart, mouseYStart);
        // ... and touch controls
    } else {
        console.log('start Touch track');
        mouseXStart = (event.changedTouches[0].pageX - sigFieldOffsetX)*2;
        mouseYStart = (event.changedTouches[0].pageY - sigFieldOffsetY)*2;
        mouseIsDown = true;
        ctx.lineWidth = canvas.height / 30;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mouseXStart, mouseYStart);
    }


}



// Record the signature
function recordSignature(event) {
    event.preventDefault();
    // Draw the signature for mouse movements...
    if (mouseIsDown && !event.changedTouches) {
        let mouseXCurr = (event.pageX - sigFieldOffsetX)*2;
        let mouseYCurr = (event.pageY - sigFieldOffsetY)*2;

        ctx.lineTo(mouseXCurr, mouseYCurr);
        ctx.stroke();
    // ... and touch movements
    } else if (mouseIsDown) {
        console.log('record touch track');
        let mouseXCurr = (event.changedTouches[0].pageX - sigFieldOffsetX)*2;
        let mouseYCurr = (event.changedTouches[0].pageY - sigFieldOffsetY)*2;

        ctx.lineTo(mouseXCurr, mouseYCurr);
        ctx.stroke();
    }
    
}


// Stop the recording of the signature and convert to image URL

function stopRecordingSignature(event) {
    event.preventDefault();
    if (mouseIsDown) {
        mouseIsDown = false;
        canvasUrl = canvas.toDataURL("image/png", 1);
        image = new Image();
        image.src = canvasUrl;
        $("#signatureURL").val(canvasUrl);
    }
    // Turn off event listeners for end of drawing
    $(document).off("mouseup", stopRecordingSignature).off("touchend", stopRecordingSignature);
}

// Delete the canvas, if button is pressed
$(".deleteCanvas").on("mouseup", deleteCanvas);
function deleteCanvas() {
    ctx.clearRect(0, 0, $("canvas")[0].width, $("canvas")[0].height);
    canvasUrl = null;
    $("#signatureURL").val(null);
    image = new Image();
}





