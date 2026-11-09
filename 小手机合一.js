/* =========================================================
   小手机 · 单文件（样式 + 逻辑）
   用法：页面里只引这一个文件
   <script src="小手机合一.js"></script>
   改样式改上面的 CSS 模板串，改逻辑改下面的代码。
   ========================================================= */

/* ---------- 1 样式（原 styles.css，运行时注入） ---------- */
const MINI_PHONE_CSS = `
/* =========================================================
   小手机 · 桌面系统
   1 变量 / 2 基础 / 3 状态栏 / 4 多页桌面 / 5 卡片
   6 图标网格 / 7 标点条 / 8 inbox / 9 日历 / 10 播放器
   11 角色主页 / 12 档案卡 / 13 圆点 Dock FAB
   14 应用页 / 15 聊天页 / 16 面板提示 / 17 响应式
   ========================================================= */

/* ---------- 1 变量 ---------- */
:root{
  --bg:            #f5f4f2;
  --bg-soft:       #eeedeb;
  --card:          #ffffff;
  --card-2:        #faf9f7;
  --ink:           #141414;
  --ink-2:         #6d6d6d;
  --ink-3:         #a6a6a6;
  --line:          rgba(0,0,0,.07);
  --line-2:        rgba(0,0,0,.12);
  --shadow:        0 14px 32px -22px rgba(0,0,0,.35);
  --shadow-sm:     0 8px 18px -12px rgba(0,0,0,.30);

  --r-card:        26px;
  --r-tile:        18px;
  --r-pill:        999px;
  --pad:           18px;
  --gap:           14px;
  --tile:          56px;
  --icon:          26px;
  --dock-bg:       #eae9e7;
  --dot-bg:        rgba(0,0,0,.055);
  --ease:          cubic-bezier(.22,.68,.16,1);
}

:root[data-theme="night"]{
  --bg:#0f0f10; --bg-soft:#171718; --card:#1c1c1e; --card-2:#232325;
  --ink:#f2f2f3; --ink-2:#a8a8ad; --ink-3:#6c6c72;
  --line:rgba(255,255,255,.10); --line-2:rgba(255,255,255,.18);
  --shadow:0 14px 32px -20px rgba(0,0,0,.9);
  --shadow-sm:0 8px 18px -12px rgba(0,0,0,.85);
  --dock-bg:#222224;
  --dot-bg:rgba(255,255,255,.10);
}

/* ---------- 2 基础 ---------- */
*{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
[hidden]{ display:none !important; }

html,body{ height:100%; margin:0; }

body{
  background:var(--bg);
  color:var(--ink);
  font-family:-apple-system, BlinkMacSystemFont, "SF Pro SC", "PingFang SC",
             "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow:hidden;
  transition:background .3s var(--ease), color .3s var(--ease);
}

.sprite{ position:absolute; width:0; height:0; overflow:hidden; }

.icon{ width:var(--icon); height:var(--icon); display:block; }
.icon,
.rabbit,
.mini .icon,
.dock__item .icon,
.sb__mini{
  fill:none;
  stroke:currentColor;
  stroke-width:1.6;
  stroke-linejoin:round;
  stroke-linecap:round;
}
.rabbit{ width:100%; height:100%; }
.icon--xs{ width:12px; height:12px; }

button{ font:inherit; color:inherit; }

.mini{
  appearance:none; border:0; background:none; padding:0;
  width:30px; height:30px; display:grid; place-items:center;
  color:var(--ink-3); cursor:pointer;
  border-radius:50%;
}
.mini .icon{ width:15px; height:15px; stroke-width:1.7; }
.mini--sm .icon{ width:14px; height:14px; }
.mini:active{ transform:scale(.92); }

.label{
  display:block;
  font-size:10px; line-height:1;
  letter-spacing:.24em;
  color:var(--ink-3);
  text-transform:lowercase;
}
.label--wide{ letter-spacing:.22em; }
.label--lower{ font-size:10.5px; letter-spacing:.26em; }

/* ---------- 3 状态栏 ---------- */
.statusbar{
  position:fixed; top:0; left:0; right:0; z-index:20;
  height:calc(env(safe-area-inset-top, 0px) + 52px);
  padding:calc(env(safe-area-inset-top, 0px) + 8px) 26px 0;
  display:flex; align-items:center; justify-content:space-between;
  font-size:15px; font-weight:600;
  color:var(--ink);
  background:linear-gradient(var(--bg) 55%, rgba(0,0,0,0));
  pointer-events:none;
}
.sb__left, .sb__right{ display:flex; align-items:center; gap:8px; }
.sb__time{ font-variant-numeric:tabular-nums; letter-spacing:.01em; }
.sb__mini{ width:15px; height:15px; display:block; opacity:.75; }
.sb__signal{ display:flex; align-items:flex-end; gap:2px; }
.sb__signal i{ display:block; width:3px; border-radius:1.5px; background:var(--ink); opacity:.85; }
.sb__signal i:nth-child(1){ height:4px; }
.sb__signal i:nth-child(2){ height:6px; }
.sb__signal i:nth-child(3){ height:8px; }
.sb__signal i:nth-child(4){ height:10px; }
.sb__5g{ font-size:12px; font-weight:700; letter-spacing:.04em; }
.sb__battery{
  position:relative;
  width:28px; height:13px; padding-right:2px;
  border:1px solid var(--ink); border-radius:4px;
  display:grid; place-items:center;
  font-size:8px; font-weight:700; letter-spacing:.02em;
  overflow:hidden;
}
.sb__battery::before{
  content:""; position:absolute; left:0; top:0; bottom:0;
  width:64%; background:var(--ink); opacity:.22;
}
.sb__battery-fill{ position:relative; font-variant-numeric:tabular-nums; }

/* ---------- 4 多页桌面 ---------- */
.pager{
  display:flex;
  height:100dvh;
  overflow-x:auto; overflow-y:hidden;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
}
.pager::-webkit-scrollbar{ display:none; }

.page{
  flex:0 0 100%;
  height:100%;
  overflow-y:auto;
  scroll-snap-align:start;
  scrollbar-width:none;
  padding:calc(env(safe-area-inset-top, 0px) + 62px) 0 calc(env(safe-area-inset-bottom, 0px) + 190px);
}
.page::-webkit-scrollbar{ display:none; }

.page__inner{
  width:100%; max-width:430px; margin:0 auto;
  padding:0 var(--pad);
  display:flex; flex-direction:column; gap:var(--gap);
}
.page__inner--wide{ max-width:470px; }

/* ---------- 5 卡片 ---------- */
.card{
  position:relative;
  background:var(--card);
  border:1px solid var(--line);
  border-radius:var(--r-card);
  box-shadow:var(--shadow);
  padding:14px 16px;
}
.card__bar{
  display:flex; align-items:center; justify-content:space-between;
  margin:-4px -4px 2px;
}

/* 点阵纹理块 */
.dots-bg{
  background-color:var(--card-2);
  background-image:radial-gradient(circle, var(--dot-bg) 2.6px, transparent 3px);
  background-size:15px 15px;
  background-position:6px 6px;
}
.dots-tile{
  display:grid; place-items:center;
  width:96px; aspect-ratio:1;
  border-radius:16px;
  color:var(--ink-2);
  background-color:var(--card-2);
  background-image:radial-gradient(circle, var(--dot-bg) 2.4px, transparent 2.8px);
  background-size:13px 13px;
}
.dots-tile--sm{ width:52px; border-radius:13px; }
.dots-tile .rabbit{ width:62%; height:62%; }

/* 问候卡 */
.greet{ padding:10px 12px 14px; }
.greet__body{
  display:grid; grid-template-columns:96px 1fr;
  gap:14px; align-items:stretch;
}
.greet__text{ display:flex; flex-direction:column; justify-content:center; gap:8px; min-width:0; }
.greet__line1{ margin:0; font-size:14px; font-weight:600; letter-spacing:.01em; }
.greet__line2{ margin:0; font-size:13.5px; line-height:1.55; color:var(--ink-2); }

/* NOW PLAYING */
.nowplaying{
  display:flex; align-items:center; gap:13px;
  text-align:left; width:100%; cursor:pointer;
  padding:12px 14px;
  transition:transform .2s var(--ease);
}
.nowplaying:active{ transform:scale(.985); }
.np__text{ display:flex; flex-direction:column; gap:5px; min-width:0; flex:1 1 auto; }
.np__title{
  font-size:17px; font-weight:700; letter-spacing:-.01em;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.np__title--sm{ font-size:16px; }
.np__sub{ font-size:12.5px; color:var(--ink-2); letter-spacing:.02em; }
.np__wave{ display:flex; align-items:flex-end; gap:2.5px; flex:0 0 auto; opacity:.35; }
.np__wave i{ display:block; width:2.5px; border-radius:2px; background:var(--ink); }
.np__wave i:nth-child(1){ height:9px; }
.np__wave i:nth-child(2){ height:15px; }
.np__wave i:nth-child(3){ height:11px; }
.np__wave i:nth-child(4){ height:6px; }

/* ---------- 6 图标网格 ---------- */
.grid{
  display:grid;
  gap:16px 8px;
  justify-items:center;
}
.grid--4{ grid-template-columns:repeat(4, 1fr); }
.grid--2{ grid-template-columns:repeat(2, 1fr); gap:14px 10px; }

.app{
  appearance:none; border:0; background:none; padding:0;
  display:flex; flex-direction:column; align-items:center; gap:7px;
  width:100%; cursor:pointer;
  transition:transform .2s var(--ease);
}
.app:active{ transform:scale(.93); }
.app:focus-visible{ outline:none; }
.app:focus-visible .tile{ box-shadow:0 0 0 3px rgba(20,20,20,.25), var(--shadow-sm); }

.tile{
  width:var(--tile); height:var(--tile);
  border-radius:var(--r-tile);
  display:grid; place-items:center;
  color:var(--ink);
  background:var(--card);
  border:1px solid var(--line);
  box-shadow:var(--shadow-sm);
  transition:box-shadow .25s var(--ease);
}
.tile--hero{ width:64px; height:64px; }
.tile--hero .icon{ width:30px; height:30px; }
.tile--date{ font-size:22px; font-weight:400; letter-spacing:-.02em; }
.tile--date b{ font-weight:400; }

.app__label{
  font-size:11.5px; font-weight:500;
  letter-spacing:.02em; color:var(--ink-2);
  white-space:nowrap;
}
.app--static{ cursor:default; }

/* ---------- 7 标点条 ---------- */
.marks{
  margin-top:4px;
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 18px;
  background:var(--card);
  border:1px solid var(--line);
  border-radius:var(--r-pill);
  box-shadow:var(--shadow-sm);
}
.mark{
  appearance:none; border:0; background:none;
  font-size:14px; color:var(--ink-3);
  padding:6px 4px; cursor:pointer;
  transition:color .2s var(--ease), transform .2s var(--ease);
}
.mark:active{ transform:scale(.88); color:var(--ink); }

/* ---------- 8 inbox ---------- */
.inbox{ padding:14px 14px 8px; }
.inbox__head{
  display:flex; align-items:center; justify-content:space-between;
  padding:2px 4px 10px;
}
.inbox__new{ font-size:13px; font-weight:600; letter-spacing:.02em; }

.inbox__row{
  display:flex; align-items:center; gap:11px;
  width:100%; padding:11px 4px;
  border:0; background:none; cursor:pointer;
  border-top:1px solid var(--line);
  text-align:left;
}
.inbox__row:first-child{ border-top:0; }
.inbox__row:active{ background:var(--card-2); }

.avatar{
  flex:0 0 auto;
  display:grid; place-items:center;
  border-radius:50%;
  color:var(--ink-2);
  background-color:var(--card-2);
  background-image:radial-gradient(circle, var(--dot-bg) 1.8px, transparent 2.2px);
  background-size:9px 9px;
  overflow:hidden;
}
.avatar .rabbit{ width:64%; height:64%; }
.avatar--row{ width:42px; height:42px; font-size:15px; font-weight:600; }
.avatar--lg{ width:52px; height:52px; }
.avatar--xs{ width:26px; height:26px; }

.row__main{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:3px; }
.row__name{
  display:flex; align-items:center; gap:6px;
  font-size:14px; font-weight:700; letter-spacing:.01em;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.row__dot{ width:6px; height:6px; border-radius:50%; background:var(--ink); flex:0 0 auto; }
.row__dot.is-off{ display:none; }
.row__preview{
  font-size:12.5px; color:var(--ink-3);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.row__time{ font-size:11.5px; color:var(--ink-3); letter-spacing:.02em; flex:0 0 auto; }

/* ---------- 9 日历 ---------- */
.cal{ padding:8px 12px 14px; }
.cal__body{ display:grid; grid-template-columns:66px 1fr; gap:10px; }
.cal__side{
  display:flex; flex-direction:column; align-items:flex-start; gap:8px;
  padding:6px 0 0 4px;
}
.cal__month{ font-size:15px; font-weight:700; letter-spacing:.12em; }
.cal__rule{ display:block; width:26px; height:1px; background:var(--line-2); }
.cal__weekday{ font-size:11px; color:var(--ink-2); letter-spacing:.04em; }
.cal__hint{ font-size:11px; color:var(--ink-3); letter-spacing:.04em; }

.cal__main{ min-width:0; }
.cal__nav{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.cal__year{ font-size:11px; color:var(--ink-3); letter-spacing:.1em; }

.cal__week, .cal__grid{
  display:grid; grid-template-columns:repeat(7, 1fr);
  text-align:center;
}
.cal__week{ margin-bottom:4px; }
.cal__week span{ font-size:10px; color:var(--ink-3); letter-spacing:.04em; }

.cal__cell{
  appearance:none; border:0; background:none;
  height:27px; display:grid; place-items:center;
  font-size:12px; color:var(--ink-2);
  font-variant-numeric:tabular-nums;
  cursor:pointer; border-radius:50%;
  transition:background .18s var(--ease), color .18s var(--ease);
}
.cal__cell--blank{ visibility:hidden; cursor:default; }
.cal__cell.is-today{ color:var(--ink); font-weight:700; }
.cal__cell.is-on{ background:var(--ink); color:var(--card); font-weight:600; }

/* ---------- 10 播放器 ---------- */
.player{ padding:14px 14px 12px; }
.player__head{ display:flex; align-items:center; gap:12px; }
.player__art{
  width:64px; height:64px; flex:0 0 auto;
  border-radius:50%;
  display:grid; place-items:center;
  background:var(--ink);
}
.vinyl{
  display:block;
  width:34px; height:34px; border-radius:50%;
  background:radial-gradient(circle, var(--card) 0 4px, rgba(255,255,255,.35) 4px 5px, transparent 5px 100%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);
}
.player__meta{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:4px; }
.player__tag{
  display:flex; align-items:center; gap:5px;
  font-size:11px; color:var(--ink-3); letter-spacing:.06em;
}
.player__tag .icon{ stroke-width:1.4; width:11px; height:11px; }
.player__row{ display:flex; align-items:center; gap:9px; margin-top:12px; }
.player__input{
  flex:1 1 auto; min-width:0;
  height:38px; padding:0 15px;
  border-radius:var(--r-pill);
  border:1px solid var(--line);
  background:var(--card-2);
  font:inherit; font-size:13px; color:var(--ink);
  outline:none;
}
.player__input::placeholder{ color:var(--ink-3); }
.player__input:focus{ border-color:var(--line-2); }
.round-btn{
  appearance:none; border:0; cursor:pointer;
  width:38px; height:38px; flex:0 0 auto;
  border-radius:50%;
  display:grid; place-items:center;
  background:var(--card-2);
  border:1px solid var(--line);
  color:var(--ink);
}
.round-btn .icon{ width:17px; height:17px; stroke-width:1.9; }
.round-btn--dark{ background:var(--ink); color:var(--card); border-color:var(--ink); }
.round-btn:active{ transform:scale(.93); }

/* ---------- 11 角色主页 ---------- */
.profile{ padding:16px; }
.profile__top{ display:flex; align-items:center; gap:12px; }
.profile__id{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:3px; }
.profile__name{ font-size:17px; font-weight:700; letter-spacing:-.01em; }
.profile__handle{ font-size:12.5px; color:var(--ink-3); letter-spacing:.04em; }
.follow{
  appearance:none; border:1px solid var(--ink);
  background:var(--ink); color:var(--card);
  font-size:12.5px; font-weight:600; letter-spacing:.04em;
  padding:8px 18px; border-radius:var(--r-pill);
  cursor:pointer; flex:0 0 auto;
  transition:background .22s var(--ease), color .22s var(--ease);
}
.follow[aria-pressed="true"]{ background:transparent; color:var(--ink); }
.profile__line{ margin:14px 0 0; font-size:14px; font-weight:600; letter-spacing:.01em; }
.profile__stats{
  display:flex; gap:22px; margin-top:12px;
  padding-top:12px; border-top:1px solid var(--line);
}
.stat{ display:flex; align-items:baseline; gap:6px; font-size:12px; color:var(--ink-3); }
.stat b{ font-size:16px; font-weight:700; color:var(--ink); letter-spacing:-.01em; }
.stat i{ font-style:normal; }
.profile__bio{ margin:10px 0 0; font-size:12.5px; line-height:1.6; color:var(--ink-2); }

/* 拍立得 */
.polaroid-wrap{ display:grid; grid-template-columns:118px 1fr; gap:12px; align-items:start; }
.polaroid{
  margin:6px 0 0;
  background:var(--card);
  padding:7px 7px 0;
  border:1px solid var(--line);
  box-shadow:var(--shadow);
  transform:rotate(-6deg);
  border-radius:4px;
}
.polaroid__img{
  display:grid; place-items:center;
  aspect-ratio:1 / 1.16;
  color:var(--ink-2);
  background-color:var(--card-2);
  background-image:radial-gradient(circle, var(--dot-bg) 2.4px, transparent 2.8px);
  background-size:12px 12px;
}
.polaroid__img .rabbit{ width:58%; height:58%; }
.polaroid__cap{
  font-size:10px; letter-spacing:.16em; font-style:italic;
  color:var(--ink-3); text-align:center;
  padding:7px 0 8px;
}

/* 星期条 */
.weekstrip{
  display:grid; grid-template-columns:repeat(7, 1fr);
  text-align:center; padding:6px 2px;
}
.ws{ display:flex; flex-direction:column; align-items:center; gap:9px; }
.ws__day{ font-size:10px; color:var(--ink-3); letter-spacing:.04em; }
.ws__num{
  appearance:none; border:0; background:none;
  width:28px; height:28px; border-radius:50%;
  display:grid; place-items:center;
  font-size:13px; color:var(--ink-2);
  font-variant-numeric:tabular-nums;
  cursor:pointer;
  transition:background .18s var(--ease), color .18s var(--ease);
}
.ws__num.is-on{ background:var(--ink); color:var(--card); font-weight:600; }
.ws__num.is-today{ color:var(--ink); font-weight:700; }

/* ---------- 12 档案卡 ---------- */
.covercard{ padding:0; overflow:hidden; }
.cover__band{ position:relative; height:132px; display:grid; place-items:end center; }
.cover__avatar{
  position:relative;
  transform:translateY(44px);
  width:88px; height:88px;
  border-radius:50%;
  border:4px solid var(--card);
  display:grid; place-items:center;
  color:var(--ink-2);
  background:var(--card-2);
  box-shadow:var(--shadow-sm);
  overflow:hidden;
}
.cover__avatar .rabbit{ width:62%; height:62%; }
.cover__body{
  padding:50px 18px 20px;
  display:flex; flex-direction:column; align-items:center; gap:5px;
  text-align:center;
}
.cover__name{ font-size:19px; font-weight:700; letter-spacing:-.01em; }
.cover__handle{ font-size:12.5px; color:var(--ink-3); letter-spacing:.04em; }
.cover__quote{ margin:11px 0 0; font-size:14px; font-weight:500; }
.cover__loc{
  display:flex; align-items:center; gap:5px;
  margin:8px 0 0; font-size:12px; color:var(--ink-3); letter-spacing:.03em;
}

.duo{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.counter, .note{ padding:15px 14px; display:flex; flex-direction:column; min-height:158px; }
.counter__num{
  margin-top:14px;
  font-size:32px; font-weight:400; letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;
}
.counter__cap{ margin-top:4px; font-size:11px; color:var(--ink-3); letter-spacing:.04em; }
.counter__bar{
  display:block; margin-top:auto;
  height:2px; background:var(--line-2); border-radius:2px; overflow:hidden;
}
.counter__bar i{ display:block; height:100%; background:var(--ink); }

.note__text{
  margin:14px 0 0;
  font-size:13px; line-height:1.6; color:var(--ink);
  display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden;
}
.note__sign{
  margin:auto 0 0; padding-top:8px;
  font-size:10px; letter-spacing:.14em; font-style:italic;
  color:var(--ink-3); text-align:right;
}

/* 应用库标题 */
.lib__head{ display:flex; flex-direction:column; gap:9px; padding:4px 2px 2px; }
.lib__title{ margin:0; font-size:26px; font-weight:700; letter-spacing:-.02em; }

/* ---------- 13 圆点 / Dock / FAB ---------- */
.dots{
  position:fixed; left:0; right:0;
  bottom:calc(env(safe-area-inset-bottom, 0px) + 108px);
  z-index:14;
  display:flex; align-items:center; justify-content:center; gap:9px;
}
.dot{
  appearance:none; border:0; padding:0;
  width:7px; height:7px; border-radius:50%;
  background:var(--ink); opacity:.18;
  cursor:pointer;
  transition:opacity .25s var(--ease), transform .25s var(--ease);
}
.dot.is-on{ opacity:.85; transform:scale(1.12); }

.dock{
  position:fixed;
  left:50%; transform:translateX(-50%);
  bottom:calc(env(safe-area-inset-bottom, 0px) + 22px);
  z-index:15;
  width:min(100% - 36px, 408px);
  padding:11px 16px;
  display:grid; grid-template-columns:repeat(4, 1fr);
  justify-items:center; gap:12px;
  background:var(--dock-bg);
  border:1px solid var(--line);
  border-radius:32px;
  box-shadow:var(--shadow);
  -webkit-backdrop-filter:blur(18px);
  backdrop-filter:blur(18px);
}
.dock__item{
  appearance:none; border:1px solid var(--line); cursor:pointer;
  width:100%; max-width:58px; aspect-ratio:1 / 1;
  border-radius:17px;
  background:var(--card);
  color:var(--ink);
  display:grid; place-items:center;
  box-shadow:var(--shadow-sm);
  transition:transform .2s var(--ease);
}
.dock__item .icon{ width:25px; height:25px; }
.dock__item:active{ transform:scale(.93); }

.fab{
  position:fixed; right:20px;
  bottom:calc(env(safe-area-inset-bottom, 0px) + 150px);
  z-index:16;
  width:52px; height:52px;
  border-radius:50%;
  appearance:none; border:1px solid var(--line);
  background:var(--card); color:var(--ink-2);
  display:grid; place-items:center;
  box-shadow:var(--shadow);
  cursor:pointer;
}
.fab .rabbit{ width:56%; height:56%; }
.fab:active{ transform:scale(.94); }

/* ---------- 14 应用页 ---------- */
.fullview{
  position:fixed; inset:0; z-index:40;
  background:var(--bg);
  display:flex; flex-direction:column;
  overflow-y:auto;
  animation:fv-in .32s var(--ease);
}
@keyframes fv-in{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }

.fv__bar{
  position:sticky; top:0; z-index:2;
  display:flex; align-items:center; gap:10px;
  padding:calc(env(safe-area-inset-top, 0px) + 10px) 14px 10px;
  background:linear-gradient(var(--bg) 70%, rgba(0,0,0,0));
}
.back{
  appearance:none; border:1px solid var(--line); background:var(--card);
  width:38px; height:38px; border-radius:50%;
  display:grid; place-items:center; cursor:pointer;
  color:var(--ink); box-shadow:var(--shadow-sm);
}
.back .icon{ width:19px; height:19px; }
.back:active{ transform:scale(.94); }
.fv__title{ font-size:14px; font-weight:600; letter-spacing:.02em; color:var(--ink-2); }
.fv__spacer{ width:38px; flex:0 0 auto; }

.fv__body{
  width:100%; max-width:470px; margin:0 auto;
  padding:10px var(--pad) 60px;
  display:flex; flex-direction:column;
}
.fv__body .label{ margin-top:16px; }
.fv__heading{ margin:9px 0 0; font-size:28px; line-height:1.24; font-weight:700; letter-spacing:-.02em; }
.fv__desc{ margin:11px 0 0; font-size:14px; line-height:1.72; color:var(--ink-2); max-width:30em; }
.fv__extra{ margin-top:16px; display:flex; flex-direction:column; gap:10px; }

.chips{ display:flex; flex-wrap:wrap; gap:7px; margin-top:18px; }
.chip{
  font-size:11.5px; letter-spacing:.02em; color:var(--ink-2);
  padding:7px 12px; border-radius:var(--r-pill);
  background:var(--card); border:1px solid var(--line);
}

.skeleton{ margin-top:22px; display:flex; flex-direction:column; gap:12px; }
.sk{ display:flex; align-items:center; gap:12px; }
.sk__thumb{
  width:42px; height:42px; flex:0 0 auto; border-radius:13px;
  background:var(--card-2); border:1px solid var(--line);
}
.sk__lines{ flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:7px; }
.sk__lines i{
  display:block; height:8px; border-radius:5px;
  background:linear-gradient(90deg, var(--card-2), transparent);
  border:1px solid var(--line);
}

/* 应用页里的开关行 */
.setting-row{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:13px 16px;
  background:var(--card); border:1px solid var(--line); border-radius:18px;
}
.setting-row__label{ font-size:13.5px; font-weight:500; }
.setting-row__hint{ display:block; margin-top:3px; font-size:11.5px; color:var(--ink-3); }
.switch{
  appearance:none; border:0; cursor:pointer;
  width:46px; height:27px; border-radius:var(--r-pill);
  background:var(--bg-soft); border:1px solid var(--line-2);
  position:relative; flex:0 0 auto;
  transition:background .22s var(--ease);
}
.switch::after{
  content:""; position:absolute; top:2px; left:2px;
  width:21px; height:21px; border-radius:50%;
  background:var(--card); box-shadow:0 2px 5px rgba(0,0,0,.2);
  transition:transform .22s var(--ease);
}
.switch[aria-pressed="true"]{ background:var(--ink); border-color:var(--ink); }
.switch[aria-pressed="true"]::after{ transform:translateX(19px); }

/* ---------- 15 聊天页 ---------- */
#chatView{ overflow:hidden; }
.chat__who{ display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; }
.chat__log{
  flex:1 1 auto; overflow-y:auto;
  width:100%; max-width:470px; margin:0 auto;
  padding:10px var(--pad) 18px;
  display:flex; flex-direction:column; gap:10px;
}
.bubble{
  max-width:76%;
  padding:11px 14px;
  border-radius:18px;
  font-size:14px; line-height:1.62;
  background:var(--card);
  border:1px solid var(--line);
  box-shadow:var(--shadow-sm);
  align-self:flex-start;
  animation:pop .24s var(--ease);
}
.bubble--me{ align-self:flex-end; background:var(--ink); color:var(--card); border-color:var(--ink); }
@keyframes pop{ from{ opacity:0; transform:translateY(6px) scale(.98); } to{ opacity:1; transform:none; } }

.chat__composer{
  display:flex; align-items:flex-end; gap:9px;
  width:100%; max-width:470px; margin:0 auto;
  padding:10px var(--pad) calc(env(safe-area-inset-bottom, 0px) + 14px);
}
.chat__input{
  flex:1 1 auto; min-width:0;
  min-height:42px; max-height:120px;
  padding:11px 15px;
  border-radius:20px;
  border:1px solid var(--line);
  background:var(--card);
  color:var(--ink);
  font:inherit; font-size:15px; line-height:1.5;
  resize:none; outline:none;
}
.chat__input::placeholder{ color:var(--ink-3); }

/* ---------- 16 面板 / 提示 ---------- */
.sheet{
  position:fixed; inset:0; z-index:50;
  display:flex; align-items:flex-end;
  background:rgba(0,0,0,.28);
  -webkit-backdrop-filter:blur(2px);
  backdrop-filter:blur(2px);
}
.sheet__panel{
  width:100%; max-width:470px; margin:0 auto;
  background:var(--bg);
  border-radius:30px 30px 0 0;
  padding:10px 18px calc(env(safe-area-inset-bottom, 0px) + 22px);
  box-shadow:0 -18px 44px -20px rgba(0,0,0,.4);
  animation:up .3s var(--ease);
}
@keyframes up{ from{ transform:translateY(100%); } to{ transform:none; } }
.sheet__grip{ display:block; width:38px; height:4px; border-radius:3px; background:var(--line-2); margin:2px auto 14px; }
.sheet__title{ margin:0 0 12px; font-size:16px; font-weight:700; letter-spacing:.01em; }

.toggles{ display:flex; flex-wrap:wrap; gap:8px; }
.toggle{
  appearance:none; cursor:pointer;
  display:flex; align-items:center; gap:7px;
  padding:10px 15px; border-radius:var(--r-pill);
  background:var(--card); border:1px solid var(--line);
  font-size:12.5px; color:var(--ink-2);
  transition:all .2s var(--ease);
}
.toggle__dot{ width:6px; height:6px; border-radius:50%; background:var(--ink-3); }
.toggle[aria-pressed="true"]{ background:var(--ink); color:var(--card); border-color:var(--ink); }
.toggle[aria-pressed="true"] .toggle__dot{ background:rgba(255,255,255,.9); }

.sheet__links{ margin-top:14px; display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; }
.sheet__link{
  appearance:none; cursor:pointer;
  padding:12px 0; border-radius:16px;
  background:var(--card); border:1px solid var(--line);
  font-size:12.5px; font-weight:500; color:var(--ink);
}
.sheet__link:active{ transform:scale(.97); }

.toast{
  position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom, 0px) + 190px);
  transform:translate(-50%, 8px);
  z-index:60;
  max-width:80vw;
  padding:10px 16px; border-radius:var(--r-pill);
  background:var(--ink); color:var(--card);
  font-size:12.5px; letter-spacing:.02em;
  opacity:0; pointer-events:none;
  transition:opacity .24s var(--ease), transform .24s var(--ease);
}
.toast.is-on{ opacity:1; transform:translate(-50%, 0); }

/* ---------- 17 响应式 ---------- */
@media (max-width:359px){
  :root{ --tile:50px; --icon:23px; --pad:14px; --gap:12px; }
  .greet__body{ grid-template-columns:80px 1fr; gap:11px; }
  .dots-tile{ width:80px; }
  .polaroid-wrap{ grid-template-columns:104px 1fr; gap:10px; }
  .counter__num{ font-size:26px; }
  .duo{ gap:9px; }
  .cover__name{ font-size:17px; }
}

@media (min-width:768px){
  :root{ --tile:62px; --icon:28px; --pad:24px; --gap:18px; }
  .page{ padding-bottom:210px; }
  .page__inner{ max-width:470px; }
  .fv__heading{ font-size:32px; }
  .chat__log, .chat__composer{ max-width:520px; }
  .dock{ width:430px; }
}

@media (max-height:640px){
  .page{ padding-bottom:180px; }
  .dots-tile{ width:78px; }
  .greet__line2{ font-size:12.5px; }
}

@media (prefers-reduced-motion:reduce){
  *{ animation-duration:.01ms !important; transition-duration:.01ms !important; }
}
`;

