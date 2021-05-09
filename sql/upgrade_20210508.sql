-- ----------------------------
-- 增加七牛文件空间
-- ----------------------------
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:06:41.536985000', '2021-05-08 03:06:41.536985000', 69, NULL, '文件空间', '/file/space', NULL, 1, 'space', 255, 'views/file/space', 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:07:00.710454000', '2021-05-08 03:07:00.710454000', 70, 69, '查询', NULL, 'file:space:list', 2, NULL, 255, NULL, 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:07:36.804612000', '2021-05-08 03:07:44', 71, 69, '删除', NULL, 'file:space:delete,file:space:check', 2, NULL, 255, NULL, 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:08:16.445447000', '2021-05-08 03:08:16.445447000', 72, 69, '创建文件夹', NULL, 'file:space:mkdir', 2, NULL, 255, NULL, 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:08:34.173745000', '2021-05-08 03:08:34.173745000', 73, 69, '上传', NULL, 'file:space:token', 2, NULL, 255, NULL, 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:08:55.860051000', '2021-05-08 03:09:27', 74, 69, '重命名', NULL, 'file:space:rename,file:space:check', 2, NULL, 255, NULL, 1, 1);
INSERT INTO `sf-admin`.sys_menu (createTime, updateTime, id, parent_id, name, router, perms, `type`, icon, order_num, view_path, keepalive, isShow) VALUES('2021-05-08 03:09:19.551524000', '2021-05-08 03:09:19.551524000', 75, 69, '下载', NULL, 'file:space:download', 2, NULL, 255, NULL, 1, 1);
