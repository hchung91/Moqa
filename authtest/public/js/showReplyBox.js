function showReplyBox(trigger){
	$(".hiddenReplyBox").empty()
	
	var id = trigger.value;
	var input = document.createElement("textarea");
	//input.type = "textarea";
	input.id = "replyContent"+id;
	input.rows = 4;
	input.cols = 40;
	var btn = document.createElement("button");
	var replyBtn = document.createTextNode("reply");
	btn.value = id;
	btn.setAttribute('onClick', 'reply(this)');
	btn.appendChild(replyBtn)

	document.getElementById("div"+id).appendChild(input);
	document.getElementById("div"+id).appendChild(btn);
}