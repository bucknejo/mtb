;(function($) {
    
    var defaults = {
        debug: true,
        name: 'MTB Carousel',
        token: null,
        li: {
            width: 160
        }
    };
    
    function MtbCarousel(item, options) {
        this.options = $.extend({}, defaults, options);
        this.item = $(item);
        this.id = this.item.attr('id');
        this.init(this, this.options);
    }
    
    MtbCarousel.prototype = {
        init: function(instance, options) {
            build(instance);
        },
        refresh: function(options) {
            
        }
    };
    
    function log(instance, method, message, obj) {
        if (instance.options.debug) {
            console.log(instance.options.name + ' | method: ' + method + ' | message: ' + message + ' | ' + JSON.stringify(obj));
        }
    }
    
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function isArray(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    }
    
    function server(request, instance) {
        
        var x = {};
        
        $.ajax({
            url: request.url,
            asynch: (request.asynch) ? (request.asynch) : true,
            cache: (request.cache) ? (request.cache) : false,
            dataType: 'json',
            type: request.type,
            data: request.data,
            beforeSend: function() {
                
            },
            success: function(response) {
                x = response;
            },
            error: function(data, errorThrown) {
                log(instance, 'server', 'error object: ', data);
                log(instance, 'server', 'error thrown: ' + errorThrown, {});
            },
            complete: function() {
                if (request.callback) {
                    request.callback(x, instance);
                } else {
                    console.log('not a function');
                }
            }
            
        });
        
    }
    
    function build(instance) {
        
        var carousel = $('<div id="'+instance.id+'-carousel-container" class="mtb-carousel-container">');
        var header = $('<div class="mtb-carousel-header">').append('Photos');
        
        carousel.append(header);
                
        var request = {
            url: 'photos/get',
            type: 'get',
            data: instance.options,
            callback: function(data, instance) {
                
                log(instance, instance.options.name, 'build', data);
                
                var l = $('<div id="'+instance.id+'-carousel-scroll-left" class="mtb-carousel-scroll">').append($('<span>').append('&lt;'));
                var m = $('<div id="'+instance.id+'-carousel-inner" class="mtb-carousel-inner">');
                var r = $('<div id="'+instance.id+'-carousel-scroll-right" class="mtb-carousel-scroll">').append($('<span>').append('&gt;'));;

                var ul = $('<ul id="'+instance.id+'-carousel-ul" class="mtb-carousel-ul">');
                
                if (isArray(data.photos)) {
                    
                    header.click(function(){
                        photoManagement(instance, data);
                    });
                                        
                    for (var i=0; i < data.photos.length; i++) {
                        var photo = data.photos[i];
                        var li = $('<li>');
                        var a = $('<a href="#">');
                        var img = $('<img/>',{
                           id: instance.id + '-carousel-photo-' + i,
                           alt: photo.alt,
                           src: data.path + photo.url,
                           height: '100',
                           width: '150'
                        });
                        a.append(img);
                        li.append(a);
                        ul.append(li);
                        
                        a.click(function(){
                            var i = $(this).find('img');
                            var d = $('<div class="mtb-carousel-lightbox">');
                            var p = $('<img />', {
                                alt: i.prop('alt'),
                                src: i.prop('src'),
                                height: '400',
                                width: '600'                                
                            });
                            d.append(p);
                            $(document.body).append(d);
                            
                            d.click(function() {
                                $(this).remove();
                            });
                        });
                        
                    }
                    
                    m.append(ul);
                }
                
                carousel.append(l);
                carousel.append(m);
                carousel.append(r);
                
                $('#'+instance.id+'-carousel-ul li:first').before('#'+instance.id+'-carousel-ul li:last');

                r.click(function(){
                    var item_width = ul.find('li').outerWidth() + 10;
                    var left_indent = parseInt(ul.css('left')) - item_width;
                    ul.animate({'left': left_indent, queue: false, duration: 1000}, function(){
                        ul.find('li:last').after(ul.find('li:first'));
                        ul.css({'left':'-'+instance.options.li.width+'px'});
                    });
                });

                l.click(function(){
                    var item_width = ul.find('li').outerWidth() + 10;
                    var left_indent = parseInt(ul.css('left')) + item_width;
                    ul.animate({'left': left_indent, queue: false, duration: 1000}, function(){
                        ul.find('li:first').before(ul.find('li:last'));
                        ul.css({'left':'-'+instance.options.li.width+'px'});
                    });
                });
                
            }
        };
        
        server(request, instance);
        
        instance.item.empty().append(carousel);
    }
    
    function photoManagement(instance, data) {
        
        var photos = data.photos;
        
        var config = {
            height: 500,
            width: 600
        };
    
        var div = $('<div class="mtb-carousel-photo-dialog">');
        
        var header = $('<div class="mtb-carousel-photo-dialog-header">');
        
        var title = $('<div class="mtb-carousel-photo-dialog-title">').text('Photo Management');        
        var upload = $('<button class="mtb-carousel-photo-dialog-upload" style="font-size: 10px;">').button({
            icons: {
                primary: 'ui-icon-arrowthickstop-1-n'
            },
            text: true,
            label: 'Upload'                                            
        }).click(function(){
            $('#pluploader').toggle();        
        });
        
        var footer = $('<div class="mtb-carousel-photo-dialog-footer">');
        
        var uploader = $('<div id="pluploader" style="display:none;">').append(
            $('<p>').append('Your browser does not have flash, SilverLight, or HTML5 support.')
        );
        
        header.append(title);
        header.append(upload);
        div.append(header);
        div.append(footer);
        div.append(uploader);
        
        if (isArray(photos)) {
            var table = $('<table class="mtb-carousel-photo-management" width="100%">');
            
            for (var j=0; j < photos.length; j++) {
                var photo = photos[j];
                var row1 = $('<tr>');
                
                var c1 = $('<td valign="top">');
                var c2 = $('<td valign="top">');
                var c3 = $('<td valign="top">');
                
                var img = $('<img />', {
                    alt: photo.alt,
                    src: data.path + photo.url,
                    height: '100',
                    width: '150'
                });
                c1.append(img);
                
                var details = $('<div>');
                details.append('Date Created: ' + photo.date_created + '<br />');
                details.append('Last Updated: ' + photo.last_updated + '<br />');
                
                var description = $('<div>');
                description.append((photo.description && photo.description !== '') ? photo.description : '[Description]');
                details.append(description);
                
                c2.append(details);
                                                
                var operations = $('<div>');
                var edit = $('<button>').button({
                    icons: {
                        primary: 'ui-icon-check'
                    },
                    text: true,
                    label: 'Save'                                            
                }).click(function() {
                    
                });
                var del = $('<button>').button({
                    icons: {
                        primary: 'ui-icon-close'
                    },
                    text: true,
                    label: 'Cancel'                                            
                }).click(function(){
                    
                });
                operations.append(edit);
                operations.append(del);
                c3.append(operations);
                
                row1.append(c1).append(c2).append(c3);
                table.append(row1);
                
            }
            div.append(table);
        }
        
        div.dialog({
            autoOpen: true,
            height: config.height,
            title: 'Photos',
            width: config.width,
            close: function() {
                $(this).destoy();
            },
            open: function() {
                
                uploader.plupload({
                    // General settings
                    runtimes : 'html5,htm4,flash,silverlight',
                    url : "/examples/upload",

                    // Maximum file size
                    max_file_size : '2mb',

                    chunk_size: '1mb',

                    // Resize images on clientside if we can
                    resize : {
                        width : 200,
                        height : 200,
                        quality : 90,
                        crop: true // crop to exact dimensions
                    },

                    // Specify what files to browse for
                    filters : [
                        {title : "Image files", extensions : "jpg,gif,png"},
                        {title : "Zip files", extensions : "zip,avi"}
                    ],

                    // Rename files by clicking on their titles
                    rename: true,

                    // Sort files
                    sortable: true,

                    // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
                    dragdrop: true,

                    // Views to activate
                    views: {
                        list: true,
                        thumbs: true, // Show thumbs
                        active: 'thumbs'
                    },

                    // Flash settings
                    flash_swf_url : '/js/plupload/js/Moxie.swf',

                    // Silverlight settings
                    silverlight_xap_url : '/js/plupload/js/Moxie.xap'                    
                });

                

            }
        });
                
    }
        
    $.fn.mtbCarousel = function(options) {
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        return this.each(function(){
            
            var item = $(this), instance = item.data('MtbCarousel');
            
            if (!instance) {
                item.data('MtbCarousel', new MtbCarousel(this, options));
            } else {
                
                if (typeof options === 'string') {
                    instance[options].apply(instance, args);
                } 
                
                if (typeof options === 'object') {
                    instance.refresh(options);
                }
                
            }
            
        });
        
    };
    
}(jQuery));