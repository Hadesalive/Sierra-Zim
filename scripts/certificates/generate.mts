/**
 * Certificate generator.
 *
 *   npx tsx scripts/certificates/generate.mts [--design classic|yard|all] [--only SZ-26-XXXXXX] [--out <dir>]
 *
 * Reads src/content/certificates.json, renders each certificate to an A4
 * landscape PDF with headless Chrome, and stamps a QR code that opens
 * https://www.sierrazim.com/verify/<code>. Default output: ../certificate/redesigned/<design>/
 *
 * Adding a certificate: append an entry to certificates.json with a new random
 * code (see newCode() below, or run with --new-code to print one), deploy the
 * site so /verify knows about it, then run this script.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { randomInt } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const SITE_URL = "https://www.sierrazim.com";
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

type Cert = { code: string; name: string; course: string; issued: string; status?: string };

const args = process.argv.slice(2);
const arg = (k: string) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};

export function newCode(year = new Date().getFullYear()) {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += A[randomInt(A.length)];
  return `SZ-${String(year).slice(2)}-${s}`;
}

if (args.includes("--new-code")) {
  console.log(newCode());
  process.exit(0);
}

const designs = (arg("--design") ?? "all") === "all" ? ["classic", "yard"] : [arg("--design")!];
const only = arg("--only");
const outRoot = path.resolve(arg("--out") ?? path.join(root, "../certificate/redesigned"));
const certs = (JSON.parse(readFileSync(path.join(root, "src/content/certificates.json"), "utf8")) as Cert[])
  .filter((c) => c.status !== "revoked")
  .filter((c) => !only || c.code === only);

// ---------- assets (inlined as data URIs so each HTML file is self-contained) ----------
const assetDir = path.join(here, "assets");
const dataUri = async (file: string) =>
  `data:image/png;base64,${(await sharp(path.join(assetDir, file)).png().toBuffer()).toString("base64")}`;
const LOGO = `data:image/png;base64,${readFileSync(path.join(root, "public/brand/logo.png")).toString("base64")}`;
const SIGNATURE = await dataUri("signature.png");
const FG_GOLD = await dataUri("fg-gold.png");

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Pinyon+Script&display=block" rel="stylesheet">`;

const BASE_CSS = `@page{size:297mm 210mm;margin:0}*{box-sizing:border-box;margin:0;padding:0}
html,body{width:297mm;height:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{position:relative;overflow:hidden;background:#fff}`;

/** Shrink the name if it's long so it never wraps. */
const nameSize = (name: string, base: number, perChar: number, threshold: number) =>
  Math.max(base * 0.62, base - Math.max(0, name.length - threshold) * perChar);

