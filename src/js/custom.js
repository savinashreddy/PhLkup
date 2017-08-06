// JavaScript Document

//'use strict';
var photoJsonData = '';
$(document).ready(function(e) {
    var front_slider = null;


    //pace - page loader
    Pace.options = {
        ajax: false,
        elements: false
    };
    //Pace.once('done', function() {});		pace not working in ie9, so we cannot rely on 'done' event if ie9 should be supported
    $(window).load(function(e) {
        //start front slider
        if (front_slider != null)
            front_slider.api.resume();

        //remove page loader screen
        $('#page-loader').addClass('loaded');
        Pace.stop();
    });

    getDataFromAjax();


    //one page menu and highlight current menu item
    var one_page_nav = $('#one-page-nav');
    if (one_page_nav.length == 1) {
        one_page_nav.onePageNav({
            currentClass: 'active'
        });
    }


    //main menu scrollbar
    var main_menu_scroll_el = $("#menu");
    main_menu_scroll_el.niceScroll({
        cursoropacitymin: 0.6,
        cursorborder: "1px solid rgba(255,255,255,0.5)"
    });


    //main menu submenus
    var main_navigation_submenus = $('.main-navigation .has-submenu, .main-navigation .menu-item-has-children');
    for (var i = 0, len = main_navigation_submenus.length; i < len; i++) {
        addSubmenuTriggers(main_navigation_submenus.eq(i));
    }

    function addSubmenuTriggers(menu_el) {
        var submenu = menu_el.children('ul');
        menu_el.on('mouseenter', function(e) {
                submenu.stop().slideDown(function() {
                    main_menu_scroll_el.getNiceScroll().resize();
                });
            })
            .on('mouseleave', function(e) {
                submenu.stop().slideUp(function() {
                    main_menu_scroll_el.getNiceScroll().resize();
                });
            });
    }


    //menu show/hide button functionality
    var menu = $('#menu');
    var menu_trigger = $('#menu-trigger');
    menu_trigger.on('click', function(e) {
        var menu_opened = false;
        if (menu.hasClass('active'))
            menu_opened = true;
        menu.toggleClass('active');
        menu_trigger.toggleClass('active');
        main_menu_scroll_el.getNiceScroll().resize();
        if (Modernizr.csstransitions) {
            if (menu_opened)
                main_menu_scroll_el.getNiceScroll().hide();
            menu.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                main_menu_scroll_el.getNiceScroll().resize();
                if (menu_opened)
                    main_menu_scroll_el.getNiceScroll().show();
            });
        }
    });


    //in page scrolling
    $('.scroll-to').on('click', function(e) {
        e.preventDefault();
        $.scrollTo($(this).attr('href'), 800, { axis: 'y' });
    });

    var to_top_btn = $('#to-top');
    if (to_top_btn.length == 1) {
        to_top_btn.on('click', function(e) {
            e.preventDefault();
            $.scrollTo(0, 800, { axis: 'y' });
        });

        var to_top_break = 350;
        $(window).on('scroll', function(e) {
            if ($(window).scrollTop() > to_top_break)
                to_top_btn.addClass('active');
            else
                to_top_btn.removeClass('active');
        });
    }


    //popup windows
    var page_screen_cover = $('#page-screen-cover');
    var popup_windows = $('.popup-window-container');

    $('.popup-window-trigger').on('click', function(e) {
        e.preventDefault();
        var popup = $($(this).data('popup'));
        openPopup(popup);
    });

    //tooltips
    $('[data-toggle="tooltip"]').tooltip();




});

var loadMasterSlider = function() {
    //front slider
    if (typeof MasterSlider == 'function') {
        front_slider = new MasterSlider();

        front_slider.control('arrows', { autohide: false }); //add arrows
        front_slider.control('bullets', { dir: 'v', autohide: false }); //add vertical bullets
        front_slider.control('timebar', { autohide: false, align: 'top', color: '#01bab0' }); //add top timebar
        front_slider.control('thumblist', { autohide: false, align: "bottom", inset: true, width: 150, height: 104 }); //add thumbnails

        front_slider.setup('masterslider', {
            width: 1400,
            height: 800,
            space: 0,
            view: 'basic',
            layout: 'fullscreen',
            speed: 20,
            autoplay: true,
            overPause: false
        });
        front_slider.api.pause(); //pause slider, wait for page loader
    }
}

