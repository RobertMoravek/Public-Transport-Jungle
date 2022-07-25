let sigMissing = $(".signature").data("error");
$("#label-for-canvas").after(`<canvas id="sigField" name="sigField" class="canvas ${sigMissing}"></canvas>`);


let canvas = document.getElementById("sigField");
let container = document.getElementsByClassName("container");
canvas.width = 2*(container[0].offsetWidth*0.82);
canvas.height = canvas.width/3;
let image;
let canvasUrl;

const ctx = canvas.getContext("2d");

canvas.style.width = canvas.width/2;
canvas.style.height = canvas.height/2;
    

const sigField = $("#sigField");
let sigFieldOffsetY = sigField.offset().top;
let sigFieldOffsetX = sigField.offset().left;


$(window).on("resize", resizeCanvas);

function resizeCanvas() {

    canvas.width = 2*(container[0].offsetWidth * 0.82);
    canvas.height = canvas.width / 3;
    canvas.style.width = canvas.width / 2;
    canvas.style.height = canvas.height / 2;
    sigFieldOffsetY = sigField.offset().top;
    sigFieldOffsetX = sigField.offset().left;
    if (image){
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    }
    

}
// Variables

let mouseIsDown = false;
let mouseXStart;
let mouseYStart;


// Event Listeners

$("#sigField").on("mousedown", startTracking).on("touchstart", startTracking);
$(document).on("mousemove", recordSignature).on("touchmove", recordSignature);




// Start the tracking process

function startTracking(event) {
    event.preventDefault();
    $(document).on("mouseup", stopRecordingSignature).on("touchend", stopRecordingSignature);
    if (!event.changedTouches) {
        mouseXStart = (event.pageX - sigFieldOffsetX)*2;
        mouseYStart = (event.pageY - sigFieldOffsetY)*2;
        mouseIsDown = true;
        ctx.lineWidth = canvas.height/30;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mouseXStart, mouseYStart);
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
    if (mouseIsDown && !event.changedTouches) {
        let mouseXCurr = (event.pageX - sigFieldOffsetX)*2;
        let mouseYCurr = (event.pageY - sigFieldOffsetY)*2;

        ctx.lineTo(mouseXCurr, mouseYCurr);
        ctx.stroke();
    } else if (mouseIsDown) {
        console.log('record touch track');
        let mouseXCurr = (event.changedTouches[0].pageX - sigFieldOffsetX)*2;
        let mouseYCurr = (event.changedTouches[0].pageY - sigFieldOffsetY)*2;

        ctx.lineTo(mouseXCurr, mouseYCurr);
        ctx.stroke();
    }
    
}



// Stop the recording of the signature and convert to URL

function stopRecordingSignature(event) {
    event.preventDefault();
    if (mouseIsDown) {
        mouseIsDown = false;
        canvasUrl = canvas.toDataURL("image/png", 1);
        image = new Image();
        image.src = canvasUrl;
        $("#signatureURL").val(canvasUrl);
    }

    $(document).off("mouseup", stopRecordingSignature).off("touchend", stopRecordingSignature);
}

$(".deleteCanvas").on("mouseup", deleteCanvas);
function deleteCanvas() {
    ctx.clearRect(0, 0, $("canvas")[0].width, $("canvas")[0].height);
    canvasUrl = null;
    $("#signatureURL").val(null);
    image = new Image();
}





