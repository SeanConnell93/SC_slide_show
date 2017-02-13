function init_sc_slide_show(){
        $(window).on("load", function(){
            $("section#opacity").removeAttr("id #opacity");

            $(".carousel h1").wrap('<div class="mask"></div>')
        }); 

        // vars for carousel
        var imgs = $(".carousel");
        var num_imgs = imgs.length - 1;
        var forward = true;
        var current_num = 0;
        var wrapper = $(".carousel-wrapper");
        var interval_speed = 5000;
        var easing = "easeInOutExpo";
        var ani_speed = 1000;
        var btns = $(".btns-wrapper ul li");
        var li_btns = ".btns-wrapper ul li";
        var carousel_intval = setInterval(function(){
            move_carousel();
            text_in_carousel();
        }, interval_speed);

        var limit_timeout = setTimeout(function(){
            carousel_intval = setInterval(function(){
                move_carousel();
                text_in_carousel();
            }, interval_speed);
        }, interval_speed);
        // dont run at start 
        clearTimeout(limit_timeout);

        function move_to_next_slide(){
            wrapper.animate({right: current_num + "00%"}, ani_speed, easing);
        }

        function reset_carousel_interval(){
            clearTimeout(limit_timeout);

            limit_timeout = setTimeout(function(){
                carousel_intval = setInterval(function(){
                    move_carousel();
                    text_in_carousel();
                }, interval_speed);
            }, interval_speed);  
         }

        // move each img side by side 
        function carousel(){
            var move_img = 0;
            $(imgs).each(function(){
                $(this).css("transform", "translateX(" + move_img + "00%");
                move_img++;
                $(".btns-wrapper ul").append("<li></li>");
                btns = $(".btns-wrapper ul li");
                $(".btns-wrapper ul li").first().addClass("active");

            });
        }
        // init carousel on ready
        carousel();

        function check_arrows(){
            if (current_num <= 0) {
                $(".left-arrow").attr("disabled", true);
                $(".right-arrow").attr("disabled", false);
            } else if (current_num >= num_imgs) {
                $(".right-arrow").attr("disabled", true);
                $(".left-arrow").attr("disabled", false);
            } else {
                $(".left-arrow, .right-arrow").attr("disabled", false);
            }
        }

        function move_carousel(){
            if (forward && current_num >= num_imgs) {
                current_num--;
                move_to_next_slide();
                forward = false;
            } else if (!forward && current_num <= 0) {
                current_num++;
                move_to_next_slide();
                forward = true;
            } else if (!forward){
                current_num--;
                move_to_next_slide();
            } else if (forward) {
                current_num++;
                move_to_next_slide();
            }

            check_arrows();
            btns.removeClass("active");
            btns.eq(current_num).addClass("active");
         }

        function text_in_carousel(){
            $(".carousel-text").addClass("hide"); 
            var current_img = $(".carousel:eq(" + current_num + ") .carousel-text");

            setTimeout(function(){   
                current_img.each(function(e){
                   setTimeout(function(){
                       current_img.eq(e).removeClass("hide");
                   }, 200 * (e+1)); 
                }); 
            }, ani_speed);   
        }

        function ripple(rippleIn){
            $(rippleIn).append('<div class="ripple"> </div>');
            setTimeout(function(){
                $(".ripple").remove();
            }, 500);
        } 

        function click_next_arrow(){
            clearInterval(carousel_intval);
            forward = true;
            move_carousel();
            text_in_carousel();
            reset_carousel_interval();
        }

        function click_prev_arrow(){
            clearInterval(carousel_intval);
            forward = false;
            move_carousel();
            text_in_carousel();
            reset_carousel_interval();
        } 

        $(document).on("click", ".right-arrow", function(){
            click_next_arrow();
            ripple(this);
        });
        $(document).on("click", ".left-arrow", function(){
            click_prev_arrow(); 
            ripple(this);
        });

        $(document).on("click", li_btns, function(){
            var click_num = $(this).index();
            if (click_num != current_num) {
                clearInterval(carousel_intval);
                $(btns).removeClass("active");
                $(this).addClass("active");
                ripple(this);
                current_num = click_num;
                wrapper.animate({right: click_num + "00%"}, ani_speed, easing);
                text_in_carousel();
                check_arrows();
                reset_carousel_interval();
            }
        });

        $.extend( $.easing, {
            easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        });
    } // end init_sc_slide_show