$(window).load(function(e) {
    //blog 1 - isotope activation
    var blog1 = $('#blog1');
    if (blog1.length == 1) {
        blog1.isotope({
            itemSelector: '.blog-item',
            masonry: {
                columnWidth: '.blog-item'
            },
            percentPosition: true
        });
    }


    //portfolio layout 1 - isotope activation
    var portfolio1 = $('#portfolio1');
    if (portfolio1.length == 1) {
        var isotopeEl1 = portfolio1.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        //isotope filter
        var isotope_filter1_items = $('#isotope-filter-list1 .isotope-filter');
        isotope_filter1_items.on('click', function(e) {
            e.preventDefault();
            isotope_filter1_items.removeClass('active');
            $(this).addClass('active');
            isotopeEl1.isotope({ filter: $(this).data('filter') });
        });
    }



    function portfolio2_filter_perform() {
        var filter_string = '';
        for (var i = 0; i < isotope_filter2_items.length; i++) {
            var current_it = isotope_filter2_items.eq(i);
            if (!current_it.hasClass('active'))
                continue;
            filter_string = filter_string + current_it.data('filter') + ', ';
        }
        //remove last comma and space in the filter string
        filter_string = filter_string.substring(0, filter_string.length - 2);
        if (filter_string.length == 0)
            filter_string = '*';
        isotopeEl2.isotope({ filter: filter_string });
    }


    //portfolio layout 3 - isotope activation
    var portfolio3 = $('#portfolio3');
    if (portfolio3.length == 1) {
        var isotopeEl3 = portfolio3.isotope({
            itemSelector: '.portfolio-item'
        });

        //isotope filter
        var isotope_filter3_list = $('#isotope-filter-list3');
        var isotope_filter3_items = isotope_filter3_list.find('.isotope-filter');
        var isotope_filter3_all = isotope_filter3_list.find('[data-filter="*"]');
        var automatic_filtering = portfolio3.hasClass('filtering-on-button') ? false : true;
        isotope_filter3_items.on('click', function(e) {
            e.preventDefault();
            if ($(this).get(0) == isotope_filter3_all.get(0)) {
                isotope_filter3_items.removeClass('active');
                isotope_filter3_all.addClass('active');
            } else {
                isotope_filter3_all.removeClass('active');
                $(this).toggleClass('active');
            }
            if (automatic_filtering)
                portfolio3_filter_perform();
        });
        isotope_filter3_list.find('.isotope-filter-button > a').on('click', function(e) {
            portfolio3_filter_perform();
        });
    }

    function portfolio3_filter_perform() {
        var filter_string = '';
        for (var i = 0; i < isotope_filter3_items.length; i++) {
            var current_it = isotope_filter3_items.eq(i);
            if (!current_it.hasClass('active'))
                continue;
            filter_string = filter_string + current_it.data('filter') + ', ';
        }
        //remove last comma and space in the filter string
        filter_string = filter_string.substring(0, filter_string.length - 2);
        if (filter_string.length == 0)
            filter_string = '*';
        isotopeEl3.isotope({ filter: filter_string });
    }
});



//placeholder fallback for old browsers
if (!("placeholder" in document.createElement("input"))) {
    $("input[placeholder], textarea[placeholder]").each(function() {
        var val = $(this).attr("placeholder");
        if (this.value == "") {
            this.value = val;
        }
        $(this).focus(function() {
            if (this.value == val) {
                this.value = "";
            }
        }).blur(function() {
            if ($.trim(this.value) == "") {
                this.value = val;
            }
        })
    });

    // Clear default placeholder values on form submit
    $('form').submit(function() {
        $(this).find("input[placeholder], textarea[placeholder]").each(function() {
            if (this.value == $(this).attr("placeholder")) {
                this.value = "";
            }
        });
    });
}





