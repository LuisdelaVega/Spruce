var offset = 0;
var order = "none";
var by = "none";
var total;
var gtotal = 0;

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
			var currentUser = data.info;
			$('#lrd-checkoutAccountnumber').empty();
			$('#lrd-checkoutShippingAddress').empty();
			for (var i = 0; i < currentUser.length; i++) {
				var j = i + 1;
				$('#lrd-checkoutShippingAddress').append('<option value = "' + j + '"> '+currentUser[i].street+', ' + currentUser[i].city + '</option>');
				$('#lrd-checkoutAccountnumber').append('<option value = "' + j + '">' + currentUser[i].number + '</option>');
			}
			$('#lrd-checkoutAccountnumber').selectmenu('refresh', true);
			$('#lrd-checkoutShippingAddress').selectmenu('refresh', true);
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$('#sdlt-totalamount').append("Total: " + accounting.formatMoney(gtotal));
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
	var list = $("#lrd-homePopularContent");
	list.empty();
	populatePanel("lrd-home");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/home/",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
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
				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ")><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='" + object.photo + "'>" + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.itemdate + '</b></p></div></div></a></li>');

			}
			list.listview("refresh");
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
							alert("Data not found!");
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
						alert("Data not found!");
					}
				});
			}
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

$(document).on('pagebeforeshow', "#lrd-sellitem", function(event, ui) {
	populatePanel("lrd-sellitem");
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
			$("#checkoutTotal").text("Total price: (" + accounting.formatMoney(total) + ")");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminreportspage", function(event, ui) {
	populatePanel("lrd-adminreportspage");
});

$(document).on('pagebeforeshow', "#lrd-pastinvoice", function(event, ui) {
	populatePanel("lrd-pastinvoice");
	$("#lrd-pastinvoiceList").listview("refresh");
});

$(document).on('pagebeforeshow', "#rpa-usernameandpassword", function(event, ui) {
	$("#rpa-username").attr("value", $('#userMyAccountName').text());
	populatePanel("rpa-usernameandpassword");
});

$(document).on('pagebeforeshow', "#rpa-accphoto", function(event, ui) {
	$("#rpa-accphotoimg").attr("src", $('#userMyAccountImage').attr('src'));
	populatePanel("rpa-accphoto");
});

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
			alert("Data not found!");
		}
	});
	populatePanel("lrd-generalinfo");
});

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
				list.append("<li data-icon='delete'><a onclick=GoToEditView(" + card.cid + ",'rpa-creditcardedit')> <h1>Number: " + card.number + "</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a><a></a></li>");
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
				list.append("<li data-icon='delete'><a onclick=GoToEditView(" + address.sid + ",'rpa-shippingedit')> <h1>Street: " + address.street + "</h1><p>City: " + address.city + "</br>State: " + address.state + "</br>Country: " + address.country + "</br>Zip: " + address.zip + "</p> </a><a></a></li>");
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
			alert("Data not found!");
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
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-admincategoriespage", function(event, ui) {
	var list = $("#lrd-admincategoriespageCategoriesList");
	list.empty();
	populatePanel("lrd-admincategoriespage");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/myadmintools/category",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.category;
			var len = objectList.length;
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
				list.append('<li data-icon="false"><a onclick=goToAccountEditPage("' + object.accusername + '")>' + object.accusername + '</a><a href="#lrd-adminremoveuserdialog" data-rel="dialog"></a></li>');
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

function goToAccountEditPage(username) {
	console.log(username);
	$.ajax({
		url : "http://localhost:5000/SpruceServer/adminaccountedit/" + username,
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
			alert("Data not found!seller profile");
		}
	});
}


$(document).on('pagebeforeshow', "#sam-usernameandpassword", function(event, ui) {
	populatePanel("sam-usernameandpassword");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-username").attr("value", accountinfo[0].accusername);
});

$(document).on('pagebeforeshow', "#sam-accphoto", function(event, ui) {
	populatePanel("sam-accphoto");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-accphotoimg").attr("src", accountinfo[0].accphoto);
});

$(document).on('pagebeforeshow', "#sam-generalinfo", function(event, ui) {
	populatePanel("sam-generalinfo");
	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	$("#sam-firstname").attr("value", accountinfo[0].accfname);
	$("#sam-lastname").attr("value", accountinfo[0].acclname);
	$("#sam-email").attr("value", accountinfo[0].accemail);
	$("#sam-lastname").attr("value", accountinfo[0].acclname);
	$("#sam-phone").attr("value", accountinfo[0].accphonenum);
});

