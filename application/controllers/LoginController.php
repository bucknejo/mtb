<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class LoginController extends Zend_Controller_Action
{

    public function init() {
        
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('get', 'json');
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->addActionContext('authenticate', 'json');
        $ajaxContext->addActionContext('register', 'json');
        $ajaxContext->initContext();                                        
        
    }
    
    public function indexAction() {

        
    }
    
    public function logoutAction() {
        Zend_Session::namespaceUnset("csrf");
        Zend_Auth::getInstance()->clearIdentity();
        $this->_helper->redirector('index', 'login', 'default');        
    }
    
    public function registerAction() {

        
        $email = $this->_getParam('email', 'Missing User ID');
        $password = $this->_getParam('password', '');
        
        $data = array();
        
        try {
            
            $date = date('Y-m-d');
            
            $salt = $this->_helper->utilities->create_salt();
            $hash = $this->_helper->utilities->create_hash($password, $salt);
            
            $insert = array(
                "date_created" => $date,
                "last_updated" => $date,
                "active" => 1,
                "user_name_internal" => "",
                "user_name_external" => "",
                "first_name" => "",
                "last_name" => "",
                "password" => $hash,
                "role_id" => 1,
                "email" => $email,
                "skill" => "Beginner",
                "experience" => 0,
                "type" => "Mellow",
                "guide" => 0,
                "salt" => $salt,
                "viewable" => "",
                "avatar" => "",                
                "gender" => "M"
            );
            
            $mapper = new Application_Model_TableMapper();
            $table_name = "users";
            
            $i = $mapper->insertItem($table_name, $insert);
            
            if ($i > 0) {
                $query = "select * from users where email='$email';";
                $users = $mapper->getCustomSelect($query);
                
                if (count($users) > 0) {
                    
                    $values = array(
                        'email' => $email,
                        'password' => $hash,
                    );
                                        
                    if ($this->_process($table_name, $values)) {

                        $data["success"] = true; 
                        $data["message"] = "Registration success";
                        $data["code"] = 0;                 

                    } else {

                        $data["success"] = false; 
                        $data["message"] = "Account created, authentication failed";
                        $data["code"] = -1;                 

                    }                                                    
                    
                }
                
            }
                                                           
        } catch (Exception $ex) {

            $data["success"] = false; 
            $data["message"] = "Registration failed: ".$ex->getMessage();
            $data["code"] = $ex->getCode();                 
            
        }
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();        
        
        
    }
    
    public function authenticateAction() {
        
        $mapper = new Application_Model_TableMapper();
        $table_name = 'users';        
        
        $email = $this->_getParam('email', 'Missing User ID');
        $password = $this->_getParam('password', '');

        $data = array();
        
        try {
            
            $salt = $this->_helper->utilities->create_salt();
            $hash = $this->_helper->utilities->create_hash($password, $salt);
        
            $query = "select * from users where email='$email';";
            $users = $mapper->getCustomSelect($query);

            if (count($users) > 0) {
                $user = $users[0];
                $salt = $user["salt"];
                $key = $user["password"];

                $hash = $this->_helper->utilities->create_hash($password, $salt); 

                if ($key == $hash) {

                    $values = array(
                        'email' => $email,
                        'password' => $key,
                    );

                    if ($this->getRequest()->isPost()) {

                        if ($this->_process($table_name, $values)) {

                            $data["success"] = true; 
                            $data["message"] = "Authentication success";
                            $data["code"] = 0;                 

                        } else {

                            $data["success"] = false; 
                            $data["message"] = "Authentication failed: Invalid user id or password.";
                            $data["code"] = -1;                 

                        }            

                    } else {

                        $data["success"] = false; 
                        $data["message"] = "Authentication failed: GET request detected.";
                        $data["code"] = -2;                 

                    }                

                } else {
                    
                    $data["success"] = false; 
                    $data["message"] = "Authentication failed: Password does not match user id.";
                    $data["code"] = -3;                 
                    
                }                                

            } else {
                
                $data["success"] = false; 
                $data["message"] = "Authentication failed: Could not find account associated with provided email [$email].";
                $data["code"] = -4;                 
                
            }
                        
        } catch (Exception $ex) {

            $data["success"] = false; 
            $data["message"] = "Authentication failed: ".$ex->getMessage();
            $data["code"] = $ex->getCode();                 
            
        }
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();        
        
    }
    
    protected function _process($table_name, $values) {
        
        $config = Zend_Registry::get('config');                
        $active = $config->authentication->active;
        $timeout = $config->authentication->timeout;
        
        // by-pass authetication
        if ($active == 0) {
            return true;            
        }
        
        $adapter = $this->_getAuthAdapter($table_name);
        $adapter->setIdentity($values['email']);
        //$adapter->setCredential(md5($values['password']));
        $adapter->setCredential($values['password']);

        $auth = Zend_Auth::getInstance();
        $result = $auth->authenticate($adapter);
        if ($result->isValid()) {
            $user = $adapter->getResultRowObject();
            $auth->getStorage()->write($user);
            $session = new Zend_Session_Namespace('auth');
            $session->setExpirationSeconds($timeout * 60);
            return true;
        }
        return false;
    }

    protected function _getAuthAdapter($table_name) {
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);

        $authAdapter->setTableName($table_name);
        $authAdapter->setIdentityColumn('email');
        $authAdapter->setCredentialColumn('password');

        return $authAdapter;
    }
    
    
}
