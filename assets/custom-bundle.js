

$(document).on("click", ".productsimage .card__image", function(e) {
	$bkpQty = $(this).closest(".productsimage").find(".product-quantity.show .product-quantity__selector").val();
	var thisObj = $(this).closest(".productsimage").find("quick-view-product a");
	
	e.preventDefault();
	if (!thisObj.quickViewModal) {
		const target = e.currentTarget;
		target.classList.add('working');
		fetch(`${target.getAttribute('href')}${ target.getAttribute('href').includes('?') ? '&' : '?' }view=quick-view`)
			.then(response => response.text())
			.then(text => {

				const quickViewHTML = new DOMParser().parseFromString(text, 'text/html').querySelector('#product-quick-view');
				const quickViewContainer = document.createElement('div');
				quickViewContainer.innerHTML = `<modal-box id="modal-${target.dataset.id}"	
              class="modal modal--product" 
              data-options='{
                "enabled": false,
                "showOnce": false,
                "blockTabNavigation": true
              }'
              tabindex="-1" role="dialog" aria-modal="true" 
            >
              <div class="container--medium">
                <div class="modal-content">
                  <button class="modal-close" data-js-close data-js-first-focus style="position:absolute;margin:0;top:0;right:0">${window.KROWN.settings.symbols.close}</button>
                </div>
              </div>
              <span class="modal-background" data-js-close></span>
            </modal-box>`;

				thisObj.quickViewModal = quickViewContainer.querySelector('modal-box');
				document.body.appendChild(thisObj.quickViewModal);
				thisObj.quickViewModal.querySelector('.modal-content').innerHTML = quickViewHTML.innerHTML;
				if (!window.productPageScripts) {
					const scripts = thisObj.quickViewModal.querySelectorAll('script');
					scripts.forEach(elm => {
						const script = document.createElement('script');
						script.src = elm.src;
						document.body.append(script);
						window.productPageScripts = true;
					})
				}

				thisObj.quickViewModal.querySelector('.product-quick-view__close').addEventListener('click', () => {
					thisObj.quickViewModal.hide();
				});

				if (thisObj.quickViewModal.querySelector('[data-js-product-form]')) {
					thisObj.quickViewModal.querySelector('[data-js-product-form]').addEventListener('add-to-cart', () => {
						thisObj.quickViewModal.hide();
					});
				}
				setTimeout(() => {
					thisObj.quickViewModal.show();
					console.log($bkpQty);
					if($bkpQty != undefined){
						var innnHtml = thisObj.quickViewModal.querySelector('.modal-content');
						console.log(innnHtml);
						innnHtml.querySelector(".popupaddbtn").classList.remove('show');
						innnHtml.querySelector(".productQty").classList.add('show');
						innnHtml.querySelector(".productQty .product-quantity__minus").classList.remove('disabled');
						innnHtml.querySelector(".product-quantity__selector").value = $bkpQty;
					}
					target.classList.remove('working');
				}, 250);
			});
	} else {
		thisObj.quickViewModal.show();
	}
});

