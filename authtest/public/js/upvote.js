function upvote(comment){
	//console.log('upvote clicked');
	var id = comment.value;
	var parameters = {comment: id, vote: 'upvote'};
	$.ajax({
	    type: 'PUT', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
	    dataType: 'json', // Set datatype - affects Accept header
	    url: "/test", // A valid URL
	    data: parameters, // Some data e.g. Valid JSON as a string
	});
	//console.log('upvote executed')	
}