(function injectStyle(){
  if (document.getElementById("mini-phone-style")) return;
  const tag = document.createElement("style");
  tag.id = "mini-phone-style";
  tag.textContent = MINI_PHONE_CSS;
  document.head.appendChild(tag);
})();

/* ---------- 2 逻辑（原 app.js） ---------- */
/* =========================================================
   小手机 · 交互
   区块：1 应用表 2 工具 3 时钟 4 桌面分页 5 收件箱与聊天
        6 日历 7 星期条与天数 8 小组件 9 快捷面板
        10 应用页 11 事件绑定
   说明：聊天回复是本地演示文案，接 API 时替换 replyFor() 即可。
   ========================================================= */

/* ---------- 1 应用表 ---------- */
const APPS = {
  chat:      { name:'聊天',     sym:'i-chat',   kicker:'MESSAGES', heading:'会话',   desc:'所有角色会话集中在这里。点任意一条进入聊天页，输入框已经可用；接上模型 API 后把 replyFor() 换成真实请求即可。', chips:['会话列表','本地记录','输入框'], extra:'chat' },
  settings:  { name:'设置',     sym:'i-gear',   kicker:'SETTINGS', heading:'界面与参数', desc:'颜色、圆角、阴影、字号全部收在 CSS 变量里，这里只暴露最常用的几项。', chips:['外观','圆点','本地数据'], extra:'settings' },
  worldbook: { name:'世界书',   sym:'i-book',   kicker:'LORE',     heading:'设定条目', desc:'人设、世界观与关键词条目的存放处，后续按关键词触发插入上下文。', chips:['条目','关键词','插入权重'] },
  community: { name:'社区',     sym:'i-users',  kicker:'SOCIAL',   heading:'同好广场', desc:'角色卡分享、二创与讨论区，先留结构，内容后续接入。', chips:['角色卡分享','二创','讨论'] },
  icidy:     { name:'iCity',    sym:'i-note',   kicker:'NOTES',    heading:'城市笔记', desc:'随手记录的地点、心情与日程片段。', chips:['笔记','标签','搜索'] },
  insta:     { name:'Insta',    sym:'i-camera', kicker:'FEED',     heading:'动态',   desc:'以图片为主的日常流，可发布到相册。', chips:['发布','九宫格','点赞'] },
  schedule:  { name:'日程',     sym:'i-cal',    kicker:'CALENDAR', heading:'日程表', desc:'按天查看的安排与提醒，桌面日历卡点进来就是这一页。', chips:['月视图','提醒','重复'] },
  x:         { name:'X',        sym:'i-x',      kicker:'TIMELINE', heading:'时间线', desc:'短文本流，用于放角色日常碎片。', chips:['时间线','转发','话题'] },
  store:     { name:'商店',     sym:'i-bag',    kicker:'STORE',    heading:'主题商店', desc:'图标包、壁纸与主题，后续可以挂自己的素材包。', chips:['图标包','壁纸','主题'] },
  music:     { name:'音乐',     sym:'i-music',  kicker:'MUSIC',    heading:'正在播放', desc:'点歌、播放列表与一起听。桌面播放卡与点歌输入都会同步到这里。', chips:['点歌','列表','一起听'] },
  gallery:   { name:'图库',     sym:'i-image',  kicker:'GALLERY',  heading:'图片',   desc:'生成图与截图的归档，按角色和时间分组。', chips:['全部','角色','收藏'] },
  health:    { name:'健康',     sym:'i-heart',  kicker:'HEALTH',   heading:'状态',   desc:'睡眠、步数与心情打卡，自己填给自己看。', chips:['睡眠','步数','心情'] },
  valorant:  { name:'无畏契约', sym:'i-target', kicker:'GAME',     heading:'战绩',   desc:'对局记录与好友在线状态。', chips:['战绩','好友','段位'] },
  read:      { name:'阅读',     sym:'i-read',   kicker:'READ',     heading:'在读',   desc:'书单、进度与摘抄。', chips:['书单','进度','摘抄'] },
  control:   { name:'控制中心', sym:'i-sliders',kicker:'CONTROL',  heading:'快捷开关', desc:'免打扰、静音与夜间模式的集中入口，和悬浮面板共用同一状态。', chips:['免打扰','静音','夜间'], extra:'control' },
  phonecheck:{ name:'查手机',   sym:'i-phone',  kicker:'DEVICE',   heading:'设备状态', desc:'电量、存储与通知统计，给角色扮演留个“她在看我手机”的道具位。', chips:['电量','存储','通知'] },
  memory:    { name:'Memory',   sym:'i-brain',  kicker:'MEMORY',   heading:'长期记忆', desc:'按时间轴沉淀的对话摘要，供模型检索使用。', chips:['摘要','时间轴','检索'] },
  relation:  { name:'关系',     sym:'i-nodes',  kicker:'RELATION', heading:'关系网', desc:'角色之间的连线、亲密值与事件节点。', chips:['角色','连线','亲密度'] },
  travel:    { name:'旅行',     sym:'i-plane',  kicker:'TRAVEL',   heading:'行程',   desc:'想去的城市、机票与待办清单。', chips:['城市','行程','清单'] },
  tube:      { name:'Tube',     sym:'i-play',   kicker:'VIDEO',    heading:'视频',   desc:'收藏的视频与稍后看。', chips:['收藏','稍后看','播放'] },
  coop:      { name:'联机',     sym:'i-net',    kicker:'COOP',     heading:'联机房间', desc:'和角色一起开黑的房间入口。', chips:['房间','邀请','语音'] },
  codex:     { name:'Codex',    sym:'i-cmd',    kicker:'TOOLS',    heading:'提示词库', desc:'存好的提示词、正则与快捷指令。', chips:['提示词','正则','指令'] },
  gen:       { name:'生图',     sym:'i-image',  kicker:'IMAGE',    heading:'生成画面', desc:'提示词与画面比例的控制台，结果自动进图库。', chips:['提示词','比例','历史'] },
  album:     { name:'相册',     sym:'i-camera', kicker:'ALBUM',    heading:'角色相册', desc:'按角色归档的图墙。', chips:['角色','时间轴','大图'] }
};

