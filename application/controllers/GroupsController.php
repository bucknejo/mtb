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
        $ajaxContext->addActionContext('post', 'json');
        $ajaxContext->addActionContext('save', 'json');
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
    
    public function postAction()
    {
        
        $data = array();
        
        try 
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $name = $this->_getParam("group_name", "");
                    $description = $this->_getParam("group_description", "");
                    $deputy = $this->_getParam("group_deputy", 0);
                    $type = $this->_getParam("group_type", "");
                    $join = $this->_getParam("group_join", "");
                    $locked = $this->_getParam("group_locked", "");
                    
                    $members = $this->_getParam("group_members", "");
                    $ids = explode('|', $members);
                    
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "groups";

                    $date = date('Y-m-d');
                    
                    $values = array(
                        "date_created" => $date,
                        "last_updated" => $date,
                        "active" => 1,
                        "name" => $name,
                        "description" => $description,
                        "owner" => $user_id,
                        "deputy" => $deputy,
                        "type" => $type,
                        "join" => $join,
                        "locked" => $locked
                    );

                    $i = $mapper->insertItem($table_name, $values);
                    $group_id = $mapper->getLastInsertId($table_name);
                    
                    // after group is inserted, try to insert
                    // the group members
                    
                    if ($i > 0) {
                        
                        $table_name = "group_members";
                        // insert owner
                        $values = array(
                            "date_created" => $date,
                            "last_updated" => $date,
                            "active" => 1,
                            "group_id" => $group_id,
                            "user_id" => $user_id,
                            "role" => "OWNER"
                        );
                        $j = $mapper->insertItem($table_name, $values);
                        
                        // insert members
                        foreach ($ids as $id) {
                            
                            $values = array(
                                "date_created" => $date,
                                "last_updated" => $date,
                                "active" => 1,
                                "group_id" => $group_id,
                                "user_id" => $id,
                                "role" => "MEMBER"
                            );

                            $j = $mapper->insertItem($table_name, $values);

                            $failed = array();
                            if ($j <= 0) {
                                array_push($failed, $id);
                            }
                            
                        }
                        
                        if (intval($deputy) > 0) {

                            // update deputy
                            $values = array(
                                "date_created" => $date,
                                "last_updated" => $date,
                                "active" => 1,
                                "group_id" => $group_id,
                                "user_id" => intval($deputy),
                                "role" => "DEPUTY"
                            );

                            $wheres = array();
                            $wheres[] = "group_id = $group_id";
                            $wheres[] = "user_id = " . intval($deputy);

                            $k = $mapper->updateSpecific($table_name, $values, $wheres);
                            
                        }

                        if (count($failed) > 0) {

                            $error = array();
                            $error["code"] = "101";
                            $error["message"] = "Failed to add: ".join($failed, ",");
                            $data["success"] = false;
                            $data["message"] = "Some members failed to add to group.";
                            $data["code"] = 101;
                            $data["error"] = $error;

                        } else {

                            $data["success"] = true;
                            $data["message"] = "Group and members added successfully!";
                            $data["code"] = 0;

                        }                                            
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Failed to add group";
                        $data["success"] = false;
                        $data["message"] = "Failed to add group.";
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
    
    public function saveAction()
    {

        $data = array();
        
        try 
        {
            
            $auth = Zend_Auth::getInstance();

            $user_id = 0;

            if ($auth->hasIdentity()) {
                $user_id = $id = $auth->getIdentity()->id;
                
                if ($this->getRequest()->isPost()) {
                    
                    $group_id = $this->_getParam("group_id", -1);
                    $name = $this->_getParam("group_name", "");
                    $description = $this->_getParam("group_description", "");
                    $deputy = $this->_getParam("group_deputy", 0);
                    $type = $this->_getParam("group_type", "");
                    $join = $this->_getParam("group_join", "");
                    $locked = $this->_getParam("group_locked", "");
                    
                    $m = $this->_getParam("members", "");
                    $members = explode('|', $m);
                    
                    $f = $this->_getParam("friends", "");
                    $friends = explode('|', $f);
                                        
                    $mapper = new Application_Model_TableMapper();
                    $table_name = "groups";

                    $date = date('Y-m-d');
                    
                    $values = array(
                        "last_updated" => $date,
                        "active" => 1,
                        "name" => $name,
                        "description" => $description,
                        "owner" => $user_id,
                        "deputy" => $deputy,
                        "type" => $type,
                        "join" => $join,
                        "locked" => $locked
                    );

                    // update main group info
                    $i = $mapper->updateItem($table_name, $values, $group_id);
                    
                    // after update, remove members, add friends
                    
                    if ($i >= 0) {
                        
                        $table_name = "group_members";
                        
                        // delete members (remove checkbox processing)
                        foreach ($members as $id) {
                            
                            if (!empty($id)) {

                                $j = $mapper->deleteItem($table_name, $id);

                                $failed_remove = array();
                                if ($j <= 0) {
                                    array_push($failed_remove, $id);
                                }
                                
                            }
                                                        
                        }
                        
                        foreach ($friends as $id) {
                            
                            if (!empty($id)) {
                                
                                // insert friend
                                $values = array(
                                    "date_created" => $date,
                                    "last_updated" => $date,
                                    "active" => 1,
                                    "group_id" => $group_id,
                                    "user_id" => $id,
                                    "role" => "MEMBER"
                                );

                                $j = $mapper->insertItem($table_name, $values);

                                $failed_add = array();
                                if ($j <= 0) {
                                    array_push($failed_add, $id);
                                }                                
                                
                            }
                            
                        }
                        
                        if (intval($deputy) > 0) {

                            // update deputy
                            $values = array(
                                "last_updated" => $date,
                                "active" => 1,
                                "group_id" => $group_id,
                                "user_id" => intval($deputy),
                                "role" => "DEPUTY"
                            );

                            $wheres = array();
                            $wheres[] = "group_id = $group_id";
                            $wheres[] = "user_id = " . intval($deputy);

                            $k = $mapper->updateSpecific($table_name, $values, $wheres);
                            
                        }
                        

                        if (count($failed_remove) > 0 || count($failed_add) > 0) {

                            $error = array();
                            $error["code"] = "101";
                            //$error["message"] = "Failed to remove: ".join($failed_remove, ",");
                            $error["message"] = "Failed to modify members: ".join($failed_remove, ",") . " or add friends: " . join($failed_add, ",");
                            $data["success"] = false;
                            $data["message"] = "Some members failed to remove members or add friends from/to group.";
                            $data["code"] = 101;
                            $data["error"] = $error;

                        } else {

                            $data["success"] = true;
                            $data["message"] = "Group and members edited successfully!";
                            $data["code"] = 0;

                        }                                            
                        
                    } else {
                        
                        $error = array();
                        $error["code"] = "104";
                        $error["message"] = "Failed to edit group";
                        $data["success"] = false;
                        $data["message"] = "Failed to edit group.";
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
