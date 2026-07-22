---
case_id: shared-governance
stage: 07-deploy-verify
status: accepted
owner: Publishing / Frontend Receiver
reviewer: Product Decision Owner, UX / UI Owner
upstream_baseline: 06. 개발 전달·퍼블리싱의 accepted handoff manifest
decision_ids: [DEPLOY-001]
next_consumer: 강사, 수강생, 기획·디자인·개발 검토자
ai_contribution: 표준 정적 웹 구조화와 검증 자동화 보조, 사람 검토 후 배포 기준화
---

# 07. 배포·검증 (GitHub Pages)

## 이 단계의 역할

이 폴더는 06. 개발 전달·퍼블리싱까지 합의된 결과를 실제로 열어 보고 검토할 수 있는 정적 웹 결과물로 연결한다. GitHub Pages는 최신 기준을 빠르게 공유·확인하는 검증 환경이며, 이 폴더는 디자인 원본이나 실제 운영 서비스의 유일한 코드 저장소가 아니다.

사용자가 예시로 제시한 "07. publising"은 이미 06에서 다루는 전달·퍼블리싱과 역할이 겹친다. 따라서 07의 이름은 **배포·검증**으로 정해, “전달 이후 실제 결과를 확인하고 피드백을 다시 상위 단계로 연결하는 일”을 명확히 구분한다.

## 폴더 구조

    07. 배포·검증 (GitHub Pages)/
    ├── README.md
    ├── __폴더 운영 원칙.md
    └── site/
        ├── index.html
        ├── .nojekyll
        └── assets/
            ├── css/styles.css
            └── js/
                ├── data.js
                └── app.js

site만 GitHub Pages artifact로 배포한다. 이 구조는 생성 도구의 단일 대형 bundle 대신, 마크업·스타일·데이터·상호작용을 분리해 프론트엔드 담당자가 바로 읽고 수정할 수 있게 한다.

## 승인된 입력

- 05. Hi-Fi Design의 canonical source, screen/state/breakpoint 기준
- 06. 개발 전달·퍼블리싱의 accepted handoff manifest와 OPEN·blocker 해소 기록
- 현재 검증 대상 시나리오의 접근성, 콘텐츠, 보안·개인정보 가드레일

## 이 폴더에서 만드는 것

- 브라우저에서 바로 열 수 있는 정적 검증 웹 결과물
- 실제 화면 경로와 상태를 반영한 UI, mock data, interaction
- GitHub Pages 자동 배포 workflow와 배포 상태
- 검토 중 발견된 이슈를 상위 단계의 Decision 또는 CR로 되돌리는 연결

## 기준 원본과 변경 경계

| 대상 | 기준 위치 | 07에서 하는 일 |
| --- | --- | --- |
| 제품 범위·수용 기준 | 02. PRD | 검증 시나리오로 확인 |
| 정보 구조·상태 | 03. IA | 화면 흐름과 상태로 반영 |
| 시각 기준 | 05. Hi-Fi Design | 구현 표현이 기준과 맞는지 확인 |
| 전달 기준 | 06. 개발 전달·퍼블리싱 | 구현 가능성·미해결 질문을 확인 |
| 정적 검증 웹 | 07. 배포·검증 | 실제 브라우저 결과를 자동 배포 |

07에서 디자인·기획 결정을 조용히 바꾸면 안 된다. 발견한 차이는 Issue 또는 CR로 기록하고, 필요한 경우 가장 이른 영향을 받는 단계로 되돌린다.

## GitHub Pages 자동 배포

- 대상 브랜치: main
- 배포 입력: 이 폴더의 site 및 Pages workflow 변경
- 배포 방식: GitHub Actions artifact deployment
- 기본 공개 URL: https://zenit9hub.github.io/ai-ux-prototyping-collab-lab/

main에 병합된 최신 변경만 배포한다. Pull Request는 검증 workflow를 통과하지만 공개 배포는 하지 않는다. 수동 재배포는 Actions의 workflow_dispatch로 실행할 수 있다.

## 배포·검증 품질 게이트

- [ ] site의 index.html이 artifact 최상단에 있고 상대 경로가 깨지지 않는다.
- [ ] HTML, CSS, JavaScript가 생성 도구 runtime 없이 단독으로 동작한다.
- [ ] 화면별 주요 상태와 interaction이 05·06 기준과 연결된다.
- [ ] mock data와 실제 운영 데이터가 명확히 구분된다.
- [ ] 민감 정보, 비밀 키, 실고객 정보가 배포 artifact에 없다.
- [ ] GitHub Actions 배포가 성공하고 Pages URL에서 최신 commit을 확인했다.
- [ ] 검토에서 발견된 차이는 Issue 또는 CR로 추적한다.

## 현업 전환 시

이 폴더의 정적 웹은 교육·협업 검증용 기준 구현이다. 실제 제품 코드가 별도 개발 저장소에 있다면 07의 변경은 해당 저장소의 Issue·PR과 연결하고, 배포 환경·비밀값·테스트·릴리스 책임은 실제 개발 체계에서 관리한다.
