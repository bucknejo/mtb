<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Application_Plugin_CSRFTokenValidate extends Zend_Controller_Plugin_Abstract
{
    
    public function preDispatch(Zend_Controller_Request_Abstract $request) {
            
        try {
            
            $config = Zend_Registry::get('config');                
            $active = $config->authentication->active;
            $csrf = new Zend_Session_Namespace("csrf");
            
            if ($active == 1) {
                
                $token = $request->getParam("token");
                $cache = $csrf->token;
                
                if ($cache == $token) {
                    $csrf->authorized = "1";
                } else {
                    $csrf->authorized = "0";
                }
            
            } else {
                $csrf->authorized = "1";                
            }
                        
        } catch (Exception $ex) {

        }
        
    }
                                                    
}