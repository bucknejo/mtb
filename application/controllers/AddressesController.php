<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class AddressesController extends Zend_Controller_Action 
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
        
        $data = array();
        $selects = array();
        
        $id = $this->_getParam('id', 0);        
        
        // addresses
        $query = "select concat(id, ':', description) as 'option' ";
        $query .= "from addresses ";
        $query .= "where location_id = $id;";
        
        $mapper = new Application_Model_TableMapper();
        $addresses = $mapper->getCustomSelect($query);        
        $selects["addresses"] = $this->_helper->utilities->arrayitize($addresses);

        $data["selects"] = $selects;        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
                
    }
    
    public function postAction() {
        
    }
    
    
}