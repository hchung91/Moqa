function renderThread(comments, parentCommentId, changeSortOrder, sortMethod){
	logInStatus = logInCheck();
	//console.log(logInStatus);
	htmlContent = '';
	allComments = comments;
	//sortComments(allComments[0]);
	var styleClass = '';
	var margin = 5;
	var previousLevel = 0;

	findParents(allComments, parentCommentId, sortMethod, sortComments);
	

	for (i = 0; i < sortedList.length; i++){
		var level = sortedList[i].fullSlug.split('/').length;
		var hasChild = 0;
		for(j = 0; j < sortedList.length; j++){
			if(hasChild > 1)
				break;
			if(sortedList[j].parentComment == sortedList[i].commentId)
				hasChild++;
		}
		//hasChild == 2, more than 1 child comment
		
		if(level-previousLevel > 0){
			if (level == 1){
				styleClass = 'Super';
			}
			else if(sortedList[i].fullSlug.split('/').length % 2 === 1){
				styleClass = 'Odd';
			}
			else{
				styleClass = 'Even';
			}
			basicCommentHTML(styleClass, sortedList[i].commentId, margin, sortedList[i].moqaName, sortedList[i].score, sortedList[i].commentDate, sortedList[i].commentContent);	
			//console.log(sortedList[i].commentId)
			if(logInStatus == true){			
				loggedInComment(sortedList[i]._id, sortedList[i].commentId, hasChild);	
			}

			previousLevel = level;

			if (i == sortedList.length-1){
				var endTags = level;

				for (k = 0; k < endTags; k++){
					htmlContent+=('</div>');
				}

				previousLevel = 0;
			}
		}
		else {
			var endTags = (level - previousLevel)*(-1)+1;

			if (level == 1){
				styleClass = 'Super';
			}
			else if(sortedList[i].fullSlug.split('/').length % 2 === 1){
				styleClass = 'Odd';
			}
			else{
				styleClass = 'Even'
			}
			for (k = 0; k < endTags; k++){
				htmlContent+=('</div>');
			}

			basicCommentHTML(styleClass, sortedList[i].commentId, margin, sortedList[i].moqaName, sortedList[i].score, sortedList[i].commentDate, sortedList[i].commentContent);
		
			if(logInStatus == true){		
				loggedInComment(sortedList[i]._id, sortedList[i].commentId, hasChild);	
			}

			previousLevel = level;

			if (i == sortedList.length-1){
				var endTags = level;

				for (k = 0; k < endTags; k++){
					htmlContent+=('</div>');
				}

				previousLevel = 0;
			}
		}
	}
	if(!changeSortOrder){
		document.write(htmlContent);
	}
	return htmlContent;
}

var sortedList = [];
var children = [];
var allComments = [];

function sortComments(comment , comparator, commentStack){
	if (commentStack == [] || comment == undefined){
		return;
	}

	sortedList.push(comment);
	commentStack = getChildren(comment, comparator).concat(commentStack);

	commentStack = commentStack.sort(comparator);

	sortComments(commentStack[0], comparator, commentStack.slice(1));
}


function getChildren(comment, comparator){
	var tempArray = [];
	//find Children of comment
	for (i = 0; i < allComments.length; i = i+1){
		if (allComments[i].parentComment == comment.commentId){
			tempArray.push(allComments[i]);
		}
	}
	tempArray = tempArray.sort(comparator);
	return tempArray;
}

function numChildren(commentId){
	//find Children of comment
	tempArray = [];
	for (i = 0; i < allComments.length; i = i+1){
		if (allComments[i].parentComment == commentId){
			tempArray.push(allComments[i]);
		}
	}
	return tempArray.length;
}

function findParents(comments, parentCommentId, comparator, callback){
	parentStack = [];
	for(var j = 0; j < allComments.length; j++){
		if(allComments[j].parentComment == parentCommentId){
			parentStack.push(allComments[j]);
		}
	}

	parentStack.sort(comparator);

	for(var j = 0; j < parentStack.length; j++){
		sortComments(parentStack[j],comparator);
	}
	callback()
}

function timePassed(date){
	var seconds = Math.floor(((new Date().getTime()/1000) - new Date(date).getTime()/1000)),
	interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return "   " +interval + " years ago";
	}

	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return "   " +interval + " minutes ago";
	}

	interval = Math.floor(seconds / 86400);
	if (interval >= 1) {
		if (interval == 1){return "   " +interval + " day ago";}
		else {return "   " +interval + " days ago";}
	}

	interval = Math.floor(seconds / 3600);
	if (interval >= 1) {
		if (interval == 1){return "   " +interval + " hour ago";}
		else {return "   " +interval + " hours ago";}
	}

	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return "   " +interval + " minutes ago";
	}

	return Math.floor(seconds) + " seconds ago";
}