const ORDER = ['icidy','insta','schedule','x','store','music','gallery','health','valorant','read','community','control',
               'phonecheck','memory','relation','travel','tube','coop','codex','chat','gen','album','worldbook','settings'];

/* ---------- 2 工具 ---------- */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const WEEK_FULL = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
const WEEK_MARK = ['日','一','二','三','四','五','六'];
const MONTH_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const pad2 = n => (n < 10 ? '0' + n : '' + n);

function store(key, value){
  try{
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  }catch(e){ return null; }
}

let toastTimer = null;
function toast(text){
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2000);
}

function useIcon(sym){
  return '<svg class="icon"><use href="#' + sym + '" xlink:href="#' + sym + '"></use></svg>';
}

/* ---------- 3 时钟 ---------- */
function tickClock(){
  const now = new Date();
  $('#sbTime').textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
}
tickClock();
setInterval(tickClock, 30 * 1000);

/* ---------- 4 桌面分页 ---------- */
const pager = $('#pager');
const dots  = $$('.dot');
let pageIndex = 0;

function gotoPage(i){
  const w = pager.clientWidth;
  pager.scrollTo({ left: i * w, behavior: 'smooth' });
  setDot(i);
}
function setDot(i){
  pageIndex = i;
  dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
}
let scrollRaf = null;
pager.addEventListener('scroll', () => {
  if (scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = null;
    const w = pager.clientWidth || 1;
    const i = Math.round(pager.scrollLeft / w);
    if (i !== pageIndex && i >= 0 && i < dots.length) setDot(i);
  });
}, { passive:true });

