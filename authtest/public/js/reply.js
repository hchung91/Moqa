function reply(button){
	var parentId = button.value;
	console.log(parentId);
	document.getElementById('commentParentId').value = parentId;
	document.getElementById('commentContent').value = document.getElementById('replyContent'+parentId).value
	document.getElementById('submitComment').click();
}

