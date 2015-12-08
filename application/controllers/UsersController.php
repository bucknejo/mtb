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
        
        $x = 1;
        
        $id = $this->_getParam("id", 0);
        
        if ($this->getRequest()->isPost()) {
            
        }
        
        
    }

    public function usersAction() {
        
        $mapper = new Application_Model_TableMapper();
        $table_name = "users";
        $id = $this->_getParam("id");
        $process = $this->_getParam("process");
        $oper = $this->_getParam("oper");
        
        switch ($process) {
            case "GET-ONE":
                $data = $mapper->getItemById($table_name, $id);
                break;
            case "POST":
                //$date_created = $this->_getParam("date_created");
                //$last_updated = $this->_getParam("last_updated");
                //$active = $this->_getParam("active");
                $user_name_internal = $this->_getParam("user_name_internal");
                $user_name_external = $this->_getParam("user_name_external");
                $first_name = $this->_getParam("first_name");
                $last_name = $this->_getParam("last_name");
                $password = $this->_getParam("password");
                $role_id = $this->_getParam("role_id");
                $email = $this->_getParam("email");
                $data = array(
                    "user_name_internal" => $user_name_internal,
                    "user_name_external" => $user_name_external,
                    "first_name" => $first_name,
                    "last_name" => $last_name,
                    "password" => $password,
                    "role_id" => $role_id,
                    "email" => $email                    
                );
                
                if ($oper == "UPDATE") {
                    $i = $mapper->updateItem($table_name, $data, $id);
                    if ($i > 0) {
                        $data = $mapper->getItemById($table_name, $id);
                    }
                }
                break;
            default:
                $data = array();
                break;
        }
                       
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }
    
    
    
}