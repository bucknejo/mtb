<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

    protected function _initResourceLoader() {
        $this->_resourceLoader->
                addResourceType('service', 'services', 'Service');

    }

    function _initControllerHelpers() {

        // Action Helpers
        Zend_Controller_Action_HelperBroker::addPath(
            APPLICATION_PATH .'/controllers/helpers');


    }

    function _initConfig() {

        $config = new Zend_Config_Ini(
                APPLICATION_PATH. '/configs/config.ini',
                APPLICATION_ENV);
        Zend_Registry::set('config', $config);
        return $config;

    }
    
    protected function _initPlugins() {

        try {
            
            //$front = Zend_Controller_Front::getInstance();
            //$front->registerPlugin(new JEB_SSL_Plugin_SSL(), 1);
            //$front->registerPlugin(new JEB_Controller_Plugin_ACL(), 1);

            
        } catch (Exception $e) {
            
        }
        
    }    
    

}

