;(function($) {
    
    var defaults = {
        debug: true,
        name: 'Ad Management',
        states: {},
        urls: {
            main: 'ads/main'
        }
    };
    
    function AdManagement(item, options) {
        this.options = $.extend({}, defaults, options);
        this.item = $(item);
        this.id = this.item.attr('id');
        this.init(this, this.options);
    }
    
    AdManagement.prototype = {
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
        
        var d = $.extend({}, instance.options.data);
        server({
            callback: main,
            data: d,
            url: instance.options.urls.main + '/priority/' + instance.options.priority,
            type: 'get'
        }, instance);
                
    }
    
    function main(data, instance) {
                
        log(instance, 'main', 'data', data);
               
        if (isArray(data.ads)) {
            
            //instance.item.empty();
            
            $.each(data.ads, function(index, value) {
                
                var div = $('<div class="clickable ad">');
                var ad = value;
                
                var css = {
                    "background-image": "url('"+ad.image+"')",
                    "background-position": "center center",
                    "border": "0px solid #333",
                    "height": "60px",
                    "margin": "0 auto",
                    "margin-bottom": "10px",
                    "padding": "5px",
                    "text-align": "center",
                    "width": "120px"                    
                };
                
                //div.append(ad.description);
                div.css(css);
                
                div.click(function(e) {
                    e.preventDefault();
                    window.open(ad.link, '_blank');
                });
                
                instance.item.append(div);
                
            });
            
        }
        
    }

    $.fn.adManagement = function(options) {
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        return this.each(function(){
            
            var item = $(this), instance = item.data('AdManagement');
            
            if (!instance) {
                item.data('AdManagement', new AdManagement(this, options));
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


