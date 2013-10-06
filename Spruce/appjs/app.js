var objectType = "cars";
var lastPageId;

//Before mySpruceView call ajax for bidding
$(document).on('pagebeforeshow', "#mySpruceView", function( event, ui ) {
	ajaxMySpruce("bidding");
});

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
				
				list.append('<li data-icon="false"><a  onClick-getItemPage('+object.id+')><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">'+ 
			'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.startingDate+'</b></p></div></div></a></li>');
				
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#categoriesPage", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/myadmintools/category",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.category;
			var len = objectList.length;
			var list = $("#categoriesList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a>'+object.title+'</a><a href="#dialogPage"  data-rel="dialog"></a></li>');
				
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-home", function(event, ui) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/home/",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var list = $("#popularcontent");
			var images = data.images;
			var len = images.length;
			
			for (var i = 0; i < 3; ++i) {
				var image = images[i];
				list.append('<li data-icon="false"><a  onClick-getItemPage('+image.id+')><img height="80px" width="80px" style="padding-left:5px; padding-top: 6px"src="images/'+image.url+'">'+ 
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

$(document).on('pagebeforeshow', "#usersPage", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/myadmintools/users",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.users;
			var len = objectList.length;
			var list = $("#usersList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a href="userprofile.html">'+object.user+'</a><a></a></li>');
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#bidHistoryPage", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/seller-product/1/2/bids",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.bids;
			var len = objectList.length;
			var list = $("#bidHistoryList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><div class="ui-grid-a"><div class="ui-block-a"><h3>'+object.title+'</h3></div><div class="ui-block-b" align="right"><h3>'+accounting.formatMoney(object.price)+'</h3></div>	</div> </li>');
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#buyerProductPage", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/product/0/1",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			$('#name').text(currentItem.name); 
			$('#buyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem.price)+"</br> Bid: "+accounting.formatMoney(currentItem.bid)); 
			$("#image").attr("src","./images/"+currentItem.name+".jpg");
			$('#timeRemaining').text("Ending in: 2:12PM 10/6/2013"); 
			$('#modelAndBrand').text(currentItem.model+", "+currentItem.brand);
			$('#dimensions').text("Dimensions: "+currentItem.dimensions+" Id: "+currentItem.id);
			$('#description').text(currentItem.description);
			$('#sellerName').text(currentItem.seller);
			$("#sellerName").attr("href", "userprofile.html");
			$("#sellerName").attr("data-role", "link");
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#sellerProductPage", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/seller-product/0/1",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			$('#name').text(currentItem.name); 
			$('#buyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem.price)+"</br> Bid: "+accounting.formatMoney(currentItem.bid)); 
			$("#image").attr("src","./images/"+currentItem.name+".jpg");
			$('#timeRemaining').text("Ending in: 2:12PM 10/6/2013"); 
			$('#modelAndBrand').text(currentItem.model+", "+currentItem.brand);
			$('#dimensions').text("Dimensions: "+currentItem.dimensions+" Id: "+currentItem.id);
			$('#description').text(currentItem.description);
			$('#sellerName').text(currentItem.seller);
			$("#sellerName").attr("href", "userprofile.html");
			$("#sellerName").attr("data-role", "link");
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
			var list = $("#mySpruceList");
			list.empty();
			var object;
			if(where=='history'){
				for (var i=0; i < len; ++i){
				object = objectList[i];
				if(object.buyer=='Me'){
					list.append('<li data-icon="false"><a  onClick-getItemPage('+object.id+')><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">'+ 
			'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.dateBought+'</b></p></div></div></a></li>');
				}
				else{
					list.append('<li data-icon="false"><a  onClick-getItemPage('+object.id+')><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">'+ 
			'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.dateBought+'</b></p></div></div></a></li>');
				}
				}
			}
			else{
				for (var i=0; i < len; ++i){
					object = objectList[i];
					list.append('<li data-icon="false"><a  onClick-getItemPage('+object.id+')><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">'+ 
			'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.startingDate+'</b></p></div></div></a></li>');
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


///////////////////////////////////////////////!!!!!!!!!!!!!!//////////////////////////
/////////////////////////////////////////////////////NEWWWWWWWWWWWWWWW////////////////////////////////////////////
$(document).on('pagebeforeshow', "#cartView", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/user/cart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.cart;
			var len = objectList.length;
			var list = $("#myCartList");
			list.empty();
			var total=0;
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a href="buyerproduct.html"><img src="images/itshappening.gif" style="resize:both; overflow:scroll; width:80px; height:80px">'+
				'<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">'+object.name+'</h1><p style="font-size: 13px;margin-top:0px"><b>'+object.model+'</b></p><p>'+object.brand+'</p>'+
				'</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >'+accounting.formatMoney(object.price)+'</h1><p>Amount:'+object.amount+'</p></div></div><a href="#dialogPage"  data-rel="dialog"></a>');
				total+=object.price*object.amount;
			}
			list.listview("refresh");	
			$("#checkoutButton .ui-btn-text").text("Checkout ("+accounting.formatMoney(total)+")");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//////////////////////////SELLER STORE//////////////////////////////////
$(document).on('pagebeforeshow', "#userStore", function( event, ui ) {
	console.log("Jose");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/user/store",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#sellerItems");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a  onclick="GetItem('+object.id+')"><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">'+ 
			'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
			'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
			'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.startingDate+'</b></p></div></div></a></li>');
				
			}
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});


////////////////////////////////////USER PROFILE////////////////////////////////////////
$(document).on('pagebeforeshow', "#userprofile", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/user/profile",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentUser = data.user;
			$('#userProfileName').text(currentUser.userName); 
			$('#userProfileEmail').text(currentUser.email); 
			//$("#userProfileImage").attr("src","./images/"+currentUser.name+".jpg");
			$('#addressProfileName').html(currentUser.address+"</br>"+currentUser.city+", "+currentUser.state+" "+currentUser.zip); 
			$('#userProfilePhone').text(currentUser.phone);
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

/////////////////////////ACCOUNT INFO/////////////////////////
$(document).on('pagebeforeshow', "#accountinfo", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceTestServer/user/profile",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentUser = data.user;
			$('#userMyAccountName').text(currentUser.userName); 
			$('#userMyAccountEmail').text(currentUser.email); 
			//$("#userProfileImage").attr("src","./images/"+currentUser.name+".jpg");
			$('#addressMyAccountName').html(currentUser.address+"</br>"+currentUser.city+", "+currentUser.state+" "+currentUser.zip); 
			$('#userMyAccountPhone').text(currentUser.phone);
			$.mobile.loading("hide");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
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
	
	if(lastPageId == id && id == "itemsforcategory"){
			$.mobile.loading("show");
			
			$.mobile.changePage(id+".html",{
							allowSamePageTransition: true,
							reloadPage: true,
							transition: 'none'
							});
	}
	else{
		$.mobile.loading("show");
		$.mobile.changePage(id+".html");
	}
	lastPageId = id;
	
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
	

			$.mobile.navigate("buyerproduct.html");
		
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