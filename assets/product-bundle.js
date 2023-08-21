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
    $var_id = $(this).closest(".productsimage").data("variant");
    $html = $(this).closest(".productsimage").html();
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    if ($variantQty == 1) {
        $(".box-summary").append("<div class='productsimage'>" + $html + "</div>");
    } else {
        // $('.box-summary .container-box[data-summery-index="' + $summeryindex + '"] .product-quantity__selector').val($variantQty);
        $(".main-custombundle div[data-variant='"+$var_id+"']").find('.product-quantity__selector').val($variantQty);
        $(".box-summary div[data-variant='"+$var_id+"']").find('.product-quantity__selector').val($variantQty);
    }
    getcartTotalQty();
});

$(document).on("click", ".product-quantity__minus", function() {
  console.log("quantity__minus");
    $variantQtyMinus = $(this).closest(".productQty").find(".product-quantity__selector").val();
    console.log($variantQtyMinus);
    $var_id = $(this).closest(".productsimage").data("variant");
    $summeryindex = $(this).closest(".container-box").attr('data-summery-index');
    $(".main-custombundle div[data-variant='"+$var_id+"']").find('.product-quantity__selector').val($variantQtyMinus);
    $(".box-summary div[data-variant='"+$var_id+"']").find('.product-quantity__selector').val($variantQtyMinus);
    if ($variantQtyMinus == 1) {
        $(".box-summary").find('.container-box[data-summery-index="' + $summeryindex + '"]').closest(".productsimage").html("");
        $(this).closest(".productQty").css("display","none");
        $(this).closest(".container-box").find(".addButton ").css("display","block");
    } else {
        console.log("else");
    }
    getcartTotalQty();
});

