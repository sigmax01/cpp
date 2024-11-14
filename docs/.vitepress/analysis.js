// analysis.js
export default function analysis() {
  return {
    name: 'vite-plugin-analysis',
    transformIndexHtml(html) {
      // 检查当前环境是否为 localhost
      const isLocalhost = process.env.NODE_ENV === 'development' || /localhost/.test(html);

      if (isLocalhost) {
        return html; // 如果是 localhost，返回不添加任何内容的原始 HTML
      }

      // 否则，插入 Umami 分析脚本
      return html.replace(
        '</head>',
        `<script src="https://umami.ricolxwz.io/script.js" defer data-website-id="428fe69a-245a-4a8c-937b-97369fc9a31b"></script></head>`
      );
    },
  };
}
