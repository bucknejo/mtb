var HLUser = function() {
    
    var user = {};
    
    function setUser(user) {
        this.user = user;
    }
    
    function getUser() {
        return this.user;
    }
    
    return {
        setUser: setUser,
        getUser: getUser
    };
    
}();