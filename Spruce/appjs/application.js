var offset = 0;
var order = "none";
var by = "none";
var total;
var change = false;
var link = '';
var how = '';
var utd = '';

$(document).ready(function() {
	$('#lrd-homeSearch-basic').bind("enterKey", function(e) {
		sessionStorage.editId = $('#lrd-homeSearch-basic').val();
		GoToView('rpa-searchpage');
		$('#lrd-homeSearch-basic').val("");
	});
	$('#lrd-homeSearch-basic').keyup(function(e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});
	change = true;
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
			$("#lrd-checkoutPayUp").attr("onclick", "checkOut('" + sessionStorage.acc + "')");
			accept = false;
		} else {
			$("#lrd-checkoutPayUp").attr("onclick", "GoToView('lrd-checkout')");
			accept = true;
		}
	});

});

$(document).on('pagebeforeshow', "#lrd-checkout", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-checkout");
	$('#sdlt-totalamount').empty();
	var password = sessionStorage.acc;
	console.log(password);

	var account = new Object();
	account.password = password;

	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/checkout",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var currentUser = data;
			console.log(JSON.stringify(currentUser));
			$('#lrd-checkoutAccountnumber').empty();
			$('#lrd-checkoutShippingAddress').empty();
			for (var i = 0; i < currentUser.creditnumber.length; i++) {
				var j = i + 1;
				$('#lrd-checkoutAccountnumber').append('<option value = "' + currentUser.creditnumber[i].cid + '">' + currentUser.creditnumber[i].number + '</option>');
			}
			for (var i = 0; i < currentUser.shippinginfo.length; i++) {
				var j = i + 1;
				$('#lrd-checkoutShippingAddress').append('<option value = "' + currentUser.shippinginfo[i].sid + '"> ' + currentUser.shippinginfo[i].street + ', ' + currentUser.shippinginfo[i].city + '</option>');
			}
			$('#lrd-checkoutAccountnumber').selectmenu('refresh', true);
			$('#lrd-checkoutShippingAddress').selectmenu('refresh', true);
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$('#sdlt-totalamount').append("Total: " + accounting.formatMoney(total));
});

//Before mySpruceView call ajax for bidding
$(document).on('pagebeforeshow', "#lrd-mysprucebidding", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-mysprucebidding");
	ajaxMySpruce("bidding");
});

//Before mySpruceView call ajax for selling
$(document).on('pagebeforeshow', "#rpa-myspruceselling", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("rpa-myspruceselling");
	ajaxMySpruce("selling");
});

//Before mySpruceView call ajax for sold
$(document).on('pagebeforeshow', "#rpa-mysprucesold", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("rpa-mysprucesold");
	ajaxMySpruce("sold");
});

//Before mySpruceView call ajax for auction
$(document).on('pagebeforeshow', "#rpa-myspruceauction", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("rpa-myspruceauction");
	ajaxMySpruce("auction");
});

