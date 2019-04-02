jQuery(document).ready(function() {
	"use strict";
	$("#recordsButton").click(showRecords);
	$("#recordsButton2").click(hideRecords);
});

function hideRecords() {
	$("#recordsButton").removeClass("hidden");
	$("#recordsButton2").addClass("hidden");
	$("#recordsWrap").slideToggle();
}


function showRecords() {
	if ($("#recordsWrap").css("display") == "none") {
		$("#loading1").show();
		$("#loading2").show();
		$("#leastMovesList").html("");
		$("#leastTimeList").html("");
		$("#recordsWrap").slideToggle();
		$("#recordsButton").addClass("hidden");
		$("#recordsButton2").removeClass("hidden");
		
		$.get("getRecords.php?mode=moves", function(data, status) {
			if (status === "success") {
				var records = JSON.parse(data);
				for (var i = 0; i < records.length; i++) {
					var row = records[i];
					var newLi = document.createElement("li");
					$(newLi).html(row['username'] + 
								  "&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;Moves: " + row['moves']);
					$("#leastMovesList").append(newLi);	
				}
				$("#loading1").hide();
			} else {
				alert("Error! Cannot load the moves data. Error type: " + status);
			}
		});

		$.get("getRecords.php?mode=time", function(data, status) {
			if (status === "success") {
				var records = JSON.parse(data);
				for (var i = 0; i < records.length; i++) {
					var row = records[i];
					var newLi = document.createElement("li");
					var time = "";
					if (row['time'] % 60 < 10) {
						time = time + "" + parseInt(row['time'] / 60) + ":0" + row['time'] % 60;
					} else {
						time = time + "" + parseInt(row['time'] / 60) + ":" + row['time'] % 60;
					}
					$(newLi).html(row['username'] + 
								  "&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;&nbsp;Time: " + time);
					$("#leastTimeList").append(newLi);	
				}
				$("#loading2").hide();
			} else {
				alert("Error! Cannot load the time data. Error type: " + status);
			}
		});
	}
}