<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class GroupsController extends Zend_Controller_Action 
{

    public function init()
    {
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('get', 'json');
        $ajaxContext->addActionContext('save', 'json');
        //$ajaxContext->setAutoJsonSerialization(false);
        $ajaxContext->initContext();                                
    }
    
    public function indexAction() 
    {
                
    }
    
    public function getAction() 
    {
        $user_id = 1;
        $id = $this->_getParam("id", 0);
        
        $mapper = new Application_Model_TableMapper();        
        $data = array();    
        $query = "select * ";
        $query .= "from groups ";
        $query .= "where id = $id;";
        $data["group"] = $mapper->getCustomSelect($query);
        
        $query = "select a.*, ";
        $query .= "(select first_name from users where id = a.user_id) as 'first_name', ";
        $query .= "(select last_name from users where id = a.user_id) as 'last_name', ";
        $query .= "(select skill from users where id = a.user_id) as 'skill', ";
        $query .= "(select experience from users where id = a.user_id) as 'experience', ";
        $query .= "(select type from users where id = a.user_id) as 'type' ";
        $query .= "from group_members a ";
        $query .= "where group_id = $id;";        
        $data["members"] = $mapper->getCustomSelect($query);
        
        // friends
        $query = "select a.*, ";
        $query .= "(select first_name from users where id = a.friend_id) as 'first_name', ";
        $query .= "(select last_name from users where id = a.friend_id) as 'last_name', ";
        $query .= "(select email from users where id = a.friend_id) as 'email', ";
        $query .= "(select skill from users where id = a.friend_id) as 'skill', ";
        $query .= "(select experience from users where id = a.friend_id) as 'experience', ";
        $query .= "(select type from users where id = a.friend_id) as 'type', ";
        $query .= "(select guide from users where id = a.friend_id) as 'guide' ";
        $query .= "from	friends a ";
        $query .= "where user_id = $user_id; ";
        $data["friends"] = $mapper->getCustomSelect($query);
                
        // drop downs
        $selects = array();
        $config = Zend_Registry::get('config');                
        
        // join
        $joinable = explode('|', $config->codes->joinable);
        $selects["joinable"] = $joinable;
        
        // lockable
        $locked = explode('|', $config->codes->rides->locked);
        $selects["locked"] = $locked;
        
        // public
        $public = explode('|', $config->codes->public);
        $selects["public"] = $public;
                                
        // ride types
        $ridetypes = explode('|', $config->codes->rides->types);
        $selects["ridetypes"] = $ridetypes;
        
        // deputies
        $query = "select concat(b.user_id, ':', b.last_name, ', ', b.first_name) as 'option' ";
        $query .= "from  ";
        $query .= "(select a.*, ";
        $query .= "(select first_name from users where id = a.user_id) as 'first_name', ";
        $query .= "(select last_name from users where id = a.user_id) as 'last_name', ";
        $query .= "(select skill from users where id = a.user_id) as 'skill' ";
        $query .= "from group_members a ";
        $query .= "where a.group_id = $id) b; ";
        $deputies = $mapper->getCustomSelect($query);        
        $selects["deputies"] = $this->_helper->utilities->arrayitize($deputies);        
        
        $data["selects"] = $selects;
        
        $this->view->data = json_encode($data);        
	$this->view->layout()->disableLayout();        
        
    }
    
    public function saveAction()
    {

        $data = array();
        
        $this->view->data = json_encode($data);        
	$this->view->layout()->disableLayout();        
        
    }
    
}