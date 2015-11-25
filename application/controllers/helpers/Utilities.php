<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Zend_Controller_Action_Helper_Utilities extends Zend_Controller_Action_Helper_Abstract {
    
    public function arrayitize($result) {
        
        $array = array();
        
        if (count($result) > 0) {
            
            foreach($result as $options) {
                foreach($options as $option) {
                    $array[] = $option;
                }                
            }
            
        }
                
        return $array;
        
    }
    
}