/*	
  create ajax request from form element and his fields
  messages: set as form "data" attribut - "[field name]-not-set-msg", "all-fields-required-msg", "ajax-fail-msg", "success-msg"
  form must have attributes "method" and "action" set
  "return message" and "ajax loader" are also managed - see functions below
  
  @param form_el - form element
  @param all_fields - array of names of all fields in the form element that will be send
  @param required_fields - array of names of all fields in the form element that must be set - cannot be empty
*/
function form_to_ajax_request(form_el, all_fields, required_fields) {
    var fields_values = [];
    var error = false;

    //get values from fields
    $.each(all_fields, function(index, value) {
        fields_values[value] = form_el.find('*[name=' + value + ']').val();
    });

    //check if required fields are set
    $.each(required_fields, function(index, value) {
        if (!isSet(fields_values[value])) {
            var message = form_el.data(value + '-not-set-msg');
            if (!isSet(message))
                message = form_el.data('all-fields-required-msg');
            setReturnMessage(form_el, message);
            showReturnMessage(form_el);
            error = true;
            return;
        }
    });
    if (error)
        return false;

    //form data query object for ajax request
    var data_query = {};
    $.each(all_fields, function(index, value) {
        data_query[value] = fields_values[value];
    });
    data_query['ajax'] = true;

    //show ajax loader
    showLoader(form_el);

    //send the request
    $.ajax({
            type: form_el.attr('method'),
            url: form_el.attr('action'),
            data: data_query,
            cache: false,
            dataType: "text"
        })
        .fail(function() { //request failed
            setReturnMessage(form_el, form_el.data('ajax-fail-msg'));
            showReturnMessage(form_el);
        })
        .done(function(message) { //request succeeded
            if (!isSet(message)) {
                clearForm(form_el);
                setReturnMessage(form_el, form_el.data('success-msg'));
                showReturnMessage(form_el);
            } else {
                setReturnMessage(form_el, message);
                showReturnMessage(form_el);
            }
        });

    //hide ajax loader
    hideLoader(form_el);

    return false;
}

function isSet(variable) {
    if (variable == "" || typeof(variable) == 'undefined')
        return false;
    return true;
}

function clearForm(form_el) {
    form_el.find('input[type=text]').val('');
    form_el.find('input[type=checkbox]').prop('checked', false);
    form_el.find('textarea').val('');
}

function showLoader(form_el) {
    form_el.find('.ajax-loader').fadeIn('fast');
}

function hideLoader(form_el) {
    form_el.find('.ajax-loader').fadeOut('fast');
}

function setReturnMessage(form_el, content) {
    if (!isSet(content))
        content = "Unspecified message.";
    form_el.find('.return-msg').html(content);
}

function showReturnMessage(form_el) {
    form_el.find('.return-msg').addClass('show-return-msg');
}

$('.return-msg').on('click', function(e) {
    $(this).removeClass('show-return-msg');
});

function portfolio() {
    var portfolio2 = $('#portfolio2');
    if (portfolio2.length == 1) {
        /*var isotopeEl2 = portfolio2.isotope({
            itemSelector: '.portfolio-item',
            masonry: {
                columnWidth: '.portfolio-item'
            },
            percentPosition: true
        });*/

        //isotope filter
        var isotope_filter2_list = $('#isotope-filter-list2');
        var isotope_filter2_items = isotope_filter2_list.find('.isotope-filter');
        var isotope_filter2_all = isotope_filter2_list.find('[data-filter="*"]');
        var automatic_filtering = portfolio2.hasClass('filtering-on-button') ? false : true;
        isotope_filter2_items.on('click', function(e) {
            e.preventDefault();
            if ($(this).get(0) == isotope_filter2_all.get(0)) {
                isotope_filter2_items.removeClass('active');
                isotope_filter2_all.addClass('active');
            } else {
                isotope_filter2_all.removeClass('active');
                $(this).toggleClass('active');
            }
            if (automatic_filtering) {
                //portfolio2_filter_perform();
            }
        });
        isotope_filter2_list.find('.isotope-filter-button > a').on('click', function(e) {
            //portfolio2_filter_perform();
        });
    }
}

function getDataFromAjax() {
    $.ajax({
        url: '../src/data/photos.json',
        type: "GET",
        dataType: "json",
        content: 'application/json'
    }).done(function(response) {
        console.log('sucess');
        photoJsonData = response.items;
        loadHomePhotos(photoJsonData);
    }).fail(function(xhr) {
        console.log('filed to load resources')
    })
}

