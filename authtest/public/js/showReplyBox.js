function showReplyBox(trigger){
	$(".hiddenReplyBox").empty()
	
	var id = trigger.value;
	var input = document.createElement("input");
	input.type = "text";
	input.id = "replyContent"+id;

	var btn = document.createElement("button");
	var replyBtn = document.createTextNode("reply");
	btn.value = id;
	btn.setAttribute('onClick', 'reply(this)');
	btn.appendChild(replyBtn)

	document.getElementById("div"+id).appendChild(input);
	document.getElementById("div"+id).appendChild(btn);
}