<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class FriendsController extends Zend_Controller_Action
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
    
    public function getAction() {
        
        
        
    }
    
    public function postAction() {
        
        $data = array();
        
        try 
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $friends = $this->_getParam("friends");
                    $ids = explode('|', $friends);
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "friends";

                    $date = date('Y-m-d');
                    foreach ($ids as $id) {
                        
                        $values = array(
                            "date_created" => $date,
                            "last_updated" => $date,
                            "active" => 1,
                            "user_id" => $user_id,
                            "friend_id" => $id,
                            "clique_id" => 0
                        );
                        
                        $i = $mapper->insertItem($table_name, $values);
                        
                        $failed = array();
                        if ($i <= 0) {
                            array_push($failed, $id);
                        }
                    }
                    
                    if (count($failed) > 0) {
                        
                        $error = array();
                        $error["code"] = "101";
                        $error["message"] = "Failed to add: ".join($failed, ",");
                        $data["success"] = false;
                        $data["message"] = "Some friends failed to add.";
                        $data["code"] = 101;
                        $data["error"] = $error;
                        
                    } else {
                        
                        $data["success"] = true;
                        $data["message"] = "Friends added successfully!";
                        $data["code"] = 0;
                        
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
                $data["error"] = $error;
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Friend add exception.";
            $data["error"] = $error;
            
        }
                
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();        
        
        
    }
    
    
}
