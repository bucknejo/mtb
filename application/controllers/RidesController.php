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
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->addActionContext('checkin', 'json');
        $ajaxContext->addActionContext('bailout', 'json');
        $ajaxContext->addActionContext('complete', 'json');
        $ajaxContext->addActionContext('comments', 'json');
        $ajaxContext->addActionContext('rating', 'json');
        $ajaxContext->initContext();                                
    }
    
    public function indexAction() 
    {
                
    }
    
    public function mainAction() {
        
        $auth = Zend_Auth::getInstance();
        
        $user_id = 0;
        
        if ($auth->hasIdentity()) {
            $user_id = $id = $auth->getIdentity()->id;
        } 
        
        $mapper = new Application_Model_TableMapper();
        
        $data = array();            
        $data["user_id"] = $user_id;
                
        // user
        $query = "select a.* ";
        $query .= "from users a ";
        $query .= "where id = $user_id;";        
        $data["user"] = $mapper->getCustomSelect($query);
        
        // equipment
        $query = "select a.* ";
        $query .= "from equipment a ";
        $query .= "where a.user_id = $user_id;";        
        $data["equipment"] = $mapper->getCustomSelect($query);        
        
        // friends
        $query = "select a.*, ";
        $query .= "(select first_name from users where id = a.friend_id) as 'first_name', ";
        $query .= "(select last_name from users where id = a.friend_id) as 'last_name', ";
        $query .= "(select email from users where id = a.friend_id) as 'email', ";
        $query .= "(select skill from users where id = a.friend_id) as 'skill', ";
        $query .= "(select experience from users where id = a.friend_id) as 'experience', ";
        $query .= "(select type from users where id = a.friend_id) as 'type', ";
        $query .= "(select guide from users where id = a.friend_id) as 'guide', ";
        $query .= "(select viewable from users where id = a.friend_id) as 'viewable', ";
        $query .= "(select avatar from users where id = a.friend_id) as 'avatar', ";
        $query .= "(select gender from users where id = a.friend_id) as 'gender', ";
        $query .= "(select reputation from users where id = a.friend_id) as 'reputation' ";
        $query .= "from	friends a ";
        $query .= "where user_id = $user_id; ";
        $data["friends"] = $mapper->getCustomSelect($query);
        
        // available
        $query = "select * ";
        $query .= "from users  ";
        $query .= "where id not in (select friend_id from friends where user_id = $user_id);";
        $data["available"] = $mapper->getCustomSelect($query);
        
        // user groups
        $query = "select * ";
        $query .= "from groups ";
        $query .= "where owner = $user_id;";
        $data["usergroups"] = $mapper->getCustomSelect($query);
        
        // rides
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
        
        // skills
        $gender = explode('|', $config->codes->gender);
        $selects["gender"] = $gender;
        
        // skills
        $skills = explode('|', $config->codes->skills);
        $selects["skills"] = $skills;
        
        // styles
        $styles = explode('|', $config->codes->styles);
        $selects["styles"] = $styles;
        
        // viewable
        $viewable = explode('|', $config->codes->viewable);
        $selects["viewable"] = $viewable;
                       
        // ride types
        $ridetypes = explode('|', $config->codes->rides->types);
        $selects["ridetypes"] = $ridetypes;
        
        // locked
        $locked = explode('|', $config->codes->rides->locked);
        $selects["locked"] = $locked;
        
        // group roles
        $grouproles = explode('|', $config->codes->groups->roles);
        $selects["grouproles"] = $grouproles;
        
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
        
        // deputies
        $query = "select concat(id, ':', last_name, ', ', first_name) as 'option' ";
        $query .= "from users ";
        $query .= "where id in (select friend_id from friends where user_id = $user_id);";
        $deputies = $mapper->getCustomSelect($query);        
        $selects["deputies"] = $this->_helper->utilities->arrayitize($deputies);
                        
        $data["selects"] = $selects;
        
        // csrf token
        $csrf = new Zend_Session_Namespace("csrf");
        $token = $csrf->token;
        $data["token"] = $token;
                                
        $this->view->data = json_encode($data);
        
        //$this->_helper->viewRenderer->setNoRender(true);
	$this->view->layout()->disableLayout();        
                
    }
    
    public function ridesAction() {

        $mapper = new Application_Model_TableMapper();
        
        
        $process = $this->_getParam("process");
        $oper = $this->_getParam("oper");
        
        switch ($process) {
            case "GET-ONE":
                
                $auth = Zend_Auth::getInstance();

                $user_id = 0;

                if ($auth->hasIdentity()) {
                    $user_id = $id = $auth->getIdentity()->id;
                } 

                $mapper = new Application_Model_TableMapper();


                // user
                $query = "select a.* ";
                $query .= "from users a ";
                $query .= "where id = $user_id;";        
                $user = $mapper->getCustomSelect($query);
                
                        // get basic ride info
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
                $query .= "(select role from group_members where user_id = a.user_id and group_id = a.group_id) as 'role', ";
                $query .= "(select skill from users where id = a.user_id) as 'skill', ";
                $query .= "(select experience from users where id = a.user_id) as 'experience', ";
                $query .= "(select type from users where id = a.user_id) as 'type', ";
                $query .= "(select guide from users where id = a.user_id) as 'guide', ";
                $query .= "(select viewable from users where id = a.user_id) as 'viewable', ";
                $query .= "(select avatar from users where id = a.user_id) as 'avatar', ";
                $query .= "(select gender from users where id = a.user_id) as 'gender', ";
                $query .= "(select reputation from users where id = a.user_id) as 'reputation' ";
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
                $data["user_id"] = $user_id;
                $data["user"] = $user;
                
                                
                break;
            case "POST":
                $data = array();
                break;
        }
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();
        
    }
    
    public function addressesAction() {
        
        
    }
    
    public function postAction() {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $d = date('Y-m-d');
                                        
                    $name = $this->_getParam("name", "");
                    $description = $this->_getParam("description", "");
                    $owner = $this->_getParam("owner", "");
                    $group = $this->_getParam("group", "");
                    $location = $this->_getParam("location", "");
                    $address = $this->_getParam("address", "");
                    $date = $this->_getParam("date", "");
                    $time = $this->_getParam("time", "");
                    $status = $this->_getParam("status", "");
                    $join = $this->_getParam("join", "");
                    $tempo = $this->_getParam("tempo", "");
                    $drop = $this->_getParam("drop", "");
                    $public = $this->_getParam("public", "");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "rides";
                    
                    $values = array(
                        "date_created" => $d,
                        "last_updated" => $d,
                        "active" => 1,
                        "name" => $name,
                        "description" => $description,
                        "owner" => $user_id,
                        "group_id" => $group,
                        "location_id" => $location,
                        "address_id" => $address,
                        "date" => date('Y-m-d', strtotime($date)),
                        "time" => $time,
                        "status" => "ON TIME",
                        "join" => $join,
                        "tempo" => $tempo,
                        "drop" => $drop,
                        "public" => $public
                    );
                    
                    $i = $mapper->insertItem($table_name, $values);
                    
                    $id = $mapper->getLastInsertId($table_name);
                                        
                    if ($i > 0) {
                        
                        $failed_riders = array();
                                                                                               
                        // add riders 
                        $query = "select * ";
                        $query .= "from group_members ";
                        $query .= "where group_id=$group";
                        $group_members = $mapper->getCustomSelect($query);

                        foreach($group_members as $member) {

                            $values = array(
                                "date_created" => $d,
                                "last_updated" => $d,
                                "active" => 1,
                                "ride_id" => $id,
                                "user_id" => $member["user_id"],
                                "group_id" => $group,
                                "rsvp" => 0,
                                "status" => "ON TIME",
                                "complete" => 0,
                                "rating" => 0,
                                "comment" => null
                            );

                            $j = $mapper->insertItem("riders", $values);

                            if ($j <= 0) {
                                array_push($failed_riders, $member["user_id"]);
                            }
                        }
                        
                        if (count($failed_riders) > 0) {
                            
                            $error = array();
                            $error["code"] = "105";
                            $error["message"] = "Failed to add riders: " . join($failed_riders, ",");
                            $data["success"] = false;
                            $data["message"] = "Some riders failed to be added to the ride: $id";
                            $data["code"] = 105;
                            $data["error"] = $error;
                                                        
                        } else {
                            $data["success"] = true;
                            $data["message"] = "Ride added: $id";
                            $data["code"] = 0;                                                    
                        }
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Ride could not be added.";
                        $data["success"] = false;
                        $data["message"] = "Ride could not be added.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Ride add fail.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride add exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
    }
    
    public function saveAction() {
        
        $mapper = new Application_Model_TableMapper();
                
        $id = $this->_getParam("id", 0);
        $action = $this->_getParam("action", "");
        
        $date_created = date('Y-m-d');
        $last_updated = date('Y-m-d');
        $active = 1;
                
        $name = $this->_getParam("name", "");
        $description = $this->_getParam("description", "");
        $owner = $this->_getParam("owner", "");
        $group = $this->_getParam("group", "");
        $location = $this->_getParam("location", "");
        $address = $this->_getParam("address", "");
        $date = $this->_getParam("date", "");
        $time = $this->_getParam("time", "");
        $status = $this->_getParam("status", "");
        $join = $this->_getParam("join", "");
        $tempo = $this->_getParam("tempo", "");
        $drop = $this->_getParam("drop", "");
        $public = $this->_getParam("public", "");
        
        $post = array(
            'date_created' => $date_created,
            'last_updated' => $last_updated,
            'active' => $active,
            'name' => $name,
            'description' => $description,
            'owner' => $owner,
            'group' => $group,
            'location' => $location,
            'address' => $address,
            'date' => $date,
            'time' => $time,
            'status' => $status,
            'join' => $join,
            'tempo' => $tempo,
            'drop' => $drop,
            'public' => $public
        );
                        
        if ($this->getRequest()->isPost()) {
            
            if ($action == "add") {
                $table_name = "rides";
                $i = $mapper->insertItem($table_name, $post);
                $id = $mapper->getLastInsertId($table_name);
                $data = $mapper->getItemById($table_name, $id);
            }
            
        }
        
        $this->view->data = json_encode($data);
        $this->view->layout()->disableLayout();        
        
    }
    
    public function checkinAction()
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", "0");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "rsvp" => 1
                    );
                    
                    $i = $mapper->updateItem($table_name, $values, $id);
                                                            
                    if ($i > 0) {
                                            
                        $data["success"] = true;
                        $data["message"] = "Check In Successful: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Could not check in.";
                        $data["success"] = false;
                        $data["message"] = "Could not check in.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Could not check in.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride check in exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
        
    }
    
    public function bailoutAction()
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", "0");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "rsvp" => -1
                    );
                    
                    $i = $mapper->updateItem($table_name, $values, $id);
                                                            
                    if ($i > 0) {
                                            
                        $data["success"] = true;
                        $data["message"] = "Bail out Successful: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Could not bail out.";
                        $data["success"] = false;
                        $data["message"] = "Could not bail out.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Could not bail out.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride bail out exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
        
    }
    
    public function completeAction() 
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", "0");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "complete" => 1
                    );
                    
                    $i = $mapper->updateItem($table_name, $values, $id);
                                                            
                    if ($i > 0) {
                                            
                        $data["success"] = true;
                        $data["message"] = "Mark complete Successful: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Could not mark complete.";
                        $data["success"] = false;
                        $data["message"] = "Could not mark complete.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Could not mark complete.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride mark complete exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
        
    }
    
    public function commentsAction()
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", "0");
                    $comment = $this->_getParam("note", "");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "comment" => $comment
                    );
                    
                    $i = $mapper->updateItem($table_name, $values, $id);
                                                            
                    if ($i > 0) {
                                            
                        $data["success"] = true;
                        $data["message"] = "Add comments Successful: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Could not add comments complete.";
                        $data["success"] = false;
                        $data["message"] = "Could not add comments complete.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Could not add comments complete.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride add comments exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
    }
    
    public function ratingAction()
    {
        
        $data = array();
        
        try
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $id = $this->_getParam("id", "0");
                    $rating = $this->_getParam("rating", "");
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "riders";
                    
                    $values = array(
                        "rating" => $rating
                    );
                    
                    $i = $mapper->updateItem($table_name, $values, $id);
                                                            
                    if ($i > 0) {
                                            
                        $data["success"] = true;
                        $data["message"] = "Add rating Successful: $id";
                        $data["code"] = 0;                        
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Could not add rating complete.";
                        $data["success"] = false;
                        $data["message"] = "Could not add rating complete.";
                        $data["code"] = 104;
                        $data["error"] = $error;
                        
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
                $data["message"] = "Could not add rating.";
                $data["code"] = 102;
                $data["error"] = $error;                
                
            }
            
            
        } catch (Exception $ex) {

            $error = array();
            $error["code"] = "Code: ".$ex->getCode();
            $error["message"] = "Exception: ".$ex->getMessage();
            $data["success"] = false;
            $data["message"] = "Ride add rating exception.";
            $data["error"] = $error;
            
        }
        
        $this->view->data = json_encode($data);
	$this->view->layout()->disableLayout();                        
        
        
    }
    
    
}
