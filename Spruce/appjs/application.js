var itemId;
var currentItem;
var offset = 0;
var order = "none";
var by = "none";

$(document).ready(function() {
	var change = true;
	$("#lrd-signupshippingAddressCheck").click(function() {
		if (change) {
			$("#lrd-signupshippingShippingButton").attr("onclick", "GoToView('lrd-signupbilling')");
			change = false;
		} else {
			$("#lrd-signupshippingShippingButton").attr("onclick", "GoToView('lrd-signupcredit')");
			change = true;
		}
	});

	var accept = true;
	$("#lrd-checkoutAccept").click(function() {
		if (accept) {
			$("#lrd-checkoutPayUp").attr("onclick", "GoToView('lrd-home')");
			accept = false;
		} else {
			$("#lrd-checkoutPayUp").attr("onclick", "GoToView('lrd-checkout')");
			accept = true;
		}
	});

});

//Before mySpruceView call ajax for bidding
$(document).on('pagebeforeshow', "#lrd-myspruce", function(event, ui) {
	populatePanel("lrd-myspruce");
	ajaxMySpruce("bidding");
});

$(document).on('pagebeforeshow', "#sdlt-popularNowView", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("sdlt-popularNowView");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/Spruce/PopularNow/",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var list = $("#popularnowlist");
			list.empty();
			var images = data.items;
			var len = images.length;
			for (var i = 0; i < len; ++i) {
				var image = images[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + image.itemid + ")><img height='80px' width='80px' style='padding-left:5px; padding-top: 6px' src=" + image.photo + ">" + "<h1 style='margin: 0px'>" + image.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left">' + '<h2 style="font-size: 13px;margin-top:0px">' + image.model + '</h2><p>' + image.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(image.price) + '</h3><p><b>' + image.itemdate + '</b></p></div></div></a></li>');
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

$(document).on('pagebeforeshow', "#lrd-home", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-home");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/home/",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var list = $("#lrd-homePopularContent");
			list.empty();
			list.append("<li><a onclick=GoToView('sdlt-popularNowView')><h3 align='center'>Popular Now</h3></a></li>");
			var images = data.items;
			var len = images.length;

			for (var i = 0; i < 3; ++i) {
				var image = images[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + image.itemid + ")><img height='80px' width='80px' style='padding-left:5px; padding-top: 6px' src=" + image.photo + ">" + "<h1 style='margin: 0px'>" + image.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left">' + '<h2 style="font-size: 13px;margin-top:0px">' + image.model + '</h2><p>' + image.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(image.price) + '</h3><p><b>' + image.itemdate + '</b></p></div></div></a></li>');
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

$(document).on('pagebeforeshow', "#lrd-itemsforcategory", function(event, ui) {
	populatePanel("lrd-itemsforcategory");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getItemsForCategory/" + sessionStorage.category+"/"+by+"-"+order+"/"+offset,
		method : 'get',
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {

			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-itemsList");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];

				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ")><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + object.photo + "'>" + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.itemdate + '</b></p></div></div></a></li>');

			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#rpa-subCategoryPopup", function(event, ui) {
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + sessionStorage.category,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#rpa-subCategoryListPopup");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];

				list.append("<li><a onclick=GetItemsForCategory(" + object.catid + ")>" + object.catname + "</a></li>");

			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-signup", function(event, ui) {
	populatePanel("lrd-signup");
});

$(document).on('pagebeforeshow', "#lrd-signupshipping", function(event, ui) {
	populatePanel("lrd-signupshipping");
});

$(document).on('pagebeforeshow', "#lrd-signupbilling", function(event, ui) {
	populatePanel("lrd-signupbilling");
});

$(document).on('pagebeforeshow', "#lrd-signupcredit", function(event, ui) {
	populatePanel("lrd-signupcredit");
});


$(document).on('pagebeforeshow', "#lrd-login", function(event, ui) {
	populatePanel("lrd-login");
});

$(document).on('pagebeforeshow', "#lrd-checkout", function(event, ui) {
	populatePanel("lrd-checkout");
});

$(document).on('pagebeforeshow', "#lrd-adminreportspage", function(event, ui) {
	populatePanel("lrd-adminreportspage");
});

$(document).on('pagebeforeshow', "#rpa-usernameandpassword", function(event, ui) {
	$("#rpa-username").attr("value", $('#userMyAccountName').text());
	populatePanel("rpa-usernameandpassword");
});

$(document).on('pagebeforeshow', "#rpa-accphoto", function(event, ui) {
	$("#rpa-accphotoimg").attr("src", $('#userMyAccountImage').attr('src'));
	populatePanel("rpa-accphoto");
});

$(document).on('pagebeforeshow', "#rpa-generalinfo", function(event, ui) {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usergeneralinfo",
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var userdata = data.user[0];
			$("#rpa-firstname").attr("value", userdata.accfname);
			$("#rpa-lastname").attr("value", userdata.acclname);
			$("#rpa-email").attr("value", userdata.accemail);
			$("#rpa-lastname").attr("value", userdata.acclname);
			$("#rpa-phone").attr("value", userdata.accphonenum);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	populatePanel("lrd-generalinfo");
});

$(document).on('pagebeforeshow', "#rpa-creditcard", function(event, ui) {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usercreditcardinfo",
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var creditList = data.creditcard;
			var len = creditList.length;
			var list = $("#creditcardlist");
			list.empty();
			for (var i = 0; i < len; ++i) {
				var card = creditList[i];
				list.append("<li data-icon='delete'><a onclick=GoToEditView("+card.cid+",'rpa-creditcardedit')> <h1>Number: "+card.number+"</h1><p>Holder Name: "+card.name+"</br>Type: "+card.type+"</br>Expiration Date: "+card.month+"/"+card.year+"</br>CSC: "+card.csc+"</br>Bills To: "+card.street+"</p> </a><a></a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	populatePanel("rpa-creditcard");
});

$(document).on('pagebeforeshow', "#rpa-shipping", function(event, ui) {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usershippinginfo",
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var addressList = data.address;
			var len = addressList.length;
			var list = $("#shippingList");
			list.empty();
			for (var i = 0; i < len; ++i) {
				var address = addressList[i];
				list.append("<li data-icon='delete'><a onclick=GoToEditView("+address.sid+",'rpa-shippingedit')> <h1>Street: "+address.street+"</h1><p>City: "+address.city+"</br>State: "+address.state+"</br>Country: "+address.country+"</br>Zip: "+address.zip+"</p> </a><a></a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	populatePanel("rpa-shipping");
});

$(document).on('pagebeforeshow', "#rpa-creditcardedit", function(event, ui) {	
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usereditcreditcard/"+sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var address = data.address[0];
			$("#rpa-creditstreet").attr("value", address.street);
			$("#rpa-creditcity").attr("value", address.city);
			$("#rpa-creditstate").attr("value", address.state);
			$("#rpa-creditcountry").attr("value", address.country);
			$("#rpa-creditzip").attr("value", address.zip);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});		
	populatePanel("rpa-creditcardedit");
});

$(document).on('pagebeforeshow', "#rpa-shippingedit", function(event, ui) {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usereditshipping/"+sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var address = data.address[0];
			$("#rpa-shippingstreet").attr("value", address.street);
			$("#rpa-shippingcity").attr("value", address.city);
			$("#rpa-shippingstate").attr("value", address.state);
			$("#rpa-shippingcountry").attr("value", address.country);
			$("#rpa-shippingzip").attr("value", address.zip);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});	
	populatePanel("rpa-shippingedit");
});

$(document).on('pagebeforeshow', "#lrd-category", function(event, ui) {
	populatePanel("lrd-category");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {

			var objectList = data.subcategories;
			var len = objectList.length;
			var list = $("#lrd-categoryList");
			var listSub = "";
			list.empty();
			var object;
			var ojectSub;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];

				if (!object.subcategory) {
					objectSub = object;
					list.append('<li data-role="list-divider" data-theme="b">' + '<li>' + '<div>' + "<h2 style='text-align: center''>" + object.title + ':</h2>' + '</div></li>');
				} else {
					list.append("<li data-role='button'>" + "<a onclick=GetItemsForCategory('" + object.catid + "')><h4>" + object.title + '</h4></a>' + '</li>');
				}

			}

			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-admincategoriespage", function(event, ui) {
	populatePanel("lrd-admincategoriespage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/category",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.category;
			var len = objectList.length;
			var list = $("#lrd-admincategoriespageCategoriesList");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><a>" + object.title + "</a><a href='#lrd-adminremovecatdialog' data-rel='dialog'></a></li>");

			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminuserspage", function(event, ui) {
	populatePanel("lrd-adminuserspage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/users",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.users;
			var len = objectList.length;
			var list = $("#lrd-adminuserspageUsersList");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false"><a href="#lrd-myaccountinfoedit">' + object.user + '</a><a href="#lrd-adminremoveuserdialog" data-rel="dialog"></a></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-bidhistory", function(event, ui) {
	populatePanel("lrd-bidhistory");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/seller-product-bids/"+currentItem.itemid,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.bids;
			var len = objectList.length;
			var list = $("#lrd-BidHistoryList");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false">' + '<div class="ui-grid-a"><div class="ui-block-a"><h3>' + object.accusername + '</h3></div>' + '<div class="ui-block-b" align="right">' + '<h3>' + accounting.formatMoney(object.bidprice) + '</h3></div></div></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-cart", function(event, ui) {

	var account = new Object();
	account.acc = sessionStorage.acc;

	var accountfilter = new Array();
	accountfilter[0] = "acc";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	populatePanel("lrd-cart");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/mycart",
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var objectList = data.cart;
			var len = objectList.length;
			var list = $("#lrd-myCartList");
			list.empty();
			var total = 0;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ") ><img src='" + object.photo + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + object.itemname + '</h1><p style="font-size: 13px;margin-top:0px"><b>' + object.model + '</b></p><p>' + object.brand + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(object.price) + '</h1><p>Amount:' + object.quantity + '</p></div></div><a href="#rpa-deleteItemCart"  data-rel="dialog"></a>');
				total += object.price*object.quantity;
			}
			list.listview("refresh");
			$("#checkoutButton .ui-btn-text").text("Checkout (" + accounting.formatMoney(total) + ")");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-buyerproduct", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-buyerproduct");
	$('#lrd-buyerproductName').text(currentItem.itemname);
	$('#lrd-buyerproductBuyNowPrice').html("Buy it Now: " + accounting.formatMoney(currentItem.price));
	$('#lrd-buyerproductBidPrice').html("Bid: " + accounting.formatMoney(currentItem.currentbidprice));
	$("#lrd-buyerproductImage").attr("src", "" + currentItem.photo);
	$('#lrd-buyerproductQuantity').html("Quantity: " + currentItem.amount);
	$('#lrd-buyerproductTimeRemaining').html("Ending in: " + currentItem.bideventdate);
	$('#lrd-buyerproductModelAndBrand').text(currentItem.model + ", " + currentItem.brand);
	$('#lrd-buyerproductDimensions').text("Dimensions: " + currentItem.dimensions);
	$('#lrd-buyerproductId').text("Id: " + currentItem.itemid);
	$('#lrd-buyerproductDescription').text(currentItem.description);
	$('#lrd-buyerproductSellerName').text(currentItem.accusername);
	$("#lrd-buyerproductSellerName").attr("onlcick", "GoToView('lrd-userprofile')");
	$("#lrd-buyerproductSellerName").attr("data-role", "link");
	$("#popupimage").attr("src", ""+currentItem.photo);
	$.mobile.loading("hide");
});

$(document).on('pagebeforeshow', "#rpa-quantityBuyItDialog", function(event, ui) {
	$("#quantityBuyItSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-quantityAddCartDialog", function(event, ui) {
	$("#quantityAddCartSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-bidDialog", function(event, ui) {
	$("#currentBidDialog").text("Current Bid: "+accounting.formatMoney($('#lrd-buyerproductBidPrice').text().split(" $")[1]));
});

$(document).on('pagebeforeshow', "#lrd-sellerproduct", function( event, ui ) {
	$.mobile.loading("show");
	populatePanel("lrd-sellerproduct");
	$('#lrd-sellerproductName').text(currentItem.itemname);
	$('#lrd-sellerproductBuyNowPrice').html("Buy it Now: " + accounting.formatMoney(currentItem.price) + "</br> Bid: " + accounting.formatMoney(currentItem.currentbidprice));
	$("#lrd-sellerproductImage").attr("src", "" + currentItem.photo);
	$('#lrd-sellerproductTimeRemaining').html("Quantity: " + currentItem.amount + "</br>Ending in: " + currentItem.bideventdate);
	$('#lrd-sellerproductModelAndBrand').text(currentItem.model + ", " + currentItem.brand);
	$('#lrd-sellerproductDimensions').text("Dimensions: " + currentItem.dimensions);
	$('#lrd-sellerproductId').text("Id: " + currentItem.itemid);
	$('#lrd-sellerproductDescription').text(currentItem.description);
	$('#lrd-sellerproductSellerName').text(currentItem.accusername);
	$("#lrd-sellerproductSellerName").attr("onclick", "GoToView('lrd-userprofile')");
	$("#lrd-sellerproductSellerName").attr("data-role", "link");
	$("#popupimageseller").attr("src", ""+currentItem.photo);
	$.mobile.loading("hide");
});

////////////////////////////////////USER PROFILE////////////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userprofile", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-userprofile");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/user/profile",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var currentUser = data.user;
			$('#userProfileName').text(currentUser.userName);
			$('#userProfileEmail').text(currentUser.email);
			//$("#userProfileImage").attr("src","./images/"+currentUser.name+".jpg");
			$('#addressProfileName').html(currentUser.address + "</br>" + currentUser.city + ", " + currentUser.state + " " + currentUser.zip);
			$('#userProfilePhone').text(currentUser.phone);
			
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

/////////////////////////ACCOUNT INFO/////////////////////////
$(document).on('pagebeforeshow', "#lrd-myaccountinfo", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-myaccountinfo");
	
	var password = sessionStorage.acc;
	console.log(password);

	var account = new Object();
	account.password = password;

	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/userProfile",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var currentUser = data.user;
			$('#sdlt-thisshitbetterworknow').empty();
			$('#userMyAccountName').text(currentUser[0].accusername);
			$('#userMyAccountEmail').text(currentUser[0].accemail);
			$("#userMyAccountImage").attr("src",""+currentUser[0].accphoto);
			$('#addressMyAccountName').html(currentUser[0].street + "</br>" + currentUser[0].city + ", " + currentUser[0].state + " " + currentUser[0].zip);
			$('#userMyAccountPhone').text(currentUser[0].accphonenum);
			$('#sdlt-thisshitbetterworknow').append('<li><div class="rateit" data-rateit-value="'+currentUser[0].accrating+'" data-rateit-ispreset="true" data-rateit-readonly="true"></div></li>');
			$('.rateit').rateit();
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-myaccountinfoedit", function(event, ui) {
	populatePanel("lrd-myaccountinfoedit");
});

//////////////////////////SELLER STORE//////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userstore", function(event, ui) {
	populatePanel("lrd-userstore");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/user/store",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-userstoreSellerItems");
			list.empty();
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false"><a  onclick="GetItem(' + object.id + ')"><img style="padding-left:5px; padding-top: 7px"src="css/images/thumbnail.png">' + '<h1 style="margin: 0px">' + object.name + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.startingDate + '</b></p></div></div></a></li>');

			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

function signup(){
	var username = document.all["lrd-signupUsername"].value;
	console.log(username);
	var fname = document.all["lrd-signupName"].value;
	console.log(fname);
	var lname = document.all["lrd-signupLastname"].value;
	console.log(lname);
	var email = document.all["lrd-signupEmail"].value;
	console.log(email);
	var password = document.all["lrd-signupPassword"].value;
	console.log(password);
	var rpassword = document.all["lrd-signupRetypepassword"].value;
	console.log(rpassword);
	var phone = document.all["lrd-signupPhone"].value;
	console.log(phone);
	var photo = document.all["lrd-signupUploadPicture"].value;
	console.log(photo);
	var slt = Math.random();
	console.log(slt);
	var rating = 0;
	
	if(password == rpassword){
		var account = new Object();
		account.username = username;
		account.fname = fname;
		account.lname = lname;
		account.email = email;
		var shaObj = new jsSHA(slt + password, "TEXT");
		var hash = shaObj.getHash("SHA-512", "HEX");
		var hmac = shaObj.getHMAC("SecretKey", "TEXT", "SHA-512", "HEX");
		account.password = hash;
		account.phone = phone;
		account.rating = rating;
		account.slt = slt;
		account.photo = photo;
		
		var accountfilter = new Array();
		accountfilter[0] = "username";
		accountfilter[1] = "fname";
		accountfilter[2] = "lname";
		accountfilter[3] = "email";
		accountfilter[4] = "password";
		accountfilter[5] = "phone";
		accountfilter[6] = "rating";
		accountfilter[7] = "slt";
		accountfilter[8] = "photo";
		
		var jsonText = JSON.stringify(account, accountfilter, "\t");
		
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/signup",
			method : 'put',
			crossDomain : true,
			withCredentials : true,
			data : jsonText,
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				// data.signup;
				GoToView('lrd-login');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				alert("Data not found! Signup");
				GoToView('lrd-login');
			}
		});
	}
	else{
		GoToView("lrd-signup");
	}
}

function login() {
	var username = document.all["lrd-username"].value;
	var password = document.all["lrd-password"].value;
	console.log(username);
	console.log(password);

	var account = new Object();
	account.username = username;

	var accountfilter = new Array();
	accountfilter[0] = "username";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/authenticate1",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			sessionStorage.acc = data.acc[0].accslt;

			var shaObj = new jsSHA(sessionStorage.acc + password, "TEXT");
			var hash = shaObj.getHash("SHA-512", "HEX");
			console.log(hash);
			var hmac = shaObj.getHMAC("SecretKey", "TEXT", "SHA-512", "HEX");
			console.log(hmac);

			account.hash = hash;
			accountfilter[1] = "hash";
			var jsonText1 = JSON.stringify(account, accountfilter, "\t");

			$.ajax({
				url : "http://sprucemarket.herokuapp.com/SpruceServer/authenticate2",
				method : 'put',
				crossDomain : true,
				withCredentials : true,
				data : jsonText1,
				contentType : "application/json",
				success : function(data, textStatus, jqXHR) {
					sessionStorage.acc = data.acc[0].accpassword;
					GoToView('lrd-home');
				},
				error : function(data, textStatus, jqXHR) {
					console.log("textStatus: " + textStatus);
					alert("Data not found! Authenticate2");
					GoToView('lrd-login');
				}
			});
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found! Authenticate1");
			GoToView('lrd-login');
		}
	});
}

function populatePanel(view) {
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#" + view + "SidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory(" + object.catid + ")>" + object.catname + "</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

//Function for the three pages of my Spruce
function ajaxMySpruce(where) {
	populatePanel("lrd-myspruce");
	var account = new Object();
	account.acc = sessionStorage.acc;

	var accountfilter = new Array();
	accountfilter[0] = "acc";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	
	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://sprucemarket.herokuapp.com/SpruceServer/mySpruce/" + where,
		crossDomain : true,
		withCredentials : true,
		method : 'put',
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-myspruceMySpruceList");
			list.empty();
			var object;
			if (where == 'sold') {
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.solddate + '</b></p></div></div></a></li>');
				}
			} else if (where == 'bidding') {
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.date + '</b></p></div></div></a></li>');
				}
			} else {
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  href="#lrd-sellerproduct"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.itemdate + '</b></p></div></div></a></li>');
				}
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////
/// Functions Called Directly from Buttons ///////////////////////