$(document).ready(function() {
	// fetch('/checkout?discount=CLEAR');

	const filterSelectlabel = $(".filterSelectlabel");
	filterSelectlabel.on("click", function() {
		filterSelectlabel.removeClass("active");
		$(this).addClass("active");
		$boxTag = $(this).data("tag");
		if($boxTag != ""){
			$popupHtml = "";
			$totalprice = 0;
			$("#filtered-products .productsimage").each(function(index) {
				var productTags = $(this).attr("data-tags");
				productTags = productTags.split(",");
				
                var matchingValues = productTags.filter(function(value) {
					value = value.slice(0, -1);
                    return value.endsWith("_") && $boxTag == value;
                });
                if (matchingValues.length > 0) {
                    var getNewQty = matchingValues.join(", ").slice(-1);
					$var_id = $(this).data("variant");
					$imgSrc = $(this).find(".imageforcart img").attr("src");
					$productTitle = $(this).find(".variant-title").html();
					$productPrice = $(this).find(".product-price .product-price--original ").html();
					$splitprice = $productPrice.split("$");
					$proprice =(getNewQty <= 1 ) ? '':  "($"+getNewQty * $splitprice[1]+")";
					$producttotalprice = getNewQty * $splitprice[1];
					var getNewQty = (getNewQty <= 1 ) ? '' : getNewQty+"X";
					$popupHtml += '<div class="popupimage">'+
									'<div class="imageforpopup">'+
										'<img src="'+ $imgSrc +'">'+
									'</div>'+ 
									'<div class="flexrowcontaner">'+
										'<div>'+
											'<div class="text-weight--bold ">'+getNewQty+'</div>'+
											'<div class="text-weight--bold ">'+$productTitle+'</div>'+
										'</div>'+
										'<div>'+
											'<div class="text-weight--bold ">'+$productPrice+'</div>'+
											'<div class="text-weight--bold ">'+$proprice+'</div>'+
										'</div>'+
									'</div>'+
								'</div>';
					$totalprice = parseFloat($totalprice) + parseFloat($producttotalprice);

                } 
			});
			if($popupHtml != ""){
				$addSelectproduct = '<div class="main-custombundle selectproductAddbtn selectproductadd">'+
				'<button role="button" data-tag="'+ $boxTag +'"  class="mainboxli add-button button button-primary small" >'+
				'<span class="plusicon">+</span>'+
				'<span> ADD</span>'+
				'</button>'+
				'</div>';
				$TotalPrice = '<span class="totalPricepopup">Total $'+$totalprice.toFixed(2)+'</span>';
				$(".pop-up-content-wrap").append($popupHtml);
				$(".pop-up-content-wrap").append($TotalPrice);
				$(".pop-up-content-wrap").append($addSelectproduct);
				$(".custom-model-main").addClass('model-open');			
				$("#main").append('<div class="overlaypopup overlayscustom"></div>');		  
			}
		}
	});
	$(document).on("click",".close-btn, .bg-overlay",function(){
		$(".pop-up-content-wrap").html("");
		$(".custom-model-main").removeClass('model-open');
		$(".filterSelectlabel").removeClass("active");
		$(".overlayscustom").removeClass('overlaypopup');	
	  });
	// const filterContainer = $(".mainboxli");
	// filterContainer.on("click", function() {
	$(document).on("click",".mainboxli",function(){
		console.log("CLICK");
		$(".selected-btn-color").removeClass("selected-button-active");
		$(this).addClass("selected-button-active");
		$(".box-summary .productsimage").each(function(index) {
			removeCookie("variantids");
			removeCookie("variant_qty");
			$(".productsimage").find('.product-quantity__selector').val(1);
			$(".box-summary .productsimage").remove();
			$(".main-custombundle .productsimage").find(".productQty").removeClass("show");
			$(".main-custombundle .productsimage").find(".add-button").css("display", "flex");
			getcartTotalQty();
		});
		$boxTag = $(this).data("tag");
		if($boxTag != ""){
			$("#filtered-products .productsimage").each(function(index) {
				var productTags = $(this).attr("data-tags");
				productTags = productTags.split(",");

                var matchingValues = productTags.filter(function(value) {
                	value = value.slice(0, -1);
                    return value.endsWith("_") && $boxTag == value;
                });
                if (matchingValues.length > 0) {
                    var getNewQty = matchingValues.join(", ").slice(-1);
					$(this).find(".productQty input").val(getNewQty);
					$(this).find(".productQty input").trigger("change");
					$(this).find(".addButton").trigger("click");
					(getNewQty > 1 ) ? $(this).find('.product-quantity__minus').removeClass("disabled") : '' ;
					$var_id = $(this).data("variant");
					(getNewQty > 1 ) ? $(".box-summary div[data-variant='" + $var_id + "']").find('.product-quantity__minus').removeClass("disabled") : '' ;
					$(".box-summary div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val(getNewQty);
					getcartTotalQty();
                } 
			});
		}
		$(".pop-up-content-wrap").html("");
		$(".custom-model-main").removeClass('model-open');
		$(".overlayscustom").removeClass('overlaypopup');
	});


	const filterContainerselect = $("#product-filterselect");
	filterContainerselect.on("change", function() {
		$selectValue = $(this).val();
		const filterUrl = $(this).val() // Update with your actual collection URL + filters

		$.get(filterUrl, function(data) {
			$("#filtered-products .productsimage").css("display", "none");
			$eachProduct = $(data).find("#main-collection-product-grid .product-item.card");
			$($eachProduct).each(function(index) {
				$eachProductId = $(this).attr('data-product');
				$(".productsimage[data-product='" + $eachProductId + "']").css("display", "block");
			});
		}).fail(function(error) {
			console.error("Error fetching products:", error);
		});
	});

	$(document).on("click", ".product-quantity__plus", function() {
		$variantQty = $(this).closest(".productQty").find(".product-quantity__selector").val();
		$var_id = $(this).closest(".productsimage").data("variant");
		$html = $(this).closest(".productsimage").html();
		$summeryindex = $(this).closest(".container-box").attr('data-summery-index');
		if ($variantQty == 1) {
			$(".box-summary").append("<div class='productsimage'>" + $html + "</div>");
		} else {
			// $('.box-summary .container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
			$('.container-box[data-variant="' + $var_id + '"] .product-quantity__minus').removeClass('disabled');
			$(".main-custombundle div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQty);
			$(".box-summary div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQty);
		}
		getcartTotalQty();
	});

	$(document).on("click", ".product-quantity__minus", function() {
		var selected_item = getCookie("variantids");
		var variant_qty = getCookie("variant_qty");
		var delimiter = ",";
		var itemArray = selected_item.split(delimiter);
		var itemQtyArray = variant_qty.split(delimiter);
		$var_id = $(this).closest(".productsimage").data("variant");
		$variantQtyMinus = $(this).closest(".productQty").find(".product-quantity__selector").val();
		$summeryindex = $(this).closest(".container-box").attr('data-summery-index');

		for (var i = 0; i < itemArray.length; i++) {
			if ($.trim($var_id) == itemArray[i].trim()) {
				if (itemQtyArray[i].trim() == $variantQtyMinus) {
					itemArray.splice(i, 1);
					itemQtyArray.splice(i, 1);
					setCookie("variantids", itemArray, {path: '/'});
					setCookie("variant_qty", itemQtyArray, {path: '/'});
					$(".box-summary").find('.container-box[data-variant="' + $var_id + '"]').closest(".productsimage").remove();
					$(".main-custombundle .productsimage[data-variant='" + $var_id + "']").find(".productQty").removeClass("show");
					$(".main-custombundle .productsimage[data-variant='" + $var_id + "']").find(".add-button").css("display", "flex");
				}
			}
		}
		$(".main-custombundle div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQtyMinus);
		$(".box-summary div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQtyMinus);
		getcartTotalQty();
	});

	$(".productSelect").change(function() {
		$giftVariantid = $(this).find(":selected").val();
		setCookie("giftvariantid", $giftVariantid);
		$giftVariantTitle = $.trim($(this).find(":selected").html());
		$giftVariantImage = $.trim($(this).find(":selected").data("src"));
		$(this).attr("data-vid", $giftVariantid);
		$(".box-giftproduct_mobile").find(".imageforcart img").attr("src",$giftVariantImage);

		$("#filtered-products .productsimage").each( function( i ) {
			$productTitle = $(this).find(".variant-title").html();
			$productSrc = $(this).find(".imageforcart img").attr("src");
			if($productTitle.includes($giftVariantTitle)){
				// $(".freeTurkey").find(".variant-title").html($productTitle);
				// $(".freeTurkey").find(".imageforcart img").attr("src",$productSrc);
			}
		});
	});
	
	$('.addToCart,.MobileAddCart').click(function(e) {
		e.preventDefault();
		// Send an AJAX request to clear the cart
		var request = new XMLHttpRequest();
		request.open('POST', '/cart/clear.js', true);  
		request.send(); 
		window.setTimeout(() => {
			$(".subscriptionlabel").each( function( i ) {
				if($(this).hasClass('active')){
					$dataValue = $(this).data('value');
					if($dataValue == "subscribe & save"){
						subscriptionAddtocart();
					}else{
						onetimeAddtocart();
					}
				}
			});
		}, 1000);
	});

	function onetimeAddtocart(){
		$giftVariantid = $(".product-variant-select").val();
		$giftProductid = $(".giftProduct").data("product");

		var PRODUCT_ID = $(".product_variant_id").val();
		
		var bundleObject = {
			externalProductId: '8619519803673',
			externalVariantId: PRODUCT_ID ,
			selections: []
		};

		$getproductPrices = 0;
		$.each($("#cartSummary .productsimage"), function() {

			$price = $(this).find(".product-price--original").data("price");
			$currentVarQty = $(this).find(".product-quantity__selector").val();
			$Dataprice = ($price != undefined) ? $price.split("$") : 0;
			// €
			if ($Dataprice != 0) {
                $getproductPrices += $currentVarQty * parseFloat($Dataprice[1]);
			}

			$currentVarQty = $(this).find(".product-quantity__selector").val();
			var product_id = $(this).data("product");
			var variant_id = $(this).data("variant");
			var collection_id = $(this).data("collection");

			var item_data = {
				collectionId: collection_id,  // Example Shopify Collection
				externalProductId: product_id,  // Dynamic Product ID
				externalVariantId: variant_id,  // Dynamic Variant ID
				quantity: $currentVarQty  // Dynamic Quantity
			}
			bundleObject.selections.push(item_data);
		});
		
		$splitMaxPrice = $(".maxCartprice").val().split("$");
		var inputtotalrangemax = $splitMaxPrice[1];
		
		if(inputtotalrangemax < $getproductPrices){
			console.log("PRICE");	
			var item_data = {
				collectionId: '459204722969',
				externalProductId: $giftProductid,  // GIFT PRODUCT ID
				externalVariantId: $giftVariantid,  // THE SELECTED VARIANT
				quantity: 1  // Dynamic Quantity
			}
			bundleObject.selections.push(item_data);
			console.log(bundleObject);
		}

		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$affiliate_user = "true";
			}
		}
		if($affiliate_user == "true"){
		//Lemon Pepper Chicken Product
		var item_data = {
			collectionId: '459204722969',
			externalProductId: '8887761469721',  
			externalVariantId: '47309007225113',  
			quantity: 1 
			}
		bundleObject.selections.push(item_data);
		console.log(bundleObject);	
		}else{
		//Cranapple Rosemary Chicken Product
		var item_data = {
			collectionId: '459204722969',
			externalProductId: '8929832468761',  // GIFT PRODUCT ID
			externalVariantId: '47409726456089',  // THE SELECTED VARIANT
			quantity: 1  // Dynamic Quantity
		}
		bundleObject.selections.push(item_data);
		console.log(bundleObject);	
		}

		const bundle = bundleObject;
		console.log(bundle);
		const bundleItems = recharge.bundle.getDynamicBundleItems(bundle, 'shopifyProductHandle');
		
        // var get_main_bundle_id = bundleItems[0]['properties']['_rc_bundle'];
        //var get_main_bundle_id = "8619519803673";
		const cartData = { items: bundleItems };
		const asyncGetCall = async () => {
			
			const respons = await fetch(window.Shopify.routes.root + 'cart/add.js', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cartData),
			});
			const data = await respons.json();
			console.log(data);
			if(data !== undefined){
				// removeCookie("variantids");
				// removeCookie("variant_qty");
				window.location.href = '/checkout';
			}
		}
		asyncGetCall();
	}
	
	// TO DO NEED TO REMOVE
		function buildFreeProductForSubscription($giftVariantid, ){
			// Corrected this part to refer to a known element if 'this' is not clear
			var plan15 = $('.giftProduct').attr('gift-data-selling15');  
			var plan30 = $('.giftProduct').attr('gift-data-selling30');
			var giftSellingPlanId = (selling_plan_id === null) ? plan15 : plan30;

			var item_data = {
				collectionId: collection_id,  // Example Shopify Collection WE NEED TTO STORE THE COLLECTION IT BELONGS TO. 
				externalProductId: $productid,  // GIFT PRODUCT ID
				externalVariantId: $giftVariantid,  // THE SELECTED VARIANT
				quantity: 1,  // Dynamic Quantity
				sellingPlan: giftSellingPlanId // Dynamic Selling Plan ID
			}
		}
	// TO DO NEED TO REMOVE
	
	function subscriptionAddtocart(){
		$giftVariantid = $(".product-variant-select").val();
		$giftProductid = $(".giftProduct").data("product");
		var PRODUCT_ID = $(".product_variant_id").val();
        console.log('giftVariantid');
        console.log($giftVariantid);

		var bundleObject = {
			externalProductId: '8619519803673',
  			externalVariantId: PRODUCT_ID,
			selections: []
		};
		var static_frequancy = 15;
		// var selling_plan_id = $("#sellingPlan"+meta.product.id).val();
		var selling_plan_id = $( "input[name='selling_plan']").val();
		console.log(meta.product.id + " MTEA PRODUCT");
		console.log(selling_plan_id + " selling_plan_id");
		
		if(selling_plan_id ==  undefined){
			if(window.Recharge.widgets[meta.product.id] !== undefined){
				var selling_plans = window.Recharge.widgets[meta.product.id].product.selling_plan_groups;
                console.log(selling_plans);
				for(var i = 0; i < selling_plans.length; i++){
					for(var j = 0; j < (selling_plans[i].selling_plans).length; j++ ){
						var selling_plan_details = selling_plans[i].selling_plans[j];
						if(selling_plan_details.order_interval_frequency == static_frequancy){
							selling_plan_id = selling_plan_details.selling_plan_id;
						}
					}
				}
			}
		}

		bundleObject.sellingPlan = selling_plan_id;
		$getproductPrices = 0;
		$.each($("#cartSummary .productsimage"), function() {

			$price = $(this).find(".product-price--original").data("price");
			$currentVarQty = $(this).find(".product-quantity__selector").val();
			$Dataprice = ($price != undefined) ? $price.split("$") : 0;
			// €
			if ($Dataprice != 0) {
                $getproductPrices += $currentVarQty * parseFloat($Dataprice[1]);
			}
			var product_id = parseInt($(this).data("product"));
			var variant_id = parseInt($(this).data("variant"));

			// console.log(variant_id);
			var collection_id = $(this).data("collection");
			console.log(collection_id + "....collection_id");
			var sellingplan_id = (selling_plan_id == '689312137497') ? $(this).data("selling15") : $(this).data("selling30");

			var item_data = {
				collectionId: collection_id,  // Example Shopify Collection
				externalProductId: product_id,  // Dynamic Product ID
				externalVariantId: variant_id,  // Dynamic Variant ID
				quantity: $currentVarQty,  // Dynamic Quantity
				sellingPlan: sellingplan_id // Dynamic Selling Plan ID
			}
			bundleObject.selections.push(item_data);
		});
		
		// Promo Product
		$affiliate_user = $normal_user = "false";
		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$affiliate_user = "true";
			}
		}
		if($affiliate_user == "true"){
			// Free 50% product
			setCookie("50_Off_Discount", "True", 7); // Assuming a 7-day expiry for the cookie
			var item_data = {
				collectionId: '459204722969',
				externalProductId: '8981917401369',  
				externalVariantId: '47575163896089',  
				quantity: 1, 
				sellingPlan: giftSellingPlanId 
			}
			bundleObject.selections.push(item_data);
			console.log(bundleObject);

			//Lemon Pepper Chicken Product
			var item_data = {
				collectionId: '459204722969',
				externalProductId: '8887761469721',  
				externalVariantId: '47309007225113',  
				quantity: 1 
				}
			bundleObject.selections.push(item_data);
			console.log(bundleObject);	
		}else{
			$normal_user = "true";
		}

		if($normal_user == "true"){
			// 6 FREE Meats Product
			console.log(" 6 FREE Meats Product");
			var promo_product = $(".promoProduct").val();
			if(promo_product != undefined && promo_product != 'NULL'){
				$promo_variant_id = $(".promoProduct").attr("variant_id");
					var item_data = {
						collectionId: '459204722969',
						externalProductId: promo_product,  // GIFT PRODUCT ID
						externalVariantId: $promo_variant_id,  // THE SELECTED VARIANT
						quantity: 1,  // Dynamic Quantity
						sellingPlan: giftSellingPlanId // Dynamic Selling Plan ID
					}
				bundleObject.selections.push(item_data);
			}else{
				//Cranapple Rosemary Chicken Product
				var freeproduct_sellingplan_id = (selling_plan_id == '689312137497') ? '689500750105' : '689500782873' ;
				var item_data = {
				collectionId: '459204722969',
				externalProductId: '8929832468761',  // GIFT PRODUCT ID
				externalVariantId: '47409726456089',  // THE SELECTED VARIANT
				quantity: 1,  // Dynamic Quantity
				sellingPlan: freeproduct_sellingplan_id // Dynamic Selling Plan ID
				}
				bundleObject.selections.push(item_data);
				console.log(bundleObject);	
			}	
		}

		//Free gift product
		var item_data = {
			collectionId: '459204722969',
			externalProductId: '8930725921049',  // GIFT PRODUCT ID
			externalVariantId: '47413484945689',  // THE SELECTED VARIANT
			quantity: 1,  // Dynamic Quantity
			sellingPlan: giftSellingPlanId // Dynamic Selling Plan ID
		}
		bundleObject.selections.push(item_data);

		// Promo Product
        // var get_main_bundle_id = bundleItems[0]['properties']['_rc_bundle'];
        // check the price of to see if we need to append the free product to the selections before we get all the recharge values back needed to add to subscription.
		if($giftVariantid !== undefined){
			console.log("INNN");
			$splitMaxPrice = $(".maxCartprice").val().split("$");
			var inputtotalrangemax = $splitMaxPrice[1];
			
			if(inputtotalrangemax < $getproductPrices){
				console.log("PRICE");
				var plan15 = $('.giftProduct').attr('gift-data-selling15');  
				var plan30 = $('.giftProduct').attr('gift-data-selling30');
				var giftSellingPlanId = (selling_plan_id == '689312137497') ? plan15 : plan30;
	  
				var item_data = {
					collectionId: '459204722969',
				  	externalProductId: $giftProductid,  // GIFT PRODUCT ID
				  	externalVariantId: $giftVariantid,  // THE SELECTED VARIANT
				  	quantity: 1,  // Dynamic Quantity
				  	sellingPlan: giftSellingPlanId // Dynamic Selling Plan ID
			  	}
			  	bundleObject.selections.push(item_data);
				console.log(bundleObject);
			}
				// buildFreeProductForSubscription(PRODUCT_ID);
				// @brandon Here I'm trying to append the selection to the other selections. 
				// bundleObject.selections.push(buildFreeProductForSubscription);
				
				const bundle = bundleObject;
				const bundleItems = recharge.bundle.getDynamicBundleItems(bundle, 'shopifyProductHandle');
				// console.log('get_main_bundle_id---'+get_main_bundle_id);
				
				const cartData = { items: bundleItems };
				const asyncGetCall = async () => {
					const respons = await fetch(window.Shopify.routes.root + 'cart/add.js', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(cartData),
					});
					const data = await respons.json();
					console.log(data);
					// removeCookie("variantids");
					// removeCookie("variant_qty");
					window.location.href = '/checkout';
				}
				asyncGetCall();
		}
	}
  
	set_lineitems_onload();
	$(document).on("click",".addButton",function() {
		console.log("addButton  click");
		$var_id = $(this).closest(".productsimage").data("variant");
		$product_id = $(this).closest(".productsimage").data("product");
		$selling_plan_15id = $(this).closest(".productsimage").data("selling15");
		$selling_plan_30id = $(this).closest(".productsimage").data("selling30");
		$collection_id = $(this).closest(".productsimage").data("collection");
		$(this).css("display", "none");
		$(this).closest(".container-box").find(".product-quantity").addClass("show");
		$html = $(this).closest(".productsimage").html();
		$(".box-summary").append("<div class='productsimage' data-selling30='"+$selling_plan_30id+"' data-selling15='"+$selling_plan_15id+"' data-variant='" + $var_id + "' data-product='"+$product_id+"' collection-id='"+$collection_id+"' data-collection='"+$collection_id+"'>" + $html + "</div>");
		getcartTotalQty();
	});

	function set_lineitems_onload() {
		var promo_product = $(".promoProduct").val();
		console.log(promo_product + "...promo_product");
		console.log("CALL");
		$reachargevalue = getCookie("reachargevalue");
		$Temp_Var = $normal_user = "true";
		var promo_class = bgcolor =  free_pro_title = productBadge = bgcolor = free_pro_img = turkey_product_padding = "";
		console.log("STEP1");
		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$Temp_Var = "false";
				$normal_user = "false";
			}
		}
		if($reachargevalue == "subscribe & save" || $reachargevalue == ""){
			if($Temp_Var == "true"){
				console.log("STEP2");
				$normal_user = "false";
				productBadge = "PROMO";
				bgcolor ="bg_blue";
				if(promo_product != undefined && promo_product != 'NULL'){
					if ($(window).width() > 700) {
						free_pro_img = $(".promoProduct").attr('data-desktopimg');
						promo_class = 'promo-product';
						$('.announcement').text('LIMITED TIME: GET '+  $(".promoProduct").data('title').toUpperCase());
					}else{
						free_pro_img = $(".promoProduct").attr('data-mobileimg');
						promo_class = 'promo-product promo-product-color';
						free_pro_title = $(".promoProduct").data('title') + "  Limited Quantities";
					}
				}else{
					if ($(window).width() > 700) {
						free_pro_img = 'https://res.cloudinary.com/meals/image/upload/v1701388042/Cranapple_Bundler_Image.jpg';
						promo_class = 'promo-product';
						$('.announcement').text('LIMITED TIME: GET FREE CRANAPPLE ROSEMARY CHICKEN');
					}else{
						free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/Cranapple_Bundler_Image_mobile.jpg?v=1703781412';
						free_pro_title = 'Free Order Gift';
						promo_class = 'promo-product promo-product-color';
						turkey_product_padding = "turkey_product_padding";
					}
				}
			}else{
				$normal_user = "true";
			}
		}else{
			$normal_user = "true";
		}
		
		if($normal_user == "true"){
			console.log($Temp_Var);
			if ($(window).width() > 700) {
				if($Temp_Var == "false"){
					free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/free-lemon-pepper-chicken-77580322.png?v=1703939851';
				}else{
					free_pro_img = 'https://res.cloudinary.com/meals/image/upload/v1701388042/Cranapple_Bundler_Image.jpg';
				}
			}else{
				if($Temp_Var == "false"){
					free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/products/free-lemon-pepper-chicken-775803.png?v=1699086664';
				}else{
					free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/Cranapple_Bundler_Image_mobile.jpg?v=1703781412';
				}
			}
			free_pro_title = 'Free Order Gift';
			productBadge = "FREE";
			bgcolor ="bg-green";
			promo_class = 'promo-product';
			turkey_product_padding = "turkey_product_padding";
		}
		console.log(free_pro_img);
		$('.saveText').text('Save 10% on your first order');
		$('.box-header-title').html('<div class="box-header-title">Subscribers Save 10% on Orders<div><span class="subcarttitle">Applied at checkout</span></div></div>');
		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$('.announcement').text('LIMITED TIME: GET FREE LEMON PEPPER CHICKEN');
				$discount_amount_price = 0.50;
				$('.saveText').text('Save 50% on your first order');
				$rightArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="17.627" height="17.627" viewBox="0 0 17.627 17.627" aria-hidden="true" role="presentation" class="svgcolor w-3 h-3 mr-1 text-green-400"><g transform="translate(-16.457 -24.531)"><circle id="Ellipse_46" data-name="Ellipse 46" cx="7.5" cy="7.5" r="7.5" transform="translate(17.788 26.154)" fill="#fff"></circle><path id="noun_tick_684585" d="M15.413 6.6a8.813 8.813.0 1 0 8.813 8.813A8.805 8.805.0 0 0 15.413 6.6zm4.265 6.986-5.219 5.2a.8.8.0 0 1-.569.244.768.768.0 0 1-.569-.244l-2.579-2.559A.818.818.0 1 1 11.9 15.068l1.99 1.99 4.63-4.63a.809.809.0 0 1 1.158.0A.847.847.0 0 1 19.678 13.586z" transform="translate(9.857 17.931)" fill="currentColor"></path></g></svg>';
				$('.25_savetext').html($rightArrow +"50% Off First Order");
				$('.box-header-title').html('<div class="box-header-title">SUBSCRIBERS SAVE 50%<div><span class="subcarttitle">Applied at checkout</span></div></div>');
			}
		}
		  $staticGiftProduct = '<div class="freeTurkey">'+
		  '<div class="product-item card container-box '+promo_class+'" data-summery-index="4">'+
		  '<div class="imageforcart">'+
			  '<img src="'+free_pro_img+'" alt="" class="'+ turkey_product_padding +'">'+
		  '</div>'+
			'<div class="flexdirrow card__text product-item__text gutter--regular spacing--xlarge remove-empty-space text-align--center">'+
			  '<span  class="variant-title  text-size--large text-line-height--small text-weight--bold">'+free_pro_title+'</span>'+
		  '<div class="product-item__price text-size--large equalize-white-space">'+
						'<div class="remove-line-height-space">'+
		  '<div class="product-price"><span class="product-price--original " data-js-product-price-original="" data-price="FREE">FREE</span>'+
			  '<del class="product-price--compare" data-js-product-price-compare=""></del><span class="product-price--unit text-size--regular" data-js-product-price-unit=""></span>'+
		  '</div>'+
		  '</div>'+
		  '</div>'+
		  '</div><div class="product-item__badges text-size--xsmall '+bgcolor+'">'+productBadge+'</div></div>'+
		  '</div>';
		  if ($(window).width() > 700) {
			  $("#cartSummary").append($staticGiftProduct);
		  }else{
			  $("#cartSummary").prepend($staticGiftProduct);
		  }
		var selected_item = getCookie("variantids");
		var variant_qty = getCookie("variant_qty");
		if (selected_item) {
			var delimiter = ",";
			var itemArray = selected_item.split(delimiter);
			var itemQtyArray = variant_qty.split(delimiter);
			for (var i = 0; i < itemArray.length; i++) {
				var product_item = itemArray[i].trim();
				var product_item_qty = itemQtyArray[i].trim();
				$("div[data-variant='" + product_item + "']").find(".product-quantity").addClass("show");
				$("div[data-variant='" + product_item + "']").find(".productQty .qty-minus").removeClass('disabled');
				$("div[data-variant='" + product_item + "']").find(".addButton").css("display", "none");
				$("div[data-variant='" + product_item + "']").find(".productQty .product-quantity__selector").val(product_item_qty);
				$product_id = $("div[data-variant='" + product_item + "']").data("product");
				$collection_id = $("div[data-variant='" + product_item + "']").data("collection");
				$selling_plan_15id = $("div[data-variant='" + product_item + "']").data("selling15");
				$selling_plan_30id = $("div[data-variant='" + product_item + "']").data("selling30");
				$getHtml = $(".main-custombundle div[data-variant='" + product_item + "']").html();
				$(".box-summary").append("<div class='productsimage' data-selling30='"+$selling_plan_30id+"' data-selling15='"+$selling_plan_15id+"' data-variant='" + product_item + "' data-product='"+$product_id+"' data-collection='"+$collection_id+"'>" + $getHtml + "</div>");
				$(".box-summary div[data-variant='" + product_item + "']").find(".productQty .product-quantity__selector").val(product_item_qty);
				$(".box-summary div[data-variant='" + product_item + "']").find(".productQty .qty-minus").removeClass('disabled');
			}
		}
		getcartTotalQty();
	}
	
	function getcartTotalQty() {
		var selected_items = [];
		var selected_item_qty = [];
		var cartTotQty = 0;
    	var indicatore = 0;
		$splitMinPrice = $(".minCartprice").val().split("$");
		var inputtotalrange = $splitMinPrice[1];
		$splitMaxPrice = $(".maxCartprice").val().split("$");
		var inputtotalrangemax = $splitMaxPrice[1];
		$reachargevalue = getCookie("reachargevalue");
		$subscriptionvalue = getCookie("subscriptionvalue");
		$(".subscriptionlabel").removeClass('active');
		if($reachargevalue == "one time"){
			$('.productsimage[data-product="8948393378073"],.productsimage[data-product="8948391477529"]').addClass("hide");
			$('.box-summary .productsimage[data-product="8948393378073"],.box-summary .productsimage[data-product="8948391477529"]').remove();
			$('.subscriptionlabel[data-value="one time"]').addClass('active');
			$(".save_label").removeClass('active');
		}else{
			$('.productsimage[data-product="8948393378073"],.productsimage[data-product="8948391477529"]').removeClass("hide");
			$boxsweetchilli =  $('.box-summary .productsimage[data-product="8948393378073"]').html();
			if($boxsweetchilli  == undefined){
				$sweetchilli = $('.productsimage[data-product="8948393378073"] .productQty').hasClass("show");
				if($sweetchilli){
					$sweetchillihtml  = $('.main-custombundle .productsimage[data-product="8948393378073"]').html();
					$sweetchilliqty = $('.main-custombundle .productsimage[data-product="8948393378073"] .productQty .qty-selector').val();
					$(".box-summary").append("<div class='productsimage'  data-selling30='689499963673' data-selling15='689499930905' data-variant='47472880124185' data-product='8948393378073' data-collection='459204722969'>" + $sweetchillihtml + "</div>");
					$('.box-summary  .productsimage[data-product="8948393378073"] .productQty .qty-selector').val($sweetchilliqty);

				}
			}
			$boxchimichurriSteak =  $('.box-summary .productsimage[data-product="8948391477529"]').html();
			if($boxchimichurriSteak  == undefined){
				$chimichurriSteak = $('.productsimage[data-product="8948391477529"] .productQty').hasClass("show");
				if($chimichurriSteak){
					$chimichurriSteakhtml  = $('.main-custombundle .productsimage[data-product="8948391477529"]').html();
					$chimichurriSteakqty = $('.main-custombundle .productsimage[data-product="8948391477529"] .productQty .qty-selector').val();
					$(".box-summary").append("<div class='productsimage' data-selling30='689499898137' data-selling15='689499865369' data-variant='47472870850841'  data-product='8948391477529' data-collection='459204722969'>" + $chimichurriSteakhtml + "</div>");
					$('.box-summary  .productsimage[data-product="8948391477529"] .productQty .qty-selector').val($chimichurriSteakqty);
				}
			}
			$('.subscriptionlabel[data-value="subscribe & save"]').addClass('active');
			$(".save_label").addClass('active');
			if($subscriptionvalue != undefined && $subscriptionvalue != ""){
				$('.subscriptionlabel[data-value="subscribe & save"]').find(".frequency_select option[value='"+ $subscriptionvalue +"']").attr('selected','selected');
				$(".frequncy_select_btn").removeClass("active");
				$(".frequncy_select_btn[data-value='"+ $subscriptionvalue +"']").addClass("active");
				var refresh_selling_plan_Id = setInterval(function() {
					$seling_plan_id_value = $( "input[name='selling_plan']").val();
					if($seling_plan_id_value != undefined){
						clearInterval(refresh_selling_plan_Id);
						$( "input[name='selling_plan']").val($subscriptionvalue);
						console.log($( "input[name='selling_plan']").val());
					}
				}, 500);

			}
		}
	
		$productPrices = 0;
		$getproductPrices = 0;
		$.each($("#cartSummary .productsimage .product-quantity__selector"), function(index) {

			cartTotQty += parseInt($(this).val());
			$currentVarQty = $(this).val();
			$price = $(this).closest(".productsimage").find(".product-price--original").data("price");
			$Dataprice = ($price != undefined) ? $price.split("$") : 0;
			// €
			if ($Dataprice != 0) {
                $getproductPrices += $currentVarQty * parseFloat($Dataprice[1]);
                $productPrices += $currentVarQty * parseFloat($Dataprice[1]);
			}

			$gistSelectedvariant = getCookie("giftvariantid");
			$(".productSelect  option[value='"+ $gistSelectedvariant +"']").prop("selected", true);
 
			var varId = $(this).closest(".productsimage").find(".variant-title").data("id");
			var checkExistingVal = $.inArray(varId, selected_items);
			if (checkExistingVal !== -1) {
				selected_items[checkExistingVal] = varId;
				selected_item_qty[checkExistingVal] = $currentVarQty;
			} else {
				selected_items.push(varId);
				selected_item_qty.push($currentVarQty);
			}
			setCookie("variantids", selected_items, 7);
			setCookie("variant_qty", selected_item_qty, 7);

		});
		$(".totalPrice").html('Total: $'+$productPrices.toFixed(2));
		indicatore = ($productPrices * 100)/inputtotalrange;
		if ($getproductPrices <= inputtotalrangemax) {
			$(".for_desktop_range #rangeSlider,.for_mobile_range #rangeSlider").val($getproductPrices);
			$(".range-slider__indicators .range-slider__value").css("left",indicatore+"%");
      	} else if ($getproductPrices > inputtotalrangemax) {
            $(".for_desktop_range #rangeSlider,.for_mobile_range #rangeSlider").val($getproductPrices);
			$(".range-slider__indicators .range-slider__value").css("left","100%");
		}
		// don't remove this comment
		// $(".range-slider__indicators .range-slider__value").html("$"+$productPrices);
		// don't remove this comment
		$remain_amount = inputtotalrange - $getproductPrices;
		var $getremainAmount = Math.round($remain_amount * 100) / 100;
		if(inputtotalrangemax <= $getproductPrices){
			if (!$(".productsimage").hasClass("giftProduct")) {
				$(".box-giftproduct").addClass("show");
				$(".product-variant-select").addClass("show");
				$(".btnlocked").addClass("hide");
				$(".giftselection").removeClass("hide");
				$(".mobile_gift_pro_info").addClass("hide");
				$(".freeTurkey").addClass("show");
				$("#filtered-products .productsimage").each( function( i ) {
					$allproductTitle = $(this).find(".variant-title").html();
					$allproductSrc = $(this).find(".imageforcart img").attr("src");
					$giftproductTitle = $.trim($(".productSelect").find(":selected").html());
					if($allproductTitle.includes($giftproductTitle)){
						// $(".freeTurkey").find(".variant-title").html($allproductTitle);
						// $(".freeTurkey").find(".imageforcart img").attr("src",$allproductSrc);
					}
				});
				$(".box-giftproduct_mobile .product-item__badges").text("FREE");
				$(".box-giftproduct_mobile .product-item__badges").addClass("bg-green");
				$(".box-giftproduct_mobile .product-item__badges").removeClass("bg_maroon");
				$(".box-giftproduct_mobile").removeClass("lockproduct");
				$(".box-giftproduct_mobile .freeproductimg").removeClass("freeimgpadding");
				$(".for_mobile_range .range-labels li.label130").addClass("bg-green");
				$giftVariantImage = $.trim($(".box-giftproduct_mobile .productSelect").find(":selected").data("src"));
				$(".box-giftproduct_mobile").find(".imageforcart img").attr("src",$giftVariantImage);
			}
		}else{
			$(".box-giftproduct").removeClass("show");
			$(".product-variant-select").removeClass("show");
			$(".btnlocked").removeClass("hide");
			$(".giftselection").addClass("hide");
			$(".mobile_gift_pro_info").removeClass("hide");
			$(".freeTurkey").removeClass("show");
			$(".box-giftproduct_mobile .product-item__badges").text("LOCKED");
			$(".box-giftproduct_mobile .product-item__badges").removeClass("bg-green");
			$(".box-giftproduct_mobile .product-item__badges").addClass("bg_maroon");
			$(".box-giftproduct_mobile").addClass("lockproduct");
			$(".box-giftproduct_mobile .freeproductimg").addClass("freeimgpadding");
			$(".for_mobile_range .range-labels li.label130").removeClass("bg-green");
			$(".box-giftproduct_mobile .freeproductimg").attr("src","https://healthius-store.myshopify.com/cdn/shop/products/free-meat-unlocked-at-125-536967_medium.png?v=1697484259");

		}
		console.log($remain_amount + "....remain_amount");
		console.log($getproductPrices + "...getproductPrices");
		
        var $getproductPrices = Math.round($getproductPrices * 100) / 100;
        var $getremain_amount = Math.round($getremainAmount * 100) / 100;
		
		$continue_arrow = '';
		var originalString_onetime = $(".subscribeMobileContainer .subscribename.onetimeOption").text();
		var originalString_subscribe = $(".subscribeMobileContainer .subscribename.subscriptionOption").text();
		var dollarAmountRegex = /\$\d+(\.\d{2})?/g;
		var updatedString_onetime = originalString_onetime.replace(dollarAmountRegex, "");
		var updatedString_subscribe_1 = originalString_subscribe.replace(dollarAmountRegex, "");
		var updatedString_subscribe = $.trim(updatedString_subscribe_1);

		if($getproductPrices == 0){
			var $getproductPrices = $getproductPrices.toFixed(2);          
			var $finalremainamount = $getremain_amount;   
			var discount_subscribe = 0.00; 
			$subscribeBtnHtml = "$"+$getproductPrices + " " + updatedString_subscribe;                 
        }else{
			var $getproductPrices = $getproductPrices.toFixed(2);  
			console.log("PRICE +++++++++" + $discount_amount_price);
			var discountAmount =  $getproductPrices * $discount_amount_price;
			var discount_subscribe = $getproductPrices - discountAmount;
			$PriceHtml = "<p> $"+ $getproductPrices + "</p> &nbsp;"; 
			$subscribeBtnHtml = $PriceHtml + "$" + discount_subscribe.toFixed(2) + " " + updatedString_subscribe;
			var $finalremainamount = $getremain_amount.toFixed(2);                    
        }
		
		$(".subscribeMobileContainer .subscribename.onetimeOption").text("$"+$getproductPrices+" "+updatedString_onetime);
		$(".subscribeMobileContainer .subscribename.subscriptionOption").html($subscribeBtnHtml );
		if ($remain_amount < 0.1) {
			console.log("GIFTPRODUCT ADD");
			$remain_amount = '';
			$(".addToCart").prop('disabled', false);
			$(".addToCart").css("cursor", "pointer");
			$(".add-to-cart").addClass("up90");
			$(".addToCart").find("span").text("Continue To Checkout");
			$(".MobileAddCart").prop('disabled', false);
			$(".MobileAddCart").css("cursor", "pointer");
			$(".MobileAddCart").addClass("up90");
			if($reachargevalue != "one time"){
				$getproductPrices = discount_subscribe.toFixed(2);
			}
			$(".MobileAddCart").find("span").text("Checkout - $" + $getproductPrices );
			$(".for_mobile_range .range-input input,.for_mobile_range .range-labels li.label90").addClass("bg-green");
			$(".sticky_svg_cart .StickyCartBtn").attr("src","https://cdn.shopify.com/s/files/1/0555/1751/1961/files/imgpsh_fullsize_anim_2_1.png?v=1702057302");
			$remain_amount = "View Cart - ";
			// $continue_arrow = '&nbsp;&nbsp;&nbsp;&nbsp;<svg height="24px" width="24px" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 m-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
			$(".stickycart .add-to-cart, .stickycart .stickycartbtn ,.MobileAddCart").addClass("bg-green");
		} else {
			console.log("else gify product");
			$(".addToCart").attr("disabled", "disabled");
			$(".addToCart").css("cursor", "not-allowed");
			$(".add-to-cart").removeClass("up90");
			$(".addToCart").find("span").text("Spend $75 to Continue");
			$(".MobileAddCart").attr("disabled", "disabled");
			$(".MobileAddCart").css("cursor", "not-allowed");
			$(".MobileAddCart").removeClass("up90");
			if($reachargevalue != "one time"){
				$getproductPrices = discount_subscribe.toFixed(2);
			}
			$(".MobileAddCart").find("span").text("Checkout - $" + $getproductPrices +" (Add $75 to Unlock)");
			$(".for_mobile_range .range-input input,.for_mobile_range .range-labels li.label90").removeClass("bg-green");
			$(".sticky_svg_cart .StickyCartBtn").attr("src","https://cdn.shopify.com/s/files/1/0555/1751/1961/files/imgpsh_fullsize_anim_1_1.png?v=1702057156");
			$remain_amount = "Add $"+ $finalremainamount + " to Unlock Cart ";
			$(".stickycart .add-to-cart, .stickycart .stickycartbtn,.MobileAddCart ").removeClass("bg-green");
		}
		if ($getremainAmount < 1) {
          var $finalremainamount = "";  
        }
        $(".stickyAddtocart").find("span").html($remain_amount +"($" + $getproductPrices + ")"+ $continue_arrow);
      return cartTotQty;
	}
	$(document).on("click", ".StickyCartBtn", function() {
		console.log("stocky btn click");
		$(".cartcolumn").addClass("active");
	});
	$(document).on("click", ".containerCircle", function() {
		$(".cartcolumn").removeClass("active");
	});
	$(document).on("mouseleave",".subscriptionlabel ",function(){
		$(this).removeClass("hoveractive");
	});
	$(document).on("mouseenter",".subscriptionlabel ",function(){
		$(this).addClass("hoveractive");
	});
	$(document).on("click",".subscriptionOption",function(){
		$dataValue = $(this).closest(".subscriptionlabel").data('value');
		setCookie("reachargevalue",$dataValue);
		$(this).closest(".subscriptionlabel").addClass("active");
		$(".onetimeOption").closest(".subscriptionlabel").removeClass("active");
		$(".deliverybox").removeClass("hide");
		$(".rc-selling-plans").removeClass("hide");
		$(".save_label").addClass('active');

		$affiliate_user = $normal_user = "false";
		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$affiliate_user = "true";
			}
		}
		if($affiliate_user == "true"){
			if ($(window).width() > 700) {
				free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/free-lemon-pepper-chicken-77580322.png?v=1703939851';
			}else{
				free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/products/free-lemon-pepper-chicken-775803.png?v=1699086664'; // For mobile
				$(".freeTurkey .product-item").addClass("promo-product");
				$(".freeTurkey .variant-title").html("FREE LEMON PEPPER CHICKEN");
				$(".freeTurkey .product-item").removeClass("promo-product-color");
				$(".freeTurkey .product-item__badges").html("FREE");
			}
		}else{
			$normal_user = "true";
		}

		if($normal_user == "true"){
			var promo_product = $(".promoProduct").val();
			$(".freeTurkey .product-item").addClass("promo-product promo-product-color");
			$(".freeTurkey .product-item__badges").addClass("bg_blue");
			$(".freeTurkey .product-item__badges").html("PROMO");

			if(promo_product != undefined && promo_product != 'NULL'){
				$promo_variant_id = $(".promoProduct").attr("variant_id");
				if ($(window).width() > 700) {
					free_pro_img = $(".promoProduct").attr('data-desktopimg');
				}else{
					free_pro_img = $(".promoProduct").attr('data-mobileimg');
					$(".freeTurkey .variant-title").html($(".promoProduct").data('title') + "  Limited Quantities");
					$(".freeTurkey .imageforcart img").removeClass("turkey_product_padding");
				}
			}else{
				if ($(window).width() > 700) {
					free_pro_img = 'https://res.cloudinary.com/meals/image/upload/v1701388042/Cranapple_Bundler_Image.jpg';
				}else{
					free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/Cranapple_Bundler_Image_mobile.jpg?v=1703781412';
					$(".freeTurkey .variant-title").html("Free Order Gift");
					$(".freeTurkey .imageforcart img").addClass("turkey_product_padding");
				}
			}	
		}
		$(".freeTurkey .imageforcart img").attr("src",free_pro_img);
		getcartTotalQty();
	});

	$(document).on("click",".onetimeOption",function(){
		console.log("CLICK");
		$dataValue = $(this).closest(".subscriptionlabel").data('value');
		setCookie("reachargevalue",$dataValue);
		$(this).closest(".subscriptionlabel").addClass("active");
		$(".subscriptionOption").closest(".subscriptionlabel").removeClass("active");
		$(".deliverybox").addClass("hide");
		$(".rc-selling-plans").addClass("hide");
		$(".save_label").removeClass('active');


		$affiliate_user = $normal_user = "false";
		var affiliate_cookie = getCookie("discount_code");
		var affiliate_cookie_backup = getCookie("50_Off_Discount");
		var affuser_discounts = ['julian50', 'cpt50','claire50', 'hannah15', 'hanjam15', 'ashley15', 'kendra15', 'steve15', 'ryan15', 'ainsley15','dailypump50','save50'];
		$discount_amount_price = 0.10;
		if((affiliate_cookie_backup != undefined) || (affiliate_cookie != undefined && affiliate_cookie != '')){
			if(affiliate_cookie != undefined){
				affiliate_cookie = affiliate_cookie.toLowerCase();
			}
			if ((affiliate_cookie_backup == 'True') || ($.inArray(affiliate_cookie, affuser_discounts) !== -1)) {
				$affiliate_user = "true";
			}
		}

		if ($(window).width() > 700) {
			$(".freeTurkey .product-item").addClass(" promo-product");
			if($affiliate_user == 'true'){
				free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/free-lemon-pepper-chicken-77580322.png?v=1703939851';
			}else{
				free_pro_img = 'https://res.cloudinary.com/meals/image/upload/v1701388042/Cranapple_Bundler_Image.jpg';
			}
		}else{
			if($affiliate_user == 'true'){
				free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/products/free-lemon-pepper-chicken-775803.png?v=1699086664';
			}else{
				free_pro_img = 'https://cdn.shopify.com/s/files/1/0555/1751/1961/files/Cranapple_Bundler_Image_mobile.jpg?v=1703781412';
			}
			
			$(".freeTurkey .imageforcart img").addClass("turkey_product_padding");
			$(".freeTurkey .variant-title").html("Free Order Gift");
			$(".freeTurkey .product-item").removeClass("promo-product-color");
			$(".freeTurkey .product-item").addClass(" promo-product");
			$(".freeTurkey .product-item__badges").removeClass("bg_blue");
			$(".freeTurkey .product-item__badges").addClass("bg-green");
			$(".freeTurkey .product-item__badges").html("FREE");
		}
		$(".freeTurkey .imageforcart img").attr("src",free_pro_img);

		getcartTotalQty();
	});

	$(document).on("change",".frequency_select",function(){
		console.log("frequency_select");
		$frequency_val = $(this).val();
		console.log($frequency_val);
		setCookie("subscriptionvalue",$frequency_val);
		$( "input[name='selling_plan']").val($frequency_val);
	});
	$(document).on("click",".popupAddbtn",function(){
		console.log("popupAddbtn");
		$(this).css("display", "none");
		$(this).closest(".custom-quickview").find(".product-quantity").addClass("show");
		$productId = $(this).closest(".custom-quickview").data("id");
		// $backupQty = $(".custom-bundle .main-custombundle .productsimage[data-product='"+ $productId +"'] .product-quantity__selector").val();
		
		$(".main-custombundle .productsimage[data-product='"+ $productId +"']").find(".addButton").trigger("click");
		
	});
	
	$(document).on("click",".frequncy_select_btn ",function(event){
		$(".frequncy_select_btn").removeClass("active");
		$(this).addClass("active");
		$frequency_val = $(this).attr("data-value");
		console.log($frequency_val + " CLICK ...");
		$(".frequncy_select_btn[data-value='"+ $frequency_val +"']").addClass("active");
		setCookie("subscriptionvalue",$frequency_val);
		$("input[name='selling_plan']").val($frequency_val);
	});
	$(document).on("click",".onlyContinue ",function(event){
		event.preventDefault()
		console.log("onlyContinue  btn click ");
		$promo_variant_id = $(".promoProduct").attr("variant_id");
		console.log($promo_variant_id + "Promo varint id");
		$.ajax({
			type: 'POST',
			url: '/cart/add.js',
			data: {
			  quantity: 1,
			  id:$promo_variant_id
			},
			 dataType: 'json', 
			 success: function (data) { 
				if(data !== undefined){
					window.location.href = '/checkout';
				}
			 } 
		});

	});
});
function setCookie(name, value, daysToExpire) {
	var date = new Date();
	date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
	var expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function removeCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(name) {
	var cookieName = name + "=";
	var cookieArray = document.cookie.split(';');
	for (var i = 0; i < cookieArray.length; i++) {
		var cookie = cookieArray[i].trim();
		if (cookie.indexOf(cookieName) === 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return null;
}
