<?php

class Application_Plugin_CSRFTokenGenerate extends Zend_Controller_Plugin_Abstract {
        
    public function preDispatch(Zend_Controller_Request_Abstract $request) {
            
        try {
            
            $config = Zend_Registry::get('config');                
            $active = $config->authentication->active;
            $timeout = $config->authentication->timeout;
            
            $csrf = new Zend_Session_Namespace("csrf");
            $csrf->setExpirationSeconds($timeout * 60);
            $csrf->token = md5(uniqid(rand(), TRUE));
            
                                    
        } catch (Exception $e) {
            
                        
        }
    }
        
    public static function _getResource($request) {
        
        $module = $request->getModuleName();
        $controller = $request->getControllerName();
        $action = $request->getActionName();
        
        return $module."::".$controller."::".$action;
                
    }
    
    public static function _checkSSL($request) {
        
        $isSSL = false;
        
        $config = Zend_Registry::get('config');            
        $ssl = $config->ssl->switch;        

        $log = JEB_Lib_Log::get();

        if (APPLICATION_ENV == 'production' && $ssl) {

        }        
        
        return $isSSL;
                
    }

}

?>
