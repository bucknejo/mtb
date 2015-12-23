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
                
                //log(instance, instance.options.name, 'build', data);
                
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
        
        var i = 0;
        var upload = $('<button class="mtb-carousel-photo-dialog-upload" style="font-size: 10px;">').button({
            icons: {
                primary: 'ui-icon-arrowthickstop-1-n'
            },
            text: true,
            label: 'Upload'                                            
        }).click(function(){
            log(instance, instance.name, 'photoManagement', 'clicked: ' + i++);            
            $('#'+instance.id+'-plupload-upload-container').toggle();        
        });
        
        var footer = $('<div class="mtb-carousel-photo-dialog-footer">');
        
        var uploader = $('<div id="'+instance.id+'-plupload-upload-container" style="display:none;">');
        
        var list = $('<div id="'+instance.id+'-plupload-file-list" style="margin-bottom:5px;">');
        var select = $('<button id="'+instance.id+'-plupload-upload-select">').button({
            icons: {
                primary: 'ui-icon-folder-open'
            },
            text: true,
            label: 'Select'                                                        
        });
        
        var start = $('<button id="'+instance.id+'-plupload-file-upload-start">').button({
            icons: {
                primary: 'ui-icon-play'
            },
            text: true,
            label: 'Start'                                                        
        });
        
        uploader.append(list);
        uploader.append(select);
        uploader.append(start);
        
        header.append(title);
        header.append(upload);
        div.append(header);
        div.append(footer);
        div.append(uploader);
        
        if (isArray(photos)) {
            var table = $('<table class="mtb-carousel-photo-management" width="100%">');
            
            for (var j=0; j < photos.length; j++) {
                var photo = photos[j];
                var row1 = $('<tr id="'+instance.id+'-photo-item-'+photo.id+'">');
                
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
                    label: 'Delete'                                            
                }).click(function(e){
                                                           
                    e.preventDefault();
                    
                    var p = $(this).data('photo');
                    log(instance, instance.options.name, 'photo', p);
                                        
                    var post = {id: p.id};
                    
                    var request = {
                        callback: function(data, instance) {
                            log(instance, 'photo delete', 'data', data);
                            
                            if (data.success) {
                                $('#'+instance.id+'-photo-item-'+p.id).remove();                                
                                build(instance);
                            }
                            
                        },
                        data: post,
                        type: 'post',
                        url: Models.photos().urls.del
                    };
                    
                    log(instance, instance.options.name, 'request', request);
                    
                    server(request, instance);                    
                    
                }).data('photo', photo);
                
                
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
            modal: true,
            title: 'Photos',
            width: config.width,
            close: function() {
                $(this).dialog("destroy");                
            },
            open: function() {
                
                var x = new plupload.Uploader({
                    // General settings
                    runtimes : 'html5,htm4,flash,silverlight',
                    url : "/photos/upload",
                    
                    browse_button : instance.id+'-plupload-upload-select',
                    container: instance.id+'-plupload-upload-container',
                    
                    filters : {
                        max_file_size : '10mb',
                        mime_types: [
                            {title : "Image files", extensions : "jpg,gif,png"},
                            {title : "Zip files", extensions : "zip"}
                        ]
                    },                    
                    
                    // Flash settings
                    flash_swf_url : '/plupload/js/Moxie.swf',

                    // Silverlight settings
                    silverlight_xap_url : '/plupload/js/Moxie.xap',                    
                    
                    init: {
                        PostInit: function() {
                            list.html('');
                            
                            start.click(function() {
                                x.start();
                                return false;                                
                            });
                            
                        },

                        FilesAdded: function(up, files) {
                            var html = '';
                            plupload.each(files, function(file) {                                
                                //document.getElementById(instance.id+'-plupload-file-list').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                                html += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                            });
                            $('#'+instance.id+'-plupload-file-list').html(html);
                        },

                        UploadProgress: function(up, file) {
                            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        },

                        Error: function(up, err) {
                            //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                            log(instance, instance.name, 'Error: ', JSON.stringify(err));
                        },
                        
                        FileUploaded: function(up, file, response) {
                            
                            log(instance, instance.name, 'FileUploaded [file]: ', JSON.stringify(file));
                            log(instance, instance.name, 'FileUploaded [response]: ', JSON.stringify(response));
                            
                        },
                        
                        UploadComplete: function(up, files) {
                            
                            div.dialog("close");
                            build(instance);
                            
                        }
                    }                    

                });
                
                x.init();

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