function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 100); //default is 1400
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            window.clearInterval(loadingMsgInt);
            $('#loadingMessage').html("Loading done");
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
        $('#loadingMessage').html("Loading");
    }else{
        loadingDots++;
        $('#loadingMessage').append(".");
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