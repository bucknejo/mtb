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
        $ajaxContext->initContext();                                        
        
    }
    
    public function indexAction() {

        
    }
    
    public function authenticateAction() {
        
        $table_name = 'users';        
        
        $email = $this->_getParam('email', 'Missing User ID');
        $password = $this->_getParam('password', '');

        $values = array(
            'email' => $email,
            'password' => $password,
        );

        $data = array();
        
        try {
            
            if ($this->getRequest()->isPost()) {

                if ($this->_process($table_name, $values)) {

                    $data["success"] = true; 
                    $data["message"] = "Authentication success";
                    $data["code"] = 0;                 

                } else {

                    $data["success"] = false; 
                    $data["message"] = "Authentication failed";
                    $data["code"] = -1;                 

                }            

            } else {

                $data["success"] = false; 
                $data["message"] = "Authentication failed.";
                $data["code"] = -2;                 

            }
                        
        } catch (Exception $ex) {

            $data["success"] = false; 
            $data["message"] = $ex->getMessage();
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
