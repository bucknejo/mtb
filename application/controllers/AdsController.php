<?php

class AdsController extends Zend_Controller_Action 
{

    public function init()
    {
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('main', 'json');
        $ajaxContext->initContext();                                
    }
    
    public function indexAction() 
    {
                
    }
    
    public function mainAction() 
    {
        
        $priority = $this->_getParam("priority");        
        
        $mapper = new Application_Model_TableMapper();
        $data = array();
        $query = "select * from ads ";
        $query .= "where priority = $priority;";
        //$query .= " ";
        //$query .= " ";
        //$query .= " ";
        $ads = $mapper->getCustomSelect($query);
        $data["ads"] = $ads;
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                
        
    }
    
    
}