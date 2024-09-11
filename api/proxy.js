const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { parse } = require('node-html-parser');

function tryDel(root, selector) {
  const e = root.querySelector(selector);
  if(e) {
    e.remove();
  }
}

const proxy = createProxyMiddleware({
  target: "https://web.telegram.org/k/#@embypub",
  changeOrigin: true,
  selfHandleResponse: true,
  pathRewrite: {
    // rewrite request path `/backend`
    //  /backend/user/login => http://google.com/user/login
    //   "^/backend/": "/",
  },
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
      const root = parse(responseBuffer);
      const title = root.getElementsByTagName("title")[0];
      title.innerHTML = title.innerHTML.replaceAll('Google Public DNS', 'Uchan Public DNS');
      tryDel(root, ".logo");
      tryDel(root, ".help");
      tryDel(root, 'a[href="https://developers.google.com/speed/public-dns/docs/using"]');
      tryDel(root, 'a[href="https://developers.google.com/speed/public-dns"]');
      tryDel(root, 'link[rel="shortcut icon"]'); // icon
      return root.toString('utf8').replaceAll("https://dns.google/resolve?", "https://" + req.headers['x-forwarded-host'] + "/resolve?");
    } else {
      console.log(proxyRes.headers['content-type'])
    }
    return responseBuffer;
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
