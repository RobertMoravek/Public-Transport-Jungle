$(document).ready(createCanvas); 
$(".deleteCanvas").on("mouseUp", createCanvas.stopRecordingSignature);

function createCanvas() {
    let sigMissing = $(".signature").data("error");
    // if ($(".signature").data() == "red-border"){
    //     console.log('hurra');
    // };

    $("canvas").remove();
    $("#label-for-canvas").after(`<canvas width="${$(".container").width()-30}" height="200" id="sigField" name="sigField" class="canvas ${sigMissing}"></canvas>`);
    

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

    $("#sigField").on("mousedown", startTracking).on("touchstart", startTracking);
    $(document).on("mousemove", recordSignature).on("touchmove", recordSignature);
    $(document).on("mouseup", stopRecordingSignature).on("touchend", stopRecordingSignature);



    // Start the tracking process

    function startTracking(event) {
        console.log(event.changedTouches);
        if (!event.changedTouches) {
            mouseXStart = event.pageX - sigFieldOffsetX;
            mouseYStart = event.pageY - sigFieldOffsetY;
            mouseIsDown = true;
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(mouseXStart, mouseYStart);
        } else {
            console.log('start Touch track');
            mouseXStart = event.changedTouches[0].pageX - sigFieldOffsetX;
            mouseYStart = event.changedTouches[0].pageY - sigFieldOffsetY;
            mouseIsDown = true;
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(mouseXStart, mouseYStart);
        }


    }



    // Record the signature
    function recordSignature(event) {
        if (mouseIsDown && !event.changedTouches) {
            let mouseXCurr = event.pageX - sigFieldOffsetX;
            let mouseYCurr = event.pageY - sigFieldOffsetY;

            ctx.lineTo(mouseXCurr, mouseYCurr);
            ctx.stroke();
        } else if (mouseIsDown) {
            console.log('record touch track');
            let mouseXCurr = event.changedTouches[0].pageX - sigFieldOffsetX;
            let mouseYCurr = event.changedTouches[0].pageY - sigFieldOffsetY;

            ctx.lineTo(mouseXCurr, mouseYCurr);
            ctx.stroke();
        }
    }



    // Stop the recording of the signature and convert to URL

    function stopRecordingSignature(event) {
        if($(event.target).hasClass("deleteCanvas")){
            console.log($("canvas"));
            // ctx.beginPath();
            ctx.clearRect(0, 0, $("canvas")[0].width, $("canvas")[0].height);
            // ctx.stroke();
            $("#signatureURL").val(null);
        };

        
        if (mouseIsDown) {
            mouseIsDown = false;
            canvasURL = sigField[0].toDataURL();
            $("#signatureURL").val(canvasURL);
            console.log(canvasURL);

        }
    }

    $(window).on("resize", createCanvas);

}




