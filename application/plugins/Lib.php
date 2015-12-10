<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Application_Plugin_Lib
{
    
    public static function loggedInAs() {
        
        $auth = Zend_Auth::getInstance();
        
        $link = "<li><a href=\"/login\" class=\"\" >Login</a></li>";
                
        if ($auth->hasIdentity()) {
            $link = "<li><a href=\"/rides\" class=\"\" >Dashboard</a></li>";
            $link .= "<li><a href=\"/login/logout\" class=\"\" >Logout</a></li>";
        }        
        
        return $link;
        
    }
    
}