dots.forEach(d => d.addEventListener('click', () => gotoPage(+d.dataset.goto)));

document.addEventListener('keydown', e => {
  if ($('#appView').hidden === false || $('#chatView').hidden === false) return;
  if (e.key === 'ArrowRight') gotoPage(Math.min(pageIndex + 1, dots.length - 1));
  if (e.key === 'ArrowLeft')  gotoPage(Math.max(pageIndex - 1, 0));
});

/* ---------- 5 收件箱与聊天 ---------- */
const CONVOS = [
  { id:'xiayu',  name:'夏逾',   handle:'@xiaoyu_01',  time:'21:55', unread:true,  initial:'夏',
    preview:'你把我吓一跳，刚还在想你是不是睡了……' },
  { id:'qihz',   name:'祁寒知', handle:'@qi_hz',      time:'18:27', unread:true,  initial:'祁',
    preview:'盘子里的肉刚醒好，先分给脚边这只眼巴巴的馋鬼…' },
  { id:'new',    name:'新角色', handle:'@unnamed',    time:'17:32', unread:true,  initial:'新',
    preview:'[邀请] 已发送角色卡邀请，等待回应' }
];

const DEMO_REPLIES = {
  xiayu: ['我在。别关语音好不好。', '刚才那句我记下了，等你回来再说一遍。'],
  qihz:  ['嗯，在听。你继续说。', '这算什么，我还没认真呢。'],
  new:   ['角色卡还没设置好，先随便聊聊吧。']
};
let replyIndex = {};

