<?php
class Application_Model_TableMapper {

    protected $_tableName;

    public function fetchOutstanding($wheres, $table_name, $columns)
    {
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->from($table_name, $columns);

        foreach($wheres as $where) {
            $select->where($where);
        }

        // new stuff for jqGrid
        $front = Zend_Controller_Front::getInstance();
        $req = $front->getRequest();
        $sidx = $req->getParam('sidx', '1');
        $sord = $req->getParam('sord', 'ASC');
        $select->order($sidx.' '.$sord);

        $adapter = new Application_Model_Paginator_TableAdaptor($select);
        $paginator = new Zend_Paginator($adapter);

        return $paginator;

    }

    public function getItemById($table_name, $id) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->from($table_name);
        $select->where("id = $id");
        
        $stmt = $db->query($select);

        return $rows = $stmt->fetchAll();

    }


    public function getItemsByApisId($table_name, $apis_id) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->from($table_name);
        $select->where("apis_id = ?", $apis_id);

        $stmt = $db->query($select);

        return $rows = $stmt->fetchAll();

    }
    
    public function truncateTable($table_name) {
        
        $db = Zend_Db_Table::getDefaultAdapter();
        $query = 'TRUNCATE TABLE ' . $table_name;        
        $stmt = $db->query($query);        
        $int = $stmt->execute();
        
        return $int;
        
        
    }

    public function insertItem($table_name, $data) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $int = $db->insert($table_name, $data);
        return $int;

    }

    public function updateItem($table_name, $data, $id) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $where = array('id = ?' => $id);
        $int = $db->update($table_name, $data, $where);
        return $int;

    }
    
    public function updateSpecific($table_name, $data, $wheres) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $int = $db->update($table_name, $data, $wheres);
        return $int;

    }

    

    public function deleteItem($table_name, $id) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $where = array('id = ?' => $id);
        $int = $db->delete($table_name, $where);
        return $int;
        
    }

    public function deleteItemByColumn($table_name, $column, $value) {

        $db = Zend_Db_Table::getDefaultAdapter();
        $where = array("$column = ?" => $value);
        $int = $db->delete($table_name, $where);
        return $int;

    }


    public function getAll($table_name, $wheres) {
        $db = Zend_Db_Table::getDefaultAdapter();

        $select = $db->select();
        $select->from($table_name);

        foreach($wheres as $where) {
            $select->where($where);
        }


        $stmt = $db->query($select);

        return $rs = $stmt->fetchAll();
        
    }

    public function getNextInsertId($table_name) {
        
        $db = Zend_Db_Table::getDefaultAdapter();

        $sql = "SHOW TABLE STATUS LIKE '$table_name'";
        $row = $db->fetchRow($sql);
        $id = $row["Auto_increment"];

        return $id;

    }

    public function getLastInsertId($table_name) {
        $db = Zend_Db_Table::getDefaultAdapter();
        $id = $db->lastInsertId($table_name);
        return $id;

    }

    public function updateSortOrder($table_name, $bind, $where) {
        $db = Zend_Db_Table::getDefaultAdapter();
        $int = $db->update($table_name, $bind, $where);
        return $int;
    }

    public function getItemsByColumns($table_name, $columns, $wheres, $sort="") {
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->from($table_name, $columns);
        foreach($wheres as $where) {
            $select->where($where);
        }

        if ($sort != "") {
            $select->order($sort);
        }
        
        $stmt = $db->query($select);

        return $rows = $stmt->fetchAll();

    }

    public function getSingleColumnValue($table_name, $column, $where) {
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->from($table_name, $column);
        $select->where($where);

        $stmt = $db->query($select);

        $value = $stmt->fetchColumn();

        return $value;
        
    }
    
    public function getResourcesByRoleId($columns, $role_id, $side) {
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        
        $select->from(array('a' => 'resources'), $columns);
        
        if ($side) {            
            $select->join(array('b' => 'role_resources'), 'a.id = b.resource_id', array());
            $select->where("b.role_id=$role_id");
        } else {
            $subselect = $db->select();
            $subselect->from(array('b' => 'role_resources'), array('resource_id'));
            $subselect->where("b.role_id=$role_id");
            $select->where("a.id NOT IN ($subselect)");
        }
        $stmt = $db->query($select);
        
        return $rows = $stmt->fetchAll();
    }
    
    public function getRoleResourcesByRoleId($cols1, $cols2, $table1, $table2, $role_id, $page, $numberPerPage) {
        
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
                
        $select->from(array('a' => $table1), $cols1);
        $select->join(array('b' => $table2), 'a.resource_id = b.id', $cols2);
        $select->where("a.role_id=$role_id");
                        
        // new stuff for jqGrid
        $front = Zend_Controller_Front::getInstance();
        $req = $front->getRequest();
        $sidx = $req->getParam('sidx', '1');
        $sord = $req->getParam('sord', 'ASC');
        $select->order($sidx.' '.$sord);

        $adapter = new Application_Model_Paginator_TableAdaptor($select);
        $paginator = new Zend_Paginator($adapter);
        
        $paginator->setCurrentPageNumber($page);
        $paginator->setItemCountPerPage($numberPerPage);
        

        return $paginator;
        
    }
    
    public function getDistinct($table_name, $column) {
        
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select();
        $select->distinct();
        $select->from($table_name, $column);
        
        $stmt = $db->query($select);

        return $rows = $stmt->fetchAll();
    }
    
    public function getCustomSelect($query) {
        
        $db = Zend_Db_Table::getDefaultAdapter();        
        $stmt = $db->query($query);

        return $rows = $stmt->fetchAll();
        
    }
    
    public function getNextStartValue($table_name, $id) {
        
        $start = 0;
        //$table_name = 'images';
        $column = new Zend_Db_Expr("MAX(sort_order)");
        $where = "project_id=$id";
        $sort_order = $this->getSingleColumnValue($table_name, $column, $where);
        
        if ($sort_order == null || (int)$sort_order != 0) {
            $sort_order = (int)$sort_order + 1;            
        } else {
            $sort_order = (int)$sort_order + 2;                        
        }
        
        $start = $sort_order;
        return $start;
        
    }
    
    
               

}
?>
