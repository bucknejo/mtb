<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class PhotosController extends Zend_Controller_Action
{
    
    public function init()
    {
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('get', 'json');
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->addActionContext('upload', 'json');
        $ajaxContext->initContext();                                
    }
    
    public function getAction()
    {
        $data = array();  
        
        $auth = Zend_Auth::getInstance();
        
        $user_id = 0;
        
        if ($auth->hasIdentity()) {
            $user_id = $id = $auth->getIdentity()->id;
        } 
        
        $mapper = new Application_Model_TableMapper();
        // user
        $query = "select a.* ";
        $query .= "from photos a ";
        $query .= "where a.user_id = $user_id;";        
        $data["photos"] = $mapper->getCustomSelect($query);
        
        $path = "/users/$user_id/photos/";
        $data["path"] = $path;

        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();        
        
    }
    
    public function postAction()
    {
        
    }
    
    public function uploadAction() 
    {
        $data = "";
        
        try {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $id = $auth->getIdentity()->id;
            }

            if ($user_id > 0) {
                $destination = realpath(APPLICATION_PATH . "/../public/users/$user_id/photos/");

                $data = Application_Plugin_Lib::upload($destination);            
            } else {
                $data = '{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "User is not authenticated."}, "id" : "id"}';
            }
                                        
        } catch (Exception $ex) {
            $data = '{"jsonrpc" : "2.0", "error" : {"code": '.$ex->getCode().', "message": "'.$ex->getMessage().'"}, "id" : "id"}';
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();        
    }
            
}
