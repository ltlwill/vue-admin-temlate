/* 应用全局配置，如根路径等，实现修改后端地址后不需要重新打包编译即可生效，只需要修改config.js内容即可，
 * 如果有缓存，则在index.html中修改引用的config.js的版本号即可，如：<script src="config.js?v=2222">，
 * public目录下的文件不会进行编译打包
 */
window.globalConfig = {
	baseURL: 'http://192.168.10.55:8320',
	websocketURL: ''
}
