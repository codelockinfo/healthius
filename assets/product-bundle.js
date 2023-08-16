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

              // create modal w content

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
$(document).on("click", ".product-quantity__plus", function() {
  console.log("quantity__plus");
    $variantQty = $(this).closest(".productQty").find(".product-quantity__selector").val();
    console.log($variantQty);
    $html = $(this).closest(".productsimage").html();
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    if ($variantQty == 1) {
        $(".box-summary").append("<div class='productsimage'>" + $html + "</div>");
    } else {
        $('.box-summary .container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
    }
    getcartTotalQty();
});

$(document).on("click", ".productsimage .card__image", function(e) {
console.log("card__image");
e.preventDefault();

 $(this).closest(".container-box").find(".quick-add-to-cart .button").trigger("click");
});
$(document).on("click", ".product-quantity__minus", function(e) {
  e.preventDefault();

  console.log("quantity__minus");
  $variantQty = $(this).closest(".productQty").find(".product-quantity__selector").val();
  $(this).closest(".productQty").find(".product-quantity__selector").val($variantQty);
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    $('.container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
    console.log($variantQty);
    if ($variantQty == 1) {
        $(".box-summary").find('.container-box[data-summery-index="' + $summeryindex + '"]').closest(".productsimage").html("");
        $(this).closest(".productQty").css("display","none");
        $(this).closest(".container-box").find(".addButton ").css("display","block");
    } else {
        console.log("else");
    }
    getcartTotalQty();
});

$(document).ready(function() {
    $('.addToCart').click(function(e) {
      e.preventDefault();
      var PRODUCT_ID  = $(this).closest(".bundle_product").find(".product_variant_id").val();
      var selected_product_items = [];
      $.each($("#cartSummary .productsimage"), function() {
          $currentVarQty = $(this).find(".product-quantity__selector").val();
          var $currentvartitle = $(this).find(".variant-title").html();
          $perticular_propertie = $currentVarQty +"*"+ $currentvartitle;
          selected_product_items.push($perticular_propertie);
      });


      // Convert the array to an object
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
          properties:$finalproperties
        },
        success: function(response) {
          // Handle the success response here
          console.log(response);
          window.location.href = '/checkout';
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // Handle the error here
          console.log('Error:', textStatus, errorThrown);
        }
      });
    });
  
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
          console.log(product_item);
          console.log(product_item_qty);
          $("div[data-variant='"+product_item+"']").find(".product-quantity").addClass("show");
          $("div[data-variant='"+product_item+"']").find(".addButton").css("display", "none");
          var setInputQty  = $("div[data-variant='"+product_item+"']").find("product-quantity");
          setInputQty.find(".product-quantity__selector").val(product_item_qty);
          $getHtml = $(".productsimage[data-variant='"+product_item+"']").html();
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
    $remain_amount = 90-pro_price;
    
    if($remain_amount < 1){
      $remain_amount = '';
      $(".addToCart").attr("disabled",""); 
      $(".addToCart").css("cursor","pointer"); 
    }else{
      $(".addToCart").attr("disabled","disabled"); 
      $(".addToCart").css("cursor","not-allowed");  
      $remain_amount = "$"+$remain_amount+"Left to ";
    }
    $(".addToCart").find("span").text($remain_amount+ " Checkout ($"+pro_price+")") ;
    return cartTotQty;
}