$(document).on('pagebeforeshow', "#sdlt-popularNowView", function(event, ui) {
	$.mobile.loading("show");
	var list = $("#popularnowlist");
	list.empty();
	populatePanel("sdlt-popularNowView");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/Spruce/PopularNow/",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var images = data.items;
			var len = images.length;
			for (var i = 0; i < len; ++i) {
				var image = images[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + image.itemid + ")><img height='80px' width='80px' style='padding-left:5px; padding-top: 6px' src=" + image.photo + ">" + "<h1 style='margin: 0px'>" + image.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left">' + '<h2 style="font-size: 13px;margin-top:0px">' + image.model + '</h2><p>' + image.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(image.price) + '</h3><p><b>' + new Date(image.item_end_date) + '</b></p></div></div></a></li>');
			}
			list.listview('refresh');
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-home", function(event, ui) {
	$.mobile.loading("show");
	if (sessionStorage.user == null)
		sessionStorage.user = "guest";
	var list = $("#lrd-homePopularContent");
	list.empty();
	populatePanel("lrd-home");
	if (sessionStorage.user == "admin") {
		document.getElementById("adminbuttons").style.display = "block";
		document.getElementById("userbuttons").style.display = "none";
	} else {
		document.getElementById("adminbuttons").style.display = "none";
		document.getElementById("userbuttons").style.display = "block";
	}
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/home/",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			list.append("<li><a onclick=GoToView('sdlt-popularNowView')><h3 align='center'>Popular Now</h3></a></li>");
			var images = data.items;
			var len = images.length;

			for (var i = 0; i < len; ++i) {
				var image = images[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + image.itemid + ")><img height='80px' width='80px' style='padding-left:5px; padding-top: 6px' src=" + image.photo + ">" + "<h1 style='margin: 0px'>" + image.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left">' + '<h2 style="font-size: 13px;margin-top:0px">' + image.model + '</h2><p>' + image.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(image.price) + '</h3><p><b>' + new Date(image.item_end_date) + '</b></p></div></div></a></li>');
			}
			list.listview('refresh');
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-searchpage", function(event, ui) {
	$.mobile.loading("show");
	$("#rpa-searchtitle").text("Searching for: " + sessionStorage.editId);
	var list = $("#rpa-searchlist");
	list.empty();
	populatePanel("rpa-searchpage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/searchpage/" + sessionStorage.editId,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ")><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + object.photo + "'>" + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');

			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-itemsforcategory", function(event, ui) {
	populatePanel("lrd-itemsforcategory");
	var list = $("#lrd-itemsList");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getItemsForCategory/" + sessionStorage.category + "/" + by + "-" + order + "/" + offset,
		method : 'get',
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];

				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ")><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + object.photo + "'>" + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');

			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-subCategoryPopup", function(event, ui) {
	var list = $("#rpa-subCategoryListPopup");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var test = true;
			for (var i = 0; i < objectList.length; i++) {
				if (objectList[i].catid == sessionStorage.category) {
					test = false;
					$.ajax({
						url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + sessionStorage.category + "/parent",
						method : 'get',
						contentType : "application/json",
						success : function(data, textStatus, jqXHR) {
							var objectList = data.categories;
							var len = objectList.length;
							var object;
							for (var i = 0; i < len; ++i) {
								object = objectList[i];
								list.append("<li><a onclick=GetItemsForCategory(" + object.catid + ")>" + object.catname + "</a></li>");
							}
							list.listview("refresh");
						},
						error : function(data, textStatus, jqXHR) {
							console.log("textStatus: " + textStatus);

						}
					});
				}
			}
			if (test) {
				$.ajax({
					url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + sessionStorage.category + "/child",
					method : 'get',
					contentType : "application/json",
					success : function(data, textStatus, jqXHR) {
						var objectList = data.categories;
						var len = objectList.length;
						var object;
						for (var i = 0; i < len; ++i) {
							object = objectList[i];
							list.append("<li><a onclick=GetItemsForCategory(" + object.catid + ")>" + object.catname + "</a></li>");
						}
						list.listview("refresh");
					},
					error : function(data, textStatus, jqXHR) {
						console.log("textStatus: " + textStatus);

					}
				});
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

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

$(document).on('pagebeforeshow', "#sdlt-adminmyaccountinfoedit", function(event, ui) {
	populatePanel("sdlt-adminmyaccountinfoedit");
});

$(document).on('pagebeforeshow', "#lrd-sellitem", function(event, ui) {
	populatePanel("lrd-sellitem");
});

$(document).on('pagebeforeshow', "#rpa-acceptbidpage", function(event, ui) {
	populatePanel("rpa-acceptbidpage");
	$.mobile.loading("show");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/negotiateBid/" + sessionStorage.editId,
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			var info = data.bidinfo[0];
			$('#acceptbidimage').attr("src", info.accphoto);
			$('#acceptbidinfo').text("Bid Won: " + accounting.formatMoney(info.currentbidprice));
			$('#bidderusername').text(info.accusername);
			$('#bidderusername').attr("onclick", "goToSellerProfile('" + info.accusername + "')");
			var list = $('#rateitstarshitbid');
			list.empty();
			list.append('<div class="rateit" data-rateit-value="' + info.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
			$('.rateit').rateit();
			var list = $("#rpa-itemacceptbid");
			list.empty();
			list.append("<li data-icon='false'><a><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + info.photo + "'>" + '<h1 style="margin: 0px">' + info.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + info.model + '</h2><p>' + info.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(info.price) + '</h3><p>&nbsp</p></div></div></a></li>');
			list.listview('refresh');
			$('#acceptbidbutton').attr("onclick", "acceptBid('" + info.itemid + "')");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-soldreciept", function(event, ui) {
	populatePanel("rpa-soldreciept");
	$.mobile.loading("show");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/soldReciept/" + sessionStorage.invoice + "/" + sessionStorage.item,
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			var info = data.recieptinfo[0];
			$('#buyerimagereciept').attr("src", info.accphoto);
			$('#buyershippingreciept').text(info.street + ", " + info.city + ", " + info.state + ", " + info.country + ", " + info.zip);
			$('#buyeramountreciept').text(accounting.formatMoney(sessionStorage.price * info.itemquantity) + ", " + info.itemquantity);
			$('#buyerdatereciept').text(new Date(info.invoicedate));
			$('#buyerusernamereciept').text(info.accusername);
			$('#buyerusernamereciept').attr("onclick", "goToSellerProfile('" + info.accusername + "')");
			var list = $('#rateitstarshitreciept');
			list.empty();
			list.append('<div class="rateit" data-rateit-value="' + info.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
			$('.rateit').rateit();
			var list = $("#rpa-buyeritemreciept");
			list.empty();
			list.append("<li data-icon='false'><a><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + info.photo + "'>" + '<h1 style="margin: 0px">' + info.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + info.model + '</h2><p>' + info.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(sessionStorage.price) + '</h3><p>&nbsp</p></div></div></a></li>');
			list.listview('refresh');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-rating", function(event, ui) {
	populatePanel("rpa-rating");
	$.mobile.loading("show");
	var list = $("#rpa-ratinglist");
	list.empty();
	var currentUser = JSON.parse(sessionStorage.accountinfo);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getRating/" + currentUser.accid,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var ratingList = data.ratings;
			var len = ratingList.length;
			for (var i = 0; i < len; ++i) {
				var rating = ratingList[i];
				list.append("<li data-icon='false'><a onclick=goToSellerProfile('" + rating.accusername + "')><img src='" + rating.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + rating.accusername + '</h1><p style="font-size: 13px;margin-top:5px;white-space:normal">' + rating.comment + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >Rating: ' + rating.rating + '</h1></div></div></a></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-invoice", function(event, ui) {
	var list = $("#lrd-invoiceList");
	list.empty();
	populatePanel("lrd-invoice");
	var account = new Object();
	account.acc = sessionStorage.acc;
	var accountfilter = new Array();
	accountfilter[0] = "acc";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/purchaseSumary",
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			total = 0;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><img src='" + object.photo + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + object.itemname + '</h1><p style="font-size: 13px;margin-top:0px"><b>' + object.model + '</b></p><p>' + object.brand + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(object.price) + '</h1><p>Amount:' + object.quantity + '</p></div></div>');
				total += object.price * object.quantity;
			}
			list.listview("refresh");
			$("#checkoutSaddress").text(objectList[0].street + ", " + objectList[0].city + ", " + objectList[0].state + ", " + objectList[0].country + ", " + objectList[0].zip);
			$("#checkoutCard").html(objectList[0].number);
			$("#checkoutTotal").html(accounting.formatMoney(total));
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminreportspage", function(event, ui) {
	populatePanel("lrd-adminreportspage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/totalSellsReport",
		contentType : "application/json",
		method : 'get',
		success : function(data, textStatus, jqXHR) {
			$("#lrd-adminreportspageTotalSells").text("Total items sold: " + data.sells[0].sells + "");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$('#lrd-adminreportspageSellsCategory').empty();
			$('#lrd-adminreportspageRevenueCategory').empty();
			for (var i = 0; i < data.categories.length; i++) {
				var j = i + 1;
				$('#lrd-adminreportspageSellsCategory').append('<option value = "' + data.categories[i].catname + '" id="' + data.categories[i].catname + '"> ' + data.categories[i].catname + '</option>');
				$('#lrd-adminreportspageRevenueCategory').append('<option value = "' + data.categories[i].catname + '" id="' + data.categories[i].catname + '"> ' + data.categories[i].catname + '</option>');
			}
			$('#lrd-adminreportspageSellsCategory').selectmenu('refresh', true);
			$('#lrd-adminreportspageRevenueCategory').selectmenu('refresh', true);
			$.mobile.loading("hide");

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});

});

$(document).on('pagebeforeshow', "#lrd-pastinvoice", function(event, ui) {
	populatePanel("lrd-pastinvoice");
	$("#lrd-pastinvoiceList").listview("refresh");
});

$(document).on('pagebeforeshow', "#rpa-usernameandpassword", function(event, ui) {
	$("#rpa-username").attr("value", $('#userMyAccountName').text());
	populatePanel("rpa-usernameandpassword");
});

function changeUserUsername() {
	var username = document.getElementById('rpa-username').value;
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeUserUsername/" + username,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-usernameandpassword');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});

}


$(document).on('pagebeforeshow', "#rpa-accphoto", function(event, ui) {
	$("#rpa-accphotoimg").attr("src", $('#userMyAccountImage').attr('src'));
	populatePanel("rpa-accphoto");
});

function changeUserPhoto() {
	var photo = link + ".png";
	photo = link.split("/");
	console.log(photo);

	var password = sessionStorage.acc;
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/editUserPhoto/" + photo[3],
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-accphoto');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.mobile.loading("hide");
}


$(document).on('pagebeforeshow', "#lrd-buyers", function(event, ui) {
	populatePanel("lrd-buyers");
	$("#lrd-buyersList").listview('refresh');
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

		}
	});
	populatePanel("lrd-generalinfo");
});

function changeUserGeneralInfo() {
	var password = sessionStorage.acc;
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	var fname = document.getElementById('rpa-firstname').value;
	var lname = document.getElementById('rpa-lastname').value;
	var email = document.getElementById('rpa-email').value;
	var phone = document.getElementById('rpa-phone').value;

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/editGeneralInfo/" + fname + "/" + lname + "/" + email + "/" + phone,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('lrd-myaccountinfo');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.mobile.loading("hide");
}


$(document).on('pagebeforeshow', "#rpa-creditcard", function(event, ui) {
	var list = $("#creditcardlist");
	list.empty();
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
			for (var i = 0; i < len; ++i) {
				var card = creditList[i];
				if(card.defaultcard){
					list.append("<li data-icon='false'><a onclick=GoToEditView('" + card.cid + "-" + card.bid + "','rpa-creditcardedit')> <h1>Number: " + card.number + " Default</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a></li>");	
				}
				else{
					list.append("<li data-icon='delete'><a onclick=GoToEditView('" + card.cid + "-" + card.bid + "','rpa-creditcardedit')> <h1>Number: " + card.number + "</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a><a onclick=GoToEditViewPopup('" + card.cid + "','rpa-removecreditcarddialog')></a></li>");
				}
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	populatePanel("rpa-creditcard");
});

function changeUserBillingAddress() {
	var street = document.getElementById('rpa-creditstreet').value;
	var city = document.getElementById('rpa-creditcity').value;
	var state = document.getElementById('rpa-creditstate').value;
	var country = document.getElementById('rpa-creditcountry').value;
	var zip = document.getElementById('rpa-creditzip').value;

	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	console.log(sessionStorage.editId);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeUserBillingAddress/" + street + "/" + city + "/" + state + "/" + country + "/" + zip + "/" + sessionStorage.editId,
		contentType : "application/json",
		method : 'put',
		crossDomain : true,
		data : jsonText,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function addUserCreditCard() {
	var name = document.getElementById('sam-usercreditCardholder').value;
	var number = document.getElementById('sam-usercreditNumberCard').value;
	var expmonth = document.getElementById('sam-usercreditExpMonth').value;
	var expyear = document.getElementById('sam-usercreditExpYear').value;
	var csc = document.getElementById('sam-usercreditCsc').value;
	var type;
	if ($('#sam-usercreditVisa').is(':checked')) {
		type = document.all["sam-usercreditVisa"].value;
	} else if ($('#sam-usercreditMasterCard').is(':checked')) {
		type = document.all["sam-usercreditMasterCard"].value;
	} else {
		type = document.all["sam-usercreditAmericanExpress"].value;
	}

	var street = document.getElementById('sam-usercreditstreet').value;
	var city = document.getElementById('sam-usercreditcity').value;
	var state = document.getElementById('sam-usercreditstate').value;
	var country = document.getElementById('sam-usercreditcountry').value;
	var zip = document.getElementById('sam-usercreditzip').value;

	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/addUserCreditCardInfo/" + name + "/" + number + "/" + expmonth + "/" + expyear + "/" + csc + "/" + type + "/" + street + "/" + city + "/" + state + "/" + country + "/" + zip,
		contentType : "application/json",
		method : 'put',
		data : jsonText,
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#rpa-shipping", function(event, ui) {
	var list = $("#shippingList");
	list.empty();
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
			for (var i = 0; i < len; ++i) {
				var address = addressList[i];
				if(address.defaultaddress)
					list.append("<li data-icon='false'><a onclick=GoToEditView(" + address.sid + ",'rpa-shippingedit')> <h1>Street: " + address.street + " Default</h1><p>City: " + address.city + "</br>State: " + address.state + "</br>Country: " + address.country + "</br>Zip: " + address.zip + "</p> </a></li>");
				else
					list.append("<li data-icon='delete'><a onclick=GoToEditView(" + address.sid + ",'rpa-shippingedit')> <h1>Street: " + address.street + "</h1><p>City: " + address.city + "</br>State: " + address.state + "</br>Country: " + address.country + "</br>Zip: " + address.zip + "</p> </a><a onclick=GoToEditViewPopup('"+address.sid+"','sam-deletesaddressdialog')></a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	populatePanel("rpa-shipping");
});

function makeDefaultShippingAddress(){
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/makedefaultsaddress/"+sessionStorage.editId,
		contentType : "application/json",
		method : 'put',
		crossDomain : true,
		data : jsonText,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
		}
	});
}

function deleteUserShippingAddress(){
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/deleteusershipping/"+sessionStorage.editId,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function addUserShippingAddress() {
	var street = document.getElementById('sam-usershippingstreet').value;
	var city = document.getElementById('sam-usershippingcity').value;
	var state = document.getElementById('sam-usershippingstate').value;
	var country = document.getElementById('sam-usershippingcountry').value;
	var zip = document.getElementById('sam-usershippingzip').value;

	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/addUserShippingAddress/" + street + "/" + city + "/" + state + "/" + country + "/" + zip,
		contentType : "application/json",
		method : 'put',
		crossDomain : true,
		data : jsonText,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function changeUserShippingAddress() {
	var street = document.getElementById('rpa-shippingstreet').value;
	var city = document.getElementById('rpa-shippingcity').value;
	var state = document.getElementById('rpa-shippingstate').value;
	var country = document.getElementById('rpa-shippingcountry').value;
	var zip = document.getElementById('rpa-shippingzip').value;

	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	console.log(sessionStorage.editId);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeUserShippingAddress/" + street + "/" + city + "/" + state + "/" + country + "/" + zip + "/" + sessionStorage.editId,
		contentType : "application/json",
		method : 'put',
		crossDomain : true,
		data : jsonText,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#rpa-creditcardedit", function(event, ui) {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usereditcreditcard/" + sessionStorage.editId,
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
		url : "http://sprucemarket.herokuapp.com/SpruceServer/usereditshipping/" + sessionStorage.editId,
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

		}
	});
	populatePanel("rpa-shippingedit");
});

$(document).on('pagebeforeshow', "#lrd-category", function(event, ui) {
	var list = $("#lrd-categoryList");
	list.empty();
	populatePanel("lrd-category");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-role="list-divider" data-theme="b">' + object.catname + '</li>');
				for (var j = 0; j < object.subcat.length; j++) {
					var subobject = object.subcat[j];
					list.append("<li data-role='button'>" + "<a onclick=GetItemsForCategory('" + subobject.catid + "')>" + subobject.catname + "</a></li>");
				}
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-admincategoriespage", function(event, ui) {
	var list = $("#lrd-admincategoriespageCategoriesList");
	list.empty();
	populatePanel("lrd-admincategoriespage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li><a onclick=GoToEditView('" + object.catid + "','rpa-adminsubcategoriespage')>" + object.catname + "</a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});
$(document).on('pagebeforeshow', "#rpa-adminsubcategoriespage", function(event, ui) {
	populatePanel("rpa-adminsubcategoriespage");
	var list = $("#rpa-adminsubcategoriespagelist");
	list.empty();
	$('#rpa-nomorecats').text("");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + sessionStorage.editId + "/parent",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			for ( i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li><a onclick=adminSubCategories('" + object.catid + "','" + object.catname + "')>" + object.catname + "</a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminuserspage", function(event, ui) {
	var list = $("#lrd-adminuserspageUsersList");
	list.empty();
	populatePanel("lrd-adminuserspage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/users",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.users;
			var len = objectList.length;
			var list = $('#lrd-adminuserspageUsersList');
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false"><a onclick=goToAccountEditPage("' + object.accusername + '")>' + object.accusername + '</a><a onclick=setUTD("'+ object.accusername +'") href="#lrd-adminremoveuserdialog" data-rel="dialog"></a></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

function setUTD(usernameToDelete){
	utd = usernameToDelete;
}

function deleteUser(){
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/deleteuser/" + utd,
		crossDomain : true,
		withCredentials : true,
		method : 'put',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('lrd-adminuserspage');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function goToAccountEditPage(username) {
	console.log(username);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/adminaccountedit/" + username,
		crossDomain : true,
		withCredentials : true,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			sessionStorage.adminaccountinfo = JSON.stringify(data.userinfo);
			GoToView('sdlt-adminmyaccountinfoedit');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#sam-usernameandpassword", function(event, ui) {
	populatePanel("sam-usernameandpassword");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-username").attr("value", accountinfo[0].accusername);
});

function changeUsername() {
	var toChange = document.getElementById('sam-username').value;
	console.log(toChange);
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	console.log(accountinfo);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeUsername/" + accountinfo[0].accusername + "/" + toChange,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-usernameandpassword');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#sam-accphoto", function(event, ui) {
	populatePanel("sam-accphoto");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-accphotoimg").attr("src", accountinfo[0].accphoto);
});

function adminupload() {
	var photo = link + ".png";

	console.log(photo);
	var account = new Object();
	account.photo = photo;

	var accountfilter = new Array();
	accountfilter[0] = "photo";

	var jsonText = JSON.stringify(account, accountfilter, "\t");
	console.log(jsonText);
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);

	console.log(accountinfo);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/editaccphoto/" + accountinfo[0].accusername,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('sdlt-adminmyaccountinfoedit');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.mobile.loading("hide");
}


$(document).on('pagebeforeshow', "#sam-generalinfo", function(event, ui) {
	populatePanel("sam-generalinfo");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-firstname").attr("value", accountinfo[0].accfname);
	$("#sam-lastname").attr("value", accountinfo[0].acclname);
	$("#sam-email").attr("value", accountinfo[0].accemail);
	$("#sam-lastname").attr("value", accountinfo[0].acclname);
	$("#sam-phone").attr("value", accountinfo[0].accphonenum);
});

function changeGeneralInfo() {
	var fname = document.getElementById('sam-firstname').value;
	var lname = document.getElementById('sam-lastname').value;
	var email = document.getElementById('sam-email').value;
	var tel = document.getElementById('sam-phone').value;
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeGeneralInfo/" + accountinfo[0].accusername + "/" + fname + "/" + lname + "/" + email + "/" + tel,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-generalinfo');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#sam-creditcard", function(event, ui) {
	populatePanel("sam-creditcard");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	var list = $('#sam-creditcardlist');
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/admincreditcardinfo/" + accountinfo[0].accusername,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var creditList = data.creditcard;
			var len = creditList.length;
			for (var i = 0; i < len; ++i) {
				var card = creditList[i];
				if(card.defaultcard){
					list.append("<li data-icon='false'><a onclick=GoToEditView('" + card.cid + "-" + card.bid + "','sam-creditcardedit')> <h1>Number: " + card.number + " Default</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a></li>");	
				}
				else{
					list.append("<li data-icon='delete'><a onclick=GoToEditView('" + card.cid + "-" + card.bid + "','sam-creditcardedit')> <h1>Number: " + card.number + "</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a><a onclick=GoToEditViewPopup('" + card.cid + "','rpa-adminremovecreditcarddialog')></a></li>");
				}
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	list.listview("refresh");
});

function changeCreditCardInfo() {
	var street = document.getElementById('sam-creditstreet').value;
	var city = document.getElementById('sam-creditcity').value;
	var state = document.getElementById('sam-creditstate').value;
	var country = document.getElementById('sam-creditcountry').value;
	var zip = document.getElementById('sam-creditzip').value;

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeCreditCardInfo/" + accountinfo[0].accusername + "/" + street + "/" + city + "/" + state + "/" + country + "/" + zip + "/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function addCreditCard() {
	var name = document.getElementById('sam-signupcreditCardholder').value;
	var number = document.getElementById('sam-creditNumberCard').value;
	var expmonth = document.getElementById('sam-creditExpMonth').value;
	var expyear = document.getElementById('sam-creditExpYear').value;
	var csc = document.getElementById('sam-creditCsc').value;
	var type;
	if ($('#sam-creditVisa').is(':checked')) {
		type = document.all["sam-creditVisa"].value;
	} else if ($('#sam-creditMasterCard').is(':checked')) {
		type = document.all["sam-creditMasterCard"].value;
	} else {
		type = document.all["sam-creditAmericanExpress"].value;
	}

	var street = document.getElementById('sam-admincreditstreet').value;
	var city = document.getElementById('sam-admincreditcity').value;
	var state = document.getElementById('sam-admincreditstate').value;
	var country = document.getElementById('sam-admincreditcountry').value;
	var zip = document.getElementById('sam-admincreditzip').value;

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/addCreditCardInfo/" + accountinfo[0].accusername + "/" + name + "/" + number + "/" + expmonth + "/" + expyear + "/" + csc + "/" + type + "/" + street + "/" + city + "/" + state + "/" + country + "/" + zip,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#sam-shipping", function(event, ui) {
	populatePanel("sam-shipping");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	var list = $('#sam-shippingList');
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/adminshippinginfo/" + accountinfo[0].accusername,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var addressList = data.address;
			var len = addressList.length;
			for (var i = 0; i < len; ++i) {
				var address = addressList[i];
				list.append("<li data-icon='delete'><a onclick=GoToEditView(" + address.sid + ",'sam-shippingedit')> <h1>Street: " + address.street + "</h1><p>City: " + address.city + "</br>State: " + address.state + "</br>Country: " + address.country + "</br>Zip: " + address.zip + "</p> </a><a></a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	list.listview("refresh");
});

$(document).on('pagebeforeshow', "#sam-shippingedit", function(event, ui) {
	populatePanel("sam-shippingedit");
	var user = JSON.parse(sessionStorage.adminaccountinfo)[0].accusername;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/admineditshipping/" + user + "/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var address = data.address[0];
			$("#sam-shippingstreet").attr("value", address.street);
			$("#sam-shippingcity").attr("value", address.city);
			$("#sam-shippingstate").attr("value", address.state);
			$("#sam-shippingcountry").attr("value", address.country);
			$("#sam-shippingzip").attr("value", address.zip);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

function addShippingAddress() {
	var street = document.getElementById('sam-adminshippingstreet').value;
	var city = document.getElementById('sam-adminshippingcity').value;
	var state = document.getElementById('sam-adminshippingstate').value;
	var country = document.getElementById('sam-adminshippingcountry').value;
	var zip = document.getElementById('sam-adminshippingzip').value;

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/addAdminShippingAddress/" + accountinfo[0].accusername + "/" + street + "/" + city + "/" + state + "/" + country + "/" + zip,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function changeShippingAddressInfo() {
	var street = document.getElementById('sam-shippingstreet').value;
	var city = document.getElementById('sam-shippingcity').value;
	var state = document.getElementById('sam-shippingstate').value;
	var country = document.getElementById('sam-shippingcountry').value;
	var zip = document.getElementById('sam-shippingzip').value;

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/changeShippingAddressInfo/" + sessionStorage.editId + "/" + street + "/" + city + "/" + state + "/" + country + "/" + zip,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-shipping');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}


$(document).on('pagebeforeshow', "#sam-creditcardedit", function(event, ui) {
	populatePanel("sam-creditcardedit");
	var user = JSON.parse(sessionStorage.adminaccountinfo)[0].accusername;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/admineditcreditcard/" + user + "/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var address = data.address[0];
			$("#sam-creditstreet").attr("value", address.street);
			$("#sam-creditcity").attr("value", address.city);
			$("#sam-creditstate").attr("value", address.state);
			$("#sam-creditcountry").attr("value", address.country);
			$("#sam-creditzip").attr("value", address.zip);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-bidhistory", function(event, ui) {
	var list = $("#lrd-BidHistoryList");
	list.empty();
	populatePanel("lrd-bidhistory");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/seller-product-bids/" + JSON.parse(sessionStorage.currentItem).itemid,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.bids;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false">' + '<div class="ui-grid-a"><div class="ui-block-a"><h3>' + object.accusername + '</h3></div>' + '<div class="ui-block-b" align="right">' + '<h3>' + accounting.formatMoney(object.bidprice) + '</h3></div></div></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-cart", function(event, ui) {
	populatePanel("lrd-cart");
	how = "cart";
	var list = $("#lrd-myCartList");
	list.empty();
	var jsonText;
	// Check if user is a guest
	if (sessionStorage.user == "guest") {
		console.log("in guest");
		var guest = new Object();
		guest.gid = localStorage.guestId;
		var guestfilter = new Array();
		guestfilter[0] = "gid";
		jsonText = JSON.stringify(guest, guestfilter, "\t");
	} else if (sessionStorage.user == "user") {
		var account = new Object();
		account.acc = sessionStorage.acc;
		var accountfilter = new Array();
		accountfilter[0] = "acc";
		jsonText = JSON.stringify(account, accountfilter, "\t");
	}
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
			if (len == 0) {
				$("#checkoutButton .ui-btn-text").text("No items in cart :(  See Popular items here!");
				$("#checkoutButton").attr("onclick", "GoToView('sdlt-popularNowView')");
			} else {
				total = 0;
				var object;
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ") ><img src=" + object.photo + " style='resize:both; overflow:scroll; width:80px; height:80px'><div class='ui-grid-a'><div class='ui-block-a'><h1 style='margin: 0px'>" + object.itemname + "</h1><p style='font-size: 13px;margin-top:0px'><b>" + object.model + "</b></p><p>" + object.brand + "</p></div><div class='ui-block-b' align='right'><h1 style='font-size: 16px' >" + accounting.formatMoney(object.price) + "</h1><p>Amount:" + object.quantity + "</p></div></div><a onclick=GoToEditViewPopup(" + object.itemid + ",'rpa-deleteItemCart')></a>");
					total += object.price * object.quantity;
				}
				list.listview("refresh");
				$("#checkoutButton .ui-btn-text").text("Checkout (" + accounting.formatMoney(total) + ")");
				if (sessionStorage.user == "guest") {
					$("#checkoutButton").attr("onclick", "GoToView('lrd-login')");
				} else {
					$("#checkoutButton").attr("onclick", "GoToView('lrd-checkout')");
				}
			}
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-buyerproduct", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-buyerproduct");
	var jsonText;
	// Check if user is a guest
	if (sessionStorage.user == "guest") {
		console.log("in guest");
		var guest = new Object();
		guest.gid = localStorage.guestId;
		var guestfilter = new Array();
		guestfilter[0] = "gid";
		jsonText = JSON.stringify(guest, guestfilter, "\t");
	} else if (sessionStorage.user == "user") {
		var password = sessionStorage.acc;
		console.log(password);
		var account = new Object();
		account.password = password;
		var accountfilter = new Array();
		accountfilter[0] = "password";
		jsonText = JSON.stringify(account, accountfilter, "\t");
	}
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getProduct/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			var currentItem = data.product[0];
			sessionStorage.currentItem = JSON.stringify(currentItem);
			$('#lrd-buyerproductName').text(currentItem.itemname);
			$('#lrd-buyerproductBuyNowPrice').html("Buy it Now: " + accounting.formatMoney(currentItem.price));
			$("#lrd-buyerproductImage").attr("src", "" + currentItem.photo);
			$('#lrd-buyerproductQuantity').html("Quantity: " + currentItem.amount);
			$('#lrd-buyerproductTimeRemaining').html("Ending in: " + new Date(currentItem.item_end_date));
			$('#lrd-buyerproductModelAndBrand').text(currentItem.model + ", " + currentItem.brand);
			$('#lrd-buyerproductDimensions').text("Dimensions: " + currentItem.dimensions);
			$('#lrd-buyerproductId').text("Id: " + currentItem.itemid);
			$('#lrd-buyerproductDescription').text(currentItem.description);
			$('#lrd-buyerproductSellerName').text(currentItem.accusername);
			$("#lrd-buyerproductSellerName").attr("onclick", "goToSellerProfile('" + currentItem.accusername + "')");
			$("#popupimage").attr("src", "" + currentItem.photo);
			var list = $('#rpa-rateitbuyer');
			list.empty();
			list.append('<div class="rateit" data-rateit-value="' + currentItem.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
			$('.rateit').rateit();
			// Logic for diplaying bid button and bid price
			if (currentItem.currentbidprice === null) {
				document.getElementById("rpa-bidbutton").style.display = "none";
				document.getElementById("lrd-buyerproductBidPrice").style.display = "none";
			} else {
				document.getElementById("rpa-bidbutton").style.display = "block";
				document.getElementById("lrd-buyerproductBidPrice").style.display = "block";
				$('#lrd-buyerproductBidPrice').html("Bid: " + accounting.formatMoney(currentItem.currentbidprice));
			}
			// If user has the item in cart update quantity button appears
			if (currentItem.quantityincart != "0") {
				$("#rpa-cartbutton").attr("href", "#rpa-quantityUpdateCartDialog");
				$("#rpa-cartbutton .ui-btn-text").text("Update Quantity");
			} else {
				$("#rpa-cartbutton").attr("href", "#rpa-quantityAddCartDialog");
				$("#rpa-cartbutton .ui-btn-text").text("Add to Cart");
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.mobile.loading("hide");
});

$(document).on('pagebeforeshow', "#rpa-quantityBuyItDialog", function(event, ui) {
	var currentItem = JSON.parse(sessionStorage.currentItem);
	$("#quantityBuyItSlider").val(1).slider("refresh");
	$("#quantityBuyItSlider").attr("max", parseInt(currentItem.amount));
});

function buyitnow() {
	if (sessionStorage.user == 'user') {
		how = "buyitnow";
		var currentItem = JSON.parse(sessionStorage.currentItem);
		total = currentItem.price * document.all["quantityBuyItSlider"].value;
		GoToView('lrd-checkout');
	} else {
		GoToView('lrd-login');
	}
}


$(document).on('pagebeforeshow', "#rpa-quantityAddCartDialog", function(event, ui) {
	$("#quantityAddCartSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-quantityUpdateCartDialog", function(event, ui) {
	$("#quantityUpdateCartSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-bidDialog", function(event, ui) {
	var currentItem = JSON.parse(sessionStorage.currentItem);
	$("#currentBidDialog").text("Current Bid: " + accounting.formatMoney(currentItem.currentbidprice));
});

$(document).on('pagebeforeshow', "#lrd-sellerproduct", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-sellerproduct");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getProduct/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			var currentItem = data.product[0];
			sessionStorage.currentItem = JSON.stringify(currentItem);
			// Logic for diplaying bid button and bid price
			if (currentItem.restock) {
				document.getElementById("rpa-restockbutton").style.display = "block";
				document.getElementById("rpa-bidhistorybutton").style.display = "none";
				document.getElementById("lrd-sellerproductBidPrice").style.display = "none";
			} else {
				$('#lrd-sellerproductBidPrice').text("Bid: " + accounting.formatMoney(currentItem.currentbidprice));
				document.getElementById("rpa-bidhistorybutton").style.display = "block";
				document.getElementById("lrd-sellerproductBidPrice").style.display = "block";
				document.getElementById("rpa-restockbutton").style.display = "none";
			}
			///DONT TOUCH THIS. IN CASE OF EMERGENCY
			// if (currentItem.restock && (currentItem.currentbidprice !== null)) {
			// document.getElementById("rpa-sellerbuttons").style.display = "block";
			// document.getElementById("rpa-bidhistorybutton").style.display = "none";
			// document.getElementById("rpa-restockbutton").style.display = "none";
			// } else {
			// document.getElementById("rpa-sellerbuttons").style.display = "none";
			// if (currentItem.restock) {
			// document.getElementById("rpa-restockbutton").style.display = "block";
			// } else {
			// document.getElementById("rpa-restockbutton").style.display = "none";
			// }
			// if (currentItem.currentbidprice === null) {
			// document.getElementById("rpa-bidhistorybutton").style.display = "none";
			// } else {
			// document.getElementById("rpa-bidhistorybutton").style.display = "block";
			// }
			// }
			$('#lrd-sellerproductName').text(currentItem.itemname);
			$('#lrd-sellerproductBuyNowPrice').text("Buy it Now: " + accounting.formatMoney(currentItem.price));
			$("#lrd-sellerproductImage").attr("src", "" + currentItem.photo);
			$('#lrd-sellerproductTimeRemaining').html("Quantity: " + currentItem.amount + "</br>Ending in: " + new Date(currentItem.item_end_date));
			$('#lrd-sellerproductModelAndBrand').text(currentItem.model + ", " + currentItem.brand);
			$('#lrd-sellerproductDimensions').text("Dimensions: " + currentItem.dimensions);
			$('#lrd-sellerproductId').text("Id: " + currentItem.itemid);
			$('#lrd-sellerproductDescription').text(currentItem.description);
			$('#lrd-sellerproductSellerName').text(currentItem.accusername);
			$("#lrd-sellerproductSellerName").attr("onclick", "GoToView('lrd-myaccountinfo')");
			$("#lrd-buyersButton").attr("onclick", "getBuyersList('" + currentItem.itemid + "')");
			$("#lrd-sellerproductSellerName").attr("data-role", "link");
			$("#lrd-sellerproductSellerName").attr("onclick", "GoToView('lrd-myaccountinfo')");
			$("#popupimageseller").attr("src", "" + currentItem.photo);
			var list = $('#lrd-sellerRating');
			list.empty();
			list.append('<div class="rateit" data-rateit-value="' + currentItem.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
			$('.rateit').rateit();
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.mobile.loading("hide");
});

////////////////////////////////////SELLER PROFILE////////////////////////////////////////
function goToSellerProfile(username) {
	console.log(username);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/sellerprofile/" + username,
		crossDomain : true,
		withCredentials : true,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			if(data.success){
				alert("This accoun is no longer active");
				GoToView('lrd-home');
			}
			else if (data.sellerprofile[0].accpassword == sessionStorage.acc) {
				GoToView('lrd-myaccountinfo');
			} else {
				sessionStorage.accountinfo = JSON.stringify(data.sellerprofile[0]);
				GoToView('lrd-userprofile');
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});

}

////////////////////////////////////SELLER PROFILE////////////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userprofile", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-userprofile");

	var currentUser = JSON.parse(sessionStorage.accountinfo);
	$('#rateitstarshit').empty();
	$('#userProfileName').text(currentUser.accusername);
	$('#userProfileEmail').text(currentUser.accemail);
	$("#userProfileImage").attr("src", "" + currentUser.accphoto);
	$('#addressProfileName').html(currentUser.street + "</br>" + currentUser.city + ", " + currentUser.state + " " + currentUser.zip);
	$('#userProfilePhone').text(currentUser.accphonenum);
	$('#rateitstarshit').append('<div style="margin-top: 0px" class="rateit" data-rateit-value="' + currentUser.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
	$('.rateit').rateit();
	if (sessionStorage.user == "user") {
		document.getElementById("rpa-rateButton").style.display = "block";
		document.getElementById("rpa-sendMessage").style.display = "block";
	} else {
		document.getElementById("rpa-rateButton").style.display = "none";
		document.getElementById("rpa-sendMessage").style.display = "none";
	}
	$.mobile.loading("hide");
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
			sessionStorage.accountinfo = JSON.stringify(data.user[0]);
			var currentUser = data.user;
			$('#sdlt-thisshitbetterworknow').empty();
			$('#userMyAccountName').text(currentUser[0].accusername);
			$('#userMyAccountEmail').text(currentUser[0].accemail);
			$("#userMyAccountImage").attr("src", "" + currentUser[0].accphoto);
			$('#addressMyAccountName').html(currentUser[0].street + "</br>" + currentUser[0].city + ", " + currentUser[0].state + " " + currentUser[0].zip);
			$('#userMyAccountPhone').text(currentUser[0].accphonenum);
			$('#sdlt-thisshitbetterworknow').append('<div class="rateit" data-rateit-value="' + currentUser[0].accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
			$('.rateit').rateit();
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-chat", function(event, ui) {
	$.mobile.loading("show");
	var list = $("#rpa-messagelist");
	list.empty();
	populatePanel("rpa-chat");
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	var accid;
	console.log(sessionStorage.chatid === null || sessionStorage.chatid == "");
	if ( typeof sessionStorage.chatid == 'undefined' || sessionStorage.chatid == "") {
		var currentUser = JSON.parse(sessionStorage.accountinfo);
		accid = currentUser.accid;
	} else {
		accid = sessionStorage.chatid;
	}
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/chatUser/" + accid,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var messages = data.messages;
			var id1 = data.id1[0];
			var id2 = data.id2[0];
			var len = messages.length;
			for (var i = 0; i < len; ++i) {
				var message = messages[i];
				if (message.fromid == id1.accid) {
					list.append("<li data-icon='false'><a onclick=goToSellerProfile('" + id1.accusername + "')><img src='" + id1.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<p style="font-size: 16px;margin-top:5px;white-space:normal"><b>' + message.sendmessage + '</b></p>' + '<p style="font-size: 10px" >' + new Date(message.mdate) + '</p></a></li>');
				} else {
					list.append("<li data-icon='false'><a onclick=goToSellerProfile('" + id2.accusername + "')><img src='" + id2.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<p style="font-size: 16px;margin-top:5px;white-space:normal"><b>' + message.sendmessage + '</b></p>' + '<p style="font-size: 10px" >' + new Date(message.mdate) + '</p></a></li>');
				}
			}
			if (len == 0) {
				$('#rpa-messagetitle').text("Create new conversation of " + id1.accusername + " and " + id2.accusername);
			} else {
				$('#rpa-messagetitle').text("Conversation of " + id1.accusername + " and " + id2.accusername);
			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#rpa-conversations", function(event, ui) {
	$.mobile.loading("show");
	var list = $("#rpa-chatlist");
	list.empty();
	populatePanel("rpa-conversations");
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/conversationUser",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var conversations = data.conversations;
			var len = conversations.length;
			for (var i = 0; i < len; ++i) {
				var conversation = conversations[i];
				list.append("<li data-icon='false'><a onclick=goToChat('" + conversation.accid + "')><img src='" + conversation.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<p style="font-size: 20px;margin-top:5px;white-space:normal"><b>' + conversation.accusername + '</b></p></a></li>');
			}
			if (len == 0) {
				$('#conversationtitle').text("No Conversations :(");
			} else {
				$('#conversationtitle').text("Conversations");
			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-purchaseHistory", function(event, ui) {
	$.mobile.loading("show");
	var list = $("#lrd-purchaseHistoryList");
	list.empty();
	populatePanel("lrd-purchaseHistory");
	var acc = sessionStorage.acc;
	var account = new Object();
	account.acc = acc;
	var accountfilter = new Array();
	accountfilter[0] = "acc";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/purchaseHistory",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var invoicesList = data.invoices;
			var len = invoicesList.length;
			for (var i = 0; i < len; ++i) {
				var invoice = invoicesList[i];
				console.log(invoice);
				list.append('<li data-icon="false"><a  onclick="getInvoice(' + invoice.invoiceid + ')">' + '<h1 style="margin: 0px">' + new Date(invoice.invoicedate) + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + accounting.formatMoney(invoice.invoicetotalprice) + '</h2></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

$(document).on('pagebeforeshow', "#lrd-myaccountinfoedit", function(event, ui) {
	populatePanel("lrd-myaccountinfoedit");
});

//////////////////////////SELLER STORE//////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userstore", function(event, ui) {
	populatePanel("lrd-userstore");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getUserStore",
		contentType : "application/json",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : sessionStorage.accountinfo,
		success : function(data, textStatus, jqXHR) {
			var list = $("#lrd-userstoreSellerItems");
			list.empty();
			var objectList = data.items;
			console.log(objectList);
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px"src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
});

function getTotalSells() {
	$.mobile.loading("show");
	var category = document.all["lrd-adminreportspageSellsCategory"].value;
	console.log(category);
	var time = document.all["lrd-adminreportspageSellsTime"].value;
	console.log(time);

	var d = new Date();
	var thistime;

	if (time == 1) {
		thistime = "today";
		time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00.000000";
	} else if (time == 2) {
		thistime = "this week";
		time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate() - 7) + " 00:00:00.000000";
	} else {
		thistime = "this month";
		time = d.getFullYear() + "-" + (d.getMonth() + 1 - 1) + "-" + d.getDate() + " 00:00:00.000000";
	}

	console.log(time);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/totalSellsReport/" + category + "/" + time,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			document.getElementById("lrd-adminreportspageTotalItemsSold").innerHTML = 'Total ' + category + ' items sold ' + thistime + ': ' + data.sells[0].sells;
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function getTotalRevenue() {
	$.mobile.loading("show");
	var category = document.all["lrd-adminreportspageRevenueCategory"].value;
	console.log(category);
	var time = document.all["lrd-adminreportspageRevenueTime"].value;
	console.log(time);

	var d = new Date();
	var thistime;

	if (time == 1) {
		thistime = "today";
		time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00.000000";
	} else if (time == 2) {
		thistime = "this week";
		time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate() - 7) + " 00:00:00.000000";
	} else {
		thistime = "this month";
		time = d.getFullYear() + "-" + (d.getMonth() + 1 - 1) + "-" + d.getDate() + " 00:00:00.000000";
	}

	console.log(time);

	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/totalRevenueReport/" + category + "/" + time,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			document.getElementById("lrd-adminreportspageTotalItemsRevenue").innerHTML = 'Total ' + category + ' items revenue ' + thistime + ': ' + accounting.formatMoney(data.sells[0].sells);
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function getInvoice(invoiceid) {
	$.mobile.loading("show");
	var list = $("#lrd-pastinvoiceList");
	list.empty();
	var acc = sessionStorage.acc;
	var account = new Object();
	account.acc = acc;
	var accountfilter = new Array();
	accountfilter[0] = "acc";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.support.cors = true;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/purchaseSumary/" + invoiceid,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
			total = 0;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><img src='" + object.photo + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + object.itemname + '</h1><p style="font-size: 13px;margin-top:0px"><b>' + object.model + '</b></p><p>' + object.brand + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(object.price) + '</h1><p>Amount:' + object.quantity + '</p></div></div>');
				total += object.price * object.quantity;
			}
			// list.listview("refresh");
			$("#pastcheckoutSaddress").text(objectList[0].street + ", " + objectList[0].city + ", " + objectList[0].state + ", " + objectList[0].country + ", " + objectList[0].zip);
			$("#pastcheckoutCard").text(objectList[0].number);
			$("#pastcheckoutTotal").text(accounting.formatMoney(total));
			GoToView('lrd-pastinvoice');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function getBuyersList(itemid) {
	$.mobile.loading("show");
	var list = $("#lrd-buyersList");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getBuyers/" + itemid,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var buyersList = data.buyers;
			var len = buyersList.length;
			total = 0;
			// ?
			var object;
			for (var i = 0; i < len; ++i) {
				buyer = buyersList[i];
				list.append("<li data-icon='false'><a onclick=goToSellerProfile('" + buyer.accusername + "')><img src='" + buyer.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">User: ' + buyer.accusername + '</h1><p style="font-size: 13px;margin-top:5px"><b>Name: ' + buyer.accfname + ' ' + buyer.acclname + '</b></p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(buyer.price) + '</h1><p>Amount:' + buyer.itemquantity + '</p></div></div></a></li>');
			}

			GoToView('lrd-buyers');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function checkOut(acc) {
	//var currentItem = JSON.parse(sessionStorage.currentItem);

	if (how == "cart") {
		var account = new Object();
		account.acc = acc;
		account.total = total;
		account.card = document.all["lrd-checkoutAccountnumber"].value;
		account.address = document.all["lrd-checkoutShippingAddress"].value;

		var accountfilter = new Array();
		accountfilter[0] = "acc";
		accountfilter[1] = "total";
		accountfilter[2] = "card";
		accountfilter[3] = "address";
	} else if (how == "buyitnow") {
		var currentItem = JSON.parse(sessionStorage.currentItem);

		var account = new Object();
		account.acc = acc;
		account.total = total;
		account.card = document.all["lrd-checkoutAccountnumber"].value;
		account.address = document.all["lrd-checkoutShippingAddress"].value;
		account.itemid = currentItem.itemid;
		account.quantity = document.all["quantityBuyItSlider"].value;

		var accountfilter = new Array();
		accountfilter[0] = "acc";
		accountfilter[1] = "total";
		accountfilter[2] = "card";
		accountfilter[3] = "address";
		accountfilter[4] = "itemid";
		accountfilter[5] = "quantity";
	}

	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://sprucemarket.herokuapp.com/SpruceServer/generateInvoice/" + how,
		crossDomain : true,
		withCredentials : true,
		method : 'put',
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			if (data.success)
				GoToView('lrd-invoice');
			else {
				alert("Item out of stock");
				GoToView('lrd-home');
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

			GoToView('lrd-checkout');
		}
	});
}

function signup() {
	//User info
	var username = document.all["lrd-signupUsername"].value;
	if (username == '') {
		document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:* <b style='color:#ED0000'>PLEASE INPUT SOMETHING!</b>";
		$.mobile.navigate("#lrd-signup");
	} else if (!validateUsername(username)) {
		document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:* <b style='color:#ED0000'>Not in my house</b>";
		$.mobile.navigate("#lrd-signup");
	} else {
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/checkUsername/" + username,
			method : 'get',
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				if (data.success) {
					document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:* <b style='color:#ED0000'>Username already taken!</b>";
					$.mobile.navigate("#lrd-signup");
				} else {
					document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:*";
					document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
					document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";

					var fname = document.all["lrd-signupName"].value;
					var lname = document.all["lrd-signupLastname"].value;
					var email = document.all["lrd-signupEmail"].value;
					var password = document.all["lrd-signupPassword"].value;
					var rpassword = document.all["lrd-signupRetypepassword"].value;
					var phone = document.all["lrd-signupPhone"].value;
					if (password != rpassword) {
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:* <b style='color:#ED0000'>Did not match!</b>";
						$.mobile.navigate("#lrd-signup");
					} else if (password == '' || rpassword == '') {
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:* <b style='color:#ED0000'>Passwords can't be left blank, dummy!</b>";
						$.mobile.navigate("#lrd-signup");
					} else if (!validateEmail(email)) {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:* <b style='color:#ED0000'>Not valid!</b>";
						$.mobile.navigate("#lrd-signup");
					} else if (fname == '') {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:* <b style='color:#ED0000'>No first name? That's badass!</b>";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";
						$.mobile.navigate("#lrd-signup");
					} else if (lname == '') {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:* <b style='color:#ED0000'>You gotta have a last name...</b>";
						$.mobile.navigate("#lrd-signup");
					} else if (fname.length > 100) {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:* Must be less than 100 characters";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";
						$.mobile.navigate("#lrd-signup");
					} else if (lname.length > 100) {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:* Must be less than 100 characters";
						$.mobile.navigate("#lrd-signup");
					} else if (username.length > 50) {
						document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:* Must be less than 50 characters";
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";
						$.mobile.navigate("#lrd-signup");
					} else if (phone.length > 50) {
						document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:*";
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";
						document.getElementById("rpa-phonenumberlabel").innerHTML = "Phone Number:* Must be less than 50 characters";
						$.mobile.navigate("#lrd-signup");
					} else if (email.length > 100) {
						document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:*";
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:* Must be less than 100 characters";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";
						document.getElementById("rpa-phonenumberlabel").innerHTML = "Phone Number:*";
						$.mobile.navigate("#lrd-signup");
					} else {
						document.getElementById("lrd-signupRetypepasswordLabel").innerHTML = "Re-type Password:*";
						document.getElementById("lrd-signupEmailLabel").innerHTML = "Email:*";
						document.getElementById("lrd-signupNameLabel").innerHTML = "First Name:*";
						document.getElementById("lrd-signupLastnameLabel").innerHTML = "Last Name:*";

						var photo = document.all["lrd-signupUploadPicture1"].value;
						if (photo == '') {
							photo = "http://i.imgur.com/682NR9z.png";
						} else {
							photo = link + ".png";
						}

						var slt = Math.random();
						var rating = 0;

						//Shipping
						var saddresLine = document.all["lrd-signupshippingAddress"].value;
						var scity = document.all["lrd-signupshippingCity"].value;
						var sstate = document.all["lrd-signupshippingState"].value;
						var szip = document.all["lrd-signupshippingZip"].value;
						var scountry = document.all["lrd-signupshippingCountry"].value;

						if (saddresLine == '') {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:* <b style='color:#ED0000'>There's no place like home. Fill it out!</b>";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (scity == '') {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:* <b style='color:#ED0000'>A house in Nowhere...</b>";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (sstate == '') {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:* <b style='color:#ED0000'>You're so close...</b>";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (szip == '') {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:* <b style='color:#ED0000'>The zip code man...</b>";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (scountry == 'Country') {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:* <b style='color:#ED0000'>Choose the country for which you cheer and stuff!</b>";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (saddresLine.length > 100) {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:* Must be less than 100 characters";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (sstate.length > 100) {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:* Must be less than 100 characters";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (scity.length > 100) {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:* Must be less than 100 characters";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";
							$.mobile.navigate("#lrd-signupshipping");
						} else if (szip.length > 20) {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:* Must be less than 20 characters";
							$.mobile.navigate("#lrd-signupshipping");
						} else {
							document.getElementById("lrd-signupshippingAddressLabel").innerHTML = "Address Line:*";
							document.getElementById("lrd-signupshippingCityLabel").innerHTML = "City:*";
							document.getElementById("lrd-signupshippingStateLabel").innerHTML = "State/Province/Region:*";
							document.getElementById("lrd-signupshippingZipLabel").innerHTML = "Zip Code:*";

							//Billing
							var baddresLine;
							var bcity;
							var bstate;
							var bzip;
							var bcountry;

							if (!change) {
								baddresLine = document.all["lrd-signupbillingAddressBilling"].value;
								bcity = document.all["lrd-signupbillingCityBilling"].value;
								bstate = document.all["lrd-signupbillingStateBilling"].value;
								bzip = document.all["lrd-signupbillingZipBilling"].value;
								bcountry = document.all["lrd-signupbillingCountryBilling"].value;
								change = false;
							} else {
								baddresLine = saddresLine;
								bcity = scity;
								bstate = sstate;
								bzip = szip;
								bcountry = scountry;
							}

							if (baddresLine == '') {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:* <b style='color:#ED0000'>There's no place like home. Fill it out!</b>";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bcity == '') {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:* <b style='color:#ED0000'>A house in Nowhere...</b>";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bstate == '') {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:* <b style='color:#ED0000'>You're so close...</b>";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bzip == '') {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:* <b style='color:#ED0000'>The zip code man...</b>";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bcountry == 'Country') {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:* <b style='color:#ED0000'>Choose the country for which you cheer and stuff!</b>";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							}
							if (baddresLine.length > 100) {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:* Must be less than 100 characters";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bcity.length > 100) {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:* Must be less than 100 characters";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bzip.length > 20) {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:* Must be less than 20 characters";
								$.mobile.navigate("#lrd-signupbilling");
							} else if (bstate.length > 100) {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:* Must be less than 100 characters";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";
								$.mobile.navigate("#lrd-signupbilling");
							} else {
								document.getElementById("lrd-signupbillingAddressBillingLabel").innerHTML = "Address Line:*";
								document.getElementById("lrd-signupbillingCityBillingLabel").innerHTML = "City:*";
								document.getElementById("lrd-signupbillingStateBillingLabel").innerHTML = "State/Province/Region:*";
								document.getElementById("lrd-signupbillingZipBillingLabel").innerHTML = "Zip Code:*";

								//Credit
								var cardholderName = document.all["lrd-signupcreditCardholder"].value;
								var card;

								if ($('#lrd-signupcreditVisa').is(':checked')) {
									card = document.all["lrd-signupcreditVisa"].value;
								} else if ($('#lrd-signupcreditMasterCard').is(':checked')) {
									card = document.all["lrd-signupcreditMasterCard"].value;
								} else {
									card = document.all["lrd-signupcreditAmericanExpress"].value;
								}

								var cardNumber = document.all["lrd-signupcreditNumberCard"].value;
								var expMonth = document.all["lrd-signupcreditExpMonth"].value;
								var expYear = document.all["lrd-signupcreditExpYear"].value;
								var csc = document.all["lrd-signupcreditCsc"].value;

								if (cardholderName == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:* <b style='color:#ED0000'>Y U do dis?</b>";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (card == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:* <b style='color:#ED0000'>Choose a card type</b>";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (cardNumber == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:* <b style='color:#ED0000'>The numbers! What do they mean?</b>";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (expMonth == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:* <b style='color:#ED0000'>Month pls!</b>";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (expYear == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:* <b style='color:#ED0000'>Year pls!</b>";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (csc == '') {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:* <b style='color:#ED0000'>༼ ) ◕_◕ ༽)Give CSC</b>";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (cardholderName.length > 100) {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:* Must be less than 100 characters";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (cardNumber.length > 16) {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:* Must be less than 100 characters";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (expMonth.length > 2) {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:* Must be less than 2 numbers";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (expYear.length > 4) {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:* Must be less than 4 characters";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";
									$.mobile.navigate("#lrd-signupcredit");
								} else if (csc.length > 3) {
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:* Must be less than 3 numbers";
									$.mobile.navigate("#lrd-signupcredit");
								} else {//If everything whent according to plan
									document.getElementById("lrd-signupcreditCardholderLabel").innerHTML = "Cardholder Name:*";
									document.getElementById("lrd-signupcreditNumberCardLabel").innerHTML = "Number:*";
									document.getElementById("lrd-signupcreditExpMonthLabel").innerHTML = "Expiration Month:*";
									document.getElementById("lrd-signupcreditExpYearLabel").innerHTML = "Expiration Year:*";
									document.getElementById("lrd-signupcreditCscLabel").innerHTML = "CSC:*";

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
									account.saddresLine = saddresLine;
									account.scity = scity;
									account.sstate = sstate;
									account.szip = szip;
									account.scountry = scountry;
									account.baddresLine = baddresLine;
									account.bcity = bcity;
									account.bstate = bstate;
									account.bzip = bzip;
									account.bcountry = bcountry;
									account.cardholderName = cardholderName;
									account.card = card;
									account.cardNumber = cardNumber;
									account.expMonth = expMonth;
									account.expYear = expYear;
									account.csc = csc;
									account.gid = localStorage.guestId;

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
									accountfilter[9] = "saddresLine";
									accountfilter[10] = "scity";
									accountfilter[11] = "sstate";
									accountfilter[12] = "szip";
									accountfilter[13] = "scountry";
									accountfilter[14] = "baddresLine";
									accountfilter[15] = "bcity";
									accountfilter[16] = "bstate";
									accountfilter[17] = "bzip";
									accountfilter[18] = "bcountry";
									accountfilter[19] = "cardholderName";
									accountfilter[20] = "card";
									accountfilter[21] = "cardNumber";
									accountfilter[22] = "expMonth";
									accountfilter[23] = "expYear";
									accountfilter[24] = "csc";
									accountfilter[25] = "gid"

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

											GoToView('lrd-login');
										}
									});
								}
							}
						}
					}
				}
			},
			error : function(data, textStatus, jqXHR) {
				document.getElementById("lrd-signupUsernameLabel").innerHTML = "Username:* <b style='color:#ED0000'>Username already taken!</b>";
				GoToView('lrd-signup');
			}
		});
	}
}

function validateUsername(username) {
	var re = /^([a-zA-Z0-9.]+@){0,1}([a-zA-Z0-9.])+$/;
	return re.test(username);
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

// Imgur api!
function upload(file, imgtag) {
	$.mobile.loading("show");
	if (!file || !file.type.match(/image.*/))
		return;

	console.log(file.type);

	document.body.className = "uploading";

	var fd = new FormData();
	fd.append("image", file);
	fd.append("key", "6528448c258cff474ca9701c5bab6927");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://api.imgur.com/2/upload.json");
	xhr.onload = function() {
		link = JSON.parse(xhr.responseText).upload.links.imgur_page;
		document.querySelector("#" + imgtag).src = link + ".png";
	};
	xhr.send(fd);
	$.mobile.loading("hide");
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
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/authenticate1",
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			if (data.success) {
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
						if (data.success) {
							sessionStorage.clear();
							localStorage.clear();
							sessionStorage.acc = data.acc[0].accpassword;
							sessionStorage.user = data.user;
							$("#lrd-username").val("");
							$("#lrd-password").val("");
							GoToView('lrd-home');

						} else {
							sessionStorage.user = "guest";
							alert("Username or password incorrect");
						}
					},
					error : function(data, textStatus, jqXHR) {
						console.log("textStatus: " + textStatus);
						GoToView('lrd-login');
					}
				});
			} else {
				sessionStorage.user = "guest";
				alert("Username incorrect");
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			GoToView('lrd-login');
		}
	});
}

function populatePanel(view) {
	var list = $("#" + view + "SidePanel");
	list.empty();
	console.log(sessionStorage.user);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li>");
			if (sessionStorage.user == 'user') {
				list.append("<li><a  onclick=GoToView('lrd-mysprucebidding') >My Spruce</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a>Categories</li>");
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory(" + object.catid + ")>" + object.catname + "</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li>");
			if (sessionStorage.user == 'user') {
				list.append("<li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li>");
			} else if (sessionStorage.user == 'admin') {
				list.append("<li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li>");
			}
			if (sessionStorage.user == 'guest' || typeof sessionStorage.user == 'undefined') {
				list.append("<li><a onclick=GoToView('lrd-login')>Sign In</a></li>");
			} else {
				list.append("<li><a onclick=signOut()>Sign Out</a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

//Function for the three pages of my Spruce
function ajaxMySpruce(where) {
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
			var object;
			if (where == 'sold') {
				var list = $("#lrd-myspruceMySpruceListSold");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					if (object.bidwonid === null) {
						list.append('<li data-icon="false"><a  onclick="soldReciept(' + object.invoiceid + ',' + object.itemid + ',' + object.price + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.solddate) + '</b></p></div></div></a></li>');
					} else {
						list.append('<li data-icon="false"><a  onclick="soldReciept(' + object.invoiceid + ',' + object.itemid + ',' + object.currentbidprice + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">Auction ' + accounting.formatMoney(object.currentbidprice) + '</h3><p><b>' + new Date(object.solddate) + '</b></p></div></div></a></li>');
					}
				}
			} else if (where == 'bidding') {
				var list = $("#lrd-myspruceMySpruceListBidding");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');
				}
			} else if (where == 'selling') {
				list = $("#lrd-myspruceMySpruceListSelling");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');
				}
			} else {
				list = $("#lrd-mysprucelistauction");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="negotiateBid(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + new Date(object.item_end_date) + '</b></p></div></div></a></li>');
				}
			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

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
	$.mobile.loading("show");
	sessionStorage.editId = id;
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/checkProduct/" + id,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var password = data.password[0].accpassword;
			if ( typeof (Storage) !== "undefined") {
				if (password == sessionStorage.acc) {
					GoToView('lrd-sellerproduct');
				} else {
					GoToView('lrd-buyerproduct');
				}
			} else {
				GoToView('lrd-buyerproduct');
			}

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function refineQuery(paramby, paramorder) {
	by = paramby;
	order = paramorder;
	console.log(by + " " + order);
	GoToView('lrd-itemsforcategory');
	$('#rpa-refinePage').dialog('close');
}

function resetQuery() {
	order = "none";
	by = "none";
	$('#rpa-refinePage').dialog('close');
}

function GoToEditView(id, view) {
	sessionStorage.editId = id;
	$.mobile.loading("show");
	$.mobile.changePage("#" + view, {
		allowSamePageTransition : true,
		transition : "slide"
	});
}

function GoToEditViewPopup(id, view) {
	sessionStorage.editId = id;
	$.mobile.changePage("#" + view, {
		transition : 'pop',
		role : 'dialog'
	});
}

function signOut() {
	sessionStorage.clear();
	sessionStorage.user = "guest";
	GoToView('lrd-login');
}

function CheckSessionView(view) {
	if (sessionStorage.user == "user") {
		GoToView(view);
	} else {
		GoToView('lrd-login');
	}
}

function sellCat() {
	$.mobile.changePage("#rpa-sellcategorypopup", {
		allowSamePageTransition : true,
		transition : "slide",
		changeHash : false
	});
	var list = $("#rpa-categorylistpopup");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append('<li data-role="list-divider" data-theme="b">' + object.catname + '</li>');
				for (var j = 0; j < object.subcat.length; j++) {
					var subobject = object.subcat[j];
					list.append("<li data-role='button'>" + "<a onclick=sellSubCat('" + subobject.catid + "','" + subobject.catname + "')>" + subobject.catname + "</a></li>");
				}
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function sellSubCat(catid, catname) {
	var i = 0;
	console.log(catname);
	$.mobile.loading("show");
	var list = $("#rpa-categorylistpopup");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + catid + "/child",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			for ( i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li><a onclick=sellSubCat('" + object.catid + "','" + object.catname + "')>" + object.catname + "</a></li>");
			}
			list.listview("refresh");
			if (i == 0) {
				$("#rpa-selectedcategory").text(catname + ' (' + catid + ')');
				$.mobile.changePage("#lrd-sellitem", {
					allowSamePageTransition : true,
					transition : "slide",
					reverse : true
				});
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.mobile.loading("hide");
}

function adminSubCategories(catid, catname) {
	var i = 0;
	$.mobile.loading("show");
	var list = $("#rpa-adminsubcategoriespagelist");
	sessionStorage.editId = catid;
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getSubCategoryListPopup/" + catid + "/child",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			if (len == 0) {
				$('#rpa-nomorecats').text("No more categories for: " + catname + "(" + catid + ")");
			} else {
				for ( i = 0; i < len; ++i) {
					object = objectList[i];
					list.append("<li data-icon'delete'><a onclick=adminSubCategories('" + object.catid + "','" + object.catname + "')>" + object.catname + "</a><a href='#lrd-adminremovecatdialog' data-rel='dialog'></a></li>");
				}
				list.listview("refresh");
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
	$.mobile.loading("hide");
}

function addToCart() {
	if (sessionStorage.user != "admin") {
		$.mobile.loading("show");
		var jsonText;
		var currentItem = JSON.parse(sessionStorage.currentItem);
		if (localStorage.guestId != null) {
			console.log("in guest");
			var guest = new Object();
			guest.gid = localStorage.guestId;
			var guestfilter = new Array();
			guestfilter[0] = "gid";
			jsonText = JSON.stringify(guest, guestfilter, "\t");
		} else {
			var password = sessionStorage.acc;
			console.log(password);
			var account = new Object();
			account.password = password;
			var accountfilter = new Array();
			accountfilter[0] = "password";
			jsonText = JSON.stringify(account, accountfilter, "\t");
		}
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/addToCart/" + currentItem.itemid + "/" + $('#quantityAddCartSlider').val(),
			method : 'put',
			crossDomain : true,
			withCredentials : true,
			data : jsonText,
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				$.mobile.loading("hide");
				// Its a guest for the first time
				if (data.guest != null) {
					localStorage.guestId = data.guest[0].guestid;
					sessionStorage.user = "guest";
				}
				GoToView('lrd-cart');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
	} else {
		//TODO admin goes to login dont know if thats good!!
		GoToView('lrd-login');
	}
}

function updateToCart() {
	//Update cart only for user and guest
	if (sessionStorage.user != "admin") {
		$.mobile.loading("show");
		var jsonText;
		var currentItem = JSON.parse(sessionStorage.currentItem);
		if (localStorage.guestId != null) {
			console.log("in guest");
			var guest = new Object();
			guest.gid = localStorage.guestId;
			var guestfilter = new Array();
			guestfilter[0] = "gid";
			jsonText = JSON.stringify(guest, guestfilter, "\t");
		} else {
			var password = sessionStorage.acc;
			console.log(password);
			var account = new Object();
			account.password = password;
			var accountfilter = new Array();
			accountfilter[0] = "password";
			jsonText = JSON.stringify(account, accountfilter, "\t");
		}
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/updateToCart/" + currentItem.itemid + "/" + $('#quantityUpdateCartSlider').val(),
			method : 'put',
			crossDomain : true,
			withCredentials : true,
			data : jsonText,
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				$.mobile.loading("hide");
				GoToView('lrd-cart');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});
	} else {
		GoToView('lrd-login');
	}
}

function deleteFromCart() {
	$.mobile.loading("show");
	var jsonText;
	if (localStorage.guestId != null) {
		console.log("in guest");
		var guest = new Object();
		guest.gid = localStorage.guestId;
		var guestfilter = new Array();
		guestfilter[0] = "gid";
		jsonText = JSON.stringify(guest, guestfilter, "\t");
	} else {
		var password = sessionStorage.acc;
		console.log(password);
		var account = new Object();
		account.password = password;
		var accountfilter = new Array();
		accountfilter[0] = "password";
		jsonText = JSON.stringify(account, accountfilter, "\t");
	}
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/deleteFromCart/" + sessionStorage.editId,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GoToView('lrd-cart');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

function rateUser() {
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	account.comment = $('#ratingComment').val();
	var accountfilter = new Array();
	accountfilter[0] = "password";
	accountfilter[1] = "comment";
	jsonText = JSON.stringify(account, accountfilter, "\t");
	var currentUser = JSON.parse(sessionStorage.accountinfo);
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/rateUser/" + currentUser.accid + "/" + $('#ratingSlider').val(),
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GoToView('lrd-userprofile');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

function checkSell() {
	var name = $('#lrd-sellitemName').val();
	var price = $('#lrd-sellitemPrice').val();
	var model = $('#lrd-sellitemModel').val();
	var brand = $('#lrd-sellitemBrand').val();
	var dimensions = $('#lrd-dimensions').val();
	var amount = $('#lrd-sellitemAmount').val();
	var description = $('#lrd-sellitemDescription').val();
	var category = $("#rpa-selectedcategory").text();
	var regexp = /^[0-9]{0,10}([\.][0-9]{0,2})?$/;
	var result = regexp.test(price);
	var photo = document.all["lrd-sellitemUploadPicture"].value;
	if (name == "" || price == "" || model == "" || brand == "" || dimensions == "" || amount == "" || category == "" || photo == "") {
		$('#rpa-sellwarning').html("<b>Please fill all</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	} else if (amount < 1) {
		$('#rpa-sellwarning').html("<b>Amount must be greater than 0</b> *");
		 $('html, body').stop().animate({ scrollTop : 0 }, 500);
	}
	else if(!result){
		$('#rpa-sellwarning').html("<b>Incorrect buy it now price</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	}
	else if(name.length>=50){
		$('#rpa-sellwarning').html("<b>Item name must be less than 50 characters</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	}
	else if(description.length>=400){
		$('#rpa-sellwarning').html("<b>Description must be less than 400 characters</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	}
	else if(model.length>=50){
		$('#rpa-sellwarning').html("<b>Model must be less than 50 characters</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	}
	else if(brand.length>=50){
		$('#rpa-sellwarning').html("<b>Brand must be less than 50 characters</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	} 	  
	else if(dimensions.length>=50){
		$('#rpa-sellwarning').html("<b>Dimensions must be less than 50 characters</b> *");
		$('html, body').stop().animate({ scrollTop : 0 }, 500);
	} 
	else {
		$.mobile.loading("show");
		$('#rpa-sellwarning').text("");
		photo = link + ".png";
		// Magic for getting category id
		var categoryArray = category.split(" ");
		var categoryid = categoryArray[categoryArray.length - 1].substring(1, categoryArray[categoryArray.length - 1].length - 1);
		var item = new Object();
		item.name = name;
		item.price = price;
		item.model = model;
		item.brand = brand;
		item.dimensions = dimensions;
		item.amount = amount;
		item.description = description;
		item.category = categoryid;
		item.photo = photo;
		item.password = sessionStorage.acc;

		var itemfilter = new Array();
		itemfilter[0] = "name";
		itemfilter[1] = "price";
		itemfilter[2] = "model";
		itemfilter[3] = "brand";
		itemfilter[4] = "dimensions";
		itemfilter[5] = "amount";
		itemfilter[6] = "category";
		itemfilter[7] = "photo";
		itemfilter[8] = "password";
		itemfilter[9] = "description";
		var jsonText = JSON.stringify(item, itemfilter, "\t");
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/sellitem",
			method : 'put',
			crossDomain : true,
			withCredentials : true,
			data : jsonText,
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				$.mobile.loading("hide");
				if (data.success) {
					GoToView('rpa-myspruceselling');
				} else {
					GoToView('lrd-home');
					$('#rpa-sellwarning').html("<b>An error occured during transaction</b> *");
				}
				$('#rpa-sellwarning').text("");
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				$.mobile.loading("hide");
				GoToView('lrd-home');
			}
		});
	}
}

function restockItem() {
	$.mobile.loading("show");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/restockItem/" + sessionStorage.editId + "/" + $('#restockSlider').val(),
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			if (data.success) {
				GoToView('lrd-sellerproduct');
			} else {
				GoToView('lrd-home');
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			GoToView('lrd-home');
		}
	});
}

function bidItem() {
	var currentItem = JSON.parse(sessionStorage.currentItem);
	var regexp = /^[0-9]{0,10}([\.][0-9]{0,2})?$/;
	var result = regexp.test($('#bidAmount').val());
	if (sessionStorage.user == "guest" || sessionStorage.user == "admin") {
		GoToView('lrd-login');
	} else if (parseFloat($('#bidAmount').val()) <= parseFloat(currentItem.currentbidprice)) {
		$('#currentBidDialog').text("Bid must be greater than " + accounting.formatMoney(currentItem.currentbidprice));
	} else if (!result) {
		$('#currentBidDialog').text("Invalid Bid");
	} else {
		$.mobile.loading("show");
		var password = sessionStorage.acc;
		var account = new Object();
		account.password = password;
		var accountfilter = new Array();
		accountfilter[0] = "password";
		jsonText = JSON.stringify(account, accountfilter, "\t");
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/bidItem/" + sessionStorage.editId + "/" + $('#bidAmount').val(),
			crossDomain : true,
			withCredentials : true,
			method : 'put',
			data : jsonText,
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				$.mobile.loading("hide");
				if (data.success) {
					GoToView('lrd-buyerproduct');
				} else {
					$('#currentBidDialog').text("A new bid appeared, please bid again: " + accounting.formatMoney(data.bid));
				}
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				$.mobile.loading("hide");
			}
		});
	}
}

function reply() {
	$.mobile.loading("show");
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	account.reply = $('#replymessage').val();
	var accountfilter = new Array();
	accountfilter[0] = "password";
	accountfilter[1] = "reply";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	var accid;
	if ( typeof sessionStorage.chatid == 'undefined' || sessionStorage.chatid == "") {
		var currentUser = JSON.parse(sessionStorage.accountinfo);
		accid = currentUser.accid;
	} else {
		accid = sessionStorage.chatid;
	}
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/replyUser/" + accid,
		method : 'put',
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			$('#replymessage').val("");
			GoToView('rpa-chat');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function goToChat(id) {
	sessionStorage.chatid = id;
	GoToView('rpa-chat');
}

function sendMessage() {
	sessionStorage.chatid = "";
	GoToView('rpa-chat');
}

function negotiateBid(id) {
	sessionStorage.editId = id;
	GoToView('rpa-acceptbidpage');
}

function declineBid() {
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/declineBid/" + sessionStorage.editId,
		crossDomain : true,
		withCredentials : true,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-myspruceauction');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function acceptBid(id) {
	how = "auction";
	var account = new Object();
	account.username = $('#bidderusername').text();
	account.price = $('#acceptbidinfo').text().split("$")[1];
	account.itemid = id;

	var accountfilter = new Array();
	accountfilter[0] = "username";
	accountfilter[1] = "price";
	accountfilter[2] = "itemid";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://sprucemarket.herokuapp.com/SpruceServer/generateInvoice/" + how,
		crossDomain : true,
		withCredentials : true,
		method : 'put',
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-mysprucesold');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			GoToView('rpa-myspruceauction');
		}
	});
}

function soldReciept(invoiceid, itemid, price) {
	sessionStorage.invoice = invoiceid;
	sessionStorage.item = itemid;
	sessionStorage.price = price;
	GoToView('rpa-soldreciept');
}

function adminAddCategory() {
	if ($("#addCategory").val() != "" && $("#addSubCategory").val() != "") {
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/category/" + $("#addCategory").val() + "/" + $("#addSubCategory").val(),
			crossDomain : true,
			withCredentials : true,
			method : 'get',
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				GoToView('lrd-admincategoriespage');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				GoToView('lrd-admincategoriespage');
			}
		});
	}
}

function adminAddSubCategory() {
	if ($("#subaddSubCategory").val() != "") {
		$.ajax({
			url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/subcategory/" + sessionStorage.editId + "/" + $("#subaddSubCategory").val(),
			crossDomain : true,
			withCredentials : true,
			method : 'get',
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				GoToView('lrd-admincategoriespage');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				GoToView('lrd-admincategoriespage');
			}
		});
	}
}

function removeCat() {
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/removecategory/" + sessionStorage.editId,
		crossDomain : true,
		withCredentials : true,
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('lrd-admincategoriespage');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			GoToView('lrd-admincategoriespage');
		}
	});
}

function defaultCreditCard(){
	var password = sessionStorage.acc;
	console.log(password);
	var account = new Object();
	account.password = password;
	var accountfilter = new Array();
	accountfilter[0] = "password";
	var jsonText = JSON.stringify(account, accountfilter, "\t");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/defaultcreditcard/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		data : jsonText,
		method : 'put',
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function deleteCreditCard(){
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/removecreditcard/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('rpa-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function admindeleteCreditCard(){
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/removecreditcard/" + sessionStorage.editId,
		contentType : "application/json",
		crossDomain : true,
		withCredentials : true,
		success : function(data, textStatus, jqXHR) {
			GoToView('sam-creditcard');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);

		}
	});
}

function changePassword() {
	if ($('#rpa-oldpassword').val() != "" || $('#rpa-password').val() != "" || $('#rpa-oldpassword').val() != "") {
		if ($('#rpa-password').val() == $('#rpa-confirmpassword').val()) {
			$.mobile.loading("show");
			var password = sessionStorage.acc;
			console.log(password);
			var account = new Object();
			account.password = password;
			var accountfilter = new Array();
			accountfilter[0] = "password";
			var jsonText = JSON.stringify(account, accountfilter, "\t");
			$.ajax({
				url : "http://sprucemarket.herokuapp.com/SpruceServer/checkpassword",
				contentType : "application/json",
				crossDomain : true,
				withCredentials : true,
				data : jsonText,
				method : 'put',
				success : function(data, textStatus, jqXHR) {
					//Creating new password
					var slt = Math.random();
					var shaObj = new jsSHA(slt + $('#rpa-password').val(), "TEXT");
					var hash = shaObj.getHash("SHA-512", "HEX");
					var hmac = shaObj.getHMAC("SecretKey", "TEXT", "SHA-512", "HEX");
					//Creting hash for old hash
					var shaObj = new jsSHA(data.salt[0].accslt + $('#rpa-oldpassword').val(), "TEXT");
					var oldhash = shaObj.getHash("SHA-512", "HEX");
					var hmac = shaObj.getHMAC("SecretKey", "TEXT", "SHA-512", "HEX");
					var account = new Object();
					account.newsalt = slt;
					account.newhash = hash;
					account.oldhash = oldhash;
					account.password = password;
					var accountfilter = new Array();
					accountfilter[0] = "newsalt";
					accountfilter[1] = "newhash";
					accountfilter[2] = "oldhash";
					accountfilter[3] = "password";
					var jsonText = JSON.stringify(account, accountfilter, "\t");
					$.ajax({
						url : "http://sprucemarket.herokuapp.com/SpruceServer/changepassword",
						contentType : "application/json",
						crossDomain : true,
						withCredentials : true,
						data : jsonText,
						method : 'put',
						success : function(data, textStatus, jqXHR) {
							$.mobile.loading("hide");
							if(data.success){
								alert("Change Password Succesfull");
								$('#rpa-oldpassword').val("");
								$('#rpa-password').val("");
								$('#rpa-confirmpassword').val("");
							}else{
								alert("Old Password Incorrect");
							}
						},
						error : function(data, textStatus, jqXHR) {
							console.log("textStatus: " + textStatus);
						}
					});
				},
				error : function(data, textStatus, jqXHR) {
					console.log("textStatus: " + textStatus);
				}
			});
			$.mobile.loading("hide");
		} else {
			alert("New Password does not match");
		}
	} else {
		alert("Please fill out password input");
	}
}