function sort(dropdown, parentCommentId){
	//console.log(parentCommentId);
	//console.log('sort executed');
	sortedList = [];
	
	if (parentCommentId == ''){
		container = "commentContentSection"
		document.getElementById(container).innerHTML = '';

		sortType = dropdown.value;
		if (sortType == 0){
			document.getElementById(container).innerHTML = renderThread(allComments, parentCommentId, true, highestScore);
		}
		else if (sortType == 1){
			document.getElementById(container).innerHTML = renderThread(allComments, parentCommentId, true, newestFirst);
		}
		else if (sortType == 2){
			document.getElementById(container).innerHTML = renderThread(allComments, parentCommentId, true, oldestFirst);
		}
	}
	else{
		container = 'commentContent'+parentCommentId;
		removeDivChildren(container);

		sortType = dropdown.value;
		if (sortType == 0){
			document.getElementById(container).innerHTML += renderThread(allComments, parentCommentId, true, highestScore);
			document.getElementById('childSort'+parentCommentId).value = 0;
		}
		else if (sortType == 1){
			document.getElementById(container).innerHTML += renderThread(allComments, parentCommentId, true, newestFirst);
			document.getElementById('childSort'+parentCommentId).value = 1;
		}
		else if (sortType == 2){
			document.getElementById(container).innerHTML += renderThread(allComments, parentCommentId, true, oldestFirst);
			document.getElementById('childSort'+parentCommentId).value = 2;
		}
	}
}

function newestFirst(a,b) {
  if (a.commentTimeStamp < b.commentTimeStamp)
     return 1;
  if (a.commentTimeStamp > b.commentTimeStamp)
    return -1;
  return 0;
}

function oldestFirst(a,b) {
  if (a.commentTimeStamp < b.commentTimeStamp)
     return -1;
  if (a.commentTimeStamp > b.commentTimeStamp)
    return 1;
  return 0;
}

function highestScore(a,b) {
  if (a.score > b.score)
     return -1;
  if (a.score < b.score)
    return 1;
  return 0;
}

function logInCheck(){
	var status = false; 
	$.ajax({
	    type: 'GET', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate
	    async: false,
	    dataType: 'json', // Set datatype - affects Accept header
	    url: "/validateSession", // A valid URL
	    data: {}, // Some data e.g. Valid JSON as a string
	    success: function(data){
	    	status = data.loggedIn;
	    }
	});
	return status;
}

function basicCommentHTML(divClass, commentId, margin, moqaName, score, timeStamp, commentContent){
	htmlContent+=('<div class = "commentLevel'+divClass+'", ');
	htmlContent+=('id = "commentContent'+commentId+'", ');
	htmlContent+=('style = "margin-left:'+margin.toString()+'px">');
	htmlContent+=('<p style = "color:#8b8b8b"> <a style = "font-weight:bold">');
	htmlContent+=(moqaName);
	htmlContent+=('</a> | '+score +'pt &nbsp;'+timePassed(timeStamp));
	htmlContent+=('</p>'+'<p>'+commentContent+'</p>');	
}

function loggedInComment(id, parentComment, hasChild){
	//upvote
	htmlContent+=('<p><button type = "button", id = "upvote_'+id+'",');
	htmlContent+=(' class = "upvoteButton"');
	htmlContent+=('value = "'+id+'", ');
	htmlContent+=('onclick = \'upvote(this)\'>upvote</button>');

	//downvote
	htmlContent+=(' <button type = "button", id = "downvote_'+id+'",');
	htmlContent+=(' class = "downvoteButton"');
	htmlContent+=(' value = "'+id);
	htmlContent+=('", onclick = \'downvote(this)\'>downvote</button> &nbsp| &nbsp');

	//reply option
	htmlContent+=('<button type = "button", onClick = \'showReplyBox(this)\', id = "triggerReply_');
	htmlContent+=(id);
	htmlContent+=('", class = "replyButton"');
	htmlContent+=('value = "');
	htmlContent+= (id);
	htmlContent+=('">reply</button> ');
	//console.log(parentComment.toString());
	//console.log(numChildren(parentComment).toString());
	//console.log("parent comment is " + parentComment);
	//sort option
	//console.log('hasChild is ' + hasChild);
	if(hasChild > 1){
		htmlContent += (' &nbsp|&nbsp Sort children by:')
		htmlContent += ('<select onchange="sort(this,\''+id+'\')" id = "childSort'+id+'" class = "commentSortButton">');
		htmlContent += ('<option value = "0">Top Score</option>');
		htmlContent += ('<option value = "1">New</option>');
		htmlContent += ('<option value = "2">Old</option>');
		htmlContent += ('</select>');
	}
	//hidden replybox placeholder
	htmlContent+=('</p><a class = "hiddenReplyBox" id = "div'+id+'"></a>');	
}

function removeDivChildren(containerId) {
    var parentDiv = document.getElementById(containerId);
    var subDiv = parentDiv.getElementsByTagName('div');
    var subDivLength = subDiv.length;

    //console.log('subDiv length: '+subDiv.length);

    while(subDivLength>0) {
        var elem = subDiv[0];
        var div = document.getElementById(elem.id);
        div.remove();
        subDivLength = parentDiv.getElementsByTagName('div').length;
    }
}

//commentContent5507a11ed1ff7a900e9095d2
//commentContent5507a3e9d1ff7a900e9095d5