function ConverToJSON(formData) {
	var result = {};
	$.each(formData, function(i, o) {
		result[o.name] = o.value;
	});
	return result;
}

function GoToView(viewName) {
	$.mobile.loading("show");
	$.mobile.changePage("#" + viewName, {
		allowSamePageTransition : true
	});
}

function GetItemsForCategory(category) {
	var itemCategory = category;
	if ( typeof (Storage) !== "undefined") {
		sessionStorage.category = category;
	} else {
		console.log("Web storage not supported");
	}
	$.mobile.loading("show");
	$.mobile.changePage("#lrd-itemsforcategory", {
		allowSamePageTransition : true
	});
}

function GetItem(id) {
	itemId = id;
	$.mobile.loading("show");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getProduct/" + itemId,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			currentItem = data.product[0];
			if ( typeof (Storage) !== "undefined") {
				if (currentItem.accpassword == sessionStorage.acc) {
					$.mobile.changePage("#lrd-sellerproduct", {
						allowSamePageTransition : true
					});
				} else {
					$.mobile.changePage("#lrd-buyerproduct", {
						allowSamePageTransition : true
					});
				}
			} else {
				$.mobile.changePage("#lrd-buyerproduct", {
					allowSamePageTransition : true
				});
			}

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}
function refineQuery(paramby,paramorder){
	by=paramby;
	order=paramorder;
	console.log(by+" "+order);
	GoToView('lrd-itemsforcategory');
	$('#rpa-refinePage').dialog('close');
}
function resetQuery(){
	order="none";
	by="none";
	$('#rpa-refinePage').dialog('close');
}

function GoToEditView(id,view){
	sessionStorage.editId=id;
	$.mobile.loading("show");
	$.mobile.changePage("#"+view, {
		allowSamePageTransition : true
	});	
}
