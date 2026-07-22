import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

const expectedFiles = [
  "README.md",
  "AGENTS.md",
  "CONTRIBUTING.md",
  ".gitignore",
  ".gitattributes",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/CODEOWNERS",
  ".github/README.md",
  ".github/ISSUE_TEMPLATE/decision.md",
  ".github/ISSUE_TEMPLATE/change-request.md",
  ".github/workflows/validate-stage.yml",
  "00. 운영·공통 기준/00. 통합 R&R 및 전체 작업 흐름.md",
  "00. 운영·공통 기준/01. 하네스 엔지니어링 운영 규칙.md",
  "00. 운영·공통 기준/02. 산출물 계약·품질 게이트.md",
  "00. 운영·공통 기준/03. AI 협업·변경 관리 규칙.md",
  "00. 운영·공통 기준/04. 강의 기준자료와 현업 전환 안내.md",
  "00. 운영·공통 기준/visual/00. AI Native Workflow Map.html",
];

const stages = [
  ["01", "01. 요구사항 수집·리서치"],
  ["02", "02. PRD"],
  ["03", "03. IA"],
  ["04", "04. Wireframe"],
  ["05", "05. Hi-Fi Design (Figma Make, Claude Design)"],
  ["06", "06. 개발 전달·퍼블리싱"],
];

const canonicalMetadata = [
  "case_id",
  "stage",
  "status",
  "owner",
  "reviewer",
  "upstream_baseline",
  "decision_ids",
  "next_consumer",
  "ai_contribution",
];

const allowedStatuses = new Set(["draft", "review", "accepted", "superseded"]);

function relative(filePath) {
  return path.relative(root, filePath) || ".";
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function isExternal(target) {
  return /^(https?:|mailto:|tel:|data:|#)/i.test(target);
}

function localTarget(target) {
  const withoutFragment = target.split("#")[0].split("?")[0];
  try {
    return decodeURIComponent(withoutFragment);
  } catch {
    errors.push("URL 인코딩을 해석할 수 없습니다: " + target);
    return null;
  }
}

function validateRelativeLink(sourceFile, target) {
  const normalizedTarget = target.trim();
  if (!normalizedTarget || isExternal(normalizedTarget)) {
    return;
  }

  const decodedTarget = localTarget(normalizedTarget);
  if (!decodedTarget) {
    return;
  }

  const destination = path.resolve(path.dirname(sourceFile), decodedTarget);
  if (!fs.existsSync(destination)) {
    errors.push(
      "상대 링크의 대상이 없습니다: " +
        relative(sourceFile) +
        " → " +
        normalizedTarget
    );
  }
}

function validateLinks(file) {
  const extension = path.extname(file).toLowerCase();
  if (extension !== ".md" && extension !== ".html") {
    return;
  }

  const content = read(file);
  if (extension === ".md") {
    const markdownLink = /\[[^\]]*?\]\(\s*(?:<([^>]+)>|([^\s)]+))\s*\)/g;
    for (const match of content.matchAll(markdownLink)) {
      validateRelativeLink(file, match[1] || match[2]);
    }
    return;
  }

  const htmlLink = /\bhref\s*=\s*["']([^"']+)["']/gi;
  for (const match of content.matchAll(htmlLink)) {
    validateRelativeLink(file, match[1]);
  }
}

for (const required of expectedFiles) {
  if (!exists(required)) {
    errors.push("필수 파일이 없습니다: " + required);
  }
}

for (const [stageNumber, stageFolder] of stages) {
  if (!exists(stageFolder)) {
    errors.push("필수 단계 폴더가 없습니다: " + stageFolder);
    continue;
  }

  const readme = path.join(root, stageFolder, "README.md");
  if (!fs.existsSync(readme)) {
    errors.push("단계 README가 없습니다: " + relative(readme));
  }

  for (const file of walk(path.join(root, stageFolder))) {
    if (path.extname(file).toLowerCase() !== ".md" || path.basename(file) === "README.md") {
      continue;
    }

    const content = read(file);
    if (!/^---\s*\n[\s\S]*?^---\s*$/m.test(content) || !/^case_id:\s*\S+/m.test(content)) {
      continue;
    }

    for (const key of canonicalMetadata) {
      const pattern = new RegExp("^" + key + ":\\s*\\S+", "m");
      if (!pattern.test(content)) {
        errors.push(relative(file) + "에 canonical metadata가 없습니다: " + key);
      }
    }

    const statusMatch = content.match(/^status:\s*([a-z-]+)/m);
    if (statusMatch && !allowedStatuses.has(statusMatch[1])) {
      errors.push(relative(file) + "의 status 값이 허용되지 않습니다: " + statusMatch[1]);
    }

    const stageMatch = content.match(/^stage:\s*([^\s#]+)/m);
    if (stageMatch && !stageMatch[1].startsWith(stageNumber + "-")) {
      errors.push(relative(file) + "의 stage는 " + stageNumber + "-로 시작해야 합니다.");
    }
  }
}

for (const file of walk(root)) {
  const name = path.basename(file);
  validateLinks(file);

  if (/_final(?:[_\s-]?\d+)?/i.test(name) || /최종[_\s-]?(?:진짜|완성|v?\d+)/.test(name)) {
    warnings.push(
      "파일명에 버전 복제 관행이 의심됩니다. Git 이력과 canonical status를 사용하세요: " +
        relative(file)
    );
  }
}

if (warnings.length > 0) {
  console.warn("경고:");
  for (const warning of warnings) {
    console.warn("- " + warning);
  }
}

if (errors.length > 0) {
  console.error("저장소 계약 검증 실패:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exitCode = 1;
} else {
  console.log("저장소 계약 검증 통과: " + stages.length + "개 단계와 공통 운영 기준을 확인했습니다.");
}
