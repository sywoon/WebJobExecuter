// Rollup plugins
//import babel from 'rollup-plugin-babel'; // 处理es6
//import resolve from '@rollup/plugin-node-resolve'; // 你的包用到第三方npm包
//import commonjs from '@rollup/plugin-commonjs'; // 你的包用到的第三方只有commonjs形式的包
//import builtins from 'rollup-plugin-node-builtins'; // 如果你的包或依赖用到了node环境的builtins fs等
//import globals from 'rollup-plugin-node-globals'; // 如果你的包或依赖用到了globals变量
//import { terser } from 'rollup-plugin-terser'; // 压缩，可以判断模式，开发模式不加入到plugins



export default {
	input: './http_main.js',
	output: [
		{
			file: 'main.min.js', // package.json 中 "main": "dist/index.iife.js",
			format: 'iife', // 可以嵌入html中 通过<script>标签来使用
			sourcemap: false
		}
	],
	plugins: [
	]
}