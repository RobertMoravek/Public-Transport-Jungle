$("#deleteSignature").on("click", () => {
    $("#signatureQuestoin").removeClass("invisible");
    $("#deleteSignatureYes").removeClass("invisible");
    $("#deleteSignatureNo").removeClass("invisible");
});

$("#deleteSignatureNo").on("click", () => {
    $("#signatureQuestoin").addClass("invisible");
    $("#deleteSignatureYes").addClass("invisible");
    $("#deleteSignatureNo").addClass("invisible");
});

$("#deleteProfile").on("click", () => {
    $("#profileQuestoin").removeClass("invisible");
    $("#deleteProfileYes").removeClass("invisible");
    $("#deleteProfileNo").removeClass("invisible");
});

$("#deleteProfileNo").on("click", () => {
    $("#profileQuestoin").addClass("invisible");
    $("#deleteProfileYes").addClass("invisible");
    $("#deleteProfileNo").addClass("invisible");
});

