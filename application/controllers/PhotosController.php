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
        $ajaxContext->addActionContext('remove', 'json');
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
    
    public function removeAction()
    {
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", -1);
                    $url = $this->_getParam("url", "");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "photos";
                    
                    $i = $mapper->deleteItem($table_name, $id);
                    
                    if ($i > 0) {
                        
                        // try to unlink() the file
                        if (!empty($url)) {
                            $remove = realpath(APPLICATION_PATH . "/../public/users/$user_id/photos/$url");                            
                            unlink($remove);
                        }
                    
                        $data["success"] = true;
                        $data["message"] = "Photo deleted: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Photo could not be deleted: $id";
                        $data["success"] = false;
                        $data["message"] = "Photo could not be deleted: $id";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
                    }
                    
                } else {
                
                    $error = array();
                    $error["code"] = "102";
                    $error["message"] = "Possible security violation.  Please check log(s).";
                    $data["success"] = false;
                    $data["message"] = "Bad HTTP Request Type.";
                    $data["code"] = 102;
                    $data["error"] = $error;
                    
                }
                
            } else {
             
                $error = array();
                $error["code"] = "100";
                $error["message"] = "User is not authenticated.";
                $data["success"] = false;
                $data["message"] = "Friend update fail.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Photo delete exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();        
        
    }
    
    public function uploadAction() 
    {
        $data = array();
        
        try {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $id = $auth->getIdentity()->id;
            }

            if ($user_id > 0) {
                $destination = realpath(APPLICATION_PATH . "/../public/users/$user_id/photos/");

                $response = Application_Plugin_Lib::upload($destination);            
                
                if ($response["success"]) {
                    $data["jsonrpc"] = "2.0";
                    $data["result"] = null;
                    $data["id"] = "id"; 
                    
                    // TODO - insert into photos table
                    if ($response["filedetails"] != null) {
                        
                        $filedetails = $response["filedetails"];
                        $table_name = "photos";
                        $mapper = new Application_Model_TableMapper();
                        
                        $date = date('Y-m-d');
                        
                        $values = array(
                            "date_created" => $date,
                            "last_updated" => $date,                            
                            "active" => 1,
                            "user_id" => intval($user_id),
                            "ride_id" => 0,
                            "url" => $filedetails["name"],
                            "alt" => "",
                            "height" => 0,
                            "width" => 0,
                            "description" => ""
                        );                       
                        
                        $i = $mapper->insertItem($table_name, $values);
                    }
                    
                } else {
                    $error = array();
                    $error["message"] = $response["message"];
                    $error["code"] = $response["code"];
                    $data["jsonrpc"] = "2.0";
                    $data["error"] = $error;
                    $data["id"] = "id";                                        
                }
                
                
            } else {
                
                $error = array();
                $error["code"] = "100";
                $error["message"] = "User is not authenticated.";
                $data["jsonrpc"] = "2.0";
                $data["error"] = $error;
                $data["id"] = "id";
                
            }
                                        
        } catch (Exception $ex) {
            
            $error = array();
            $error["code"] = $ex->getCode();
            $error["message"] = $ex->getMessage();
            $data["jsonrpc"] = "2.0";
            $data["error"] = $error;
            $data["id"] = "id";
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();        
    }
            
}
