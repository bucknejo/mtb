<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class UsersController extends Zend_Controller_Action 
{

    public function init()
    {
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('users', 'json');
        $ajaxContext->addActionContext('get', 'json');
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->initContext();                                
    }
    
    public function getAction() {
        
    }
    
    public function postAction() {
        
        $mapper = new Application_Model_TableMapper();
        $table_name = "users";        
        
        $data = array();
        
        try {
            
            if ($this->getRequest()->isPost()) {
                
                $auth = Zend_Auth::getInstance();

                $user_id = 0;

                if ($auth->hasIdentity()) {
                    $user_id = $id = $auth->getIdentity()->id;
                    
                    $values = array(
                        "first_name" => $this->_getParam("first_name", ""),
                        "last_name" => $this->_getParam("last_name", ""),
                        //"email" => $this->_getParam("email", ""),
                        "gender" => $this->_getParam("gender", ""),
                        "skill" => $this->_getParam("skill", ""),
                        "experience" => $this->_getParam("experience", ""),
                        "type" => $this->_getParam("type", ""),                    
                        "viewable" => $this->_getParam("viewable", "")                                        
                    );

                    $i = $mapper->updateItem($table_name, $values, $user_id);
                    if ($i > 0) {
                        $data["user"] = $mapper->getItemById($table_name, $user_id);
                        $data["success"] = true;
                        $data["message"] = "Success";
                        $data["code"] = 0;
                    } else {                    
                        $data["user"] = $mapper->getItemById($table_name, $user_id);
                        $data["success"] = true;
                        $data["message"] = "Row data is unchanged.";
                        $data["code"] = 0;                    
                    }               
                    
                } else {
                    $data["success"] = false;
                    $data["message"] = "Authentication failed.";
                    $data["code"] = -3;                                        
                }
                                
            } else {
                
                $data["success"] = false;
                $data["message"] = "An illegal HTTP method has been attempted.  The event has been logged with security.  Please make arrangements to retain legal counsel.";
                $data["code"] = -1;
                
            }
                        
        } catch (Exception $ex) {
            $data["success"] = false;
            $data["message"] = "".$ex->getMessage();
            $data["code"] = $ex->getCode();
        }
                       
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }

    public function usersAction() {
        
        $data = array();
        
        $data["success"] = true;
        $data["message"] = "user action";
        $data["code"] = 0;
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }
    
    
    
}