import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const deployRoot = path.join(root, "07. 배포·검증 (GitHub Pages)", "site");
const errors = [];

const expectedFiles = [
  "index.html",
  ".nojekyll",
  "assets/css/styles.css",
  "assets/js/data.js",
  "assets/js/app.js",
];

function read(relativePath) {
  return fs.readFileSync(path.join(deployRoot, relativePath), "utf8");
}

for (const relativePath of expectedFiles) {
  if (!fs.existsSync(path.join(deployRoot, relativePath))) {
    errors.push("배포 artifact 필수 파일이 없습니다: " + relativePath);
  }
}

if (errors.length === 0) {
  const index = read("index.html");
  const css = read("assets/css/styles.css");
  const app = read("assets/js/app.js");
  const data = read("assets/js/data.js");

  const requiredIndexMarkers = [
    "<!doctype html>",
    "./assets/css/styles.css",
    "./assets/js/app.js",
    'id="main-content"',
  ];
  for (const marker of requiredIndexMarkers) {
    if (!index.toLowerCase().includes(marker.toLowerCase())) {
      errors.push("index.html에 필요한 기준이 없습니다: " + marker);
    }
  }

  if (index.includes("__bundler") || app.includes("__bundler") || app.includes("new Function")) {
    errors.push("생성 도구 bundle runtime이 배포 소스에 남아 있습니다.");
  }

  if (!css.includes("@media")) {
    errors.push("styles.css에 반응형 media query가 없습니다.");
  }

  const accessibilityMarkers = ["aria-live", "aria-modal", "data-autofocus"];
  for (const marker of accessibilityMarkers) {
    if (!app.includes(marker) && !index.includes(marker)) {
      errors.push("접근성 기준 marker가 없습니다: " + marker);
    }
  }

  const scripts = ["assets/js/data.js", "assets/js/app.js"];
  for (const script of scripts) {
    const syntaxCheck = spawnSync(process.execPath, ["--check", path.join(deployRoot, script)], {
      encoding: "utf8",
    });
    if (syntaxCheck.status !== 0) {
      errors.push(script + " 문법 검사 실패: " + (syntaxCheck.stderr || syntaxCheck.stdout).trim());
    }
  }

  if (!data.includes("export const devices") || !data.includes("export const initialAlerts")) {
    errors.push("mock data module의 필수 export가 없습니다.");
  }
}

if (errors.length > 0) {
  console.error("배포 사이트 검증 실패:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exitCode = 1;
} else {
  console.log("배포 사이트 검증 통과: 정적 artifact와 기본 접근성·반응형 기준을 확인했습니다.");
}
