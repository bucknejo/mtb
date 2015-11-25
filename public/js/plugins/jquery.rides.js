;(function($) {
    
    var defaults = {
        debug: true,
        name: 'Ride Management',
        states: {},
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
            url: instance.options.urls.main,
            type: 'get'
        }, instance);
    }
    
    function main(data, instance) {
        
        // build user section        
        instance.item.empty().append(addUserDetails(instance, data));                
        instance.item.append(addRideDetails(instance, data));
        
    }
    
    function subride(instance, data, edit) {
                                        
        var div = $('<div style="width:100%;">');        
        var close = $('<div style="float:right;font-size:20px;margin:0px 10px;" class="clickable base">').append('&#10799;').click(function(){
            $('#' + 'sub-row-' + data.id).remove();            
        });
        
        div.append(close);
        div.append($('<div style="clear:both;>'));
        
        var d = $.extend({}, instance.options.data, data, {process: "GET-ONE", oper: "SELECT"});
        
        var rides = Models.rides();
        
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
                                    alert(JSON.stringify(data));
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
                    t = $('<table class="ride-management rides detail" width="100%">');
                    td1 = $('<td align="left" style="width:100%">')
                            .append($('<span class="label-01">').append('Additional Riders'));
                    
                    row6.append(td1);
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
                                    alert(JSON.stringify(data));
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
                    
                    row7.append(td1);
                    t.append(row7);                                        
                    
                    div.append(t);
                }
                
            },
            data: d,
            url: rides.url,
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
        
        return (val === '0') ? '<div style="color: red;text-align:center;">&#10799;</div>': '<div style="color: green;text-align:center;">&#10003;</div>';
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
            //tr.append($('<td style="width:10%;text-align:center;">').append('Edit/View'));
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
                var update = $('<button style="display:inline-block;margin:2px;">').button({
                    icons: {
                        primary: 'ui-icon-pencil'
                    },
                    text: false,
                    label: 'View Ride'                                        
                });                        
                        
                tr.click(function(){

                    var data = $(this).data('data');
                    
                    if ($('#' + 'sub-row-' + data.id).length > 0) {
                        $('#' + 'sub-row-' + data.id).remove();
                    } else {
                        
                        var r = $('<tr id="sub-row-'+data.id+'">');
                        var c = $('<td colspan="9">');

                        r.append(c.append(subride(instance, data, true)));

                        $(this).closest('tr').after(r);
                        
                    }                                        
                    
                }).data('data', rides[i]);
                
                var view = $('<button style="display:inline-block;margin:2px;">').button({
                    icons: {
                        primary: 'ui-icon-document'
                    },
                    text: false,
                    label: 'View Ride'                    
                });
                        
                view.click(function(){
                    
                }).data('data', rides[i]);
                //tr.append($('<td style="width:5%;text-align:center;">').append(data[i].id));
                //tr.append($('<td style="width:10%;text-align:center;">').append(update).append(view));
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
            
            // bind event to particular cell
            $('.owner').click(function() {
                var data = $(this).data('data');
                edit(instance, Models.users(), data.id, 'Ride Owner', false);
            });
            
        }
        
        return div;
        
    }
    
    function addRideForm(instance, data) {
        
        var div = $('<div>');
        var form = $('<form id="'+instance.id+'-add-ride-form" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');
                
        var table = $('<table class="ride-management rides add" width="100%" align="center">');
        
        var ride_name = $('<input type="text" id="'+instance.id+'-ride_name" name="'+instance.id+'-ride_name" class="required">');
        var ride_description = $('<input type="text" id="'+instance.id+'-ride_description" name="'+instance.id+'-ride_description" class="required">');
        var ride_owner = $('<select id="'+instance.id+'-ride_owner" name="'+instance.id+'-ride_owner" class="">');
        var ride_group = $('<select id="'+instance.id+'-ride_group" name="'+instance.id+'-ride_group" class="">');
        var ride_location = $('<select id="'+instance.id+'-ride_location" name="'+instance.id+'-ride_location" class="">');
        var ride_address = $('<select id="'+instance.id+'-ride_address" name="'+instance.id+'-ride_address" class="">');
        var ride_date = $('<input type="text" id="'+instance.id+'-ride_date" name="'+instance.id+'-ride_date" class="" style="padding-left:10px;">');
        var ride_time = $('<select id="'+instance.id+'-ride_time" name="'+instance.id+'-ride_time" class="">');
        var ride_status = $('<select id="'+instance.id+'-ride_status" name="'+instance.id+'-ride_status" class="">');
        var ride_join = $('<select id="'+instance.id+'-ride_join" name="'+instance.id+'-ride_join" class="">');
        var ride_tempo = $('<select id="'+instance.id+'-ride_tempo" name="'+instance.id+'-ride_tempo" class="">');
        var ride_drop = $('<select id="'+instance.id+'-ride_drop" name="'+instance.id+'-ride_drop" class="">');
        var ride_states = $('<select id="'+instance.id+'-ride_states" name="'+instance.id+'-ride_states" class="">');
        var ride_public = $('<select id="'+instance.id+'-ride_public" name="'+instance.id+'-ride_public" class="">');
        
        var update = $('<button id="'+instance.id+'-ride_update" class="ride-add-button">Update</button>').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Update'                                            
        }).click(function(e){
            e.preventDefault();
            $('#'+instance.id+'-add-ride-form').validate({
            });
            
            $('#'+instance.id+'-add-ride-form').submit();
            
        });
        
        var cancel = $('<button id="'+instance.id+'-ride_cancel" class="ride-add-button">Cancel</button>').button({
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
        var a1 = $('<td rowspan="8" valign="middle">').append($('<div class="ride-add-ad alley">'));
        var c1 = $('<td>').append($('<div class="label-02">').append('Name:'));
        var c2 = $('<td>').append(ride_name);
        var c3 = $('<td>').append($('<div class="label-02">').append('Date:'));
        var c4 = $('<td>').append(ride_date);
        var a2 = $('<td rowspan="8" valign="middle">').append($('<div class="ride-add-ad alley">'));
        row.append(a1).append(c1).append(c2).append(c3).append(c4).append(a2);
        table.append(row);
        
        // row 2
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Description:'));
        c2 = $('<td>').append(ride_description);
        c3 = $('<td>').append($('<div class="label-02">').append('Time:'));
        c4 = $('<td>').append(ride_time)
        row.append(c1).append(c2).append(c3).append(c4);               
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Owner:'));
        c2 = $('<td>').append(ride_owner);
        c3 = $('<td>').append($('<div class="label-02">').append('Status:'));
        c4 = $('<td>').append(ride_status);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 4
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Group:'));
        c2 = $('<td>').append(ride_group);
        c3 = $('<td>').append($('<div class="label-02">').append('Join:'));
        c4 = $('<td>').append(ride_join);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 5
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Location:'));
        c2 = $('<td>').append(ride_location);
        c3 = $('<td>').append($('<div class="label-02">').append('Tempo:'));
        c4 = $('<td>').append(ride_tempo);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
                
        // row 6
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('Address:'));
        c2 = $('<td>').append(ride_address);
        c3 = $('<td>').append($('<span class="label-02">').append('Drop:'));
        c4 = $('<td>').append(ride_drop);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 7
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('State:'));
        c2 = $('<td>').append(ride_states);
        c3 = $('<td>').append($('<span class="label-02">').append('Public:'));
        c4 = $('<td>').append(ride_public);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);  
        
        // row 8
        row = $('<tr>');
        c1 = $('<td colspan="4" align="center">').append(update).append(cancel);
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
                    /*
                    showOn: 'button',
                    buttonImage: '/images/common/calendar-icon.png',
                    buttonImageOnly: true,
                    buttonText: 'Select Date'
                    */
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
        
        ride_owner.selectmenu();
        ride_group.selectmenu();
        ride_location.selectmenu({
            change: function() {
                
                var id = $(this).val();

                server({
                    callback: function(data, instance){
                        log(instance, 'addRideForm', 'get addresses by location id', data);
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
        
        var div = $('<div>');
        var form = $('<form id="'+instance.id+'-edit-user-info-form" style="padding:0;margin:0;border: 0px solid #333;clear: both;">');
                
        var table = $('<table class="ride-management rides add" width="100%" align="center">');
        
        var ride_name = $('<input type="text" id="'+instance.id+'-ride_name" name="'+instance.id+'-ride_name" class="">');
        var ride_description = $('<input type="text" id="'+instance.id+'-ride_description" name="'+instance.id+'-ride_description" class="">');
        var ride_owner = $('<select id="'+instance.id+'-ride_owner" name="'+instance.id+'-ride_owner" class="">');
        var ride_group = $('<select id="'+instance.id+'-ride_group" name="'+instance.id+'-ride_group" class="">');
        var ride_location = $('<select id="'+instance.id+'-ride_location" name="'+instance.id+'-ride_location" class="">');
        var ride_address = $('<select id="'+instance.id+'-ride_address" name="'+instance.id+'-ride_address" class="">');
        var ride_date = $('<input type="text" id="'+instance.id+'-ride_date" name="'+instance.id+'-ride_date" class="" style="padding-left:10px;">');
        var ride_time = $('<select id="'+instance.id+'-ride_time" name="'+instance.id+'-ride_time" class="">');
        var ride_status = $('<select id="'+instance.id+'-ride_status" name="'+instance.id+'-ride_status" class="">');
        var ride_join = $('<select id="'+instance.id+'-ride_join" name="'+instance.id+'-ride_join" class="">');
        var ride_tempo = $('<select id="'+instance.id+'-ride_tempo" name="'+instance.id+'-ride_tempo" class="">');
        var ride_drop = $('<select id="'+instance.id+'-ride_drop" name="'+instance.id+'-ride_drop" class="">');
        var ride_states = $('<select id="'+instance.id+'-ride_states" name="'+instance.id+'-ride_states" class="">');
        var ride_public = $('<select id="'+instance.id+'-ride_public" name="'+instance.id+'-ride_public" class="">');
        
        var update = $('<button id="'+instance.id+'-ride_update" class="ride-add-button">Update</button>').button({
            icons: {
                primary: 'ui-icon-check'
            },
            text: true,
            label: 'Update'                                            
        }).click(function(e){
            e.preventDefault();
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
        var a1 = $('<td rowspan="8" valign="middle">').append($('<div class="user-edit-ad alley">'));
        var c1 = $('<td>').append($('<div class="label-02">').append('Name:'));
        var c2 = $('<td>').append(ride_name);
        var c3 = $('<td>').append($('<div class="label-02">').append('Date:'));
        var c4 = $('<td>').append(ride_date);
        var a2 = $('<td rowspan="8" valign="middle">').append($('<div class="user-edit-ad alley">'));
        row.append(a1).append(c1).append(c2).append(c3).append(c4).append(a2);
        table.append(row);
        
        // row 2
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Description:'));
        c2 = $('<td>').append(ride_description);
        c3 = $('<td>').append($('<div class="label-02">').append('Time:'));
        c4 = $('<td>').append(ride_time)
        row.append(c1).append(c2).append(c3).append(c4);               
        table.append(row);
        
        // row 3
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Owner:'));
        c2 = $('<td>').append(ride_owner);
        c3 = $('<td>').append($('<div class="label-02">').append('Status:'));
        c4 = $('<td>').append(ride_status);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 4
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Group:'));
        c2 = $('<td>').append(ride_group);
        c3 = $('<td>').append($('<div class="label-02">').append('Join:'));
        c4 = $('<td>').append(ride_join);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 5
        row = $('<tr>');
        c1 = $('<td>').append($('<div class="label-02">').append('Location:'));
        c2 = $('<td>').append(ride_location);
        c3 = $('<td>').append($('<div class="label-02">').append('Tempo:'));
        c4 = $('<td>').append(ride_tempo);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
                
        // row 6
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('Address:'));
        c2 = $('<td>').append(ride_address);
        c3 = $('<td>').append($('<span class="label-02">').append('Drop:'));
        c4 = $('<td>').append(ride_drop);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);
        
        // row 7
        row = $('<tr>');
        c1 = $('<td>').append($('<span class="label-02">').append('State:'));
        c2 = $('<td>').append(ride_states);
        c3 = $('<td>').append($('<span class="label-02">').append('Public:'));
        c4 = $('<td>').append(ride_public);
        row.append(c1).append(c2).append(c3).append(c4);                       
        table.append(row);  
        
        // row 8
        row = $('<tr>');
        c1 = $('<td colspan="4" align="center">').append(update).append(cancel);
        row.append(c1);
        table.append(row);        
        
        // add ad div to form top
        var ad = $('<div class="user-edit-ad top">');
        form.append(ad);
        
        // add middle components to form
        form.append(table);                  
        
        // add ad div to form bottom
        ad = $('<div class="user-edit-ad bottom">');
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
        
        ride_owner.selectmenu();
        ride_group.selectmenu();
        ride_location.selectmenu({
            change: function() {
                
                var id = $(this).val();

                server({
                    callback: function(data, instance){
                        log(instance, 'addRideForm', 'get addresses by location id', data);
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
    
    function edit(instance, model, id, title, display) {
        
        var div = $('<div class="rm-form">');
        
        server({
            callback: function(data, instance) {
                
                if (model) {

                    if (isArray(model.columns)) {

                        var form = $('<form id="'+instance.id+'-table-'+model.name+'">');

                        var t = $('<table width="100%">');
                        
                        var elements = [];

                        for (var i=0; i < model.columns.length; i++) {
                            var column = model.columns[i];
                            var r = $('<tr>');
                            var l = $('<td>');
                            var c = $('<td>');
                            var e = element(instance, column, model, data);
                            
                            elements.push(e);
                            
                            l.append(column.description + ':');
                            c.append(e);
                            r.append(l).append(c);

                            // disable field if we only want to display
                            if (display) e.prop('disabled', display);
                            // hide entire row if the column model calls for it
                            if (column.hide) {
                                r.css({"display":"none"});
                            }
                            
                            t.append(r);                                        
                        }
                        
                        // form validation stuff
                        
                        // add buttons
                        if (!display) {

                            var r = $('<tr>');
                            var c = $('<td align="center" colspan="2" style="padding-top:15px;">');
                            var submit = $('<button>Submit</button>').button().click(function(event){
                                
                                event.preventDefault();

                                var post = {};
                                $.each(elements, function(){
                                    var e = $(this);
                                    var c = $(this).data('column');
                                    var obj = {};
                                    obj[c.name] = e.val();
                                    $.extend(post, obj);
                                });

                                $.extend(post, {id: id, process: 'POST', oper: 'UPDATE'});
                                
                                server({
                                    callback: function(data, instance){
                                        log(instance, 'edit', 'post', data);
                                        if (data && isArray(data)) {
                                            var row = data[0];
                                            if (row.id > 0) {
                                                div.dialog('close');
                                                build(instance);                                                
                                            }
                                        }
                                    },
                                    data: post,
                                    url: model.url,
                                    type: 'post'
                                }, instance);
                                
                                
                            });
                            var cancel = $('<button>Cancel</button>').button().click(function(event){
                                event.preventDefault();
                                div.dialog('close');
                            });

                            c.append(submit).append(cancel);
                            r.append(c);
                            t.append(r);
                            
                        }
                        
                        form.append(t);                

                    }

                }

                div.append(form);

                div.dialog({
                    autoOpen: true,
                    close: function() {
                        $(this).dialog('destroy');
                    },
                    modal: true,
                    open: function() {
                        $('.rm-datepicker').datepicker({
                                    changeMonth: true,
                                    changeYear: true,
                                    dateFormat: 'mm/dd/yy',
                                    showOn: 'button',
                                    buttonImage: '/images/common/calendar-icon.png',
                                    buttonImageOnly: true,
                                    buttonText: 'Select Date'
                                }); 
                    },
                    title: (title) ? title : model.name,
                    width: 600

                });

                return div;                
                
            },
            data: {id: id, process: 'GET-ONE'},
            url: model.url,
            type: 'get'
        }, instance);                
        
    }
    
    function element(instance, column, model, data) {
        
        if (!column && !model) return $('<div>');
        
        var e;
        var m = function(instance, column, model) {
            return instance.id + '-' + model.name + '-' + column.name;
        };
        
        switch (column.type) {

            case 'date':
                e = $('<input id="'+m(instance, column, model)+'" name="'+m(instance, column, model)+'" class="rm-datepicker">');
                break;
            case 'password':
                e = $('<input id="'+m(instance, column, model)+'" name="'+m(instance, column, model)+'" type="password" maxlength="'+column.length+'">');
                break;
            case 'text':
                e = $('<input id="'+m(instance, column, model)+'" name="'+m(instance, column, model)+'" maxlength="'+column.length+'">').val(column.default);
                break;
            case 'select':
                e = $('<select id="'+m(instance, column, model)+'" name="'+m(instance, column, model)+'" maxlength="'+column.length+'">').val(column.default);                    
                if (column.options && isArray(column.options)) {
                    for (var i=0; i < column.options.length; i++) {
                        var option = column.options[i];
                        var key = option.key;
                        var value = option.value;
                        var o = $('<option>', {value: key}).text(value);
                        e.append(o);
                    }
                }
                break;
            default:
                e = $('<input id="'+m(instance, column, model)+'" name="'+m(instance, column, model)+'">').val(column.default);
                break;

        }            
        
        if (e && column.properties) {
            
            var props = column.properties;
            for (var name in props) {
                e.prop(name, props[name]);
            }
                        
        }
                
        if (e && isArray(data)) {
            e.val(data[0][column.name]);
            e.data('column',column);
        }
        
        return e;
        
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