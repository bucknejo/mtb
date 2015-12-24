<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class Zend_Controller_Action_Helper_Utilities extends Zend_Controller_Action_Helper_Abstract {

    /*
    private static $PBKDF2_HASH_ALGORITHM;
    private static $PBKDF2_ITERATIONS;
    private static $PBKDF2_SALT_BYTE_SIZE;
    private static $PBKDF2_HASH_BYTE_SIZE;
    
    private static $HASH_SECTIONS;
    private static $HASH_ALGORITHM_INDEX;
    private static $HASH_ITERATION_INDEX;
    private static $HASH_SALT_INDEX;
    private static $HASH_PBKDF2_INDEX;
    */
    
    const PBKDF2_HASH_ALGORITHM = "sha256";
    const PBKDF2_ITERATIONS = 1000;
    const PBKDF2_SALT_BYTE_SIZE = 24;
    const PBKDF2_HASH_BYTE_SIZE = 24;

    const HASH_SECTIONS = 4;
    const HASH_ALGORITHM_INDEX = 0;
    const HASH_ITERATION_INDEX = 1;
    const HASH_SALT_INDEX = 2;
    const HASH_PBKDF2_INDEX = 3;
    
    function __construct() {
                
    }
    
    public function create_salt() {
        $salt = base64_encode(mcrypt_create_iv(self::PBKDF2_SALT_BYTE_SIZE, MCRYPT_DEV_URANDOM));
        return $salt;
    }
    
    public function create_hash($password, $salt) {
        $hash = md5($password.$salt);
        return $hash;
    }
            
    public function arrayitize($result) {
        
        $array = array();
        
        $array[] = "0:[Select Value]";
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
