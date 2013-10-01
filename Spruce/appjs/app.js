var objectType = "cars";

$(document).on('pagebeforeshow', "#items", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/"+objectType,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#itemsList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				
				list.append('<li data-icon="false"><a onclick="GetItem('+object.id+')">' + 
					'<img style="padding-left:5px; padding-top: 7px" src="css/images/thumbnailblack.png">'+
					'<h1 style="margin: 0px">' + object.name + '</h1><hr style="margin-bottom: 0px;margin-top: 3px" />' +
					'<table><tr><td style="padding-top: 0px" ><div style="padding-top: 0px">'+
					'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2>'+ 
					'<p><strong> Brand: ' + object.brand + '</strong></p>'+
					'</div></td><td width="1000"><div style="padding-right: 1px" align="right" >'+ 
					'<h3 style="margin-top:0px;padding-top: 0px">$'+object.price+
					'</h3><p><b>'+object.startingDate+'</b></p></div></td></tr></table>'+
					'</a></li>');
				
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#car-view", function( event, ui ) {
	// currentCar has been set at this point
	$("#upd-make").val(currentCar.make);
	$("#upd-model").val(currentCar.model);
	$("#upd-year").val(currentCar.year);
	$("#upd-price").val(currentCar.price);
	$("#upd-description").val(currentCar.description);
	
});

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData){
	var result = {};
	$.each(formData, 
		function(i, o){
			result[o.name] = o.value;
	});
	return result;
}

function GoToView(id, title){
	
	objectType = title;
	$.mobile.loading("show");
	$.mobile.navigate(id+".html");
}

function SaveCar(){
	$.mobile.loading("show");
	var form = $("#car-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var newCar = ConverToJSON(formData);
	console.log("New Car: " + JSON.stringify(newCar));
	var newCarJSON = JSON.stringify(newCar);
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/cars",
		method: 'post',
		data : newCarJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#cars");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Data could not be added!");
		}
	});

}

var currentCar = {};

function GetItem(id){
	
	$.mobile.loading("show");

	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/"+brand+"/"+ id,
		method: 'get',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			currentItem = data.item;
			$.mobile.loading("hide");

			$.mobile.navigate("buyerproduct.html");
		
		},
				error: function(data, textStatus, jqXHR){
					console.log("textStatus: " + textStatus);
					$.mobile.loading("hide");
					if (data.status == 404){
						alert("Car not found.");
					}
					else {
						alter("Internal Server Error.");
					}
				}
			});
		
}

function UpdateCar(){
	$.mobile.loading("show");
	var form = $("#car-view-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	var updCar = ConverToJSON(formData);
	updCar.id = currentCar.id;
	console.log("Updated Car: " + JSON.stringify(updCar));
	var updCarJSON = JSON.stringify(updCar);
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/cars/" + updCar.id,
		method: 'put',
		data : updCarJSON,
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#cars");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Data could not be updated!");
			}
			else {
				alert("Internal Error.");		
			}
		}
	});
}

function DeleteCar(){
	$.mobile.loading("show");
	var id = currentCar.id;
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/cars/" + id,
		method: 'delete',
		contentType: "application/json",
		dataType:"json",
		success : function(data, textStatus, jqXHR){
			$.mobile.loading("hide");
			$.mobile.navigate("#cars");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404){
				alert("Car not found.");
			}
			else {
				alter("Internal Server Error.");
			}
		}
	});
}