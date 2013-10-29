var itemId;

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
	 
	var accept=true;
    $("#lrd-checkoutAccept").click(function(){
    	if(accept){
    		$("#lrd-checkoutPayUp").attr("onclick", "GoToView('lrd-home')");
    		accept=false;
		}
    	else{
    		$("#lrd-checkoutPayUp").attr("onclick", "GoToView('lrd-checkout')");
    		accept=true;
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
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-homeSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/Spruce/home/",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var list = $("#lrd-homePopularContent");
			list.empty();
			list.append("<li><a onclick=GetItemsForCategory('Books')><h3 align='center'>Popular Now</h3></a></li>");
			var images = data.images;
			var len = images.length;
			
			for (var i = 0; i < 3; ++i) {
				var image = images[i];
				list.append("<li data-icon='false'><a onclick=GetItem("+image.id+")><img height='80px' width='80px' style='padding-left:5px; padding-top: 6px' src='images/"+image.url+"'>"+
					"<h1 style='margin: 0px'>"+image.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left">'+
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
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-itemsforcategorySidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getItemsForCategory/"+sessionStorage.category,
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-itemsList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				
				list.append("<li data-icon='false'><a onclick=GetItem("+object.itemid+")><img style='padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px' src='"+object.photo+"'>"+
					'<h1 style="margin: 0px">'+object.itemname+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
					'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
					'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.itemdate+'</b></p></div></div></a></li>');
				
			}
			list.listview("refresh");
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-login", function( event, ui ) {
	  $.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-loginSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-checkout", function( event, ui ) {
	  $.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-checkoutSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-adminreportspage", function( event, ui ) {
	  $.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-adminreportspageSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#lrd-category", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-categorySidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getSubCategories",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			
			var objectList = data.subcategories;
			var len = objectList.length;
			var list = $("#lrd-categoryList");
			var listSub = "";
			list.empty();
			var object;
			var ojectSub;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				
				if(!object.subcategory){
					objectSub = object;
					list.append('<li data-role="list-divider" data-theme="b">'+
					'<li>'+
						'<div>'+
						"<h2 style='text-align: center''>"+ object.title +':</h2>'+
						'</div></li>');
				}
				
				else{
					list.append("<li data-role='button'>"+
						"<a onclick=GetItemsForCategory('"+objectSub.title+"')><h4>"+ object.title +'</h4></a>'+
						'</li>');
				}
				
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
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-admincategoriespageSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/myadmintools/category",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.category;
			var len = objectList.length;
			var list = $("#lrd-admincategoriespageCategoriesList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li data-icon='false'><a>"+object.title+"</a><a href='#lrd-adminremovecatdialog' data-rel='dialog'></a></li>");
				
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
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-adminuserspageSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/myadmintools/users",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.users;
			var len = objectList.length;
			var list = $("#lrd-adminuserspageUsersList");
			list.empty();
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append('<li data-icon="false"><a href="#lrd-myaccountinfoedit">'+object.user+'</a><a href="#lrd-adminremoveuserdialog" data-rel="dialog"></a></li>');
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
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-bidhistorySidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/seller-product/1/2/bids",
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

$(document).on('pagebeforeshow', "#lrd-cart", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-cartSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/user/cart",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.cart;
			var len = objectList.length;
			var list = $("#lrd-myCartList");
			list.empty();
			var total=0;
			var object;
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li data-icon='false'><a onclick=GetItem("+object.id+") ><img src='images/"+object.image+"' style='resize:both; overflow:scroll; width:80px; height:80px'>"+
					'<div class="ui-grid-a"><div class="ui-block-a"><h1 style="margin: 0px">'+object.name+'</h1><p style="font-size: 13px;margin-top:0px"><b>'+object.model+'</b></p><p>'+object.brand+'</p>'+
					'</div><div class="ui-block-b" align="right"><h1 style="font-size: 16px" >'+accounting.formatMoney(object.price)+'</h1><p>Amount:'+object.amount+'</p></div></div><a href="#rpa-deleteItemCart"  data-rel="dialog"></a>');
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

$(document).on('pagebeforeshow', "#lrd-buyerproduct", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-buyerproductSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getProduct/removethis/"+itemId,
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			// console.log("currentItem= "+currentItem[0]);
			$('#lrd-buyerproductName').text(currentItem[0].itemname);
			$('#lrd-buyerproductBuyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem[0].price)+"</br> Bid: need to implement");//+accounting.formatMoney(currentItem.bid)); 
			$("#lrd-buyerproductImage").attr("src",""+currentItem[0].photo);
			$('#lrd-buyerproductTimeRemaining').html("Quantity: "+currentItem[0].amount+"</br>Ending in: "+currentItem[0].itemdate); 
			$('#lrd-buyerproductModelAndBrand').text(currentItem[0].model+", "+currentItem[0].brand);
			$('#lrd-buyerproductDimensions').text("Dimensions: "+currentItem[0].dimensions);
			$('#lrd-buyerproductId').text("Id: "+currentItem[0].itemid);
			$('#lrd-buyerproductDescription').text(currentItem[0].description);
			$('#lrd-buyerproductSellerName').text("need to implement");//currentItem.seller);
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
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-sellerproductSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getSellerProduct/0/1",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var currentItem = data.product;
			$('#lrd-sellerproductName').text(currentItem.name); 
			$('#lrd-sellerproductBuyNowPrice').html("Buy it Now: "+accounting.formatMoney(currentItem.price)+"</br> Bid: "+accounting.formatMoney(currentItem.bid)); 
			$("#lrd-sellerproductImage").attr("src","images/"+currentItem.image);
			$('#lrd-sellerproductTimeRemaining').html("Quantity: "+currentItem.amount+"</br>Ending in: "+currentItem.startingDate); 
			$('#lrd-sellerproductModelAndBrand').text(currentItem.model+", "+currentItem.brand);
			$('#lrd-sellerproductDimensions').text("Dimensions: "+currentItem.dimensions);
			$('#lrd-buyerproductId').text("Id: "+currentItem[0].itemid);
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

////////////////////////////////////USER PROFILE////////////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userprofile", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-userprofileSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/user/profile",
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
$(document).on('pagebeforeshow', "#lrd-myaccountinfo", function( event, ui ) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-myaccountinfoSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/user/profile",
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

$(document).on('pagebeforeshow', "#lrd-myaccountinfoedit", function( event, ui ) {
	  $.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-myaccountinfoeditSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//////////////////////////SELLER STORE//////////////////////////////////
$(document).on('pagebeforeshow', "#lrd-userstore", function( event, ui ) {
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-userstoreSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		url : "http://localhost:3412/SpruceServer/user/store",
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.items;
			var len = objectList.length;
			var list = $("#lrd-userstoreSellerItems");
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

//Function for the three pages of my Spruce
function ajaxMySpruce(where){
	$.ajax({
		url : "http://localhost:3412/SpruceServer/getCategoriesForSidePanel",
		method: 'get',
		contentType: "application/json",
		success : function(data, textStatus, jqXHR){
			var objectList = data.categories;
			var len = objectList.length;
			var list = $("#lrd-myspruceSidePanel");
			list.empty();
			var object;
			list.append("<li><a onclick=GoToView('lrd-home')>Home</a></li><li><a  onclick=GoToView('lrd-myspruce') >My Spruce</a></li><li data-role=list-divider data-theme=a>Categories</li>");
			for (var i=0; i < len; ++i){
				object = objectList[i];
				list.append("<li><a onclick=GetItemsForCategory("+object.catid+")>"+object.catname+"</a></li>");
			}
			list.append("<li data-role=list-divider data-theme=a></li><li><a onclick=GoToView('lrd-myaccountinfo') >My Account Info</a></li><li><a onclick=GoToView('lrd-adminreportspage') >Admin Tools</a></li><li><a href=#candy >Sign Out</a></li>");
			list.listview("refresh");	
		},
		error: function(data, textStatus, jqXHR){
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.ajax({
		//The server takes care of where to route depending of page (selling,bidding,history)
		url : "http://localhost:3412/SpruceServer/mySpruce/"+where,
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
						list.append('<li data-icon="false"><a  onclick="GetItem('+object.id+')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+ 
							'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
							'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
							'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p style="color:green"><b>Lost: '+object.startingDate+'</b></p></div></div></a></li>');
					}
					else{
						list.append('<li data-icon="false"><a  onclick="GetItem('+object.id+')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+ 
							'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
							'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
							'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p style="color:red"><b>Lost: '+object.startingDate+'</b></p></div></div></a></li>');
					}
				}
			}
			else if(where=='bidding'){
				for (var i=0; i < len; ++i){
					object = objectList[i];
					list.append('<li data-icon="false"><a  onclick="GetItem('+object.id+')"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+ 
						'<h1 style="margin: 0px">'+object.name+'</h1><hr style="margin-bottom: 0px;margin-top: 3px"/><div class="ui-grid-a"><div class="ui-block-a" align="left" style="">'+
						'<h2 style="font-size: 13px;margin-top:0px">'+object.model+'</h2><p>'+object.brand+'</p></div><div class="ui-block-b" align="right">'+
						'<h3 style="margin-top:0px;padding-top: 0px">'+accounting.formatMoney(object.price)+'</h3><p><b>'+object.startingDate+'</b></p></div></div></a></li>');
				}
			}
			else{
				for (var i=0; i < len; ++i){
					object = objectList[i];
					list.append('<li data-icon="false"><a  href="#lrd-sellerproduct"><img style="padding-left:5px; padding-top: 7px; resize:both; overflow:scroll; width:80px; height:80px" src="images/'+object.image+'">'+ 
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

function GoToView(viewName){
	$.mobile.loading("show");
	$.mobile.changePage("#"+viewName,{
		allowSamePageTransition: true
	});
}

function GetItemsForCategory(category){
	var itemCategory = category;
	if(typeof(Storage)!=="undefined"){
  		sessionStorage.category=category;
  	}
	else{
  		console.log("Web storage not supported");
  	}
	$.mobile.loading("show");
	$.mobile.changePage("#lrd-itemsforcategory",{
		allowSamePageTransition: true
	});
}

function GetItem(id){
	itemId = id;
	$.mobile.loading("show");
	$.mobile.changePage("#lrd-buyerproduct",{
		allowSamePageTransition: true
	});
}