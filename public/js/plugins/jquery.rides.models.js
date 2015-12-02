var Models = function(){
   
    var users = {
        columns: [
            {
                name: 'id',
                datatype: 'int',
                defaultvalue: '',
                description: 'ID',
                hide: true,
                length: 0,
                options: [],
                properties: {disabled:true},
                rules: [],
                type: 'text'
            },
            {
                name: 'date_created',
                datatype: 'date',
                defaultvalue: '',
                description: 'Date Created',
                hide: true,
                length: 0,
                options: [],
                properties: {disabled:true},
                rules: [],
                type: 'text'
            },
            {
                name: 'last_updated',
                datatype: 'date',
                defaultvalue: '',
                description: 'Last Updated',
                hide: true,
                length: 0,
                options: [],
                properties: {disabled:true},
                rules: [],
                type: 'text'                
            },
            {
                name: 'active',
                datatype: 'int',
                defaultvalue: '',
                description: 'Active',
                hide: true,
                length: 0,
                options: [],
                properties: {disabled:true},
                rules: [],
                type: 'text'                
            },
            {
                name: 'user_name_internal',
                datatype: 'string',
                defaultvalue: '',
                description: 'User Name (Internal)',
                hide: false,
                length: 255,
                options: [],
                properties: {},
                rules: ['required'],
                type: 'text'                
            },
            {
                name: 'user_name_external',
                datatype: 'string',
                defaultvalue: '',
                description: 'User Name (External)',
                hide: false,
                length: 255,
                options: [],
                properties: {},
                rules: ['required'],
                type: 'text'                
            },
            {
                name: 'first_name',
                datatype: 'string',
                defaultvalue: '',
                description: 'First Name',
                hide: false,
                length: 255,
                options: [],
                properties: {},
                rules: ['required'],
                type: 'text'                                
            },
            {
                name: 'last_name',
                datatype: 'string',
                defaultvalue: '',
                description: 'Last Name',
                hide: false,
                length: 255,
                options: [],
                properties: {},
                rules: ['required'],
                type: 'text'                                
            },
            {
                name: 'password',
                datatype: 'string',
                defaultvalue: '',
                description: 'Password',
                hide: false,
                length: 45,
                options: [],
                properties: {},
                rules: ['required'],
                type: 'password'                                
            },
            {
                name: 'role_id',
                datatype: 'int',
                defaultvalue: '',
                description: 'Role',
                hide: false,
                length: 0,
                options: [{key: 0, value: 'Admin'}, {key: 1, value: 'User'}],
                properties: {},
                rules: [],
                type: 'select'                                
            },
            {
                name: 'email',
                datatype: 'string',
                defaultvalue: '',
                description: 'Email',
                hide: false,
                length: 255,
                options: [],
                properties: {},
                rules: ['required', 'email'],
                type: 'text'                                
            }
        ],
        name: 'users',
        urls: {
            get: 'users/users',
            post: 'users/save'
        }
    };
    
    var rides = {
        columns: [
            {
                name: '',
                datatype: '',
                defaultvalue: '',
                description: '',
                hide: false,
                length: 0,
                options: [{key: 0, value: ''}, {key: 1, value: ''}],
                properties: {},
                rules: [],
                type: ''                                
            }   
        ],
        name: 'rides',
        urls: {
            get: 'rides/rides',
            post: 'rides/save'
        }
    };
    
    var locations = {
        name: 'locations',
        urls: {
            get: 'rides/locations/id/'
        }        
    };
    
    var addresses = {
        name: 'addresses',
        urls: {
            get: 'rides/addresses/id/'
        }        
    };
    
    var groups = {
        name: 'groups',
        urls: {
            post: 'groups/save'
        }
    }
    

    function getUsers() {
        return users;
    }
    
    function getRides() {
        return rides;
    }
    
    function getLocations() {
        return locations;
    }
    
    function getAddresses() {
        return addresses;
    }
    
    function getGroups() {
        
    }
    
    return {
        users: getUsers,
        rides: getRides,
        locations: getLocations,
        addresses: getAddresses,
        groups: getGroups
    };
    
}();