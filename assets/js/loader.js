var canvasRdy = false;

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 100); //default is 1400
    function checkReady() {
        if (canvasRdy) {
            window.clearInterval(intervalID);
            window.clearInterval(loadingMsgInt);
            $('#loading p').html("Loading done");
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

function loadMsg() {
    if (loadingDots==3){
        loadingDots=0;
        $('#loading p').html("Loading");
    }else{
        loadingDots++;
        $('#loading p').append(".");
    }
}

var loadingDots = 0;
var loadingMsgInt = window.setInterval(loadMsg, 500);
if (webSite.state == websiteStates.ACTIVE){
    onReady(function () {
        $('#loading').fadeOut(1234, function(){
            $('#loading').hide();
        });
    });
}