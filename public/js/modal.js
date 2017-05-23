function chart(post)
{
	var options = {'title':'Voting option',
   'width':550,
   'height':400};
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Options');
	data.addColumn('number', 'Percentage');
	data.addRows(post.option.length);
	for(var i=0;i<post.option.length;i++)
	{
		data.setCell(i,0,post.option[i].name.toString());
		data.setCell(i,1,parseInt(post.option[i].click));
	}
	var chart = new google.visualization.PieChart(document.getElementById('container'));
	chart.draw(data, options);
}
function func(postid)
{
	console.log('/postval/'+postid);
	$.ajax({
		type:'POST',
		url:'/postval/'+postid,
		timeout:5000,
		dataType: "json",
		success:function(res)
		{
			chart(res);
			$('#myModal').css('display','block');
		},
		error:function(err){
			console.log(err);
		}
	});
}
$(document).ready(function()
{
	$('#close').click(function(){
		$('#myModal').css('display','none');
		location.reload(true);
	});
	$('#span').click(function(){
		$('#myModal').css('display','none');
		location.reload(true);
	})
});
window.onclick=function(event)
{
	if(event.target.id==='myModal')
	{
		$('#myModal').css('display','none');
		location.reload(true);
	}
}