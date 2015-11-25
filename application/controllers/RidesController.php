<?php

class RidesController extends Zend_Controller_Action {
    
    public function init()
    {
        $config = Zend_Registry::get('config');                
        $title = $config->site->title->home;
        $this->view->headTitle($title);
        
        $ajaxContext = $this->_helper->getHelper('AjaxContext');
        $ajaxContext->addActionContext('main', 'json');
        $ajaxContext->addActionContext('users', 'json');
        $ajaxContext->addActionContext('addresses', 'json');
        //$ajaxContext->setAutoJsonSerialization(false);
        $ajaxContext->initContext();                                
    }
    
    public function indexAction() 
    {
                
    }
    
    public function mainAction() {
        
        $mapper = new Application_Model_TableMapper();
        
        $data = array();    
        
        $user_id = 1;
        
        $query = "select a.* ";
        $query .= "from users a ";
        $query .= "where id = $user_id;";        
        $data["user"] = $mapper->getCustomSelect($query);
        
        $query = "select a.*, ";
        $query .= "(select concat_ws(', ', last_name, first_name) from users where id = a.owner) as 'owner_name', ";
        $query .= "(select name from groups where id = a.group_id) as 'group_name', ";
        $query .= "(select name from locations where id = a.location_id) as 'location_name' ";
        $query .= "from rides a;";        
        $data["rides"] = $mapper->getCustomSelect($query);
                
        // get codes for drop downs
        $selects = array();
        $config = Zend_Registry::get('config');                
        
        // states
        $states = explode('|', $config->codes->states);
        $selects["states"] = $states;
        
        // status
        $status = explode('|', $config->codes->status);
        $selects["status"] = $status;
        
        // join
        $joinable = explode('|', $config->codes->joinable);
        $selects["joinable"] = $joinable;
        
        // tempo
        $tempo = explode('|', $config->codes->tempo);
        $selects["tempo"] = $tempo;
        
        // drop
        $drop = explode('|', $config->codes->drop);
        $selects["drop"] = $drop;
        
        // public
        $public = explode('|', $config->codes->public);
        $selects["public"] = $public;
        
        // groups
        $query = "select concat(id, ':', name) as 'option' ";
        $query .= "from groups ";
        $query .= "where owner = $user_id;";
        $groups = $mapper->getCustomSelect($query);        
        $selects["groups"] = $this->_helper->utilities->arrayitize($groups);
        
        // locations
        $query = "select concat(id, ':', name) as 'option' ";
        $query .= "from locations a ";
        $query .= "where a.address_id in (select id from addresses where state = 'NJ');";
        $locations = $mapper->getCustomSelect($query);        
        $selects["locations"] = $this->_helper->utilities->arrayitize($locations);
        
        // addresses
        $query = "select concat(id, ':', description) as 'option' ";
        $query .= "from addresses a ";
        $query .= "where a.location_id = 2;";
        $addresses = $mapper->getCustomSelect($query);        
        $selects["addresses"] = $this->_helper->utilities->arrayitize($addresses);
                        
        $data["selects"] = $selects;
                
        $this->view->data = json_encode($data);
        
        //$this->_helper->viewRenderer->setNoRender(true);
	$this->view->layout()->disableLayout();        
                
    }
    
    public function ridesAction() {

        $mapper = new Application_Model_TableMapper();
        
        $id = $this->_getParam("id");
        $query = "select a.*, ";
        $query .= "(select concat_ws(', ', last_name, first_name) from users where id = a.owner) as 'owner_name', ";
        $query .= "(select name from groups where id = a.group_id) as 'group_name', ";
        $query .= "(select name from locations where id = a.location_id) as 'location_name', ";
        $query .= "(select description from addresses where id = a.address_id) as 'address_description', ";
        $query .= "(select type from addresses where id = a.address_id) as 'address_type', ";
        $query .= "(select street from addresses where id = a.address_id) as 'address_street', ";
        $query .= "(select city from addresses where id = a.address_id) as 'address_city', ";
        $query .= "(select state from addresses where id = a.address_id) as 'address_state', ";
        $query .= "(select zip from addresses where id = a.address_id) as 'address_zip', ";
        $query .= "(select gps_latitude from addresses where id = a.address_id) as 'address_latitude', ";
        $query .= "(select gps_longitude from addresses where id = a.address_id) as 'address_longitude' ";
        $query .= "from rides a ";
        $query .= "where id = $id;";
        
        $process = $this->_getParam("process");
        $oper = $this->_getParam("oper");
        
        switch ($process) {
            case "GET-ONE":
                // get basic ride info
                $ride = $mapper->getCustomSelect($query);
                                
                // get owner info
                $owner_id = $ride[0]["owner"];
                $owner = $mapper->getItemById("users", $owner_id);
                
                // get group info
                $group_id = $ride[0]["group_id"];
                $query = "select a.*, ";
                $query .= "(select user_name_internal from users where id = a.owner) as 'user_name_internal', ";
                $query .= "(select user_name_external from users where id = a.owner) as 'user_name_external', ";
                $query .= "(select first_name from users where id = a.owner) as 'first_name', ";
                $query .= "(select last_name from users where id = a.owner) as 'last_name' ";
                $query .= "from groups a ";
                $query .= "where id = $group_id;";
                $group = $mapper->getCustomSelect($query);
                                
                // get group member info
                $query = "select a.*, ";
                $query .= "b.user_name_internal, ";
                $query .= "b.first_name, ";
                $query .= "b.last_name, ";
                $query .= "b.email ";
                $query .= "from group_members a, users b ";
                $query .= "where a.user_id = b.id ";
                $query .= "and a.group_id = $group_id;";                
                $group_members = $mapper->getCustomSelect($query);
                
                // get location resources info
                $wheres = array();
                $location_id = $ride[0]["location_id"];
                $wheres[] = "location_id = $location_id";
                $location_resources = $mapper->getAll("location_resources", $wheres);
                
                // get riders info
                $query = "select a.*, ";
                $query .= "(select user_name_internal from users where id = a.user_id) as 'user_name_internal', ";
                $query .= "(select first_name from users where id = a.user_id) as 'first_name', ";
                $query .= "(select last_name from users where id = a.user_id) as 'last_name', ";
                $query .= "(select email from users where id = a.user_id) as 'email', ";
                $query .= "(select role from group_members where user_id = a.user_id) as 'role', ";
                $query .= "(select skill from users where id = a.user_id) as 'skill', ";
                $query .= "(select experience from users where id = a.user_id) as 'experience', ";
                $query .= "(select type from users where id = a.user_id) as 'type', ";
                $query .= "(select guide from users where id = a.user_id) as 'guide' ";
                $query .= "from riders a ";
                $query .= "where ride_id = $id;";
                
                $riders = $mapper->getCustomSelect($query);
                
                // drop everything into one array
                $data = array();                
                $data["ride"] = $ride;
                $data["group"] = $group;
                $data["group_members"] = $group_members;
                $data["location_resources"] = $location_resources;
                $data["owner"] = $owner;
                $data["riders"] = $riders;
                                
                break;
            case "POST":
                $data = array();
                break;
        }
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
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
    
    public function addressesAction() {
        
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
    
    
}