function chatStore(){
  try{ return JSON.parse(store('mini-phone-chats') || '{}'); }catch(e){ return {}; }
}
function saveChats(data){ store('mini-phone-chats', JSON.stringify(data)); }

function renderInbox(){
  const box = $('#inboxList');
  box.innerHTML = '';
  CONVOS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'inbox__row';
    btn.dataset.convo = c.id;
    btn.innerHTML =
      '<span class="avatar avatar--row">' + c.initial + '</span>' +
      '<span class="row__main">' +
        '<span class="row__name"><span class="row__dot' + (c.unread ? '' : ' is-off') + '"></span>' + c.name + '</span>' +
        '<span class="row__preview">' + c.preview + '</span>' +
      '</span>' +
      '<span class="row__time">' + c.time + '</span>';
    box.appendChild(btn);
  });
  const n = CONVOS.filter(c => c.unread).length;
  $('#inboxNew').textContent = n ? n + ' new' : 'all read';
}

let activeConvo = null;

function openChat(id){
  const convo = CONVOS.find(c => c.id === id);
  if (!convo) return;
  activeConvo = id;
  $('#chatName').textContent = convo.name;
  $('#chatAvatar').textContent = convo.initial;
  $('#chatView').hidden = false;
  renderChatLog();
  $('#chatInput').focus();
}

