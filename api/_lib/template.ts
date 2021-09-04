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
  let foregroundLight = "#8290A5";
  let gradient = "#E0E7FF";
  let highlight = "rgba(236,251,63,1)";
  let card = "#FFFFFF";
  let border = "#E4EAF3";

  if (theme === "dark") {
    background = "#131C28";
    foreground = "white";
    gradient = "#394558";
    highlight = "#8290A5";
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

    * {
      margin: 0;
      padding: 0;
    }

    body {
        display: flex;
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

    .logo-wrapper {
        display: flex;
        align-items: center;
        margin-right: 2.25rem;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin-bottom: 150px;
    }

    .reading-time {
      font-size: 0.6em;
      font-family: 'SpaceGrotesk', sans-serif;
      letter-spacing: -2px;
      color: ${foregroundLight};
      margin-bottom: 4rem;
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
        margin-bottom: 10rem;
    }

    .heading * {
        margin: 0;
    }

    .content {
      padding: 40px 80px;
    }

    .website {
      font-family: 'SpaceGrotesk', sans-serif;
      font-size: 0.65em;
      font-weight: 500;
      letter-spacing: -2px;
      color: ${foreground};
    }

    .slug {
      font-family: 'Inter', sans-serif;
      font-size: 0.4em;
      font-weight: 500;
      font-style: oblique;
      color: ${foreground};
      padding: 0.25rem;
      border-radius: 0.25rem;
      background: transparent;
      background-image: linear-gradient(90deg, ${highlight} 0%, rgba(255,255,255,0) 100%);
    }

    .media {
      display: inline-flex;
      flex-direction: row;
    }

    .media-meta {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .card {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(20%, 10%);
      display: flex;
      min-width: 900px;
      min-height: 94%;
      max-width: 50%;
      background: ${card};
      border-radius: 1.25rem;
      border: 2px solid ${border};
      box-shadow: 0px 5.30536px 31.8322px rgba(43, 53, 69, 0.12);
      overflow: hidden;
    }

    .card > img {
      width: auto;
      height : auto;
      max-height: 100%;
      max-width: 100%;
    }

    .image-container {
      position: relative;
    }

    .image {
      width: 100%; /* or any custom size */
      height: 100%;
      object-fit: cover;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const {
    text,
    theme,
    md,
    fontSize,
    images,
    widths,
    heights,
    entryImage,
    article,
    time,
  } = parsedReq;
  if (article) {
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
          <div class="reading-time">${time}</div>
          <div class="heading">
            ${emojify(md ? marked(text) : sanitizeHtml(text))}
          </div>
          <div class="media">
            <div class="logo-wrapper">
              ${images
                .map(
                  (img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                )
                .join("")}
            </div>
            <div class="media-meta">
              <p class="website">luizov.com</p>
              <p class="slug">/tailwind-linting</p>
            </div>
          </div>
        </div>
        <div class="card">
            <img
              src="${entryImage}"
              class="image"
              alt="Entry Image"
            />
        </div>
      </body>
  </html>`;
  }

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
          <div class="heading">
            ${emojify(md ? marked(text) : sanitizeHtml(text))}
          </div>
          <div class="media">
            <div class="logo-wrapper">
              ${images
                .map(
                  (img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                )
                .join("")}
            </div>
            <div class="media-meta">
              <p class="website">luizov.com</p>
              <p class="slug">/tailwind-linting</p>
            </div>
          </div>
        </div>
        <div class="card">
            <img
              src="${entryImage}"
              class="image"
              alt="Entry Image"
            />
        </div>
      </body>
  </html>`;
}

function getImage(src: string, width = "auto", height = "200") {
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

/* function getReadingTime(readingTime: string) {
  return `<div class="reading-time">${readingTime}</div>`;
} */
