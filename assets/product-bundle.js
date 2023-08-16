
$(document).on("click", ".product-quantity__plus", function() {
    $variantQty = $(this).closest(".productQty").find(".product-quantity__selector").val();
    $html = $(this).closest(".container-box").html();
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    if ($variantQty == 1) {
        $(".box-summary").append("<div class='productsimage'>" + $html + "</div>");
    } else {
        $('.container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
    }
    getcartTotalQty();
});

$(document).on("click", ".productsimage .card__image", function(e) {
console.log("card__image");
e.preventDefault();

 $(this).closest(".container-box").find(".quick-add-to-cart .button").trigger("click");
});
$(document).on("click", ".product-quantity__minus", function() {
    $variantQty = $(this).closest(".productQty").find(".product-quantity__selector").val();
    $html = $(this).closest(".container-box").html();
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    $('.container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
    if ($variantQty == 1) {
        $(".box-summary").find('.container-box[data-summery-index="' + $summeryindex + '"]').closest(".productsimage").html("");
    } else {
        console.log("else");
    }
    getcartTotalQty();
});

$(document).ready(function() {
    set_lineitems_onload();
    $(".addButton").on("click", function() {
        console.log("addButton  click");
        $(this).css("display", "none");
        $(this).closest(".container-box").find(".product-quantity").addClass("show");
        $html = $(this).closest(".productsimage").html();
        $(".box-summary").append("<div class='productsimage'>" + $html + "</div>");
        getcartTotalQty();
    });

    function set_lineitems_onload(){
      var selected_item = getCookie("variantids");
      var variant_qty = getCookie("variant_qty");
      if (selected_item) {
        var delimiter = ",";
        var itemArray = selected_item.split(delimiter);
        var itemQtyArray = variant_qty.split(delimiter);
        for (var i = 0; i < itemArray.length; i++) {
          var product_item = itemArray[i].trim();
          var product_item_qty = itemQtyArray[i].trim();
          console.log(product_item_qty);
          $("div[data-variant='"+product_item+"']").find(".product-quantity").addClass("show");
          $("div[data-variant='"+product_item+"']").find(".addButton").css("display", "none");
          var setInputQty  = $("div[data-variant='"+product_item+"']").find("product-quantity");
          setInputQty.find(".product-quantity__selector").val(product_item_qty);
          $getHtml = $("div[data-variant='"+product_item+"']").html();
          $(".box-summary").append("<div class='productsimage' data-variant='"+product_item+"'>" + $getHtml + "</div>");
        }
      } 
      getcartTotalQty();
    }
});

function setCookie(name, value, daysToExpire) {
  var date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  var expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
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


var selected_items = [];
var selected_item_qty = [];
function getcartTotalQty() {
    var cartTotQty = 0;
    $.each($("#cartSummary .productsimage .product-quantity__selector"), function(index) {
        cartTotQty += parseInt($(this).val());
        $currentVarQty = $(this).val();
        var varId = $(this).closest(".productsimage").find(".variant-title").data("id");
        var checkExistingVal = $.inArray(varId, selected_items);
        if (checkExistingVal !== -1) {
          selected_items[checkExistingVal] = varId;
          selected_item_qty[checkExistingVal] = $currentVarQty;
        }else{
          selected_items.push(varId);
          selected_item_qty.push($currentVarQty);
        }
        setCookie("variantids", selected_items , 7);
        setCookie("variant_qty", selected_item_qty , 7);
    });
    var productPrice = $("#rangeSlider").attr("step");
    var pro_price = cartTotQty * parseInt(productPrice);
    $("#rangeSlider").val(pro_price);
    return cartTotQty;
}