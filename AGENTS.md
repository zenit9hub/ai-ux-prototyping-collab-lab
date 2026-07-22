# AI Agent Working Agreement

이 저장소에서 AI 에이전트는 사람이 정한 작업 범위와 단계별 계약 안에서만 보조한다. AI는 초안·구조화·비교·검수 제안을 만들 수 있지만, 사업 사실·정책·승인을 스스로 확정하지 않는다.

## 1. 작업 범위

- 요청받은 사례와 현재 단계 폴더만 우선 수정한다.
- `00. 운영·공통 기준`과 `.github`은 Repository Steward 또는 명시적 요청이 있을 때만 바꾼다.
- 직전 단계의 accepted baseline은 원본으로 보존한다. 수정이 필요하면 변경 요청(`CR-###`)을 기록하고, 영향을 받는 하위 단계를 알린다.
- Hi-Fi 기준 원본은 `05. Hi-Fi Design (Figma Make, Claude Design)`의 canonical manifest다. `06`에는 canonical 복사본을 만들지 않는다. 다만 구현 수신에 상호작용 참고가 필요하면, manifest에 기준·동결일·도구·상태를 기록한 **단일 standalone HTML**을 `reference-only`로 패키징할 수 있다. 이는 구현 원본이 아니다.

- 07. 배포·검증 (GitHub Pages)의 site는 검증용 정적 source다. 실제 운영 데이터·비밀값·실장비 제어 API를 추가하지 않는다.

## 2. 시작 전 확인

1. 루트 `README.md`와 현재 단계의 `README.md`를 읽는다.
2. 이번 작업의 `case_id`, 현재 `stage`, `owner`, `upstream_baseline`을 확인한다.
3. 입력 산출물이 `accepted`인지 확인한다. 승인 전 초안은 참고로만 쓰고, 사실처럼 전파하지 않는다.
4. 필요한 경우 `00. 운영·공통 기준`의 템플릿과 품질 게이트를 먼저 읽는다.

## 3. 사실성·결정 표기

문서에는 아래 구분을 유지한다.

- `FACT`: 출처·날짜·근거가 확인된 사실
- `ASSUMPTION`: 확인 전이지만 설계를 진행하기 위한 가정
- `DECISION`: 책임자가 승인한 선택
- `OPEN`: 다음 결정 또는 추가 검증이 필요한 항목

리서치가 수행되지 않았으면 “리서치에서 확인됨”이라고 쓰지 않는다. 예시 데이터, AI 생성 결과, 시연용 결과는 실제 운영 사실과 분리해 표기한다.

## 4. 산출물 계약

각 canonical 산출물 상단에는 다음 메타데이터를 둔다.

```yaml
case_id: example-case
stage: 01-research
status: draft # draft | review | accepted | superseded
owner: 역할 또는 담당자
reviewer: 역할 또는 담당자
upstream_baseline: 경로 또는 commit/PR 참조
decision_ids: []
next_consumer: 다음 역할
ai_contribution: 도구·프롬프트 버전·사람 검토 범위
```

- 한 사례·한 단계에는 원칙적으로 canonical 문서 하나를 둔다.
- `_final_v2`, `진짜최종본` 같은 파일명은 만들지 않는다. Git commit, PR, status로 버전을 관리한다.
- Markdown은 사실·결정·세부 명세의 기준 원문이다. HTML, draw.io, SVG, 이미지 등은 시각·공유용 동반 자료로 만들고 기준 원문 링크를 포함한다.

## 5. AI 협업 규칙

- 입력을 `Context → Intent → Constraint → Output Format → Evaluation Criteria`로 정리한다.
- 결과를 만들기 전, 누락된 입력·제약·검증 기준을 밝힌다.
- 새 구조·화면·정책을 발명해야 할 때는 `ASSUMPTION` 또는 `OPEN`으로 남긴다.
- 보안 정보, 개인정보, 고객 데이터, 비밀 키를 저장소에 쓰지 않는다.
- Figma/Claude Design은 URL, 페이지/프레임 ID, 동결일, 버전으로 manifest에 기록한다. 대형 원본 파일·내보낸 비밀 자산을 무단으로 추가하지 않는다. 단일 standalone HTML은 5 MB 이하이고 비밀값·개인정보·운영 API가 없으며, `reference-only` 용도와 기준 manifest가 명시된 경우에만 06 handoff package에 포함할 수 있다.

## 6. 완료 전 검수

- 현재 단계 README의 품질 게이트를 모두 확인한다.
- 입력 baseline, 결정 ID, 다음 단계 전달물이 문서에서 추적 가능한지 확인한다.
- 상대 링크·파일명·frontmatter가 깨지지 않았는지 확인한다.
- 위험한 변경은 변경 범위·영향받는 하위 단계·되돌리기 방안을 함께 보고한다.

## 7. GitHub 작업 방식

- `main`에는 accepted baseline만 반영한다. 단, 교육·전달을 위한 `reference_only: true` 동결 참고본과 그 manifest는 포함할 수 있으나, 다음 단계의 accepted 입력으로 취급하지 않는다.
- 작업 브랜치는 `work/<case-id>/<NN>-<stage-name>`을 사용한다.
- Pull Request에는 입력 baseline, 변경 목적, 사실/가정/결정/미확정, 다음 단계 영향, AI 사용 범위, 품질 게이트 결과를 적는다.
- 자동 검증은 구조·링크·메타데이터 같은 기계적 조건만 다룬다. UX 품질·사업 적합성·정책 승인은 사람이 담당한다.
- 07의 배포 URL에서 발견한 차이는 직접 상위 기준을 바꾸지 말고 Issue 또는 CR로 기록한다.
