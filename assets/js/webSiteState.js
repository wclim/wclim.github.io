if (webSite.state == websiteStates.OFFLINE){
	$('body').addClass("offline");
	jQuery('body').html("<p>Sorry the website is offline. Do check back again!<br><img src='assets/images/offline.png' width='100px'/></p>");
} else if (webSite.state == websiteStates.UNDERCONSTRUCTION){
	$('body').addClass("underConstruction");
	jQuery('body').html("<p>Sorry the website is under construction. Do check back again!<br><img src='assets/images/spanner.png' width='100px'/></p>");
} else if (webSite.state == websiteStates.ACTIVE){
	var body = document.getElementsByTagName('body')[0];
	var script;
	for (var i in canvasScripts){
		script = document.createElement('script');
		script.src = "assets/js/" +canvasScripts[i];
		script.type = 'text/javascript';
		body.appendChild(script);
	}
}