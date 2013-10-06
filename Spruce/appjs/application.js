var objectType = "cars";
var lastPageId;


$(document).ready(function(){
	var change=true;
    $("#lrd-signupshippingAddressCheck").click(function(){
    	if(change){
    		$("#lrd-signupshippingShippingButton").attr("onclick", "GoToView('lrd-signupbilling')");
    		change=false;
		}
    	else{
    		$("#lrd-signupshippingShippingButton").attr("onclick", "GoToView('lrd-signupcredit')");
    		change=true;
    	}
	 });
});

//Before mySpruceView call ajax for bidding
$(document).on('pagebeforeshow', "#lrd-myspruce", function( event, ui ) {
	ajaxMySpruce("bidding");
});

$(document).on('pagebeforeshow', "#lrd-home", function(event, ui) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/Spruce/home/",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var list = $("#popularcontent");
			var images = data.images;
			var len = images.length;
			
			for (var i = 0; i < 3; ++i) {
				var image = images[i];
				list.append('<li data-icon="false"><a  onclick=GetItem('+image.id+')><img height="80px" width="80px" style="padding-left:5px; padding-top: 6px"src="images/'+image.url+'">'+ 
			'<h1 style="margin: 0px">'+image.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+image.model+'</h2><p>'+image.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(image.price)+'</h3><p><b>'+image.startingDate+'</b></p></div></div></a></li>');
			}
			list.listview('refresh');
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-itemsforcategory", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/"+objectType,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-itemsList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				
				list.append('<li data-icon="false"><a onclick="GetItem('+object.id+')">' + 
					'<img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+
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

$(document).on('pagebeforeshow', "#lrd-admincategoriespage", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/myadmintools/category",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.category;
			var len = objectList.length;
			var list = $("#lrd-admincategoriespageCategoriesList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li data-icon='false'><a>"+object.title+"</a><a href='#lrd-admindialogpage' data-rel='dialog'></a></li>");
				
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminuserspage", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/myadmintools/users",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.users;
			var len = objectList.length;
			var list = $("#lrd-adminuserspageUsersList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a href="#lrd-userprofile">'+object.user+'</a><a href="#lrd-admindialogpage"></a></li>');
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-bidhistory", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/seller-product/1/2/bids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.bids;
			var len = objectList.length;
			var list = $("#lrd-BidHistoryList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false">'+
					'<div class="ui-grid-a"><div class="ui-block-a"><h3>'+object.title+'</h3></div>'+
					'<div class="ui-block-b" align="right">'+
					'<h3>'+accounting.formatMoney(object.price)+'</h3></div></div></li>');
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-buyerproduct", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/product/0/1",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			$('#lrd-buyerproductName').text(currentItem.name);
			$('#lrd-buyerproductBuyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem.price)+"</br> Bid: "+accounting.formatMoney(currentItem.bid)); 
			$("#lrd-buyerproductImage").attr("src","images/"+currentItem.image);
			$('#lrd-buyerproductTimeRemaining').text("Ending in: 2:12PM 10/6/2013"); 
			$('#lrd-buyerproductModelAndBrand').text(currentItem.model+", "+currentItem.brand);
			$('#lrd-buyerproductDimensions').text("Dimensions: "+currentItem.dimensions+" Id: "+currentItem.id);
			$('#lrd-buyerproductDescription').text(currentItem.description);
			$('#lrd-buyerproductSellerName').text(currentItem.seller);
			$("#lrd-buyerproductSellerName").attr("onlcick", "GoToView('lrd-userprofile')");
			$("#lrd-buyerproductSellerName").attr("data-role", "link");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-sellerproduct", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/seller-product/0/1",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			$('#lrd-sellerproductName').text(currentItem.name); 
			$('#lrd-sellerproductBuyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem.price)+"</br> Bid: "+accounting.formatMoney(currentItem.bid)); 
			$("#lrd-sellerproductImage").attr("src","images/"+currentItem.image);
			$('#lrd-sellerproductTimeRemaining').text("Ending in: 2:12PM 10/6/2013"); 
			$('#lrd-sellerproductModelAndBrand').text(currentItem.model+", "+currentItem.brand);
			$('#lrd-sellerproductDimensions').text("Dimensions: "+currentItem.dimensions+" Id: "+currentItem.id);
			$('#lrd-sellerproductDescription').text(currentItem.description);
			$('#lrd-sellerproductSellerName').text(currentItem.seller);
			$("#lrd-sellerproductSellerName").attr("onclick", "GoToView('lrd-userprofile')");
			$("#lrd-sellerproductSellerName").attr("data-role", "link");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//Function for the three pages of my Spruce
function ajaxMySpruce(where){
	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://localhost:3412/SpruceTestServer/mySpruce/"+where,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-myspruceMySpruceList");
			list.empty();
			var object;
			if(where=='history'){
				for (var i=0; i < len; ++i){
					object = objectList[i];
					if(object.buyer=='Me'){
						list.append('<li data-icon="false"><a onclick="GetItem('+object.id+')">' + 
						'<img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+
						'<h1 style="margin: 0px">' + object.name + '</h1><hr style="margin-bottom: 0px;margin-top: 3px" />' +
						'<table><tr><td style="padding-top: 0px" ><div style="padding-top: 0px">'+
						'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2>'+ 
						'<p><strong> Brand: ' + object.brand + '</strong></p>'+
						'</div></td><td width="1000"><div style="padding-right: 1px" align="right" >'+ 
						'<h3 style="margin-top:0px;padding-top: 0px">$'+object.price+
						'</h3><p style="color:green"><b>Won: '+object.dateBought+'</b></p></div></td></tr></table>'+
						'</a></li>');
					}
					else{
						list.append('<li data-icon="false"><a onclick="GetItem('+object.id+')">' + 
						'<img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+
						'<h1 style="margin: 0px">' + object.name + '</h1><hr style="margin-bottom: 0px;margin-top: 3px" />' +
						'<table><tr><td style="padding-top: 0px" ><div style="padding-top: 0px">'+
						'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2>'+ 
						'<p><strong> Brand: ' + object.brand + '</strong></p>'+
						'</div></td><td width="1000"><div style="padding-right: 1px" align="right" >'+ 
						'<h3 style="margin-top:0px;padding-top: 0px">$'+object.price+
						'</h3><p style="color:red"><b>Lost: '+object.dateBought+'</b></p></div></td></tr></table>'+
						'</a></li>');
					}
				}
			}
			else{
				for (var i=0; i < len; ++i){
					object = objectList[i];
					list.append('<li data-icon="false"><a onclick="GetItem('+object.id+')">' + 
					'<img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+
					'<h1 style="margin: 0px">' + object.name + '</h1><hr style="margin-bottom: 0px;margin-top: 3px" />' +
					'<table><tr><td style="padding-top: 0px" ><div style="padding-top: 0px">'+
					'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2>'+ 
					'<p><strong> Brand: ' + object.brand + '</strong></p>'+
					'</div></td><td width="1000"><div style="padding-right: 1px" align="right" >'+ 
					'<h3 style="margin-top:0px;padding-top: 0px">$'+object.price+
					'</h3><p><b>'+object.startingDate+'</b></p></div></td></tr></table>'+
					'</a></li>');
				}
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

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
	$.mobile.changePage("#"+id,{
		allowSamePageTransition: true
		});
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

	/*
	$.ajax({
			url : "http://localhost:3412/SpruceTestServer/books/"+ id,
			method: 'get',
			contentType: "application/json",
			dataType:"json",
			success : function(data, textStatus, jqXHR){
				currentItem = data.item;
				$.mobile.loading("hide");*/
	

			$.mobile.changePage("#lrd-buyerproduct",{
		allowSamePageTransition: true
		});
		
		/*
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
					});*/
		
		
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