function renderChatLog(){
  const log = $('#chatLog');
  const data = chatStore();
  const messages = data[activeConvo] || [];
  log.innerHTML = '';
  if (!messages.length){
    const tip = document.createElement('p');
    tip.style.cssText = 'margin:24px auto;font-size:12.5px;color:var(--ink-3);letter-spacing:.02em;text-align:center';
    tip.textContent = '本地演示会话 · 还没有消息，说第一句吧';
    log.appendChild(tip);
  }
  messages.forEach(m => {
    const b = document.createElement('div');
    b.className = 'bubble' + (m.role === 'me' ? ' bubble--me' : '');
    b.textContent = m.text;
    log.appendChild(b);
  });
  log.scrollTop = log.scrollHeight;
}

function pushMessage(role, text){
  const data = chatStore();
  if (!data[activeConvo]) data[activeConvo] = [];
  data[activeConvo].push({ role: role, text: text });
  saveChats(data);
  renderChatLog();
}

/* 接 API 时替换这个函数 */
function replyFor(id){
  const pool = DEMO_REPLIES[id] || DEMO_REPLIES.new;
  const i = (replyIndex[id] || 0) % pool.length;
  replyIndex[id] = i + 1;
  return pool[i];
}

function sendChat(){
  const input = $('#chatInput');
  const text = input.value.trim();
  if (!text){ toast('先写点什么'); return; }
  pushMessage('me', text);
  input.value = '';
  input.style.height = 'auto';

  const id = activeConvo;
  setTimeout(() => {
    if (activeConvo !== id) return;
    pushMessage('them', replyFor(id));
  }, 800);
}

