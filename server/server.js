const http = require('http');

const app = http.createServer();

app.on('request', (req, res) => {
	res.end('ok');
});

app.listen(3000);
console.log('服务器启动成功');