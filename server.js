const dgram = require('dgram');
const net = require('net');
const udpPort = 12345;  // UDP 监听端口
const tcpPort = 8692;   // TCP 监听端口

let receivedKey = '';

// 创建 UDP 服务器
const udpServer = dgram.createSocket('udp4');

// 处理 UDP 数据包
udpServer.on('message', (msg, rinfo) => {
    console.log(`[UDP] 收到伪造的UDP包: ${msg}`);
    // 从消息中提取密钥
    const match = msg.toString().match(/密钥:(\S+)/);
    if (match) {
        receivedKey = match[1];
        console.log(`[UDP] 保存的密钥: ${receivedKey}`);
    }
});

// 绑定 UDP 服务器到指定端口
udpServer.bind(udpPort, () => {
    console.log(`UDP 监听端口 ${udpPort} 中...`);
});

// 创建 TCP 服务器
const tcpServer = net.createServer((socket) => {
    console.log('TCP 客户端已连接');

    socket.on('data', (data) => {
        const request = data.toString();
        console.log(`[TCP] 收到的请求: ${request}`);

        let response;
        if (request.includes(receivedKey) && receivedKey.length > 0) {
            response = `服务器已收到伪造的UDP包，密钥: ${receivedKey}，存在IP欺骗漏洞！`;
        } else {
            response = '未收到伪造的UDP包或密钥不匹配。';
        }

        socket.write(response);
        console.log(`[TCP] 发送响应: ${response}`);
    });

    socket.on('end', () => {
        console.log('TCP 客户端断开连接');
    });
});

// 绑定 TCP 服务器到指定端口
tcpServer.listen(tcpPort, () => {
    console.log(`TCP 监听端口 ${tcpPort} 中...`);
});
