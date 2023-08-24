$(document).on("click", ".productsimage .card__image", function(e) {
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
					target.classList.remove('working');
				}, 250);
			});
	} else {
		thisObj.quickViewModal.show();
	}
});

$(document).ready(function() {
	const filterContainer = $(".tablisting");
	filterContainer.on("click", function() {
		const filterUrl = $(this).attr('value') // Update with your actual collection URL + filters
		$.get(filterUrl, function(data) {
			$("#filtered-products .productsimage").css("display", "none");
			$eachProduct = $(data).find("#main-collection-product-grid .product-item.card");
			console.log($eachProduct);
			$($eachProduct).each(function() {
				console.log($(this).attr('data-product'));
				$eachProductId = $(this).attr('data-product');
				$(".productsimage[data-product='" + $eachProductId + "']").css("display", "block");
			});
		}).fail(function(error) {
			console.error("Error fetching products:", error);
		});
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
			$('.box-summary .container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__minus').removeClass('disabled');
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
					$(".box-summary").find('.container-box[data-summery-index="' + $summeryindex + '"]').closest(".productsimage").remove();
					$(".main-custombundle div[data-variant='" + $var_id + "']").find(".productQty").removeClass("show");
					$(".main-custombundle div[data-variant='" + $var_id + "']").find(".addButton").css("display", "block");
				}
			}
		}
		$(".main-custombundle div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQtyMinus);
		$(".box-summary div[data-variant='" + $var_id + "']").find('.product-quantity__selector').val($variantQtyMinus);
		getcartTotalQty();
	});

	$(".productSelect").change(function() {
		$giftVariantid = $(this).find(":selected").val();
		console.log($giftVariantid);
		$(this).attr("data-vid", $giftVariantid);
	});

	$('.addToCart').click(function(e) {
		e.preventDefault();
		$giftVariantid = $('.productSelect').attr("data-vid");
		var PRODUCT_ID = $(this).closest(".bundle_product").find(".product_variant_id").val();
		var selected_product_items = [];
		$.each($("#cartSummary .productsimage"), function() {
			$currentVarQty = $(this).find(".product-quantity__selector").val();
			var $currentvartitle = $(this).find(".variant-title").html();
			$perticular_propertie = $currentVarQty + "*" + $currentvartitle;
			selected_product_items.push($perticular_propertie);
		});

		const objectItems = {};
		$.each(selected_product_items, function(index, item) {
			objectItems[index] = item;
		});

		$finalproperties = objectItems;
		$.ajax({
			url: '/cart/add.js',
			dataType: 'json',
			type: 'POST',
			data: {
				id: PRODUCT_ID,
				quantity: 1,
				properties: $finalproperties
			},
			success: function(response) {
				removeCookie("variantids");
				removeCookie("variant_qty");
				addGiftproduct($giftVariantid);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error:', textStatus, errorThrown);
			}
		});
	});

	function addGiftproduct(giftVariantid) {
		console.log(giftVariantid);
		$.ajax({
			url: '/cart/add.js',
			dataType: 'json',
			type: 'POST',
			data: {
				quantity: 1, // Adjust the quantity as needed
				id: giftVariantid
			},
			success: function(response) {
				// Handle the success response here
				console.log(response);
				window.location.href = '/checkout';
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error:', textStatus, errorThrown);
			}
		});
	}
  
	set_lineitems_onload();
	$(".addButton").on("click", function() {
		console.log("addButton  click");
		$var_id = $(this).closest(".productsimage").data("variant");
		$(this).css("display", "none");
		$(this).closest(".container-box").find(".product-quantity").addClass("show");
		$html = $(this).closest(".productsimage").html();
		$(".box-summary").append("<div class='productsimage' data-variant='" + $var_id + "'>" + $html + "</div>");
		getcartTotalQty();
	});

	function set_lineitems_onload() {
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
				$getHtml = $(".main-custombundle div[data-variant='" + product_item + "']").html();
				$(".box-summary").append("<div class='productsimage' data-variant='" + product_item + "'>" + $getHtml + "</div>");
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
		var productPrice = 0;
    var indicatore = 0;
		var inputtotalrange = 130;
		$productPrices = 0;
		$.each($("#cartSummary .productsimage .product-quantity__selector"), function(index) {

			cartTotQty += parseInt($(this).val());
			$currentVarQty = $(this).val();
			$price = $(this).closest(".productsimage").find(".product-price--original").data("price");
			console.log($price);
			$Dataprice = ($price != undefined) ? $price.split("$") : 0;
			if ($Dataprice != 0) {
				$productPrices += $currentVarQty * parseInt($Dataprice[1]);
				console.log($productPrices + "TP");
			}

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
		// var productPrice = $("#rangeSlider").attr("step");
		// var pro_price = cartTotQty * parseInt($productPrices);
    
    indicatore = ($productPrices * 100)/inputtotalrange;
		if ($productPrices <= inputtotalrange) {
			$("#rangeSlider").val($productPrices);
      $(".range-slider__indicators .range-slider__value").css("left",indicatore+"%");
		} else if ($productPrices > inputtotalrange) {
      $("#rangeSlider").val(inputtotalrange);
      $(".range-slider__indicators .range-slider__value").css("left","100%");
		}
    // do't remove this comment
    // $(".range-slider__indicators .range-slider__value").html("$"+$productPrices);
    // do't remove this comment
		$remain_amount = inputtotalrange - $productPrices;

		if ($remain_amount < 1) {
			console.log("GIFTPRODUCT ADD");
			$remain_amount = '';
			$(".addToCart").prop('disabled', false);
			$(".addToCart").css("cursor", "pointer");
			if (!$(".productsimage").hasClass("giftProduct")) {
				$(".box-giftproduct").addClass("show");
			}
		} else {
			$(".box-giftproduct").removeClass("show");
			$(".addToCart").attr("disabled", "disabled");
			$(".addToCart").css("cursor", "not-allowed");
			$remain_amount = "$" + $remain_amount + " Left to ";
		}
		$(".addToCart").find("span").text($remain_amount + " Checkout ($" + $productPrices + ")");
		$(".stickyAddtocart").find("span").text($remain_amount + " Checkout ($" + $productPrices + ")");
		return cartTotQty;
	}
	$(document).on("click", ".stickycartbtn", function() {
		console.log("stocky btn click");
		$(".cartcolumn").addClass("active");
	});
	$(document).on("click", ".containerCircle", function() {
		$(".cartcolumn").removeClass("active");
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