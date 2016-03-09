if (webSite.state == websiteStates.OFFLINE){
	$('body').addClass("offline");
	jQuery('body').html("<p>Sorry the website is offline. Do check back again!<br><img src='assets/images/offline.png' width='100px'/></p>");
} else if (webSite.state == websiteStates.UNDERCONSTRUCTION){
	$('body').addClass("underConstruction");
	jQuery('body').html("<p>Sorry the website is under construction. Do check back again!<br><img src='assets/images/spanner.png' width='100px'/></p>");
} else if (webSite.state == websiteStates.ACTIVE){
	var body = document.getElementsByTagName('body')[0];
	var script = document.createElement('script');
	script.src = "assets/js/canvasObjects.js";
	script.type = 'text/javascript';
	body.appendChild(script);
	var script2 = document.createElement('script');
	script2.src = "assets/js/canvas.js";
	script2.type = 'text/javascript';
	body.appendChild(script2);
}