// ---------- Design 1: Classic ----------
function classic(c: Cert, qr: string, url: string) {
  const size = nameSize(c.name, 30, 0.75, 16);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
:root{--forest:#094e1d;--forest2:#0b7c29;--gold:#b08a1e;--gold2:#e2c15a;--ink:#14201a;--soft:#55635c}
body{background:#fffdf7}
.frame{position:absolute;inset:8mm;border:1.6mm solid var(--forest)}
.frame::before{content:"";position:absolute;inset:1.8mm;border:.35mm solid var(--gold)}
.frame::after{content:"";position:absolute;inset:3mm;border:.2mm solid var(--gold)}
.corner{position:absolute;width:16mm;height:16mm;border:.6mm solid var(--gold)}
.corner.tl{top:13mm;left:13mm;border-right:0;border-bottom:0}.corner.tr{top:13mm;right:13mm;border-left:0;border-bottom:0}
.corner.bl{bottom:13mm;left:13mm;border-right:0;border-top:0}.corner.br{bottom:13mm;right:13mm;border-left:0;border-top:0}
.watermark{position:absolute;left:50%;top:52%;width:120mm;transform:translate(-50%,-50%);opacity:.06}
.flag{position:absolute;left:8mm;right:8mm;bottom:8mm;height:1.6mm;display:flex}
.flag i{flex:1}
.wrap{position:absolute;inset:20mm 26mm 18mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.head{display:flex;align-items:center;justify-content:space-between;width:100%}
.head img.logo{height:23mm}.head img.fg{height:11mm;opacity:.9}
.org{font-family:'Barlow Condensed';font-weight:600;letter-spacing:.42em;font-size:11pt;color:var(--forest);text-transform:uppercase}
h1{margin-top:5mm;font-family:'Cormorant Garamond';font-weight:600;font-size:40pt;letter-spacing:.06em;color:var(--forest);line-height:1;text-transform:uppercase}
.sub{margin-top:2.5mm;font-family:'Barlow Condensed';font-weight:500;letter-spacing:.5em;font-size:10.5pt;color:var(--gold);text-transform:uppercase}
.rule{margin:5mm auto 0;width:70mm;height:.3mm;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.pres{margin-top:5mm;font-family:'Cormorant Garamond';font-style:italic;font-size:15pt;color:var(--soft)}
.name{margin-top:2mm;font-family:'Cormorant Garamond';font-weight:700;font-size:${size}pt;color:var(--ink);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
.nameline{width:150mm;height:.35mm;background:var(--gold);margin-top:1.5mm}
.for{margin-top:5mm;font-family:'Barlow';font-size:11.5pt;color:var(--soft)}
.course{margin-top:1.5mm;font-family:'Barlow Condensed';font-weight:700;font-size:21pt;letter-spacing:.06em;color:var(--forest2);text-transform:uppercase}
.foot{margin-top:auto;width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:10mm}
.sig{text-align:center;width:62mm}.sig img{height:15mm;mix-blend-mode:multiply;display:block;margin:0 auto -2mm}
.sig img{height:17mm}.sig .val{font-family:'Cormorant Garamond';font-weight:600;font-size:14pt;color:var(--ink);height:13mm;display:flex;align-items:flex-end;justify-content:center;padding-bottom:1mm}
.sig .line{height:.3mm;background:var(--ink);opacity:.6}
.sig .lab{margin-top:1.5mm;font-family:'Barlow Condensed';font-weight:600;letter-spacing:.25em;font-size:8.5pt;color:var(--soft);text-transform:uppercase}
.seal{width:30mm;height:30mm;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6e39a,var(--gold2) 35%,var(--gold) 75%,#7d5f0c);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1.2mm #fffdf7,0 0 0 1.6mm var(--gold);margin-bottom:2mm}
.seal div{width:24mm;height:24mm;border-radius:50%;border:.4mm dashed rgba(255,255,255,.7);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:'Barlow Condensed';font-weight:700;text-transform:uppercase;line-height:1.05;text-shadow:0 .3mm .6mm rgba(0,0,0,.25)}
.seal b{font-size:13pt;letter-spacing:.08em}.seal small{font-size:6.5pt;letter-spacing:.2em}
.qr{position:absolute;right:20mm;bottom:19mm;display:flex;align-items:flex-end;gap:3mm;text-align:right}
.qr svg{width:22mm;height:22mm;display:block;background:#fff;padding:1.2mm;border:.25mm solid var(--gold)}
.qr .t{font-family:'IBM Plex Mono';font-size:6.4pt;line-height:1.45;color:var(--soft)}
.qr .t b{display:block;font-weight:500;font-size:8.3pt;color:var(--ink);letter-spacing:.06em}
.foot{padding-right:30mm}
</style></head><body>
<img class="watermark" src="${LOGO}" alt="">
<div class="frame"></div>
<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
<div class="flag"><i style="background:#0f9531"></i><i style="background:#fff"></i><i style="background:#0a63c4"></i><i style="background:#f0c000"></i><i style="background:#d81e1e"></i><i style="background:#14201a"></i></div>
<div class="wrap">
  <div class="head"><img class="logo" src="${LOGO}" alt=""><div class="org">SierraZim Training Academy</div><img class="fg" src="${FG_GOLD}" alt=""></div>
  <h1>Certificate</h1>
  <div class="sub">of Recognition</div>
  <div class="rule"></div>
  <div class="pres">This certificate is proudly presented to</div>
  <div class="name">${esc(c.name)}</div>
  <div class="nameline"></div>
  <div class="for">for successfully completing the</div>
  <div class="course">${esc(c.course)}</div>
  <div class="foot">
    <div class="sig"><img src="${SIGNATURE}" alt=""><div class="line"></div><div class="lab">Instructor</div></div>
    <div class="seal"><div><small>SierraZim</small><b>Certified</b><small>${c.issued.slice(0, 4)}</small></div></div>
    <div class="sig"><div class="val">${fmtDate(c.issued)}</div><div class="line"></div><div class="lab">Date of issue</div></div>
  </div>
</div>
<div class="qr"><div class="t">Scan to verify<b>${c.code}</b>sierrazim.com/verify</div>${qr}</div>
<!-- ${url} -->
</body></html>`;
}

// ---------- Design 2: Safety Yard (matches the website) ----------
function yard(c: Cert, qr: string, url: string) {
  const size = nameSize(c.name, 60, 1.7, 14);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
:root{--f950:#04250f;--f900:#073a17;--f800:#094e1d;--f600:#0b7c29;--gold:#f0c000;--ink:#14201a;--soft:#55635c;--line:#e1e9e4}
.side{position:absolute;left:0;top:0;bottom:0;width:78mm;background:var(--f950);color:#fff;padding:14mm 11mm 12mm;display:flex;flex-direction:column}
.side::after{content:"";position:absolute;right:0;top:0;bottom:0;width:4mm;background:repeating-linear-gradient(-45deg,var(--gold) 0 3mm,var(--f950) 3mm 6mm)}
.side .logo{width:52mm;background:#fff;padding:3mm;align-self:flex-start}
.side .k{margin-top:auto;font-family:'IBM Plex Mono';font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.side .v{font-family:'Barlow Condensed';font-weight:600;font-size:13pt;letter-spacing:.04em;margin-top:1mm;margin-bottom:4.5mm}
.side .v.mono{font-family:'IBM Plex Mono';font-weight:500;font-size:11pt;letter-spacing:.08em;color:var(--gold)}
.qrbox{display:flex;gap:3.5mm;align-items:center;border-top:.25mm solid rgba(255,255,255,.18);padding-top:5mm}
.qrbox svg{width:27mm;height:27mm;background:#fff;padding:1.5mm;display:block;flex:none}
.qrbox p{font-family:'Barlow';font-size:8pt;line-height:1.4;color:rgba(255,255,255,.75)}
.qrbox p b{display:block;white-space:nowrap;font-family:'Barlow Condensed';font-weight:700;font-size:11pt;letter-spacing:.1em;text-transform:uppercase;color:#fff;margin-bottom:.8mm}
.main{position:absolute;left:78mm;right:0;top:0;bottom:0;padding:16mm 18mm 13mm 20mm;display:flex;flex-direction:column}
.main::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--line) .2mm,transparent .2mm),linear-gradient(90deg,var(--line) .2mm,transparent .2mm);background-size:10mm 10mm;opacity:.55;-webkit-mask-image:linear-gradient(160deg,#000 0,transparent 55%);z-index:-1}
.top{display:flex;justify-content:space-between;align-items:flex-start}
.eyebrow{font-family:'IBM Plex Mono';font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:#8a6300}
.fg{height:11mm}
h1{margin-top:6mm;font-family:'Barlow Condensed';font-weight:800;font-size:50pt;line-height:.9;text-transform:uppercase;color:var(--ink);letter-spacing:-.005em}
h1 span{color:var(--f600)}
.aw{margin-top:14mm;font-family:'IBM Plex Mono';font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--soft)}
.name{margin-top:1.5mm;font-family:'Barlow Condensed';font-weight:700;font-size:${size}pt;line-height:1;text-transform:uppercase;color:var(--f800);white-space:nowrap}
.bar{margin-top:3mm;height:1.6mm;width:34mm;background:var(--gold)}
.for{margin-top:8mm;font-family:'Barlow';font-size:13pt;color:var(--soft)}
.course{font-family:'Barlow Condensed';font-weight:700;font-size:26pt;text-transform:uppercase;letter-spacing:.02em;color:var(--ink);margin-top:.5mm}
.foot{margin-top:auto;display:flex;align-items:flex-end;gap:14mm}
.sig{width:66mm}.sig img{height:16mm;mix-blend-mode:multiply;display:block;margin-bottom:-2mm}
.sig .line{height:.3mm;background:var(--ink)}
.sig .lab{margin-top:1.5mm;font-family:'IBM Plex Mono';font-size:7pt;letter-spacing:.18em;text-transform:uppercase;color:var(--soft)}
.stamp{margin-left:auto;width:31mm;height:31mm;border-radius:50%;border:.7mm solid var(--f600);display:flex;align-items:center;justify-content:center;transform:rotate(-12deg);color:var(--f600)}
.stamp div{width:26mm;height:26mm;border-radius:50%;border:.3mm solid var(--f600);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Barlow Condensed';font-weight:700;text-transform:uppercase;line-height:1}
.stamp b{font-size:14pt;letter-spacing:.06em;margin:.8mm 0}.stamp small{font-size:6.5pt;letter-spacing:.18em}
.strip{position:absolute;left:78mm;right:0;bottom:0;height:2.2mm;display:flex}.strip i{flex:1}
</style></head><body>
<aside class="side">
  <img class="logo" src="${LOGO}" alt="">
  <div class="k">Certificate no.</div><div class="v mono">${c.code}</div>
  <div class="k" style="margin-top:0">Date of issue</div><div class="v">${fmtDate(c.issued)}</div>
  <div class="qrbox">${qr}<p><b>Scan to verify</b>Confirms this certificate is genuine</p></div>
</aside>
<main class="main">
  <div class="top"><div class="eyebrow">SierraZim Training Academy</div><img class="fg" src="${FG_GOLD}" alt=""></div>
  <h1>Certificate of<br><span>Recognition</span></h1>
  <div class="aw">Awarded to</div>
  <div class="name">${esc(c.name)}</div>
  <div class="bar"></div>
  <div class="for">for successfully completing the</div>
  <div class="course">${esc(c.course)}</div>
  <div class="foot">
    <div class="sig"><img src="${SIGNATURE}" alt=""><div class="line"></div><div class="lab">Instructor</div></div>
    <div class="stamp"><div><small>SierraZim</small><b>Certified</b><small>Training Academy</small></div></div>
  </div>
</main>
<div class="strip"><i style="background:#0f9531"></i><i style="background:#0a63c4"></i><i style="background:#f0c000"></i><i style="background:#d81e1e"></i><i style="background:#14201a"></i></div>
<!-- ${url} -->
</body></html>`;
}

const RENDER = { classic, yard } as Record<string, typeof classic>;
const tmp = path.join(outRoot, ".html");
mkdirSync(tmp, { recursive: true });

for (const design of designs) {
  const dir = path.join(outRoot, design);
  mkdirSync(dir, { recursive: true });
  for (const c of certs) {
    const url = `${SITE_URL}/verify/${c.code}`;
    const qr = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      color: { dark: "#14201a", light: "#ffffff" },
    });
    const html = RENDER[design](c, qr, url);
    const htmlFile = path.join(tmp, `${design}-${c.code}.html`);
    writeFileSync(htmlFile, html);
    const pdf = path.join(dir, `CERTIFICATE-${c.name} (${c.code}).pdf`);
    execFileSync(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${pdf}`,
      `file://${htmlFile}`,
    ], { stdio: "ignore" });
    if (args.includes("--preview")) {
      execFileSync(CHROME, [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=8000",
        "--window-size=1123,794", `--screenshot=${path.join(outRoot, `preview-${design}.png`)}`, `file://${htmlFile}`,
      ], { stdio: "ignore" });
    }
    console.log(`${design}  ${c.code}  ${c.name}`);
  }
}
if (existsSync(tmp) && !args.includes("--keep-html")) rmSync(tmp, { recursive: true });
