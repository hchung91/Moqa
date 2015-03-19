// function reply(button){
// 	var parentId = button.value;
// 	console.log(parentId);
// 	document.getElementById('commentParentId').value = parentId;
// 	document.getElementById('commentContent').value = document.getElementById('replyContent'+parentId).value;
// 	document.getElementById('submitComment').click();
// }

function reply(button){
	var parentId = button.value;
	var commentContent = document.getElementById('replyContent'+parentId).value;
	var parameters = {action: 'reply', parentId: parentId, commentContent: commentContent};
	$.ajax({
	    type: 'PUT', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
	    dataType: 'json', // Set datatype - affects Accept header
	    url: "/test", // A valid URL
	    data: parameters, // Some data e.g. Valid JSON as a string
	    success: function(data){
	    	var container = 'commentContent'+parentId;
	    	allComments.push(data);
	    	document.getElementById('childSort'+parentId).value = 1;
	    	document.getElementById('childSort'+parentId).onchange();

	    	document.getElementById('div'+parentId).remove();
	    }
	});
}