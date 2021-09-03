import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const headings = readFileSync(
  `${__dirname}/../_fonts/SpaceGrotesk-var.woff2`
).toString("base64");
const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "#2B3545";
  let gradient = "#E0E7FF";
  let card = "#FFFFFF";
  let border = "#E4EAF3";

  if (theme === "dark") {
    background = "#131C28";
    foreground = "white";
    gradient = "#394558";
    card = "#394558";
    border = "rgba(255,255,255, 0.1)";
  }
  return `
        @font-face {
        font-family: 'SpaceGrotesk';
        font-style:  normal;
        font-weight: 100 800;
        src: url(data:font/woff2;charset=utf-8;base64,${headings}) format('woff2');
    }
    
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 100vh;
        width: 100%;
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        background: ${background};
        background-image: linear-gradient(180deg, ${background} 36.35%, ${gradient} 119.05%);
        text-align: left;
        margin: 0;
        padding: 0;

    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
    }

    .logo {
        margin: 0 0 64px 0;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin-bottom: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .desc {
        max-width: 60%;
        font-family: 'Inter', sans-serif;
        font-size: 0.5em;
        font-weight: 500;
        color: #8290A5;
        margin-bottom: 50px !important;
    }

    .website {
        font-size: 0.5em;
        opacity: 0.6;
        font-weight: 400;
    }
    
    .heading {
        max-width: 60%;
        font-family: 'SpaceGrotesk', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: 800;
        font-style: normal;
        color: ${foreground};
        line-height: 1.1;
        letter-spacing: -4px;
    }

    .heading * {
        margin: 0;
    }

    .content {
      display: flex;
      flex-direction: column;
      padding: 40px 80px;
    }
    
    .card {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(20%, 10%);
      display: flex;
      min-width: 900px;
      min-height: 94%;
      background: ${card};
      border-radius: 0.75rem;
      border: 2px solid ${border};
      box-shadow: 0px 5.30536px 31.8322px rgba(43, 53, 69, 0.12);
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, desc, theme, md, fontSize, images, widths, heights } =
    parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
      <div class="content">
        <div class="logo-wrapper">
          ${images
            .map(
              (img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i])
            )
            .join("")}
        </div>
        <div class="heading">
          ${emojify(md ? marked(text) : sanitizeHtml(text))}
        </div>
        <p class="desc">${desc}</p>
      </div>
      <div class="card">
      </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
