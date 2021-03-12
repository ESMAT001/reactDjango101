class Auth{
    constructor(){
        this.authenticated = false;
    }
    login(fn){
        this.authenticated=true;
        fn()
    }
    logout(fn){
        this.authenticated=false;
        fn()
    }
    isAuthenticated(){
        return this.authenticated;
    }
}

export default new Auth();