<?php
$connect = mysql_connect('localhost', 'root', 'mySQL17');
mysql_select_db('test', $connect);
mysql_query('SET NAMES utf8', $connect);

function getParents($id) {
  global $connect;
  $q = mysql_query("SELECT parent_id FROM region WHERE region_id = $id", $connect);
  $d = mysql_fetch_assoc($q);
  if ($d && $d['parent_id'] != 0) {
    $parents = getParents($d['parent_id']);
    return ($parents || is_numeric($parents) && $parents >= 0? $parents.',': ''). $d['parent_id'];
  }
  return 0;
}

function getChildren($id) {
  global $connect;
  $q = mysql_query("SELECT region_id AS value, name_cn AS label FROM region WHERE parent_id = $id", $connect);
  $d = array();
  while($r = mysql_fetch_assoc($q)) {
    $d[] = $r;
  }
  return $d;
}

if (!empty($_GET['action'])) {
  if (0 === strcasecmp($_GET['action'], 'getParents')) {
    if (!isset($_GET['child']) || !is_numeric($_GET['child']) || $_GET['child'] < 0) {
      die('Child value must be number format');
    }
    die(getParents($_GET['child']));
  } elseif (0 === strcasecmp($_GET['action'], 'getChildren')) {
    if (isset($_GET['parent']) && (!is_numeric($_GET['parent']) || $_GET['parent'] < 0)) {
      die('Parent value must be number format');
    } elseif (!isset($_GET['parent'])) {
      $_GET['parent'] = 0;
    }
    die(json_encode(getChildren($_GET['parent'])));
  }
}

die('Invalid request');
