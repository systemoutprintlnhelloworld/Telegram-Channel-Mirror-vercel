const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

module.exports = (req, res) => {
  //   if (
  //     req.url.startsWith("/api") ||
  //     req.url.startsWith("/auth") ||
  //     req.url.startsWith("/banner") ||
  //     req.url.startsWith("/CollegeTask")
  //   ) {
  //     target = "http://106.15.2.32:6969";
  //   }
  createProxyMiddleware({
    target: "https://dns.google/",
    changeOrigin: true,
    //selfHandleResponse: true,
    pathRewrite: {
      // rewrite request path `/backend`
      //  /backend/user/login => http://google.com/user/login
      //   "^/backend/": "/",
    }/*,
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req2, res2) => {
        //res2.statusCode = 200; // set different response status code
        const response = responseBuffer.toString('utf8');
        return response;
      }),
    }
      */
  })(req, res);
};
