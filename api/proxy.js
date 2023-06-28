const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
import { parse } from 'node-html-parser';

const proxy = createProxyMiddleware({
  target: "https://dns.google/",
  changeOrigin: true,
  selfHandleResponse: true,
  pathRewrite: {
    // rewrite request path `/backend`
    //  /backend/user/login => http://google.com/user/login
    //   "^/backend/": "/",
  },
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const root = parse(responseBuffer);
    return root.toString('utf8');
  })
});

module.exports = (req, res) => {
  //   if (
  //     req.url.startsWith("/api") ||
  //     req.url.startsWith("/auth") ||
  //     req.url.startsWith("/banner") ||
  //     req.url.startsWith("/CollegeTask")
  //   ) {
  //     target = "http://106.15.2.32:6969";
  //   }
  proxy(req, res);
};