$(document).on('pagebeforeshow', "#sam-creditcard", function(event, ui) {
	populatePanel("sam-creditcard");

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	console.log(sessionStorage.adminaccountinfo);
	console.log(accountinfo);
	var list = $('#sam-creditcardlist');
	list.empty();
	for (var i = 0; i < accountinfo.length; ++i) {
		var card = accountinfo[i];
		console.log(card.number);
		list.append("<li data-icon='delete'><a onclick=GoToEditView(" + card.cid + ",'rpa-creditcardedit')> <h1>Number: " + card.number + "</h1><p>Holder Name: " + card.name + "</br>Type: " + card.type + "</br>Expiration Date: " + card.month + "/" + card.year + "</br>CSC: " + card.csc + "</br>Bills To: " + card.street + "</p> </a><a></a></li>");
	}
	list.listview("refresh");
});

$(document).on('pagebeforeshow', "#sam-shipping", function(event, ui) {
	populatePanel("sam-shipping");

	var accountinfo = JSON.parse(sessionStorage.adminaccountinfo);
	console.log(sessionStorage.adminaccountinfo);
	console.log(accountinfo);
	var list = $('#sam-shippingList');
	list.empty();
	var len = accountinfo.length;
	for (var i = 0; i < len; ++i) {
		var address = accountinfo[i];
		list.append("<li data-icon='delete'><a onclick=GoToEditView(" + address.sid + ",'rpa-shippingedit')> <h1>Street: " + address.street + "</h1><p>City: " + address.city + "</br>State: " + address.state + "</br>Country: " + address.country + "</br>Zip: " + address.zip + "</p> </a><a></a></li>");
	}
	list.listview("refresh");
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
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-cart", function(event, ui) {
	var list = $("#lrd-myCartList");
	list.empty();
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
			total = 0;
			var object;
			for (var i = 0; i < len; ++i) {
				object = objectList[i];
				list.append("<li data-icon='false'><a onclick=GetItem(" + object.itemid + ") ><img src='" + object.photo + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + object.itemname + '</h1><p style="font-size: 13px;margin-top:0px"><b>' + object.model + '</b></p><p>' + object.brand + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(object.price) + '</h1><p>Amount:' + object.quantity + '</p></div></div><a href="#rpa-deleteItemCart"  data-rel="dialog"></a>');
				total += object.price * object.quantity;
			}
			gtotal = total;
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
	var currentItem = JSON.parse(sessionStorage.currentItem);
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
	$("#lrd-buyerproductSellerName").attr("onclick", "goToSellerProfile('" + currentItem.accusername + "')");
	$("#popupimage").attr("src", "" + currentItem.photo);
	var list = $('#rpa-rateitbuyer');
	list.empty();
	list.append('<div class="rateit" data-rateit-value="' + currentItem.accrating + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>');
	$('.rateit').rateit();
	$.mobile.loading("hide");
});

$(document).on('pagebeforeshow', "#rpa-quantityBuyItDialog", function(event, ui) {
	$("#quantityBuyItSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-quantityAddCartDialog", function(event, ui) {
	$("#quantityAddCartSlider").attr("max", parseInt($('#lrd-buyerproductQuantity').text().split(" ")[1]));
});

$(document).on('pagebeforeshow', "#rpa-bidDialog", function(event, ui) {
	$("#currentBidDialog").text("Current Bid: " + accounting.formatMoney($('#lrd-buyerproductBidPrice').text().split(" $")[1]));
});

$(document).on('pagebeforeshow', "#lrd-sellerproduct", function(event, ui) {
	$.mobile.loading("show");
	populatePanel("lrd-sellerproduct");
	var currentItem = JSON.parse(sessionStorage.currentItem);
	$('#lrd-sellerproductName').text(currentItem.itemname);
	$('#lrd-sellerproductBuyNowPrice').html("Buy it Now: " + accounting.formatMoney(currentItem.price) + "</br> Bid: " + accounting.formatMoney(currentItem.currentbidprice));
	$("#lrd-sellerproductImage").attr("src", "" + currentItem.photo);
	$('#lrd-sellerproductTimeRemaining').html("Quantity: " + currentItem.amount + "</br>Ending in: " + currentItem.bideventdate);
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
			sessionStorage.accountinfo = JSON.stringify(data.sellerprofile[0]);
			GoToView('lrd-userprofile');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!seller profile");
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
			alert("Data not found!");
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
				list.append('<li data-icon="false"><a  onclick="getInvoice(' + invoice.invoiceid + ')">' + '<h1 style="margin: 0px">' + new Date(invoice.invoicedate).toUTCString() + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + invoice.invoicetotalprice + '</h2></li>');
			}
			list.listview("refresh");
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
	var list = $("#lrd-userstoreSellerItems");
	list.empty();
	populatePanel("lrd-userstore");
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/user/store",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.items;
			var len = objectList.length;
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
			$("#pastcheckoutTotal").text("Total price: (" + accounting.formatMoney(total) + ")");
			GoToView('lrd-pastinvoice');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
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
			var object;
			for (var i = 0; i < len; ++i) {
				buyer = buyersList[i];
				list.append("<li data-icon='false'><a onclick=goToSellerProfile('" + buyer.accusername + "')><img src='" + buyer.accphoto + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">User: ' + buyer.accusername + '</h1><p style="font-size: 13px;margin-top:5px"><b>Name: ' + buyer.accfname + ' ' + buyer.acclname + '</b></p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(buyer.price) + '</h1><p>Amount:' + buyer.itemquantity + '</p></div></div></a></li>');
				//"<li data-icon='false'><img src='" + object.photo + "' style='resize:both; overflow:scroll; width:80px; height:80px'>" + '<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">' + object.itemname + '</h1><p style="font-size: 13px;margin-top:0px"><b>' + object.model + '</b></p><p>' + object.brand + '</p>' + '</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >' + accounting.formatMoney(object.price) + '</h1><p>Amount:' + object.quantity + '</p></div></div>'
			}

			GoToView('lrd-buyers');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

function checkOut(acc) {
	var account = new Object();
	account.acc = acc;
	account.total = total;

	var accountfilter = new Array();
	accountfilter[0] = "acc";
	accountfilter[1] = "total";
	var jsonText = JSON.stringify(account, accountfilter, "\t");

	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://sprucemarket.herokuapp.com/SpruceServer/generateInvoice",
		crossDomain : true,
		withCredentials : true,
		method : 'put',
		data : jsonText,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			GoToView('lrd-invoice');
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found! checkOut");
			GoToView('lrd-checkout');
		}
	});
}

function signup() {
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

	if (password == rpassword) {
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
	} else {
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
							sessionStorage.acc = data.acc[0].accpassword;
							sessionStorage.user = data.user;
							$("#lrd-username").val("");
							$("#lrd-password").val("");
							GoToView('lrd-home');
							
						} else {
							sessionStorage.user = "guest";
							alert("Username and password does not exist");
						}
					},
					error : function(data, textStatus, jqXHR) {
						console.log("textStatus: " + textStatus);
						alert("Data not found");
						GoToView('lrd-login');
					}
				});
			} else {
				alert("Username not found");
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found");
			GoToView('lrd-login');
		}
	});
}

