function renderThread(comments, status){
	allComments = comments;
	//sortComments(allComments[0]);
	var styleClass = '';
	var margin = 5;
	var previousLevel = 0;

	findParents(allComments, sortComments);
	//console.log(new Date().getTime());
	//console.log(allComments[0].commentTimeStamp);
	//console.log(new Date(allComments[0].commentDate).getTime());
	//console.log(Math.floor(((new Date().getTime()/1000) - (new Date(allComments[0].commentDate).getTime())/1000)))
	//console.log(timePassed(allComments[0].commentDate))


	for (i = 0; i < sortedList.length; i++){
		var level = sortedList[i].fullSlug.split('/').length;
		if(level-previousLevel > 0){
			if (level === 1){
				styleClass = 'Super';
			}
			else if(sortedList[i].fullSlug.split('/').length % 2 === 1){
				styleClass = 'Odd';
			}
			else{
				styleClass = 'Even';
			}
			document.write('<div class = "commentLevel'+styleClass+'", style = "margin-left:'+margin.toString()+'px">'+
				'<p style = "color:#8b8b8b"> <a style = "font-weight:bold">' + sortedList[i].moqaName +'</a> /'+sortedList[i].score +'pt &nbsp;'+timePassed(sortedList[i].commentDate)+'</p>'+
				'<p>'+sortedList[i].commentContent+'</p>');	
			if(status == 'loggedIn'){			
				document.write('<p><button type = "button", onClick = \'showReplyBox(this)\', id = "triggerReply_'+sortedList[i]._id+'", style = "background:none; border:none; padding:0; font:inherit; border-bottom: 1px solid #444; cursor: pointer;" value = "'+sortedList[i]._id+'">reply</button> | <button type = "button", id = "upvote_'+sortedList[i]._id+'",  style = "background:none; border:none; padding:0; font:inherit; color: #ff7800; cursor: pointer;" value = "'+sortedList[i]._id+'", onclick = \'upvote(this); this.onclick=null;\'>upvote</button>  <button type = "button", id = "downvote_'+sortedList[i]._id+'", style = "background:none; border:none; padding:0; font:inherit; color: #007eff; cursor: pointer;" value = "'+sortedList[i]._id+'", onclick = \'downvote(this); this.onclick=null;\'>downvote</button></p>');
				document.write('<a id = "div'+sortedList[i]._id+'"></a>');
			}

			previousLevel = level;

			if (i == sortedList.length-1){
				var endTags = level;

				for (k = 0; k < endTags; k++){
					document.write('</div>');
				}

				previousLevel = 0;
			}
		}
		else {
			var endTags = (level - previousLevel)*(-1)+1;
			if(sortedList[i].fullSlug.split('/').length % 2 === 1){
				styleClass = 'Odd';
			}
			else{
				styleClass = 'Even'
			}
			for (k = 0; k < endTags; k++){
				document.write('</div>');
			}
			document.write('<div class = "commentLevel'+styleClass+'", style = "margin-left:'+margin.toString()+'px">'+
				'<p style = "color:#8b8b8b"> <a style = "font-weight:bold">' + sortedList[i].moqaName +'</a> /'+sortedList[i].score +'pt &nbsp;'+timePassed(sortedList[i].commentDate)+'</p>'+
				'<p>'+sortedList[i].commentContent+'</p>');				
			if(status == 'loggedIn'){			
				document.write('<p><button type = "button", onClick = \'showReplyBox(this)\', id = "triggerReply_'+sortedList[i]._id+'", style = "background:none; border:none; padding:0; font:inherit; border-bottom: 1px solid #444; cursor: pointer;" value = "'+sortedList[i]._id+'">reply</button> | <button type = "button", id = "upvote_'+sortedList[i]._id+'",  style = "background:none; border:none; padding:0; font:inherit; color: #ff7800; cursor: pointer;" value = "'+sortedList[i]._id+'", onclick = \'upvote(this); this.onclick=null;\'>upvote</button>  <button type = "button", id = "downvote_'+sortedList[i]._id+'", style = "background:none; border:none; padding:0; font:inherit; color: #007eff; cursor: pointer;" value = "'+sortedList[i]._id+'", onclick = \'downvote(this); this.onclick=null;\'>downvote</button></p>');
				document.write('<a id = "div'+sortedList[i]._id+'"></a>');
			}

			previousLevel = level;

			if (i == sortedList.length-1){
				var endTags = level;

				for (k = 0; k < endTags; k++){
					document.write('</div>');
				}

				previousLevel = 0;
			}
		}
	}
}

var sortedList = [];
var children = [];
var allComments = [];

function sortComments(comment, commentStack){
	if (commentStack == [] || comment === undefined){
		return;
	}

	sortedList.push(comment);
	commentStack = getChildren(comment).concat(commentStack);


	sortComments(commentStack[0], commentStack.slice(1));
}


function getChildren(comment){
	var tempArray = [];
	//find Children of comment
	for (i = 0; i < allComments.length; i = i+1){
		if (allComments[i].parentComment == comment.commentId){
			tempArray.push(allComments[i]);
		}
	}
	return tempArray;
}

function findParents(comments, callback){
	for(var j = 0; j < allComments.length; j++){
		if(allComments[j].parentComment == ''){
			sortComments(allComments[j]);
		}
	}
	callback()
}

function timePassed(date){
	var seconds = Math.floor(((new Date().getTime()/1000) - new Date(date).getTime()/1000)),
	interval = Math.floor(seconds / 31536000);

	if (interval > 1) return "   " +interval + " years ago";

	interval = Math.floor(seconds / 2592000);
	if (interval > 1) return "   " +interval + " minutes ago";

	interval = Math.floor(seconds / 86400);
	if (interval >= 1) return "   " +interval + " days ago";

	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return "   " +interval + " hours ago";

	interval = Math.floor(seconds / 60);
	if (interval > 1) return "   " +interval + " minutes ago";

	return Math.floor(seconds) + " seconds ago";
}