function setUpFancybox() {
    $(".fancybox").fancybox({
        openEffect  : 'none',
        closeEffect : 'none'
    });

}
var loadHomePhotos = function(photoJsonData) {
    for (var i = 0; i < photoJsonData.item.length; i++) {
        if (photoJsonData.item[i].id == 'wedding' && window.location.href.indexOf('couples') >= 0) {
            for (var j = 0; j < photoJsonData.item[i].imgs.img.length; j++) {
                var template = '<div class="item col-sm-4 col-xs-6 col-md-3 col-lg-3"> <a class="fancybox" rel="gallery1" href=' + photoJsonData.item[i].imgs.img[j].uri + '> <img  alt="" src=' + photoJsonData.item[i].imgs.img[j].uri + ' />  </a> </div>';
                $('.portfolio-wedding').append(template);
            }
            setUpFancybox();
        } else if (photoJsonData.item[i].id == 'fashion' && window.location.href.indexOf('glamor') >= 0) {
            for (var j = 0; j < photoJsonData.item[i].imgs.img.length; j++) {
                var template = '<div class="item col-sm-4 col-xs-6 col-md-3 col-lg-3"> <a class="fancybox" rel="gallery1" href=' + photoJsonData.item[i].imgs.img[j].uri + '> <img  alt="" src=' + photoJsonData.item[i].imgs.img[j].uri + ' />  </a> </div>';
                $('.portfolio-glamour').append(template);
            }
            setUpFancybox();
        } else if (photoJsonData.item[i].id == 'landscapes' && window.location.href.indexOf('landscaps') >= 0) {
            for (var j = 0; j < photoJsonData.item[i].imgs.img.length; j++) {
                if (photoJsonData.item[i].imgs.img[j].uri) {
                    var template = '<div class="item col-sm-4 col-xs-6 col-md-3 col-lg-3"> <a class="fancybox" rel="gallery1" href=' + photoJsonData.item[i].imgs.img[j].uri + '> <img  alt="" src=' + photoJsonData.item[i].imgs.img[j].uri + ' />  </a> </div>';
                    $('.portfolio-nature').append(template);
                }
            }
            setUpFancybox();
        } else if (photoJsonData.item[i].id == 'home') {
            for (var j = 0; j < photoJsonData.item[i].imgs.img.length; j++) {
                var template = '<div class="ms-slide ms-slide1" data-delay="7"> <div class="ms-slide-pattern bg-pattern dark-screen"></div> <img src="../../images/blank.gif" data-src="http://drive.google.com/uc?export=view&id=' + photoJsonData.item[i].imgs.img[j].id + '" alt="img">  <div class="ms-thumb"><img alt="img" src="http://drive.google.com/uc?export=view&id=' + photoJsonData.item[i].imgs.img[j].id + '"></div> </div>';
                $('.master-slider-home').append(template);
            }
            loadMasterSlider();
        }
    }

}

/*Wedding:

C&N:
https://drive.google.com/open?id=0BzxNJKy_d6NWTnd5TVgzMzl3T2s
https://drive.google.com/open?id=0BzxNJKy_d6NWRUFCendnWm90X0U
https://drive.google.com/open?id=0BzxNJKy_d6NWYmh5XzJfbGduODA
https://drive.google.com/open?id=0BzxNJKy_d6NWVjRuMVQ4U1F2bE0
https://drive.google.com/open?id=0BzxNJKy_d6NWazl5YmRxRkdiSlk

R&S
https://drive.google.com/open?id=0BzxNJKy_d6NWMUYzbmRaVkJJVHM
https://drive.google.com/open?id=0BzxNJKy_d6NWMUYzbmRaVkJJVHM
https://drive.google.com/open?id=0BzxNJKy_d6NWMURvX2NlclVtUGM
https://drive.google.com/open?id=0BzxNJKy_d6NWYWliU0xPdlpBckk
https://drive.google.com/open?id=0BzxNJKy_d6NWa0ZCd1hKYXQyU3c
https://drive.google.com/open?id=0BzxNJKy_d6NWU1F2ZFVlRlFuRVU

Laura:
 

Kimberly:
https://drive.google.com/open?id=0BzxNJKy_d6NWdTdFRDhLTFBIUmM
https://drive.google.com/open?id=0BzxNJKy_d6NWWlhWQ3JjaGtUR3c
https://drive.google.com/open?id=0BzxNJKy_d6NWZDZuRmZsTnItX1E
https://drive.google.com/open?id=0BzxNJKy_d6NWZGRLSGxSZ09rSkk
https://drive.google.com/open?id=0BzxNJKy_d6NWRTYxOS0tbDlkUWc


Cecila:
https://drive.google.com/open?id=0BzxNJKy_d6NWejNsbHlPRHBTa1U
https://drive.google.com/open?id=0BzxNJKy_d6NWVXVQZmNRdGpsOEE
https://drive.google.com/open?id=0BzxNJKy_d6NWM1R2NTVaWGg5UTA
https://drive.google.com/open?id=0BzxNJKy_d6NWaFk5WlU3T082TkU */