function populatePanel(view) {
	var list = $("#" + view + "SidePanel");
	list.empty();
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getCategoriesForSidePanel",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var objectList = data.categories;
			var len = objectList.length;
			var object;
			console.log(sessionStorage.user);
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
			alert("Data not found!");
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
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.solddate + '</b></p></div></div></a></li>');
				}
			} else if (where == 'bidding') {
				var list = $("#lrd-myspruceMySpruceListBidding");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.date + '</b></p></div></div></a></li>');
				}
			} else {
				var list = $("#lrd-myspruceMySpruceListSelling");
				list.empty();
				for (var i = 0; i < len; ++i) {
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem(' + object.itemid + ')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="' + object.photo + '">' + '<h1 style="margin: 0px">' + object.itemname + '</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">' + '<h2 style="font-size: 13px;margin-top:0px">' + object.model + '</h2><p>' + object.brand + '</p></div><div class="ui-block-b" align="right">' + '<h3 style="margin-top:0px;padding-top: 0px">' + accounting.formatMoney(object.price) + '</h3><p><b>' + object.itemdate + '</b></p></div></div></a></li>');
				}
			}
			list.listview("refresh");
			$.mobile.loading("hide");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
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
	$.ajax({
		url : "http://sprucemarket.herokuapp.com/SpruceServer/getProduct/" + id,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var currentItem = data.product[0];
			sessionStorage.currentItem = JSON.stringify(currentItem);
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
		allowSamePageTransition : true
	});
}

function signOut() {
	sessionStorage.acc = "";
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
			alert("Data not found!");
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
				$("#rpa-selectcategorybutton .ui-btn-text").text(catname + '(' + catid + ')');
				$.mobile.changePage("#lrd-sellitem", {
					allowSamePageTransition : true,
					transition : "slide",
					reverse : true
				});
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.mobile.loading("hide");
}