/* ---------- 6 日历 ---------- */
const today = new Date();
const calState = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };

function renderCalendar(){
  const { year, month } = calState;
  $('#calMonth').textContent = MONTH_EN[month];
  $('#calYear').textContent = year;
  $('#calWeekday').textContent = WEEK_FULL[new Date(year, month, calState.day).getDay()];
  $('#calHint').textContent = calState.day + ' 日';

  $('#calWeek').innerHTML = WEEK_MARK.map(m => '<span>' + m + '</span>').join('');

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const grid = $('#calGrid');
  grid.innerHTML = '';

  for (let i = 0; i < first; i++){
    const b = document.createElement('button');
    b.className = 'cal__cell cal__cell--blank';
    b.setAttribute('aria-hidden', 'true');
    grid.appendChild(b);
  }
  for (let d = 1; d <= days; d++){
    const b = document.createElement('button');
    b.className = 'cal__cell';
    b.textContent = d;
    if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) b.classList.add('is-today');
    if (d === calState.day) b.classList.add('is-on');
    b.addEventListener('click', () => {
      calState.day = d;
      renderCalendar();
    });
    grid.appendChild(b);
  }
}

function shiftMonth(delta){
  const d = new Date(calState.year, calState.month + delta, 1);
  calState.year = d.getFullYear();
  calState.month = d.getMonth();
  const days = new Date(calState.year, calState.month + 1, 0).getDate();
  if (calState.day > days) calState.day = days;
  renderCalendar();
}

/* ---------- 7 星期条与天数 ---------- */
const weekState = { index: today.getDay() };

function renderWeek(){
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  const strip = $('#weekStrip');
  strip.innerHTML = '';
  for (let i = 0; i < 7; i++){
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);

    const cell = document.createElement('div');
    cell.className = 'ws';

    const day = document.createElement('span');
    day.className = 'ws__day';
    day.textContent = WEEK_MARK[i];

    const num = document.createElement('button');
    num.className = 'ws__num';
    num.textContent = d.getDate();
    if (d.toDateString() === today.toDateString()) num.classList.add('is-today');
    if (i === weekState.index) num.classList.add('is-on');
    num.addEventListener('click', () => {
      weekState.index = i;
      renderWeek();
      $('#dateNum').textContent = d.getDate();
      $('#dateWeek').textContent = WEEK_FULL[d.getDay()];
    });

    cell.appendChild(day);
    cell.appendChild(num);
    strip.appendChild(cell);
  }

  const sel = new Date(sunday);
  sel.setDate(sunday.getDate() + weekState.index);
  $('#dateNum').textContent = sel.getDate();
  $('#dateWeek').textContent = WEEK_FULL[sel.getDay()];
}

const SINCE = new Date(2026, 6, 4); // 2026-07-04
function renderCounter(){
  const diff = Math.max(1, Math.floor((new Date().setHours(0,0,0,0) - SINCE.getTime()) / 86400000));
  const y = SINCE.getFullYear();
  $('#sinceLabel').textContent = 'since ' + y + '.' + pad2(SINCE.getMonth() + 1) + '.' + pad2(SINCE.getDate());
  $('#dayCount').textContent = 'D+' + diff;
  $('#counterBar').style.width = Math.min(100, (diff % 365) / 365 * 100) + '%';
}

/* ---------- 8 小组件 ---------- */
$('#greetClose').addEventListener('click', () => {
  $('#greetCard').hidden = true;
  toast('已收起今日卡片');
});
$('#calClose').addEventListener('click', () => {
  $('#calCard').hidden = true;
  toast('已收起日历');
});
$('#playerClose').addEventListener('click', () => {
  $('#playerCard').hidden = true;
  toast('已收起播放器');
});

function setNowPlaying(title, sub){
  $('#npTitle').textContent = title;
  $('#npSub').textContent = sub;
  $('#playerTitle').textContent = title;
  $('#playerSub').textContent = sub;
}

$('#playerSend').addEventListener('click', () => {
  const v = $('#playerInput').value.trim();
  if (!v){ toast('先写一句点歌'); return; }
  setNowPlaying(v, '点歌 · 刚刚加入');
  $('#playerInput').value = '';
  toast('已同步到正在播放');
});
$('#playerInput').addEventListener('keydown', e => {
  if (e.key === 'Enter'){ e.preventDefault(); $('#playerSend').click(); }
});

/* 标点：复制到剪贴板 */
$$('.mark').forEach(btn => {
  btn.addEventListener('click', async () => {
    const m = btn.dataset.mark;
    try{
      await navigator.clipboard.writeText(m);
      toast('已复制「' + m + '」');
    }catch(e){
      toast('「' + m + '」长按可复制');
    }
  });
});

$('#followBtn').addEventListener('click', e => {
  const on = e.currentTarget.getAttribute('aria-pressed') === 'true';
  e.currentTarget.setAttribute('aria-pressed', String(!on));
  e.currentTarget.textContent = on ? '关注' : '已关注';
  toast(on ? '已取消关注' : '已关注');
});