$(document).ready(function() {

    const filterContainer = $("#product-filterselect");
    filterContainer.on("change", function() {
      $selectValue = $(this).val();
      $
      const selectedFilters = getSelectedFilters(); // Implement this function
      const filterUrl = $(this).val() // Update with your actual collection URL + filters

      $.get(filterUrl, function(data) {
        var getHtml = $(data).find("#main-collection-product-grid").html();
          console.log(getHtml);
          $("#filtered-products .productsimage").css("display","none");
          $eachProduct = $(data).find("#main-collection-product-grid .product-item.card");
          $($eachProduct).each(function( index ) {
            console.log($(this).attr('data-product'));
            $eachProductId = $(this).attr('data-product');
            $(".productsimage[data-product='"+ $eachProductId +"']").css("display","block");
          });
      }).fail(function(error) {
        console.error("Error fetching products:", error);
      });
    });

    // Function to get selected filter options
    function getSelectedFilters() {
      // Implement this function to collect selected filter values
    }
    $(".productSelect").change(function(){
     $giftVariantid = $(this).find(":selected").val();
      console.log($giftVariantid);  
      $(this).attr("data-vid",$giftVariantid);
  });
    $('.addToCart').click(function(e) {
      e.preventDefault();

      $giftVariantid = $('.productSelect').attr("data-vid");
      console.log($giftVariantid);
      // $giftVariantid = $(".giftVariantid").val();
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
          addGiftproduct($giftVariantid);
          console.log(response);
          // window.location.href = '/checkout';
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
    });
    function addGiftproduct(giftVariantid){
      console.log(giftVariantid);
    $.ajax({
      url: '/cart/add.js',
      dataType: 'json',
      type: 'POST',
      data:  {
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
        $(".box-summary").append("<div class='productsimage' data-variant='"+$var_id+"'>" + $html + "</div>");
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
          $("div[data-variant='"+product_item+"']").find(".product-quantity").addClass("show");
          $("div[data-variant='"+product_item+"']").find(".productQty .qty-minus").removeClass('disabled');
          $("div[data-variant='"+product_item+"']").find(".addButton").css("display", "none");
          $("div[data-variant='"+product_item+"']").find(".productQty .product-quantity__selector").val(product_item_qty);
          $getHtml = $(".main-custombundle div[data-variant='"+product_item+"']").html();
          $(".box-summary").append("<div class='productsimage' data-variant='"+product_item+"'>" + $getHtml + "</div>");
          $(".box-summary div[data-variant='"+product_item+"']").find(".productQty .product-quantity__selector").val(product_item_qty);
          $(".box-summary div[data-variant='"+product_item+"']").find(".productQty .qty-minus").removeClass('disabled');
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
      console.log("GIFTPRODUCT ADD");
      $remain_amount = '';
      $(".addToCart").prop('disabled', false);
      $(".addToCart").css("cursor","pointer"); 
      if(!$(".productsimage").hasClass("giftProduct")){

        $giftProduct = '<div class="productsimage giftProduct" data-variant="46329470026009">'+
        
        '<div id="product-item-8573113696537" class="product-item card container-box" data-js-product-item="" data-variant="46329470026009" data-summery-index="6"><div href="/collections/all/products/cookies-cream" class="card__image product-item__image   " style="padding-top:66.66666666666667%"><figure class="lazy-image product-item__image-figure product-item__image-figure--primary lazy-image--animation lazy-image--background lazy-image--fit lazyloaded" data-crop="true">'+
      
        '<img src="//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=480" alt="Cookies &amp; Cream" srcset="//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=240 240w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=360 360w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=420 420w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=480 480w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=640 640w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=840 840w,//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3.webp?v=1692160659&amp;width=1080 1080w" class="img" width="1200" height="800" data-ratio="" sizes="(max-width: 359px) calc(100vw - 30px), (max-width: 767px) calc((100vw - 50px) / 2),(max-width: 1280px) calc((100vw - 120px) / 3), 420px" loading="lazy">'+
        
      '</figure></div>'+
      '<div class="imageforcart">'+
      '<img src="//healthius-store.myshopify.com/cdn/shop/files/main-4up_1200x_af5c23d9-380c-4594-a20f-404c601263d3_medium.webp?v=1692160659" alt="">'+
      '</div>'+
      
        '<div class="flexdirrow card__text product-item__text gutter--regular spacing--xlarge remove-empty-space text-align--center"><a class="product-item__title" href="/collections/all/products/cookies-cream" title="Cookies &amp; Cream">'+
                  '<div class="remove-line-height-space--small">'+
                    '<span data-id="" class="variant-title text-animation--underline text-size--large text-line-height--small text-weight--bold text-animation--underline">Cookies &amp; Cream</span>'+
                    '</div>'+
                    '</a>'+
                    '<button role="button" aria-label="Add Green Apple Cinnamon" class="addButton add-button button button-primary small" data-gtm-action="add flavor" data-gtm-label="Green Apple Cinnamon" style="display: none;">'+
                    '<span>+Add</span>'+
                    '</button><product-quantity class="productQty product-quantity show" data-js-product-quantity="">'+
                    
         '<button class="product-quantity__minus qty-minus no-js-hidden" aria-label="Decrease quantity" role="button" controls="qty-template--20487732265241__c19ec86d-19d9-4f0d-a7f6-18cf3f231ce3">-</button>'+
        
         '<label for="qty-template--20487732265241__c19ec86d-19d9-4f0d-a7f6-18cf3f231ce3" class="visually-hidden">Quantity</label>'+
          '<input type="number" name="quantity" value="1" min="1" max="999" class="product-quantity__selector qty-selector text-size--xlarge" id="qty-template--20487732265241__c19ec86d-19d9-4f0d-a7f6-18cf3f231ce3">'+
          
          '<button class="product-quantity__plus qty-plus no-js-hidden" aria-label="Increase quantity" role="button" controls="qty-template--20487732265241__c19ec86d-19d9-4f0d-a7f6-18cf3f231ce3">+</button>'+
          
        '</product-quantity>'+
      '</div><div class="product-item__badges text-size--xsmall"></div></div>'+
      '</div>';
      $(".box-giftproduct").addClass("show");
      // $("#cartSummary").append($giftProduct);
    }
    }else{
      $(".box-giftproduct").removeClass("show");
      $(".addToCart").attr("disabled","disabled"); 
      $(".addToCart").css("cursor","not-allowed");  
      $remain_amount = "$"+$remain_amount+" Left to ";
    }
    $(".addToCart").find("span").text($remain_amount+ " Checkout ($"+pro_price+")") ;
    $(".stickyAddtocart").find("span").text($remain_amount+ " Checkout ($"+pro_price+")") ;
    return cartTotQty;
}
$(document).on("click",".stickycartbtn",function(){
console.log("stocky btn click");
$(".cartcolumn").addClass("active");
});
$(document).on("click",".containerCircle",function(){
  $(".cartcolumn").removeClass("active");
});