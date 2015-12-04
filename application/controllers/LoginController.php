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
        $ajaxContext->initContext();                                        
        
    }
    
    public function indexAction() {

        $table_name = 'users';        
        
        $user_id = $this->_getParam('user_id', 'Missing User ID');
        $password = $this->_getParam('password', '');

        $values = array(
            'user_id' => $user_id,
            'password' => $password,
        );

        if ($this->getRequest()->isPost()) {
            
            if ($this->_process($table_name, $values)) {
                $auth = Zend_Auth::getInstance();
            } else {
                $message = "Cannot Authenticate: " . $values['user_id'];
            }
            
            
        } else {
            
        }
        
        
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
        $adapter->setIdentity($values['user_id']);
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
        $authAdapter->setIdentityColumn('user_id');
        $authAdapter->setCredentialColumn('password');

        return $authAdapter;
    }
    
    
}
