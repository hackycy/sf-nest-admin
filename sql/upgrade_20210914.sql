-- 移除 请求追踪日志记录表及菜单
DROP TABLE IF EXISTS `sys_req_log`;

DELETE FROM `sys_menu` WHERE id = 38;
DELETE FROM `sys_task` WHERE id = 1;
