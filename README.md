# xiaoyu · 小鱼

一个为「小鱼」做的单页个人主页。温柔、内敛、偶尔天然呆的 INFP，玩我的世界，闲来无事打打洲。

页面由他的朋友 **饭** 撰写、排版，托管在 GitHub Pages 上。

> 这页是我写的，字是我打的，版是我排的。他大概会觉得有点夸张，然后回一句「哦，谢谢」。

## 这是什么

纯静态的一页网站，没有框架、没有构建步骤、没有依赖。打开 `index.html` 就是全部。

- **昼夜主题**：导航栏右侧的按钮在天亮 / 天黑之间切换，整页配色、插图（头像 / 月面）和说明文字一起变化。
- **一段没有视频的片子**：`#reel` 区块用滚动条当播放键。往下滚，四张 NASA 影像（南天极光、纳米布沙漠、巴哈马、喜马拉雅）走完 24 秒；往上滚，它倒着放。进度条、时间码、圆点跳转、回到开头按钮都可操作，也支持键盘与 `aria-*` 无障碍属性。
- **入场动画**：区块与资料条目用 `IntersectionObserver` 在进入视口时淡入；`prefers-reduced-motion` 生效时全部直接呈现。
- **会收缩的字标**：页首的 `xiaoyu` 会随首屏滚动轻微缩小，像落定一样。
- **无外部依赖的排版**：只有 Google Fonts（STIX Two Text、Noto Serif SC）两个字体请求，其余全在本地。

## 文件结构

```
.
├── index.html      # 页面结构与全部文案
├── styles.css      # 排版、配色、昼夜主题、动效
├── main.js         # 昼夜切换、滚动播放器、入场动画
├── assets/         # 头像、图标、NASA 影像
├── LICENSE         # GNU General Public License v3.0
└── README.md
```

## 本地预览

不需要安装任何东西。直接双击 `index.html`，或者起一个静态服务器：

```bash
# 任选其一
python -m http.server 8080
npx serve .
```

然后访问 <http://localhost:8080>。

## 部署

站点通过 **GitHub Pages** 从仓库根目录直接发布，无需构建：

访问 <https://hi-polarbear.github.io/xiaoyu/>

## 图片与字体

- 头像、好友头像：本人的。
- 月面、尼罗河三角洲，以及片子里的四张（极光、纳米布、巴哈马、喜马拉雅）：均来自 **NASA**，公有领域。
- 字体：**STIX Two Text** 与 **Noto Serif SC**，通过 Google Fonts 加载，遵循各自的 SIL Open Font License。

## 许可

本仓库代码与文字以 **GNU General Public License v3.0** 发布，全文见 [LICENSE](LICENSE)。

这意味着你可以自由地使用、修改、再分发这份作品，但衍生作品必须以同样的协议开源，并保留版权声明。

## 作者

**Hi-PolarBear** — 替他写这页的人
