function openLink(link){
	$('#dark').fadeIn("200", function(){
		$('#tab').fadeIn("500");
	});
	removeEventListener("keydown", keyDownListener, false);
	removeEventListener("keyup", keyUpListener, false);
	keysDown = {};
	document.getElementById('tab').src = "pages/" + link + ".html";
}

$('#dark').click(closeLink);

function closeLink(){
	$('#dark').fadeOut("200");
	$('#tab').fadeOut("200");
	addEventListener("keydown", keyDownListener, false);
	addEventListener("keyup", keyUpListener, false);
}