import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const headings = readFileSync(
  `${__dirname}/../_fonts/Fira-Sans-Semi.woff2`
).toString("base64");
const rglr = readFileSync(
  `${__dirname}/../_fonts/Fira-Sans-Regular.woff2`
).toString("base64");

function getCss(theme: string, fontSize: string) {
  let background = "#F9F8F9";
  let foreground = "#11181C";
  let foregroundLight = "#697177";
  let gradient = "#FDFCFD";
  let highlight = "rgba(236,251,63,1)";
  let card = "#F9FAFB";
  let border = "#D7DCDF";

  if (theme === "dark") {
    background = "#161618";
    foreground = "#EDEDEF";
    gradient = "#232326";
    highlight = "#8290A5";
    card = "#232326";
    border = "#3E3E44";
  }
  return `
        @font-face {
        font-family: 'Fira Sans';
        font-style:  normal;
        font-weight: 600;
        src: url(data:font/woff2;charset=utf-8;base64,${headings}) format('woff2');
    }
    
    @font-face {
        font-family: 'Fira Sans';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
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
        font-family: 'Fira Sans', sans-serif;
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
      font-size: 4rem;
      font-family: 'Fira Sans', sans-serif;
      letter-spacing: -2px;
      color: ${foregroundLight};
      margin-bottom: 4rem;
    }
    
    .heading {
        max-width: 60%;
        font-family: 'Fira Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: 600;
        font-style: normal;
        color: ${foreground};
        line-height: 1.1;
        letter-spacing: -2px;
        margin-bottom: 12rem;
    }

    .heading * {
        margin: 0;
    }

    .content {
      padding: 40px 80px;
    }

    .website {
      font-family: 'Fira Sans', sans-serif;
      font-size: 2.5rem;
      font-weight: 600;
      color: ${foreground};
    }

    .slug {
      font-family: 'Fira Sans', sans-serif;
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
    slug,
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
          <div class="reading-time">${time} read</div>
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
              <p class="website">temattic.com</p>
              <p class="slug">/blog/${slug}</p>
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
              <p class="website">temattic.com</p>
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
