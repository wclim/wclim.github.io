function escListener(e) {if (e.keyCode == 27){closeLink();}}

function openLink(link){
	if (me.autoWalk){keysDown={};me.autoWalk=false;}
	clearInterval(mouseInt);
	mouseDown = false;
	$('#dark').fadeIn("200", function(){
		$('#tab').fadeIn("500");
	});
	panning = true;
	disableMouse();
	document.getElementById('tab').src = "pages/" + link + ".html";
	for (var i in houses){
		if (houses[i].tab == link){
			houses[i].moveCharacterOver(me);
			break;
		}
	}
	addEventListener("keyup", escListener, false);
}

$('#dark').click(closeLink);

function closeLink(){
	$('#dark').fadeOut("200");
	$('#tab').fadeOut("200");
	enableMouse();
	panning = false;
	walkTo(me, me.x, me.y+60);
	removeEventListener("keyup", escListener, false);
}