/* ---------- 9 快捷面板 ---------- */
const toggles = { dnd:false, mute:false, night:false };

function applyNight(on){
  document.documentElement.setAttribute('data-theme', on ? 'night' : 'day');
  const sb = $('#sbBatteryFill');
  if (on) sb.style.opacity = '1';
}
function applyToggle(key, on, silent){
  toggles[key] = on;
  $$('[data-toggle="' + key + '"]').forEach(b => b.setAttribute('aria-pressed', String(on)));
  $$('[data-switch="' + key + '"]').forEach(b => b.setAttribute('aria-pressed', String(on)));
  if (key === 'night') applyNight(on);
}
$$('[data-toggle]').forEach(b => {
  b.addEventListener('click', () => applyToggle(b.dataset.toggle, !toggles[b.dataset.toggle]));
});

$('#fab').addEventListener('click', () => { $('#sheet').hidden = false; });
$('#sheet').addEventListener('click', e => {
  if (e.target === $('#sheet')) $('#sheet').hidden = true;
});

/* ---------- 10 应用页 ---------- */
function extraChatList(){
  const wrap = document.createElement('div');
  wrap.className = 'extra-list';
  CONVOS.forEach(c => {
    const row = document.createElement('button');
    row.className = 'inbox__row';
    row.style.cssText = 'background:var(--card);border:1px solid var(--line);border-radius:18px;padding:12px 14px;margin-bottom:8px';
    row.innerHTML =
      '<span class="avatar avatar--row">' + c.initial + '</span>' +
      '<span class="row__main"><span class="row__name">' + c.name + '</span>' +
      '<span class="row__preview">' + c.preview + '</span></span>' +
      '<span class="row__time">' + c.time + '</span>';
    row.addEventListener('click', () => {
      $('#appView').hidden = true;
      openChat(c.id);
    });
    wrap.appendChild(row);
  });
  return wrap;
}

function extraSettings(){
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:10px';
  wrap.innerHTML =
    '<div class="setting-row"><span class="setting-row__label">夜间模式<span class="setting-row__hint">深色背景与浅色文字</span></span><button class="switch" data-switch="night" aria-pressed="false" aria-label="夜间模式"></button></div>' +
    '<div class="setting-row"><span class="setting-row__label">桌面圆点<span class="setting-row__hint">隐藏底部分页指示</span></span><button class="switch" data-switch="dots" aria-pressed="true" aria-label="桌面圆点"></button></div>' +
    '<div class="setting-row"><span class="setting-row__label">清除本地聊天<span class="setting-row__hint">只删本机记录，不可恢复</span></span><button class="switch" data-switch="clear" aria-pressed="false" aria-label="清除聊天"></button></div>';
  return wrap;
}

function extraControl(){
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:10px';
  wrap.innerHTML =
    '<div class="setting-row"><span class="setting-row__label">免打扰</span><button class="switch" data-switch="dnd" aria-pressed="false" aria-label="免打扰"></button></div>' +
    '<div class="setting-row"><span class="setting-row__label">静音</span><button class="switch" data-switch="mute" aria-pressed="false" aria-label="静音"></button></div>' +
    '<div class="setting-row"><span class="setting-row__label">夜间模式</span><button class="switch" data-switch="night" aria-pressed="false" aria-label="夜间模式"></button></div>';
  return wrap;
}

function openApp(id){
  const app = APPS[id];
  if (!app) return;
  $('#appTitle').textContent = app.name;
  $('#appKicker').textContent = app.kicker;
  $('#appHeading').textContent = app.heading;
  $('#appDesc').textContent = app.desc;
  $('#appIcon').innerHTML = useIcon(app.sym);

  const chips = $('#appChips');
  chips.innerHTML = app.chips.map(c => '<span class="chip">' + c + '</span>').join('');

  const extra = $('#appExtra');
  extra.innerHTML = '';
  if (app.extra === 'chat') extra.appendChild(extraChatList());
  if (app.extra === 'settings') extra.appendChild(extraSettings());
  if (app.extra === 'control') extra.appendChild(extraControl());

  /* 让新生成的开关显示当前真实状态 */
  $$('[data-switch]', extra).forEach(b => {
    const key = b.dataset.switch;
    if (key === 'night' || key === 'dnd' || key === 'mute'){
      b.setAttribute('aria-pressed', String(toggles[key]));
    }
  });

  $('#appView').hidden = false;
  $('.fv__body', $('#appView')).scrollTop = 0;
}

function closeApp(){ $('#appView').hidden = true; }

/* 动态开关：设立即绑定 */
function bindSwitches(root){
  $$('[data-switch]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.switch;
      if (key === 'clear'){
        store('mini-phone-chats', '{}');
        toast('本地聊天已清除');
        return;
      }
      if (key === 'dots'){
        const on = btn.getAttribute('aria-pressed') === 'true';
        $('#dots').hidden = on;
        btn.setAttribute('aria-pressed', String(!on));
        return;
      }
      applyToggle(key, !toggles[key]);
    });
  });
}

/* ---------- 11 事件绑定 ---------- */
renderInbox();
renderCalendar();
renderWeek();
renderCounter();
applyToggle('night', false, true);

/* 所有 [data-app] 统一委托（含动态生成的） */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-app]');
  if (!el) return;
  if (el.closest('#sheet')) $('#sheet').hidden = true;
  openApp(el.dataset.app);
});

$$('.inbox__row[data-convo]').forEach(r => {
  r.addEventListener('click', () => openChat(r.dataset.convo));
});

$('#appBack').addEventListener('click', closeApp);
$('#chatBack').addEventListener('click', () => {
  $('#chatView').hidden = true;
  activeConvo = null;
});
$('#chatSend').addEventListener('click', sendChat);
$('#chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendChat(); }
});
$('#chatInput').addEventListener('input', e => {
  const el = e.target;
  el.style.height = 'auto';
  el.style.height = Math.min(120, el.scrollHeight) + 'px';
});

$('#calPrev').addEventListener('click', () => shiftMonth(-1));
$('#calNext').addEventListener('click', () => shiftMonth(1));

/* 应用页内动态开关（打开应用后再绑定） */
const appView = $('#appView');
const appObserver = new MutationObserver(() => bindSwitches(appView));
appObserver.observe($('#appExtra'), { childList:true });

/* 第 5 页：全部应用 */
(function renderAllApps(){
  const grid = $('#allApps');
  ORDER.forEach(id => {
    const app = APPS[id];
    if (!app) return;
    const btn = document.createElement('button');
    btn.className = 'app';
    btn.dataset.app = id;
    btn.innerHTML = '<span class="tile">' + useIcon(app.sym) + '</span><span class="app__label">' + app.name + '</span>';
    grid.appendChild(btn);
  });
})();

/* 记住主题 */
(function restoreTheme(){
  const saved = store('mini-phone-theme');
  if (saved === 'night') applyToggle('night', true, true);
})();
