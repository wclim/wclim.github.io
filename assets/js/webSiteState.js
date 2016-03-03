if (webSite.state == websiteStates.OFFLINE){
	$('body').addClass("offline");
	jQuery('body').html("<div class='constructionMessage'>Sorry the website is offline. Do check back again!<br><img src='images/offline.png' width='100px'/></div>");
} else if (webSite.state == websiteStates.UNDERCONSTRUCTION){
	$('body').addClass("underConstruction");
	jQuery('body').html("<div class='constructionMessage'>Sorry the website is under construction. Do check back again!<br><img src='images/spanner.png' width='100px'/></div>");
} else if (webSite.state == websiteStates.ACTIVE){
	
}