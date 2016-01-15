<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class RidersController extends Zend_Controller_Action
{
    
    public function init()
    {
        
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('get', 'json');
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->initContext();                                
        
    }
    
    public function getAction()
    {
        
        $data = array();
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }
    
    public function postAction()
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $d = date('Y-m-d');
                                        
                    $ride_id = $this->_getParam("id", "");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "date_created" => $d,
                        "last_updated" => $d,
                        "active" => 1,
                        "ride_id" => $ride_id,
                        "user_id" => $user_id,
                        "group_id" => 0,
                        "rsvp" => 0,
                        "status" => "ON TIME",
                        "complete" => 0,
                        "rating" => 0,                        
                    );
                    
                    $i = $mapper->insertItem($table_name, $values);
                    
                    $id = $mapper->getLastInsertId($table_name);
                                        
                    if ($i > 0) {
                        
                        $data["success"] = true;
                        $data["message"] = "Rider added: $id";
                        $data["code"] = 0;                                                    
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Ride could not be added.";
                        $data["success"] = false;
                        $data["message"] = "Ride could not be added.";
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
                $data["message"] = "Rider add fail.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Rider add exception.";
            $data["error"] = $error;
            
        }
        
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }
    
    
}
