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
            
            $token = $request->getParam("token");
            $csrf = new Zend_Session_Namespace("csrf");
            
            $cache = $csrf->token;
            
            if ($cache == $token) {
                $x = "we're good.";
            } else {
                $x = "we're cheating";
            }
                                    
        } catch (Exception $ex) {

        }
        
    }
                                                    
}