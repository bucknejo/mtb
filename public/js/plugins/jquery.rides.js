;(function($) {
    
    var x = "";
    
    var defaults = {
        debug: true,
        exception: {
            message: 'An exception has occurred while processing your request.  A log of the event has been generated and sent to support for investigation and resolution.'
        },
        name: 'Ride Management',
        states: {},
        token: null,
        urls: {
            main: 'rides/main'
        }
    };
    
    function RideManagement(item, options) {
        this.options = $.extend({}, defaults, options);
        this.item = $(item);
        this.id = this.item.attr('id');
        this.div = $('<div id="' + this.id + '-tablespace">');
        this.init(this, this.options);
    }
    
    RideManagement.prototype = {
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
                log(instance, instance.options.name, 'sending url: ', request.url);
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
    
    function display(instance, config) {
        
        var d = $('<div>');
        
        var message = $('<div>');
        
        if (!config.success) {
            message.append($('<div class="error" style="padding: 5px;">').append(instance.options.exception.message));

            message.append("<br />Message: " + ((config.message) ? config.message : 'Exception'));
            message.append("<br />Code: " + ((config.code) ? config.code : ''));            
        } else {
            message.append($('<div>').append("Success!"));
        }
        
        d.append(message);
        
        d.dialog({
            autoOpen: true,
            buttons: [
                {
                    text: 'Ok',
                    click: function() {
                        $(this).dialog('close');
                    },
                    style: 'font-size: 11px;'
                }
            ],
            close: function() {
                if (config.callback  && $.isFunction(config.callback)) {
                    config.callback();
                }
                $(this).dialog('destroy');  
            },
            height: (config.height) ? config.height : 275,
            width: (config.width) ? config.width : 600,
            modal: (config.modal) ? config.modal : false,
            title: (config.title) ? config.title : 'Error'
        });
        
    }
    
    function build(instance) {
    
        var d = $.extend({}, instance.options);
        server({
            callback: main,
            data: d,
            url: instance.options.urls.main,
            type: 'get'
        }, instance);
    }
    
    function main(data, instance) {
        
        instance.options.token = data.token;
        
        if (data.user_id > 0) {
            
            // set user
            HLUser.setUser(data.user);
            
            // build user section        
            instance.item.empty().append(addUserDetails(instance, data));                
            instance.item.append(addRideDetails(instance, data));            
            

        } else {
            location.replace('login');
        }
        
        
    }
    
    function subfriend(instance, data) {
                
        var div = $('<div style="width:100%; position: relative;">');        
        var close = $('<div style="position: absolute; top: -15px; right: 5px; font-size: 20px;" class="clickable base">').append('&#10799;').click(function(){
            $('#' + 'friend-sub-row-' + data.id).remove();            
        });
        
        div.append(close);
        div.append($('<div style="clear:both;>'));
        
        //div.append("Subfriend").append("<br />");
        //div.append("User Id: " + data.friend_id);
        
        var json = $('<div>');        
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                json.append($('<br/>')).append(prop + ': ' + data[prop]);
            }
        }
        log(instance, instance.options.name, 'subfriend', data);
        
        var friend = $('<div style="margin: 15px;">');
        
        var div1 = $('<div style="float:left; border: 2px solid #465a9b; margin-right: 20px;">');
        var div2 = $('<div style="float:left; border: 0px solid #444;">');
        var div3 = $('<div style="clear:both;margin-top: 10px;">');
        
        var image = $('<img />', {
            id: instance.id + '-subfriend-avatar-' + data.friend_id,
            alt: 'Avatar',
            src: data.avatar,
            height: '75',
            width: '75'                    
        });
        
        var table = $('<table class="ride-management subfriend">');
        
        // row 1
        var tr = $('<tr>');
        var c1 = $('<td class="col1" style="font-weight: bold;" colspan="2">').append(data.first_name + ' ' + data.last_name).append(guideDisplay(data.guide, data.friend_id));
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 2
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Skill:');
        var c2 = $('<td class="col2">').append(data.skill);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 3
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Experience:');
        var c2 = $('<td class="col2">').append(data.experience);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 4
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Style:');
        var c2 = $('<td class="col2">').append(data.type);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 5
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Reputation Points:');
        var c2 = $('<td class="col2">').append(data.reputation);
        tr.append(c1).append(c2);
        table.append(tr);
        
        div1.append(image);
        div2.append(table);
        
        friend.append(div1).append(div2).append(div3);                                
        div.append(friend);
        
        return div;
        
    }
    
    function subrider(instance, data) {
        
        var div = $('<div style="width:100%; position: relative;">');        
        var close = $('<div style="position: absolute; top: -15px; right: 5px; font-size: 20px;" class="clickable base">').append('&#10799;').click(function(){
            $('#' + 'rider-sub-row-' + data.id).remove();            
        });
        
        div.append(close);
        div.append($('<div style="clear:both;>'));
        
        //div.append("Subfriend").append("<br />");
        //div.append("User Id: " + data.user_id);
        
        var json = $('<div>');        
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                json.append($('<br/>')).append(prop + ': ' + data[prop]);
            }
        }
        log(instance, instance.options.name, 'subrider', data);
        
        var rider = $('<div style="margin: 15px;">');
        
        var div1 = $('<div style="float:left; border: 2px solid #465a9b; margin-right: 20px;">');
        var div2 = $('<div style="float:left; border: 0px solid #444; margin-right: 10px;">');
        var div3 = $('<div style="float:left; border: 0px solid #444; margin-right: 10px;">');
        var div4 = $('<div style="float:left; border: 0px solid #444; margin-right: 10px;">');
        var div5 = $('<div style="clear:both;margin-top: 10px;">');
        
        var image = $('<img />', {
            id: instance.id + '-subrider-avatar-' + data.user_id,
            alt: 'Avatar',
            src: data.avatar,
            height: '75',
            width: '75'                    
        });
        
        var table = $('<table class="ride-management subrider">');
        
        // row 1
        var tr = $('<tr>');
        var c1 = $('<td class="col1" style="font-weight: bold;" colspan="2">').append(data.first_name + ' ' + data.last_name).append(guideDisplay(data.guide, data.friend_id));
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 2
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Skill:');
        var c2 = $('<td class="col2">').append(data.skill);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 3
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Experience:');
        var c2 = $('<td class="col2">').append(data.experience);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 4
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Style:');
        var c2 = $('<td class="col2">').append(data.type);
        tr.append(c1).append(c2);
        table.append(tr);
        
        // row 5
        var tr = $('<tr>');
        var c1 = $('<td class="col1">').append('Reputation Points:');
        var c2 = $('<td class="col2">').append(data.reputation);
        tr.append(c1).append(c2);
        table.append(tr);
        
        var actions = $('<div>');
        
        var checkin = $('<button class="subride-button-action">').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Check In'                                                        
        }).click(function(e) {
            e.preventDefault();
            
            var d = $(this).data('data');
            
            var post = $.extend(d, {token: instance.options.token});
                       
            var request = {
                callback: function(data, instance) {

                    var config = {
                        success: data.success,
                        code: (!data.error) ? data.code : data.error.code,
                        message: (!data.error) ? data.message : data.error.message,
                        callback: function() {                                            
                            build(instance);
                        },
                        height: (data.success) ? 150 : 700,
                        modal: true,
                        title: 'Check In'                                
                    };

                    display(instance, config);

                },
                data: post,
                type: 'post',
                url: Models.rides().urls.checkin
            };

            server(request, instance);                            
                        
        }).data('data', data);
        
        var bailout = $('<button class="subride-button-action">').button({
            icons: {
                primary: 'ui-icon-close'
            },
            text: true,
            label: 'Bail Out'                                                                    
        }).click(function(e) {
            e.preventDefault();
            var d = $(this).data('data');
            
            var post = $.extend(d, {token: instance.options.token});
                       
            var request = {
                callback: function(data, instance) {

                    var config = {
                        success: data.success,
                        code: (!data.error) ? data.code : data.error.code,
                        message: (!data.error) ? data.message : data.error.message,
                        callback: function() {                                            
                            build(instance);
                        },
                        height: (data.success) ? 150 : 700,
                        modal: true,
                        title: 'Bail Out'                                
                    };

                    display(instance, config);

                },
                data: post,
                type: 'post',
                url: Models.rides().urls.bailout
            };

            server(request, instance);                            
            
        }).data('data', data);
        
        var complete = $('<button class="subride-button-action">').button({
            icons: {
                primary: 'ui-icon-star'
            },
            text: true,
            label: 'Mark Complete'                                                                                
        }).click(function(e) {
            e.preventDefault();
            var d = $(this).data('data');
            
            var post = $.extend(d, {token: instance.options.token});
                       
            var request = {
                callback: function(data, instance) {

                    var config = {
                        success: data.success,
                        code: (!data.error) ? data.code : data.error.code,
                        message: (!data.error) ? data.message : data.error.message,
                        callback: function() {                                            
                            build(instance);
                        },
                        height: (data.success) ? 150 : 700,
                        modal: true,
                        title: 'Mark Complete'                                
                    };

                    display(instance, config);

                },
                data: post,
                type: 'post',
                url: Models.rides().urls.complete
            };

            server(request, instance);                            
            
            
        }).data('data', data);
        
        var comments = $('<button class="subride-button-action">').button({
            icons: {
                primary: 'ui-icon-pencil'
            },
            text: true,
            label: 'Add Comments'                                                                                
        }).click(function(e) {
            e.preventDefault();
            var d = $(this).data('data');
            
            var c = $('<div>').dialog({
                autoOpen: true,
                buttons: [
                    {
                        text: 'Save',
                        click: function() {
                            
                            var note = $('#' + instance.id+'-subrider-manage-comments-'+d.id).val();
                            
                            var post = $.extend(d, {token: instance.options.token, note: note});
                            
                            var request = {
                                callback: function(data, instance) {

                                    var config = {
                                        success: data.success,
                                        code: (!data.error) ? data.code : data.error.code,
                                        message: (!data.error) ? data.message : data.error.message,
                                        callback: function() {                                            
                                            c.dialog('close');
                                            build(instance);
                                        },
                                        height: (data.success) ? 150 : 700,
                                        modal: true,
                                        title: 'Mark Complete'                                
                                    };

                                    display(instance, config);

                                },
                                data: post,
                                type: 'post',
                                url: Models.rides().urls.comments
                            };
                            
                            log(instance, instance.options.name, 'Add Comments', request);

                            server(request, instance);                            
                                                                                    
                        },
                        style: ''
                    },
                    {
                        text: 'Cancel',
                        click: function() {
                            $(this).dialog('close');
                        },
                        style: ''
                    }
                ],
                close: function() {
                    $(this).dialog('destroy');
                },
                open: function() {
                    $('#' + instance.id+'-subrider-manage-comments-'+d.id).focus();
                },
                title: 'Add Ride Comments',
                height: 300,
                width: 600,
                modal: true
            });
            
            var t = $('<textarea id="'+instance.id+'-subrider-manage-comments-'+d.id+'" rows="7" cols="58">').data('data', d);
            t.val(d.comment);
            c.append(t);
            
        }).data('data', data);
        
        var ranking = $('<div style="border: 0px solid orange; position: relative;">');
        
        //ranking.append($('<div style="margin-right: 10px; border:0px solid red; display: inline-block;">'));
        
        for (var i=0; i < 5; i++) {
            //var star = $('<span class="subride-ranking-star" id="'+instance.id+'-subrider-manage-ranking-'+i+'">').append('&#8902;').data('data', data).data('i', i+1);
            var star = $('<img />', {
                id: instance.id+'-subrider-manage-ranking-'+i,
                alt: 'empty-star',               
                src: '/images/common/rating-star-0.jpg',
                class: 'subride-ranking-star'
            }).data('data', data).data('i', i+1);
            if (parseInt(data.rating) > i) {
                star = $('<img />', {
                    id: instance.id+'-subrider-manage-ranking-'+i,
                    alt: 'empty-star',               
                    src: '/images/common/rating-star-1.jpg',
                    class: 'subride-ranking-star'
                }).data('data', data).data('i', i+1);
            }
            ranking.append(star);
        }
        
        actions.append(checkin).append(bailout);
        actions.append($('<br />'));
        actions.append(complete).append(comments);
        actions.append($('<br />'));
        actions.append(ranking);
        
        ranking.find(".subride-ranking-star").click(function(){
            var i = $(this).data('i');
            var d = $(this).data('data');
            
            var post = $.extend(d, {token: instance.options.token, rating: i});

            var request = {
                callback: function(data, instance) {

                    var config = {
                        success: data.success,
                        code: (!data.error) ? data.code : data.error.code,
                        message: (!data.error) ? data.message : data.error.message,
                        callback: function() {                                            
                            build(instance);
                        },
                        height: (data.success) ? 150 : 700,
                        modal: true,
                        title: 'Rate this Ride!'                                
                    };

                    display(instance, config);

                },
                data: post,
                type: 'post',
                url: Models.rides().urls.rating
            };
            
            log(instance, instance.options.name, 'Subride ranking (request): ', request);             

            server(request, instance);                            
            
        });                        
        
        // function to toggle the availability of the actions
        var v = function(){
            
            // disable all
            if (parseInt(data.complete) === 1) {
                checkin.prop('disabled', true);
                bailout.prop('disabled', true);
                complete.prop('disabled', true);
            }
            
            // disable checkin
            if (parseInt(data.rsvp) === 1) {
                checkin.prop('disabled', true);                
            }
            
            // disable bailout
            if (parseInt(data.rsvp) === -1) {
                bailout.prop('disabled', true);
            }
            
            // disable complete
            if (parseInt(data.rsvp) !== 1) {
                complete.prop('disabled', true);
            }
            
            // TODO
            // disable ranking
            if (parseInt(data.complete) !== 1) {
                
            }
            
        }();
        
        var text = $('<div style="">');
        var header = $('<div style="font-size: 11px; font-weight: bold; text-decoration: underline;">').append("Comments");
        var body = $('<div style="font-size: 11px;">').append((data.comment) ? data.comment : $('<div style="font-style: italic;">').append("There are no comments for this ride."));
        text.append(header);
        text.append(body);
        
        div1.append(image);
        div2.append(table);
        div3.append(actions);
        div4.append(text);
        
        rider.append(div1).append(div2).append(div3).append(div4).append(div5);                                
        div.append(rider);
        
        return div;
        
    }
    
    function subgroup(instance, data) {
        
        var div = $('<div style="width:100%;">');        
        var close = $('<div style="float:right;font-size:20px;margin:0px 10px;" class="clickable base">').append('&#10799;').click(function(){
            $('#' + 'group-sub-row-' + data.id).remove();            
        });
        
        div.append(close);
        div.append($('<div style="clear:both;>'));
        
        var d = $.extend({}, data);
        server({
            callback: function(groupinfo, instance) {
                                                
                if (isArray(groupinfo.group)) {
                    var group = groupinfo.group[0];
                    var gid = group.id;
                }
                
                var m = [];
                if (isArray(groupinfo.members)) {
                    for (var x=0; x < groupinfo.members.length; x++) {
                        m.push(groupinfo.members[x].user_id);
                    }                    
                }
                
                var f = [];
                if (isArray(groupinfo.members)) {
                    for (var x=0; x < groupinfo.friends.length; x++) {
                        f.push(groupinfo.friends[x].friend_id);
                    }                    
                }
                                    
                // group add form
                var form = $('<form id="'+instance.id+'-edit-group-form-'+gid+'" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');        
                var table = $('<table class="ride-management group detail" width="100%" align="center">');

                var group_name = $('<input type="text" id="'+instance.id+'-group_name-'+gid+'" name="'+instance.id+'-group_name-'+gid+'" class="required">').val(group.name);
                var group_description = $('<input type="text" id="'+instance.id+'-group_description-'+gid+'" name="'+instance.id+'-group_description-'+gid+'" class="required">').val(group.description);
                var group_deputy = $('<select id="'+instance.id+'-group_deputy-'+gid+'" name="'+instance.id+'-group_deputy-'+gid+'" class="large">');
                var group_type = $('<select id="'+instance.id+'-group_type-'+gid+'" name="'+instance.id+'-group_type-'+gid+'" class="small">');
                var group_join = $('<select id="'+instance.id+'-group_join-'+gid+'" name="'+instance.id+'-group_join-'+gid+'" class="small">');
                var group_locked = $('<select id="'+instance.id+'-group_locked-'+gid+'" name="'+instance.id+'-group_locked-'+gid+'" class="small">');

                var update = $('<button class="ride-add-button">Update</button>').button({
                    icons: {
                        primary: 'ui-icon-check'
                    },
                    text: true,
                    label: 'Save'                                            
                }).click(function(e){
                    
                    e.preventDefault();

                    $('#'+instance.id+'-edit-group-form-'+gid).validate({
                        debug: true,
                        errorPlacement: function(error, element) {
                            return true;
                        },
                        ignore: '',
                        submitHandler: function(f) {

                            var ms = [];
                            $(".ride-management-group-edit-members").each(function() {
                                var item = $(this);
                                var member = $(this).data('member');
                                if (item.is(':checked')) {
                                    ms.push(member.id);                        
                                }
                            });
                            
                            var fs = [];
                            $(".ride-management-group-edit-friends").each(function() {
                                var item = $(this);
                                var friend = $(this).data('friend');
                                if (item.is(':checked')) {
                                    fs.push(friend.friend_id);                        
                                }
                            });
                            
                            var group = {
                                group_id: gid,
                                group_name: $('#'+instance.id+'-group_name-'+gid).val(),
                                group_description: $('#'+instance.id+'-group_description-'+gid).val(),
                                group_owner: $('#'+instance.id+'-group_owner-'+gid).val(),
                                group_deputy: $('#'+instance.id+'-group_deputy-'+gid).val(),
                                group_type: $('#'+instance.id+'-group_type-'+gid).val(),
                                group_join: $('#'+instance.id+'-group_join-'+gid).val(),                        
                                group_locked: $('#'+instance.id+'-group_locked-'+gid).val()                        
                            };

                            var post = $.extend(group, {action: 'edit', members: ms.join('|'), friends: fs.join('|')});
                            
                            var request = {
                                callback: function(data, instance) {
                                    
                                    var config = {
                                        success: data.success,
                                        code: (!data.error) ? data.code : data.error.code,
                                        message: (!data.error) ? data.message : data.error.message,
                                        callback: function() {                                            
                                            build(instance);
                                        },
                                        height: (data.success) ? 150 : 700,
                                        modal: true,
                                        title: 'Edit Group'                                
                                    };

                                    display(instance, config);
                                    
                                },
                                data: post,
                                type: 'post',
                                url: Models.groups().urls.save
                            };

                            server(request, instance);                            

                        },
                        success: function() {

                        },
                        unhighlight: function(element, errorClass) {
                            $(element).removeClass(errorClass);
                        }                
                    });

                    $('#'+instance.id+'-edit-group-form-'+gid).submit();

                });

                var cancel = $('<button class="ride-add-button">Cancel</button>').button({
                    icons: {
                        primary: 'ui-icon-close'
                    },
                    text: true,
                    label: 'Cancel'                                            
                }).click(function(e){
                    e.preventDefault();
                    $('#' + 'group-sub-row-' + data.id).remove();            
                });                        

                // row 1
                var row = $('<tr>');
                var a1 = $('<td rowspan="9" valign="middle">').append($('<div class="group-add-ad alley">'));        
                var c1 = $('<td>').append($('<div class="label-02">').append('Name:'));
                var c2 = $('<td>').append(group_name);
                var a2 = $('<td rowspan="9" valign="middle">').append($('<div class="group-add-ad alley">'));
                row.append(a1).append(c1).append(c2).append(a2);
                table.append(row);

                // row 2
                row = $('<tr>');
                c1 = $('<td>').append($('<div class="label-02">').append('Description:'));
                c2 = $('<td>').append(group_description);
                row.append(c1).append(c2);
                table.append(row);

                // row 3
                row = $('<tr>');
                c1 = $('<td>').append($('<div class="label-02">').append('Deputy:'));
                c2 = $('<td>').append(group_deputy);
                row.append(c1).append(c2);
                table.append(row);

                // row 4
                row = $('<tr>');
                c1 = $('<td>').append($('<div class="label-02">').append('Join:'));
                c2 = $('<td>').append(group_join);
                row.append(c1).append(c2);
                table.append(row);
                
                // row 4
                row = $('<tr>');
                c1 = $('<td>').append($('<div class="label-02">').append('Locked:'));
                c2 = $('<td>').append(group_locked);
                row.append(c1).append(c2);
                table.append(row);

                // row 4
                row = $('<tr>');
                c1 = $('<td>').append($('<div class="label-02">').append('Type:'));
                c2 = $('<td>').append(group_type);
                row.append(c1).append(c2);
                table.append(row);

                // row 5
                row = $('<tr>');
                c1 = $('<td valign="top">').append($('<div class="label-02">').append('Members:'));
                var members = $('<table class="ride-management friends" style="width: 450px;">');
                if (isArray(groupinfo.members)) {
                    
                    var tr = $('<tr class="table-header">');
                    tr.append($('<td width="45%">').append('Name'));
                    tr.append($('<td width="20%">').append('Skill'));
                    tr.append($('<td width="15%">').append('Experience'));
                    tr.append($('<td width="10%">').append('Style'));
                    tr.append($('<td width="10%" align="center">').append('Remove'));
                    members.append(tr);

                    for (var i=0; i < groupinfo.members.length; i++) {
                        var member = groupinfo.members[i];
                        tr = $('<tr>');
                        tr.append($('<td>').append(member.first_name + ' ' + member.last_name));
                        tr.append($('<td>').append(member.skill));
                        tr.append($('<td align="center">').append(member.experience));
                        tr.append($('<td>').append(member.type));

                        var queue = $('<input type="checkbox" class="ride-management-group-edit-members">').data('member', member);                
                        tr.append($('<td align="center">').append(queue));

                        members.append(tr);
                    }

                }
                c2 = $('<td>').append(members);
                row.append(c1).append(c2);
                table.append(row);
                
                // row 6
                row = $('<tr>');
                c1 = $('<td valign="top">').append($('<div class="label-02">').append('Friends:'));
                var friends = $('<table class="ride-management friends" style="width: 450px;">');
                if (isArray(groupinfo.friends)) {

                    var tr = $('<tr class="table-header">');
                    tr.append($('<td width="45%">').append('Name'));
                    tr.append($('<td width="20%">').append('Skill'));
                    tr.append($('<td width="15%">').append('Experience'));
                    tr.append($('<td width="10%">').append('Style'));
                    tr.append($('<td width="10%" align="center">').append('Add'));
                    friends.append(tr);

                    for (var i=0; i < groupinfo.friends.length; i++) {
                        var friend = groupinfo.friends[i];
                        
                        if ($.inArray(friend.friend_id, m) === -1) {
                            
                            tr = $('<tr>');
                            tr.append($('<td>').append(friend.first_name + ' ' + friend.last_name));
                            tr.append($('<td>').append(friend.skill));
                            tr.append($('<td align="center">').append(friend.experience));
                            tr.append($('<td>').append(friend.type));

                            var queue = $('<input type="checkbox" class="ride-management-group-edit-friends">').data('friend', friend);                
                            tr.append($('<td align="center">').append(queue));

                            friends.append(tr);                            
                            
                        }
                        
                    }

                }
                c2 = $('<td>').append(friends);
                row.append(c1).append(c2);
                table.append(row);

                // row 7
                row = $('<tr>');
                c1 = $('<td colspan="2" align="center">').append(update).append(cancel);
                row.append(c1);
                table.append(row);

                // add ad div to form top
                var ad = $('<div class="group-add-ad top">');
                form.append(ad);
                form.append(table);                  
                ad = $('<div class="group-add-ad bottom">');
                form.append(ad);                

                // selects
                $.each(getOptions(instance, groupinfo.selects.deputies), function(index, option){
                    group_deputy.append(option);
                });

                $.each(getOptions(instance, groupinfo.selects.ridetypes), function(index, option){
                    group_type.append(option);
                });

                $.each(getOptions(instance, groupinfo.selects.joinable), function(index, option){
                    group_join.append(option);
                });

                $.each(getOptions(instance, groupinfo.selects.locked), function(index, option){
                    group_locked.append(option);
                });

                group_deputy.selectmenu();
                group_type.selectmenu();
                group_join.selectmenu();
                group_locked.selectmenu();
                
                group_deputy.val(group.deputy);
                group_deputy.selectmenu("refresh");                
                group_type.val(group.type);
                group_type.selectmenu("refresh");
                group_join.val(group.join);
                group_join.selectmenu("refresh");
                group_locked.val(group.locked);
                group_locked.selectmenu("refresh");
                                
                div.append(form);
                
                
            },
            data: d,
            url: Models.groups().urls.get,
            type: 'get'
        }, instance);
                                
        return div;
        
    }
    
    function subride(instance, data, edit) {
                                        
        var div = $('<div style="width:100%;">');        
        var close = $('<div style="float:right;font-size:20px;margin:0px 10px;" class="clickable base">').append('&#10799;').click(function(){
            $('#' + 'sub-row-' + data.id).remove();            
        });
        
        div.append(close);
        div.append($('<div style="clear:both;>'));
        
        var d = $.extend({}, instance.options, data, {process: "GET-ONE", oper: "SELECT"});
        
        //var rides = Models.rides();
        
        server({
            callback: function(data, instance) {
                        
                if (data) {
                    
                    var green = {'background-color': 'green'};
                    var red = {'background-color': 'red'};
                    
                    var ride = data.ride[0];
                    var group = data.group[0];
                    var group_members = data.group_members;
                    var location_resources = data.location_resources;
                    var owner = data.owner;
                    var riders = data.riders;
                    var user = data.user[0];
                    
                    var t = $('<table class="ride-management rides detail" width="100%">');
                    var row1 = $('<tr>');
                    var row2 = $('<tr>');
                    var row3 = $('<tr>');
                    var row4 = $('<tr>');
                    var row5 = $('<tr>');
                    var row6 = $('<tr>');
                    var row7 = $('<tr>');
                    
                    // row1
                    var td1 = $('<td style="width:10%">').append('Name: ');
                    var td2 = $('<td style="width:35%">').append(ride.name);
                    var td3 = $('<td style="width:5%">').append('Date: ');
                    var td4 = $('<td style="width:10%">').append(ride.date);
                    var td5 = $('<td style="width:10%" rowspan="4" valign="top">').append('Address: ');
                    var td6 = $('<td style="width:30%" rowspan="4" valign="top">').append(rideAddress(ride));
                    row1.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
                    t.append(row1);
                    
                    // row 2
                    td1 = $('<td valign="top">').append('Description: ');
                    td2 = $('<td>').append(ride.description);
                    td3 = $('<td>').append('Status: ');
                    td4 = $('<td>').append(ride.status);
                    row2.append(td1).append(td2).append(td3).append(td4);
                    t.append(row2);
                    
                    // row 3
                    td1 = $('<td>').append('Location: ');
                    td2 = $('<td>').append(ride.location_name);
                    td3 = $('<td>').append('Join: ');
                    td4 = $('<td>').append(function(){                                       
                        return (ride.join !== '0') ? $('<span class="circle">').css(green): $('<span class="circle">').css(red);                    
                    });
                    row3.append(td1).append(td2).append(td3).append(td4);
                    t.append(row3);
                    
                    // row 3 redux
                    row3 = $('<tr>');
                    td1 = $('<td>').append('Tempo: ');
                    td2 = $('<td>').append(ride.tempo);
                    td3 = $('<td>').append('Drop: ');
                    td4 = $('<td>').append(function(){                                       
                        return (ride.drop !== '0') ? $('<span class="">').append('No'): $('<span class="">').append('Yes');                    
                    });
                    row3.append(td1).append(td2).append(td3).append(td4);
                    t.append(row3);                    
                    
                    div.append(t);
                    div.append($('<hr style="border:0;height:1px;background:#333;margin:10px 0px;" />'));
                    
                    // row 4
                    t = $('<table class="ride-management rides detail" width="100%">');
                    td1 = $('<td align="left" style="width:100%">')
                            .append($('<span class="label-01">').append('Group:'))
                            .append($('<span class="content-green">').append(group.name))
                            .append($('<span class="label-01">').append('Description:'))
                            .append($('<span class="content-green">').append(group.description))
                            .append($('<span class="label-01">').append('Owner:'))
                            .append($('<span class="content-green">').append(group.user_name_internal))                    
                            .append($('<span class="label-01">').append('Type:'))
                            .append(groupType(group.type))
                            .append($('<span class="label-01">').append('Locked:'))
                            .append((group.locked === 0) ? '<div class="ui-icon ui-icon-locked" style="display:inline-block;position:relative;top:3px;">' : '<div class="ui-icon ui-icon-unlocked" style="display:inline-block;position:relative;top:3px;">');                            
                    
                    row4.append(td1);
                    t.append(row4);
                    
                    // row 5
                    if (riders && isArray(riders)) {
                        var gt = $('<table class="ride-management rides detail group" width="100%">');
                        var gh = $('<tr class="table-header">');
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('User')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('First Name')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('Last Name')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Role')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('Email')));
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('RSVP')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Status')));                                                        
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Skill')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Type')));
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('Complete')));
                        gt.append(gh);
                        
                        for (var i=0; i < riders.length; i++) {
                            
                            var rider = riders[i];
                            
                            if (rider.group_id > 0) {
                                
                                var gr = $('<tr class="clickable group-member">').data('data', rider).click(function(){
                                    var data = $(this).data('data');
                                    
                                    if ($('#' + 'rider-sub-row-' + data.id).length > 0) {
                                        $('#' + 'rider-sub-row-' + data.id).remove();
                                    } else {

                                        var r = $('<tr id="rider-sub-row-'+data.id+'" style="background-color: #fff !important;">');
                                        var c = $('<td colspan="10">');

                                        r.append(c.append(subrider(instance, data)));

                                        $(this).closest('tr').after(r);

                                    }                                        
                                    
                                });
                                gr.append($('<td width="5%">').append(rider.user_name_internal));
                                gr.append($('<td width="15%">').append(rider.first_name));
                                gr.append($('<td width="15%">').append(rider.last_name));
                                gr.append($('<td width="10%">').append(rider.role));
                                gr.append($('<td width="15%">').append(rider.email));                                                        
                                gr.append($('<td width="5%">').append(checkMark(rider.rsvp)));                                                                                        
                                gr.append($('<td width="10%">').append(rider.status));                                                        
                                gr.append($('<td width="10%">').append(rider.skill));
                                gr.append($('<td width="10%">').append(rider.type));
                                gr.append($('<td width="5%">').append(checkMark(rider.complete)));
                                gt.append(gr);
                                                                
                            }
                        }
                        td1 = $('<td align="left" style="width:100%">').append(gt);
                    }                    
                    
                    row5.append(td1);
                    t.append(row5);
                    
                    div.append(t);                    
                    
                    // row 6
                    
                    var jr = $('<button class="ride-add-button">').button({
                        icons: {
                            primary: 'ui-icon-plus'
                        },
                        text: true,
                        label: 'Join Ride'                                                                            
                    }).click(function(e) {
                        e.preventDefault();
                        
                        var post = $.extend(ride, {token: instance.options.token});

                        var request = {
                            callback: function(data, instance) {

                                var config = {
                                    success: data.success,
                                    code: (!data.error) ? data.code : data.error.code,
                                    message: (!data.error) ? data.message : data.error.message,
                                    callback: function() {
                                        build(instance);
                                    },
                                    height: (data.success) ? 150 : 700,
                                    modal: true,
                                    title: 'Add Rider'
                                };

                                display(instance, config);

                            },
                            data: post,
                            url: Models.riders().urls.post,
                            type: 'post'                        
                        };
                        
                        log(instance, instance.options.name, 'Join Ride: ', post);
                        
                        server(request, instance);
                        
                    });
                    
                    t = $('<table class="ride-management rides detail" width="100%">');
                    td1 = $('<td align="left" style="width:100%">').append($('<span class="label-01">').append('Additional Riders'));
                    if (rideJoinable(instance, ride, riders, user)) {
                        td2 = $('<td align="right" style="width:100%">').append(jr);
                    } else {
                        td2 = $('<td align="right" style="width:100%">').append('&nbsp;');
                    }
                    row6.append(td1);
                    row6.append(td2);
                    t.append(row6);
                    div.append(t);
                    
                    // row 7
                    if (riders && isArray(riders)) {
                        var gt = $('<table class="ride-management rides detail group" width="100%">');
                        var gh = $('<tr class="table-header">');
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('User')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('First Name')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('Last Name')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Role')));
                        gh.append($('<td width="15%">').append($('<div class="label-01">').append('Email')));
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('RSVP')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Status')));                                                        
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Skill')));
                        gh.append($('<td width="10%">').append($('<div class="label-01">').append('Type')));
                        gh.append($('<td width="5%">').append($('<div class="label-01">').append('Complete')));
                        gt.append(gh);
                        
                        for (var i=0; i < riders.length; i++) {
                            
                            var rider = riders[i];
                            
                            if (rider.group_id === '0') {
                                
                                var gr = $('<tr class="clickable group-member">').data('data', rider).click(function(){
                                    var data = $(this).data('data');
                                    
                                    if ($('#' + 'rider-sub-row-' + data.id).length > 0) {
                                        $('#' + 'rider-sub-row-' + data.id).remove();
                                    } else {

                                        var r = $('<tr id="rider-sub-row-'+data.id+'" style="background-color: #fff !important;">');
                                        var c = $('<td colspan="10">');

                                        r.append(c.append(subrider(instance, data)));

                                        $(this).closest('tr').after(r);

                                    }                                        
                                                                        
                                });
                                gr.append($('<td width="5%">').append(rider.user_name_internal));
                                gr.append($('<td width="15%">').append(rider.first_name));
                                gr.append($('<td width="15%">').append(rider.last_name));
                                gr.append($('<td width="10%">').append(rider.role));
                                gr.append($('<td width="15%">').append(rider.email));                                                        
                                gr.append($('<td width="5%">').append(checkMark(rider.rsvp)));                                                                                        
                                gr.append($('<td width="10%">').append(rider.status));                                                        
                                gr.append($('<td width="10%">').append(rider.skill));
                                gr.append($('<td width="10%">').append(rider.type));
                                gr.append($('<td width="5%">').append(checkMark(rider.complete)));
                                gt.append(gr);
                                                                
                            }
                        }
                        td1 = $('<td colspan="2" align="left" style="width:100%">').append(gt);
                    }                    
                    
                    row7.append(td1);
                    t.append(row7);                                        
                    
                    div.append(t);
                }
                
            },
            data: d,
            url: Models.rides().urls.rides,
            type: 'get'
        }, instance);    
                
        return div;
        
    }
    
    function rideAddress(ride) {
     
        var div = $('<div>');
        div.append($('<div>').append(ride.address_description));
        div.append($('<div>').append(ride.address_street));
        div.append($('<div>').append(ride.address_city).append('&nbsp;').append(ride.address_state).append(', ').append(ride.address_zip));
        div.append($('<div>').append('Latitude: ').append(ride.address_latitude));
        div.append($('<div>').append('Longitude: ').append(ride.address_longitude));
        return div;
        
    }
    
    function groupType(type) {
        
        var span = $('<span>');
        
        if (type === 'PRIVATE') {
            span.addClass("content-red");
        } else {
            span.addClass("content-green");
        }
        
        span.append(type);
        
        return span;
        
    }
    
    function checkMark(val) {
        
        var div = $('<div>');
        
        var css = {};
        
        val = parseInt(val);
        
        switch (val) {
            case -1:
                css = {
                    color: "red",
                    textAlign: "center"
                };
                div.append('&#10799;');
                break;
            case 0:
                css = {
                    color: "orange",
                    textAlign: "center"
                };
                div.append('&#8709;');
                break;
            case 1:
                css = {
                    color: "green",
                    textAlign: "center"
                };
                div.append('&#10003;');
                break;
            default:
                css = {
                };
                break;
        }
        
        return div.css(css);
        
        //return (val === '0') ? '<div style="color: red;text-align:center;">&#10799;</div>': '<div style="color: green;text-align:center;">&#10003;</div>';
    }
    
    function addUserDetails(instance, data) {
        
        var user = data.user[0];
        
        // build add ride section
        var add = $('<button style="font-size:10px; margin-bottom:0px;">Add Ride</button>').button({
            icons: {
                primary: 'ui-icon-plus'
            },
            text: true,
            label: 'Add Ride'                                                    
        }).click(function(e){

            e.preventDefault();

            var addride = $('<div id="add-new-ride" style="border:1px solid #333;font-size:12px; width:100%;margin-top:3px;padding:3px;">');                                            
            addride.append(addRideForm(instance, data)); 
            
            var uit = $('#' + instance.id+'-user-info-table');
                        
            if ($('#add-new-ride').length > 0) {
                $('#add-new-ride').remove();
                uit.after(addride);
            } else {
                uit.after(addride);
            }

        });
        
        // build add ride section
        var edit = $('<button style="font-size:10px; margin-bottom:0px;">').button({
            icons: {
                primary: 'ui-icon-pencil'
            },
            text: true,
            label: 'Edit Profile'                                                    
        }).click(function(e){

            e.preventDefault();

            var edituserinfo = $('<div id="edit-user-info" style="border:1px solid #333;font-size:12px; width:100%;margin-top:3px;padding:3px;">');                                            
            edituserinfo.append(editUserInfoForm(instance, data)); 
            
            var uit = $('#' + instance.id+'-user-info-table');
                        
            if ($('#edit-user-info').length > 0) {
                $('#edit-user-info').remove();
                uit.after(edituserinfo);
            } else {
                uit.after(edituserinfo);
            }

        });                               
                        
        var div = $('<div id="'+instance.id+'-user-info" style="border:1px solid #333;font-size:12px; width:100%;margin:0px 0px;padding:2px;">');
        
        if (user) {
            
            var table = $('<table id="'+instance.id+'-user-info-table" class="ride-management user" style="margin-bottom:3px;width:100%">');
            var row = $('<tr>');                       
            var cell = $('<td>');
            
            cell.append($('<span class="label">').append('Name:'))
                .append($('<span class="content-green">').append(user.first_name + ' ' + user.last_name))
                .append($('<span class="label">').append('Email:'))
                .append($('<span class="content-green">').append(user.email))
                .append($('<span class="label">').append('Skill:'))
                .append($('<span class="content-green">').append(user.skill))
                .append($('<span class="label">').append('Experience:'))
                .append($('<span class="content-green">').append(user.experience))
                .append($('<span class="label">').append('Type:'))
                .append($('<span class="content-green">').append(user.type))
                .append($('<span class="label">').append('Guide:'))
                .append($('<span class="content-green">').append((user.guide === '0') ? 'No' : 'Yes'));                
        
            row.append(cell);
            
            cell = $('<td align="right">');
            cell.append(edit).append(add);
            row.append(cell);
            
            table.append(row);
            div.append(table);
        }        
                        
        return div;
        
    }
    
    function addRideDetails(instance, data) {
        
        var rides = data.rides;
        
        var div = $('<div>');
                
        // build rides grid
        if (isArray(rides)) {
                        
            var header = $('<table class="ride-management rides" style="width:100%">');
            var tr = $('<tr style="background-color: #999 !important;color: #fff;">');
            tr.append($('<td style="width:10%;">').append('Name'));
            tr.append($('<td style="width:23%;">').append('Description'));
            tr.append($('<td style="width:10%;">').append('Location'));
            tr.append($('<td style="width:10%;">').append('Owner'));
            tr.append($('<td style="width:10%;">').append('Group'));
            tr.append($('<td style="width:8%;">').append('Date'));
            tr.append($('<td style="width:6%;">').append('Time'));
            tr.append($('<td style="width:8%;">').append('Status'));
            tr.append($('<td style="width:5%;">').append('Join'));
            header.append(tr);            
            div.append(header);
            
            var table = $('<table class="ride-management rides" style="width:100%">');
            var green = {'background-color': 'green'};
            var red = {'background-color': 'red'};
            
            for (var i=0; i < rides.length; i++) {
                var tr = $('<tr class="clickable">');
                                        
                tr.click(function(){

                    var data = $(this).data('data');
                    
                    if ($('#' + 'sub-row-' + data.id).length > 0) {
                        $('#' + 'sub-row-' + data.id).remove();
                    } else {
                        
                        var r = $('<tr id="sub-row-'+data.id+'" style="background-color: #fff !important;">');
                        var c = $('<td colspan="9">');

                        r.append(c.append(subride(instance, data, true)));

                        $(this).closest('tr').after(r);
                        
                    }                                        
                    
                }).data('data', rides[i]);
                
                
                tr.append($('<td style="width:10%;">').append(rides[i].name));
                tr.append($('<td style="width:23%;">').append(rides[i].description));                                
                tr.append($('<td style="width:10%;">').append(rides[i].location_name));
                tr.append($('<td style="width:10%;">').append(rides[i].owner_name).data('data', rides[i]));
                tr.append($('<td style="width:10%;" class="group">').append(rides[i].group_name).data('data', rides[i]));
                tr.append($('<td style="width:8%;">').append(rides[i].date));
                tr.append($('<td style="width:6%;">').append(rides[i].time));
                tr.append($('<td style="width:8%;">').append(rides[i].status));
                tr.append($('<td style="width:5%;text-align:center;">').append(function(){
                                        
                    return (rides[i].join !== '0') ? $('<span class="circle">').css(green): $('<span class="circle">').css(red);
                    
                }));
                
                table.append(tr);
            }
                                    
            div.append(table);  
                        
        }
        
        return div;
        
    }
    
    function addRideForm(instance, data) {
        
        var div = $('<div>');
        var form = $('<form id="'+instance.id+'-add-ride-form" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');
                
        var table = $('<table class="ride-management rides add" width="100%" align="center">');
        
        var ride_name = $('<input type="text" id="'+instance.id+'-ride_name" name="'+instance.id+'-ride_name" class="required">');
        var ride_description = $('<input type="text" id="'+instance.id+'-ride_description" name="'+instance.id+'-ride_description" class="required">');
        var ride_group = $('<select id="'+instance.id+'-ride_group" name="'+instance.id+'-ride_group" class="large">');
        var ride_location = $('<select id="'+instance.id+'-ride_location" name="'+instance.id+'-ride_location" class="large">');
        var ride_address = $('<select id="'+instance.id+'-ride_address" name="'+instance.id+'-ride_address" class="large">');
        var ride_date = $('<input type="text" id="'+instance.id+'-ride_date" name="'+instance.id+'-ride_date" class="required fdate" style="padding-left:10px;" readonly="true">');
        var ride_time = $('<select id="'+instance.id+'-ride_time" name="'+instance.id+'-ride_time" class="large">');
        var ride_status = $('<select id="'+instance.id+'-ride_status" name="'+instance.id+'-ride_status" class="">');
        var ride_join = $('<select id="'+instance.id+'-ride_join" name="'+instance.id+'-ride_join" class="large">');
        var ride_tempo = $('<select id="'+instance.id+'-ride_tempo" name="'+instance.id+'-ride_tempo" class="large">');
        var ride_drop = $('<select id="'+instance.id+'-ride_drop" name="'+instance.id+'-ride_drop" class="large">');
        var ride_states = $('<select id="'+instance.id+'-ride_states" name="'+instance.id+'-ride_states" class="">');
        var ride_public = $('<select id="'+instance.id+'-ride_public" name="'+instance.id+'-ride_public" class="large">');
        
        var update = $('<button id="'+instance.id+'-ride_update" class="ride-add-button">').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Save'                                            
        }).click(function(e){
            e.preventDefault();
            
            $.validator.addMethod('fdate', function(date, element) {
                var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
                return this.optional(element) || date.match(date_regex);
            }, 'Please enter a date mm/dd/yyyy');
            
            $('#'+instance.id+'-add-ride-form').validate({
                debug: true,
                errorPlacement: function(error, element) {
                    return true;
                },
                ignore: '',
                submitHandler: function(f) {
                    
                    var ride = {
                        name: $('#'+instance.id+'-ride_name').val(),
                        description: $('#'+instance.id+'-ride_description').val(),
                        owner: $('#'+instance.id+'-ride_owner').val(),
                        group: $('#'+instance.id+'-ride_group').val(),
                        location: $('#'+instance.id+'-ride_location').val(),
                        address: $('#'+instance.id+'-ride_address').val(),
                        date: $('#'+instance.id+'-ride_date').val(),
                        time: $('#'+instance.id+'-ride_time').val(),
                        status: $('#'+instance.id+'-ride_status').val(),
                        join: $('#'+instance.id+'-ride_join').val(),
                        tempo: $('#'+instance.id+'-ride_tempo').val(),
                        drop: $('#'+instance.id+'-ride_drop').val(),
                        states: $('#'+instance.id+'-ride_states').val(),
                        public: $('#'+instance.id+'-ride_public').val()                        
                    };
                    
                    var post = $.extend(ride, {action: 'add', token: instance.options.token});
                    
                    var request = {
                        callback: function(data, instance) {
                            log(instance, instance.options.name, 'AddRideForm', post);                            
                            log(instance, instance.options.name, 'AddRideForm', data);
                            
                            var config = {
                                success: data.success,
                                code: (!data.error) ? data.code : data.error.code,
                                message: (!data.error) ? data.message : data.error.message,
                                callback: function() {
                                    build(instance);
                                },
                                height: (data.success) ? 150 : 700,
                                modal: true,
                                title: 'Add Ride'
                            };

                            display(instance, config);
                            
                        },
                        data: post,
                        url: Models.rides().urls.post,
                        type: 'post'                        
                    };                    
                    
                    server(request, instance);
                                        
                },
                success: function() {
                    
                },
                unhighlight: function(element, errorClass) {
                    $(element).removeClass(errorClass);
                }                
            });
            
            $('#'+instance.id+'-add-ride-form').submit();
            
        });
        
        var cancel = $('<button id="'+instance.id+'-ride_cancel" class="ride-add-button">').button({
            icons: {
                primary: 'ui-icon-close'
            },
            text: true,
            label: 'Cancel'                                            
        }).click(function(e){
            e.preventDefault();
            $('#add-new-ride').remove();
        });                
        
        // row 1
        var row = $('<tr>');
        var a1 = $('<td rowspan="12" valign="middle">').append($('<div class="ride-add-ad alley">'));
        var c1 = $('<td>').append($('<div class="label-02">').append('Name:'));
        var c2 = $('<td>').append(ride_name);
        var a2 = $('<td rowspan="12" valign="middle">').append($('<div class="ride-add-ad alley">'));
        row.append(a1).append(c1).append(c2).append(a2);
        table.append(row);
        
        // row 2
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Description:'));
        c2 = $('<td>').append(ride_description);
        row.append(c1).append(c2);               
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Group:'));
        c2 = $('<td>').append(ride_group);
        row.append(c1).append(c2);
        table.append(row);

        // row 4
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Location:'));
        c2 = $('<td>').append(ride_location);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 5
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('Address:'));
        c2 = $('<td>').append(ride_address);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 6
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Date:'));
        c2 = $('<td>').append(ride_date);
        row.append(c1).append(c2);
        table.append(row);

        // row 7
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Time:'));
        c2 = $('<td>').append(ride_time);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 8
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('Public:'));
        c2 = $('<td>').append(ride_public);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 9
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Allow Join:'));
        c2 = $('<td>').append(ride_join);
        row.append(c1).append(c2);
        table.append(row);
                
        // row 10
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Tempo:'));
        c2 = $('<td>').append(ride_tempo);
        row.append(c1).append(c2);
        table.append(row);
                
        // row 11
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('Drop:'));
        c2 = $('<td>').append(ride_drop);
        row.append(c1).append(c2);
        table.append(row);
                                
        // row 12
        row = $('<tr>');
        c1 = $('<td colspan="2" align="center">').append(update).append(cancel);
        row.append(c1);
        table.append(row);        
        
        // add ad div to form top
        var ad = $('<div class="ride-add-ad top">');
        form.append(ad);
        
        // add middle components to form
        form.append(table);                  
        
        // add ad div to form bottom
        ad = $('<div class="ride-add-ad bottom">');
        form.append(ad);
        
        // add date picker to date
        ride_date.datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: 'mm/dd/yy'
                });  
                        
        // selects
        $.each(getOptions(instance, data.selects.groups), function(index, option){
            ride_group.append(option);
        });
        
        $.each(getOptions(instance, data.selects.locations), function(index, option){
            ride_location.append(option);
        });
        
        $.each(getOptions(instance, data.selects.addresses), function(index, option){
            ride_address.append(option);
        });
        
        $.each(timeOptions(instance), function(index, option){            
            ride_time.append(option);
        });
        
        $.each(getOptions(instance, data.selects.status), function(index, option){
            ride_status.append(option);
        });

        $.each(getOptions(instance, data.selects.joinable), function(index, option){
            ride_join.append(option);
        });
        
        $.each(getOptions(instance, data.selects.tempo), function(index, option){
            ride_tempo.append(option);
        });
        
        $.each(getOptions(instance, data.selects.drop), function(index, option){
            ride_drop.append(option);
        });
        
        $.each(getOptions(instance, data.selects.public), function(index, option){
            ride_public.append(option);
        });
        
        $.each(getOptions(instance, data.selects.states), function(index, option){
            ride_states.append(option);
        });
        
        ride_group.selectmenu();
        ride_location.selectmenu({
            change: function() {
                
                var id = $(this).val();

                server({
                    callback: function(data, instance){
                        ride_address.find('option').remove();
                        ride_address.selectmenu('destroy').selectmenu({ style: 'dropdown' });
                        $.each(getOptions(instance, data.selects.addresses), function(index, option){
                            ride_address.append(option).selectmenu("refresh", true);
                        });                    
                    },
                    url: Models.addresses().urls.get + id,
                    type: 'get'
                }, instance);            
                
            }
        });
        ride_address.selectmenu();
        ride_time.selectmenu();
        ride_status.selectmenu();
        ride_join.selectmenu();
        ride_tempo.selectmenu();
        ride_drop.selectmenu();
        ride_public.selectmenu();
        ride_states.selectmenu();
       
        div.append(form);                
        
        return div;
    }
    
    function editUserInfoForm(instance, data) {
        
        var user = data.user[0];        
        
        var div = $('<div style="border: 0px dotted red;">');
        
        var close = $('<div style="float:right;font-size:20px;margin:0px 10px;border:0px dotted green;" class="clickable base">').append('&#10799;').click(function(){
            $('#edit-user-info').remove();
        });
        
        div.append(close);
        
        div.append($('<div class="ride-management-segment-header" style="clear:both;">').append('Profile'));
        div.append($('<hr style="border:0;clear:both;height:1px;background:#333;margin-top:10px;" />'));
        
        var divw = $('<div style="text-align: center;">');
        var divl = $('<div style="display:inline-block; vertical-align: top; border: 0px solid orange;">');
        var divr = $('<div style="display:inline-block; vertical-align: top; margin-left: 10px; border: 0px solid purple;">');
        
        // build left side
        var form = $('<form id="'+instance.id+'-edit-user-info-form" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');
                
        var table = $('<table class="ride-management user" style="text-align: left;" width="50%">');
        
        var user_first_name = $('<input type="text" id="'+instance.id+'-user_first_name" name="'+instance.id+'-user_first_name" class="required">');
        var user_last_name = $('<input type="text" id="'+instance.id+'-user_last_name" name="'+instance.id+'-user_last_name" class="required">');
        var user_email = $('<input type="text" id="'+instance.id+'-user_email" name="'+instance.id+'-user_email" class="required email">').prop('disabled', true);
        
        var user_gender = $('<select id="'+instance.id+'-user_gender" name="'+instance.id+'-user_gender" class="small">');
        var user_skill = $('<select id="'+instance.id+'-user_skill" name="'+instance.id+'-user_skill" class="small">');
        var user_experience = $('<select id="'+instance.id+'-user_experience" name="'+instance.id+'-user_experience" class="small">');
        var user_style = $('<select id="'+instance.id+'-user_style" name="'+instance.id+'-user_style" class="small">');
        var user_viewable = $('<select id="'+instance.id+'-user_viewable" name="'+instance.id+'-user_viewable" class="small">');
                
        var update = $('<button id="'+instance.id+'-ride_update" class="ride-add-button">Update</button>').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Update'                                            
        }).click(function(e){
            e.preventDefault();
            
            $('#'+instance.id+'-edit-user-info-form').validate({
                debug: true,
                errorPlacement: function(error, element) {
                    return true;
                },
                ignore: '',
                submitHandler: function(f) {
                    
                    var update = {
                        first_name: $('#'+instance.id+'-user_first_name').val(),
                        last_name: $('#'+instance.id+'-user_last_name').val(),
                        email: $('#'+instance.id+'-user_email').val(),
                        gender: $('#'+instance.id+'-user_gender').val(),
                        skill: $('#'+instance.id+'-user_skill').val(),
                        experience: $('#'+instance.id+'-user_experience').val(),
                        type: $('#'+instance.id+'-user_style').val(),
                        viewable: $('#'+instance.id+'-user_viewable').val()
                    };
                    
                    var post = $.extend(update, instance.options, {id: user.id});
                    
                    server({
                        callback: function(data, instance) {
                            
                            if (data.success) {
                                
                                if (isArray(data.user)) {

                                    var u = data.user[0];

                                    user_first_name.val(u.first_name);
                                    user_last_name.val(u.last_name);
                                    user_email.val(u.email);
                                    user_gender.val(u.gender);
                                    user_gender.selectmenu("refresh");
                                    user_skill.val(u.skill);
                                    user_skill.selectmenu("refresh");
                                    user_experience.val(u.experience);
                                    user_experience.selectmenu("refresh");
                                    user_style.val(u.type);
                                    user_style.selectmenu("refresh");
                                    user_viewable.val(u.viewable);
                                    user_viewable.selectmenu("refresh");
                                    
                                    var config = $.extend(data, {height: 150, title: 'Success'});
                                    display(instance, config);
                                    
                                }
                                                                
                            } else {

                                var config = $.extend(data, {title: 'Error'});
                                display(instance, config);
                                
                            }
                                                        
                            
                        },
                        data: post,
                        url: Models.users().urls.post,
                        type: 'post'
                    }, instance);
                    
                    
                },
                success: function() {
                    
                },
                unhighlight: function(element, errorClass) {
                    $(element).removeClass(errorClass);
                }                
            });
            
            $('#'+instance.id+'-edit-user-info-form').submit();
            
        });
        
        var cancel = $('<button id="'+instance.id+'-ride_cancel" class="ride-add-button">Cancel</button>').button({
            icons: {
                primary: 'ui-icon-close'
            },
            text: true,
            label: 'Cancel'                                            
        }).click(function(e){
            e.preventDefault();
            $('#edit-user-info').remove();
        });                
        
        // row 1       
        var row = $('<tr>');
        var c1 = $('<td>').append($('<div class="label-02">').append('First Name:'));
        var c2 = $('<td>').append(user_first_name);
        row.append(c1).append(c2);
        table.append(row);
                
        // row 2
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Last Name:'));
        c2 = $('<td>').append(user_last_name);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Email:'));
        c2 = $('<td>').append(user_email);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Gender:'));
        c2 = $('<td>').append(user_gender);
        row.append(c1).append(c2);
        table.append(row);

        // row 4
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Skill:'));
        c2 = $('<td>').append(user_skill);
        row.append(c1).append(c2);
        table.append(row);

        // row 5
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Experience:'));
        c2 = $('<td>').append(user_experience);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 6
        row = $('<tr>');        
        c1 = $('<td>').append($('<div class="label-02">').append('Style:'));
        c2 = $('<td>').append(user_style);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 7
        row = $('<tr>');        
        c1 = $('<td>').append($('<div class="label-02">').append('Public:'));
        c2 = $('<td>').append(user_viewable);
        row.append(c1).append(c2);
        table.append(row);
                        
        // row 8
        row = $('<tr>');
        c1 = $('<td colspan="2" align="center">').append(update).append(cancel);
        row.append(c1);
        table.append(row);        
        
        // add middle components to form
        form.append(table);                  
        divl.append(form);
                
        // selects
        $.each(getOptions(instance, data.selects.skills), function(index, option){
            user_skill.append(option);
        });
        
        $.each(experienceOptions(instance), function(index, option){
            user_experience.append(option);
        });
        
        $.each(getOptions(instance, data.selects.styles), function(index, option){
            user_style.append(option);
        });
        
        $.each(getOptions(instance, data.selects.viewable), function(index, option){
            user_viewable.append(option);
        });
        
        $.each(getOptions(instance, data.selects.gender), function(index, option){
            user_gender.append(option);
        });
        
        user_gender.selectmenu();
        user_skill.selectmenu();
        user_experience.selectmenu();
        user_style.selectmenu();
        user_viewable.selectmenu();
        
        // seed values
        user_first_name.val(user.first_name);
        user_last_name.val(user.last_name);
        user_email.val(user.email);
        user_gender.val(user.gender);
        user_gender.selectmenu("refresh");
        user_skill.val(user.skill);
        user_skill.selectmenu("refresh");
        user_gender.selectmenu("refresh");
        user_experience.val(user.experience);
        user_experience.selectmenu("refresh");
        user_style.val(user.type);
        user_style.selectmenu("refresh");
        user_viewable.val(user.viewable);
        user_viewable.selectmenu("refresh");
        
        // build right side
        var avatar = $('<div style="border:0px solid #444; float: left; height: 135px; text-align: left; margin-top: 2px;">');
        avatar.append($('<div style="margin-left: 5px;">').append('<u>Avatar</u>'));
        var image = $('<img />', {
            id: '',
            src: user.avatar,
            alt: 'Avatar: User ID ['+JSON.stringify(user.id)+']',
            name: '',
            class: '',
            height: '100',
            width: '100'            
        });
        
        avatar.append(image);
        
        var equipment = $('<div style="border:0px solid #555; float: left; height: 135px; text-align: left; margin-top: 2px; margin-left: 50px;">');
        
        var stuff = data.equipment;
        
        if (isArray(stuff)) {
            equipment.append($('<div>').append('<u>Equipment</u>'));
            var ul = $('<ul style="list-style-type: none; margin: 0; padding: 0;">');
            for (var i=0; i < stuff.length; i++) {
                var thing = stuff[i];
                var li = $('<li style="margin: 0; padding: 0;">');
                li.append($('<div class="equipment-list-label-01">').append(thing.name));
                li.append($('<div class="equipment-list-label-01">').append(thing.make));
                li.append($('<div class="equipment-list-label-02">').append(thing.model));
                //li.append($('<div class="equipment-list-label-01">').append());
                ul.append(li);
            }
            equipment.append(ul);
        }
                
        var photos = $('<div style="border:0px solid #333; clear: both;">');        
        photos.mtbCarousel({});
        
        divr.append(avatar);
        divr.append(equipment);
        divr.append(photos);
        
        divw.append(divl).append(divr);
       
        // add ad div to form top
        var ad = $('<div class="user-edit-ad top">');
        div.append(ad);
        div.append(divw);
        // add ad div to form bottom
        ad = $('<div class="user-edit-ad bottom">');
        div.append(ad);
        
        // friends management
        div.append(friendManagement(instance, data));
        
        // groups
        div.append(groupManagement(instance, data));
                
        return div;
        
    }
    
    function friendManagement(instance, data) {
                
        var div = $('<div style="border:0px solid #333; width:100%;">');
        
        var fmfind = $('<div id="friend-management-find" style="border:0px dotted blue; margin-bottom:3px; display:none; padding: 5px;">');
        var fmlist = $('<div id="friend-management-list">');
        var fmhead = $('<div id="friend-management-header" style="margin-top:10px;">');
        
        var add = $('<button style="font-size:9px;float:right;width:100px;">').button({
            icons: {
                primary: 'ui-icon-plus'
            },
            text: true,
            label: 'Add Friends'
        }).click(function(e){
            e.preventDefault();            
            $('#friend-management-find').show();           
        });
                
        fmhead.append($('<div class="ride-management-segment-header" style="display:inline-block;">').append('Friends')).append(add);
        fmhead.append($('<hr style="border:0;clear:both;height:1px;background:#333;margin-top:10px;" />'));
        
        // available
        if (isArray(data.available)) {
            
            fmfind.append($('<div class="ride-management-segment-subheader">').append('Available'));                        
            
            var table = $('<table class="ride-management available" width="100%">');
            var tr = $('<tr class="table-header">');
            tr.append($('<td>').append($('<span class="">').append('First Name')));
            tr.append($('<td>').append($('<span class="">').append('Last Name')));
            tr.append($('<td>').append($('<span class="">').append('Email')));
            tr.append($('<td>').append($('<span class="">').append('Skill')));
            tr.append($('<td>').append($('<span class="">').append('Experience')));
            tr.append($('<td>').append($('<span class="">').append('Style')));
            tr.append($('<td align="center">').append($('<span class="">').append('Add')));
            table.append(tr);
            
            for (var i=0; i < data.available.length; i++) {
                var friend = data.available[i];
                tr = $('<tr>');
                tr.append($('<td>').append(friend.first_name));
                tr.append($('<td>').append(friend.last_name));
                tr.append($('<td>').append(friend.email));
                tr.append($('<td>').append(friend.skill));
                tr.append($('<td>').append(friend.experience));
                tr.append($('<td>').append(friend.type));
                
                var queue = $('<input type="checkbox" class="ride-management-friends-available">').data('friend', friend);
                
                tr.append($('<td align="center">').append(queue));
                table.append(tr);
            }
            
            var update = $('<button style="font-size: 9px; margin-right: 1px;">').button({
                icons: {
                    primary: 'ui-icon-check'
                },
                text: true,
                label: 'Update'                
            }).click(function(e){
                                
                var friends = [];
                $(".ride-management-friends-available").each(function() {
                    var item = $(this);
                    var friend = $(this).data('friend');
                    if (item.is(':checked')) {
                        friends.push(friend.id);                        
                    }
                });
                
                var post = $.extend(instance.options, {friends: friends.join('|')});
                
                var request = {
                    
                    callback: function(data, instance) {
                        
                        var config = {
                            success: data.success,
                            code: (!data.error) ? data.code : data.error.code,
                            message: (!data.error) ? data.message : data.error.message,
                            callback: function() {
                                build(instance);
                            },
                            height: (data.success) ? 150 : 700,
                            modal: true,
                            title: 'Add Friends'
                        };

                        display(instance, config);
                        
                    },                    
                    data: post,
                    type: 'post',
                    url: 'friends/post'                    
                };
                
                if (friends.length > 0) {
                    server(request, instance);
                }
                                
            });
            
            var cancel = $('<button style="font-size: 9px;">').button({
                icons: {
                    primary: 'ui-icon-close'
                },
                text: true,
                label: 'Cancel'                
            }).click(function(e){
                e.preventDefault();
                $('#friend-management-find').hide();
            });
                                    
            fmfind.append(table);
            fmfind.append($('<div style="text-align: center; margin: 5px 0px 5px 0px;">').append(update).append(cancel));
            
        }                
                        
        if (isArray(data.friends)) {
            
            fmlist.append($('<div class="ride-management-segment-subheader">').append('My Friends'));                        
            
            var table = $('<table class="ride-management friends" width="100%">');
            var tr = $('<tr class="table-header">');
            tr.append($('<td>').append($('<span class="">').append('First Name')));
            tr.append($('<td>').append($('<span class="">').append('Last Name')));
            tr.append($('<td>').append($('<span class="">').append('Email')));
            tr.append($('<td>').append($('<span class="">').append('Skill')));
            tr.append($('<td>').append($('<span class="">').append('Experience')));
            tr.append($('<td>').append($('<span class="">').append('Style')));
            tr.append($('<td>').append($('<span class="">').append('Guide')));
            table.append(tr);
            
            for (var i=0; i < data.friends.length; i++) {
                var friend = data.friends[i];
                tr = $('<tr class="clickable">');
                tr.append($('<td>').append(friend.first_name));
                tr.append($('<td>').append(friend.last_name));
                tr.append($('<td>').append(friend.email));
                tr.append($('<td>').append(friend.skill));
                tr.append($('<td>').append(friend.experience));
                tr.append($('<td>').append(friend.type));
                tr.append($('<td>').append(friend.guide));
                
                tr.click(function(){
                    
                    var data = $(this).data('data');
                    
                    if ($('#' + 'friend-sub-row-' + data.id).length > 0) {
                        $('#' + 'friend-sub-row-' + data.id).remove();
                    } else {
                        
                        var r = $('<tr id="friend-sub-row-'+data.id+'" style="background-color: #fff !important;">');
                        var c = $('<td colspan="7">');
                        
                        r.append(c.append(subfriend(instance, data)));

                        $(this).closest('tr').after(r);
                        
                    }                                        
                    
                }).data('data', friend);
                
                table.append(tr);
            }
            
            fmlist.append(table);
            
        }
                                        
        div.append(fmhead);
        div.append(fmfind);
        div.append(fmlist);
                        
        return div;
        
    }
    
    function groupManagement(instance, data) {

        var div = $('<div style="border:0px solid #333; width:100%;">');
        
        var gmadd = $('<div id="group-management-add" style="border:0px dotted blue; margin-bottom:3px; display:none; padding: 5px;">');
        var gmlist = $('<div id="group-management-list">');
        var gmhead = $('<div id="group-management-header" style="margin-top:10px;">');
        
        var add = $('<button style="font-size:9px;float:right;width:100px;">').button({
            icons: {
                primary: 'ui-icon-plus'
            },
            text: true,
            label: 'Add Group'
        }).click(function(e){
            e.preventDefault();            
            $('#group-management-add').show();           
        });
                
        gmhead.append($('<div class="ride-management-segment-header" style="display:inline-block;">').append('Groups')).append(add);
        gmhead.append($('<hr style="border:0;clear:both;height:1px;background:#333;margin-top:10px;" />'));
        
        // group add form
        var form = $('<form id="'+instance.id+'-add-group-form" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');        
        var table = $('<table class="ride-management group" width="100%" align="center">');
        
        var group_name = $('<input type="text" id="'+instance.id+'-group_name" name="'+instance.id+'-group_name" class="required">');
        var group_description = $('<input type="text" id="'+instance.id+'-group_description" name="'+instance.id+'-group_description" class="required">');
        var group_deputy = $('<select id="'+instance.id+'-group_deputy" name="'+instance.id+'-group_deputy" class="large">');
        var group_type = $('<select id="'+instance.id+'-group_type" name="'+instance.id+'-group_type" class="small">');
        var group_join = $('<select id="'+instance.id+'-group_join" name="'+instance.id+'-group_join" class="small">');
        var group_locked = $('<select id="'+instance.id+'-group_locked" name="'+instance.id+'-group_locked" class="small">');
        
        var insert = $('<button id="'+instance.id+'-ride_update" class="ride-add-button">Update</button>').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Add'                                            
        }).click(function(e){
            e.preventDefault();
            
            $('#'+instance.id+'-add-group-form').validate({
                debug: true,
                errorPlacement: function(error, element) {
                    return true;
                },
                ignore: '',
                submitHandler: function(f) {
                    
                    var members = [];
                    $(".ride-management-friends-group-add").each(function() {
                        var item = $(this);
                        var friend = $(this).data('friend');
                        if (item.is(':checked')) {
                            members.push(friend.id);                        
                        }
                    });
                                        
                    var group = {
                        group_name: $('#'+instance.id+'-group_name').val(),
                        group_description: $('#'+instance.id+'-group_description').val(),
                        group_owner: $('#'+instance.id+'-group_owner').val(),
                        group_deputy: $('#'+instance.id+'-group_deputy').val(),
                        group_type: $('#'+instance.id+'-group_type').val(),
                        group_join: $('#'+instance.id+'-group_join').val(),                        
                        group_locked: $('#'+instance.id+'-group_locked').val()                        
                    };
                    
                    var post = $.extend(group, instance.options, {action: 'add', group_members: members.join('|')});
                    
                    var request = {
                        callback: function(data, instance) {
                            
                            var config = {
                                success: data.success,
                                code: (!data.error) ? data.code : data.error.code,
                                message: (!data.error) ? data.message : data.error.message,
                                callback: function() {
                                    build(instance);
                                },
                                height: (data.success) ? 150 : 700,
                                modal: true,
                                title: 'Add Group'                                
                            };
                            
                            display(instance, config);
                            
                        },
                        data: post,
                        url: Models.groups().urls.post,
                        type: 'post'
                    };
                    
                    server(request, instance);                    
                    
                },
                success: function() {
                    
                },
                unhighlight: function(element, errorClass) {
                    $(element).removeClass(errorClass);
                }                
            });
            
            $('#'+instance.id+'-add-group-form').submit();
            
        });
        
        var cancel = $('<button id="'+instance.id+'-ride_cancel" class="ride-add-button">Cancel</button>').button({
            icons: {
                primary: 'ui-icon-close'
            },
            text: true,
            label: 'Cancel'                                            
        }).click(function(e){
            e.preventDefault();
            $('#group-management-add').hide();
        });                        
        
        // row 1
        var row = $('<tr>');
        var a1 = $('<td rowspan="8" valign="middle">').append($('<div class="group-add-ad alley">'));        
        var c1 = $('<td>').append($('<div class="label-02">').append('Name:'));
        var c2 = $('<td>').append(group_name);
        var a2 = $('<td rowspan="8" valign="middle">').append($('<div class="group-add-ad alley">'));
        row.append(a1).append(c1).append(c2).append(a2);
        table.append(row);
        
        // row 2
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Description:'));
        c2 = $('<td>').append(group_description);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Deputy:'));
        c2 = $('<td>').append(group_deputy);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 4
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Joinable:'));
        c2 = $('<td>').append(group_join);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 5
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Locked:'));
        c2 = $('<td>').append(group_locked);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 6
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Type:'));
        c2 = $('<td>').append(group_type);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 7
        row = $('<tr>');
        c1 = $('<td valign="top">').append($('<div class="label-02">').append('Friends:'));
        var members = $('<table class="ride-management friends" style="width: 450px;">');
        if (isArray(data.friends)) {
            
            var tr = $('<tr class="table-header">');
            tr.append($('<td>').append('Name'));
            tr.append($('<td>').append('Skill'));
            tr.append($('<td>').append('Experience'));
            tr.append($('<td>').append('Style'));
            tr.append($('<td align="center">').append('Add'));
            members.append(tr);
            
            for (var i=0; i < data.friends.length; i++) {
                var friend = data.friends[i];
                tr = $('<tr>');
                tr.append($('<td>').append(friend.first_name + ' ' + friend.last_name));
                tr.append($('<td>').append(friend.skill));
                tr.append($('<td>').append(friend.experience));
                tr.append($('<td>').append(friend.type));
                
                var queue = $('<input type="checkbox" class="ride-management-friends-group-add">').data('friend', friend);                
                tr.append($('<td align="center">').append(queue));
                
                members.append(tr);
            }
            
        }
        c2 = $('<td>').append(members);
        row.append(c1).append(c2);
        table.append(row);
        
        // row 8
        row = $('<tr>');
        c1 = $('<td colspan="2" align="center">').append(insert).append(cancel);
        row.append(c1);
        table.append(row);
                        
        // add ad div to form top
        var ad = $('<div class="group-add-ad top">');
        form.append(ad);
        form.append(table);                  
        ad = $('<div class="group-add-ad bottom">');
        form.append(ad);                
        
        // selects
        $.each(getOptions(instance, data.selects.deputies), function(index, option){
            group_deputy.append(option);
        });
        
        $.each(getOptions(instance, data.selects.ridetypes), function(index, option){
            group_type.append(option);
        });
        
        $.each(getOptions(instance, data.selects.joinable), function(index, option){
            group_join.append(option);
        });
        
        $.each(getOptions(instance, data.selects.locked), function(index, option){
            group_locked.append(option);
        });
        
        group_deputy.selectmenu();
        group_type.selectmenu();
        group_join.selectmenu();
        group_locked.selectmenu();
        
        gmadd.append(form);
        
        if (isArray(data.usergroups)) {
            
            gmlist.append($('<div class="ride-management-segment-subheader">').append('My Groups'));                        
            
            var table = $('<table class="ride-management groups" width="100%">');
            var tr = $('<tr class="table-header">');
            tr.append($('<td>').append($('<span class="">').append('Name')));
            tr.append($('<td>').append($('<span class="">').append('Description')));
            tr.append($('<td>').append($('<span class="">').append('Owner')));
            tr.append($('<td>').append($('<span class="">').append('Deputy')));
            tr.append($('<td>').append($('<span class="">').append('Type')));
            tr.append($('<td>').append($('<span class="">').append('Join')));
            tr.append($('<td>').append($('<span class="">').append('Locked')));
            table.append(tr);
            
            for (var i=0; i < data.usergroups.length; i++) {
                var group = data.usergroups[i];
                tr = $('<tr class="clickable">');
                tr.append($('<td>').append(group.name));
                tr.append($('<td>').append(group.description));
                tr.append($('<td>').append(group.owner));
                tr.append($('<td>').append(group.deputy));
                tr.append($('<td>').append(group.type));
                tr.append($('<td>').append(group.join));
                tr.append($('<td>').append(group.locked));
                
                tr.click(function(){
                    
                    var data = $(this).data('data');
                    
                    if ($('#' + 'group-sub-row-' + data.id).length > 0) {
                        $('#' + 'group-sub-row-' + data.id).remove();
                    } else {
                        
                        var r = $('<tr id="group-sub-row-'+data.id+'" style="background-color: #fff !important;">');
                        var c = $('<td colspan="7">');
                        
                        r.append(c.append(subgroup(instance, data)));

                        $(this).closest('tr').after(r);
                        
                    }                                        
                    
                }).data('data', group);
                
                table.append(tr);
            }
            
            gmlist.append(table);
            
        }
        
        div.append(gmhead);
        div.append(gmadd);
        div.append(gmlist);

        return div;
        
    }
    
    function timeOptions(instance) {
        
        var options = [];
        
        for (var i=0; i < 24; i++) {
            for (var j=0; j < 60; j+=5) {                
                var hour = (i < 10) ? '0' + i : i;
                var minute = (j < 10) ? '0' + j : j;
                var option = $('<option>', { value: hour + ':' + minute}).text(hour + ':' + minute);
                options.push(option);
            }
        }
                
        return options;
        
    }
    
    function experienceOptions(instance) {
        
        var options = [];
        
        for (var i=0; i < 50; i++) {
            var option = $('<option>', { value: i}).text(i + ' year(s)');
            options.push(option);
        }
                
        return options;
        
        
    }
    
    function getOptions(instance, data) {
        
        var options = [];
        if (isArray(data)) {
            $.each(data, function(index, value){
                var s = value.split(':');
                var v = s[0];
                var t = s[1];
                var option = $('<option>', { value: v}).text(t);
                options.push(option);
            });            
        }
        
        return options;
        
    }
    
    function guideDisplay(guide, user_id) {
        
        var span = '';
        
        if (guide === "1") {
            span = $('<span class="guide-display">');
            span.append('Guide').data('user_id', user_id);
        } 
        
        return span;
        
    }
    
    function rideJoinable(instance, ride, riders, user) {
        
        var joinable = false;
        
        log(instance, instance.options.name, 'user: ', user);
        
        try {
            
            var r = $.map(riders, function(value, index){
                return value.user_id;
            });
                
            log(instance, instance.options.name, 'Riders r: ', r);
            log(instance, instance.options.name, 'User Id: ', user.id);
            log(instance, instance.options.name, 'IndexOf r: ', r.indexOf(user.id));
                        
            if (ride.join === '1' && r.indexOf(user.id) === -1) {
                
                var a = ride.date.split('-');
                var b = ride.time.substring(0,5).split(':');
                                
                log(instance, instance.options.name, 'Ride Date a: ', a);
                log(instance, instance.options.name, 'Ride Date b: ', b);

                var sd = new Date(a[0], a[1] - 1, a[2], b[0], b[1]);
                var cd = new Date();

                sd.setTime(sd.getTime() - sd.getTimezoneOffset()*60*1000);
                cd.setTime(cd.getTime() - cd.getTimezoneOffset()*60*1000);

                log(instance, instance.options.name, 'Ride Date cd: ', cd);
                log(instance, instance.options.name, 'Ride Date sd: ', sd);
                                
                joinable = sd > cd;

                log(instance, instance.options.name, 'Ride Joinable? ', joinable);
                
            }                        
            
        } catch (e) {
            
        }
        
        return joinable;
        
    }
        
    $.fn.rideManagement = function(options) {
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        return this.each(function(){
            
            var item = $(this), instance = item.data('RideManagement');
            
            if (!instance) {
                item.data('RideManagement', new RideManagement(this, options));
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