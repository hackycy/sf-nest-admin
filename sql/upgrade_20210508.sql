-- ----------------------------
-- 增加七牛文件空间
-- ----------------------------
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

--
-- 转存表中的数据 `sys_menu`
--
INSERT INTO `sys_menu` (`createTime`, `updateTime`, `id`, `parent_id`, `name`, `router`, `perms`, `type`, `icon`, `order_num`, `view_path`, `keepalive`, `isShow`) VALUES
('2021-05-16 01:38:40.990691', '2021-05-16 01:38:40.990691', 72, NULL, '网盘空间', '/netdisk', NULL, 0, 'netdisk', 255, NULL, 1, 1),
('2021-05-16 01:39:06.265986', '2021-05-16 01:39:06.265986', 73, 72, '空间管理', '/netdisk/manage', NULL, 1, 'netdisk-manage', 255, 'views/netdisk/manage', 1, 1),
('2021-05-16 01:40:03.423681', '2021-05-16 01:40:03.423681', 74, 73, '查询', NULL, 'netdisk:manage:list', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:40:27.605473', '2021-05-16 01:40:27.605473', 75, 73, '创建文件夹', NULL, 'netdisk:manage:mkdir', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:40:42.986572', '2021-05-16 01:40:42.986572', 76, 73, '上传', NULL, 'netdisk:manage:token', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:40:57.687251', '2021-05-16 01:41:36.000000', 77, 73, '重命名', NULL, 'netdisk:manage:rename,netdisk:manage:check', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:41:15.070191', '2021-05-16 01:41:15.070191', 78, 73, '下载', NULL, 'netdisk:manage:download', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:41:56.637858', '2021-05-16 01:41:56.637858', 79, 73, '删除', NULL, 'netdisk:manage:delete,netdisk:manage:check', 2, NULL, 255, NULL, 1, 1),
('2021-05-16 01:42:17.793185', '2021-05-16 01:42:17.793185', 80, 73, '预览', NULL, 'netdisk:manage:info', 2, NULL, 255, NULL, 1, 1);