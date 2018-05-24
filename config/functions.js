function getTG(date){
	var options = { year: 'numeric', month: 'long', day: '2-digit' };
	var date = new Date(date);

	var formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
}  
