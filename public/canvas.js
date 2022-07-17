const sigField = $("#sigField");
const sigFieldOffsetY = sigField.offset().top;
const sigFieldOffsetX = sigField.offset().left;

const ctx = sigField[0].getContext("2d");

// Variables

let mouseIsDown = false;
let mouseXStart;
let mouseYStart;
let canvasURL;


// Event Listeners

$("#sigField").on("mousedown", startTracking);
$(document).on("mousemove", recordSignature);
$(document).on("mouseup", stopRecordingSignature);



// Start the tracking process

function startTracking(event) {
    mouseXStart = event.pageX - sigFieldOffsetX;
    mouseYStart = event.pageY - sigFieldOffsetY;
    mouseIsDown = true;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(mouseXStart, mouseYStart);
    // ctx.clearRect(0, 0, sigField.width, sigField.height);

}



// Record the signature
function recordSignature(event) {
    if (mouseIsDown){
        let mouseXCurr = event.pageX - sigFieldOffsetX;
        let mouseYCurr = event.pageY - sigFieldOffsetY;


        ctx.lineTo(mouseXCurr, mouseYCurr);
        ctx.stroke();

    }
}



// Stop the recording of the signature and convert to URL

function stopRecordingSignature(event) {
    if (mouseIsDown) {
        mouseIsDown = false;
        canvasURL = sigField[0].toDataURL();
        $("#signatureURL").val(canvasURL);
        console.log(canvasURL);

    }
}






