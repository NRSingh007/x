// var message_lines = $(".desc")[0].getClientRects();
// var amount_of_lines = message_lines.length;
// console.log(amount_of_lines);

function get_lines(element){
    var line_height = Number($(element).css('line-height').replace('px',''));
    var font_size = Number($(element).css('font-size').replace('px',''));
    var paragraph_height = Number($(element).css('height').replace('px',''));
    // var temp_height = paragraph_height/font_size;
    // var lines_count = temp_height/(temp_height * line_height +  line_height);
    var temp_paragraph_height = font_size + line_height;
    var line = 1;
    while( temp_paragraph_height <= paragraph_height ){
        temp_paragraph_height = temp_paragraph_height + font_size + line_height;
        line ++;
    }
    
    if ( temp_paragraph_height - line_height <= paragraph_height ) {
        return line + 1;
    } else {
        return line;
    }

}

$(document).ready(function(e){
    // console.log('desc nos. ',$('.menu-item-desc .desc').length);
    $.each($('.menu-item-desc .desc'), function( index, element) {
        var lines = get_lines(element);
        // console.log('lines', lines);
        
        if ( lines > 2 ){
            var str = $(element).html().toString();
            var len = str.length;
            var two_line_length = len/lines*2;
            var strip_str = str.slice(0,two_line_length - 20 );
            strip_str = strip_str + '........';
            
            var htmls = `${strip_str}<button class='btn btn-light btn-small>Read more</button>`;
            
            // console.log(strip_str);
            $(element).html(htmls);
        }
    });
});

// // CART ITEMS
$(document).ready(function(){
    $('#subtotal').css('width',$( '#cart-upper' ).width());
    
    var fixed_top_Offset = $("#cart-upper").offset().top;
    var footer_top_offest = $(".footer-section").offset().top;
    var width = $("#cart-upper").width();
    
    // var fixed_bottom_Offset = $(".cart-total").offset().top;
    
    console.log("originalHeight",fixed_top_Offset);
    console.log("footer_top_offest",footer_top_offest);

    $(window).scroll(function() {
    
        var scrollTop     = $(window).scrollTop();
        var distance      = (fixed_top_Offset - scrollTop);
        console.log("scrollTop",scrollTop);
        
        // console.log("fixed_top_Offset",fixed_top_Offset);
    
        // alert('ss');
      if ( $(window).scrollTop() > fixed_top_Offset) {
        var parentWidth = $( '#right-side-cart' ).width(); 
          
        $("#cart-upper").addClass("fixed-top-cart");
        $("#cart-upper").css("width", parentWidth+5);
          
      } else  {
        $("#cart-upper").removeClass("fixed-top-cart");
      }
        
      if ( $(window).scrollTop() > footer_top_offest - $(".footer-section").height() ) {
        $("#right-side-cart").hide();
      } else {
        $("#right-side-cart").show();
      }
        
    });
    
});

// CART window resize

$( window ).resize(function() {
    var parentWidth = $( '#right-side-cart' ).width(); 
    console.log('parentWidth',parentWidth);
    
    $('#subtotal').css('width',parentWidth);
    $('#cart-upper').css('width',parentWidth);
});


// console.log('line count ',line+1);

// console.log('line_height',line_height);
// console.log('font_size',font_size);
// console.log('paragraph_height',paragraph_height);
// console.log('temp_height',temp_height);
// console.log('lines_count',lines_count);
// var words = $('.desc').height();
