# 04. Wireframe

## 이 단계의 역할

여기는 IA의 화면·흐름·상태 규칙을 **저충실도 화면 구조와 행동 annotation**으로 검증하는 단계다. Wireframe은 회색 박스 모음이 아니라, 사용자가 어떤 정보를 먼저 보고 어떤 action을 취하는지 합의하는 문서다.

## 입력 기준

- `03. IA`의 accepted IA, user flow, state/exception model
- screen ID, 데이터 표시 필드, 역할·권한 제약
- PRD의 acceptance criteria와 비범위

## 핵심 산출물

| 파일 예시 | 내용 | 다음 수신자 |
| --- | --- | --- |
| `<CASE-ID> — Wireframe Specification.md` | 화면별 목적, 정보 위계, module, CTA, annotation | UI Owner / AI Design Operator |
| `<CASE-ID> — Wireframe.html` 또는 Figma low-fi link | 화면 구조의 시각 동반 자료 | UI Owner / AI Design Operator |
| `<CASE-ID> — Screen State Matrix.md` | `SCR-##`별 normal/empty/error/no-permission/loading | UI Owner / AI Design Operator |

상세 형식은 [`01. 단계 산출물 템플릿`](<../00. 운영·공통 기준/templates/01. 단계 산출물 템플릿.md>)을 사용한다.

## Wireframe이 답해야 할 질문

1. 이 화면에서 사용자가 가장 먼저 판단해야 할 정보는 무엇인가?
2. 그 판단을 돕는 data, label, 상태, CTA는 어디에 놓이는가?
3. `FLOW-##`의 각 행동은 어느 control에서 시작되고 결과는 어디에 나타나는가?
4. empty, loading, error, no-permission, failed 같은 상태는 어떤 구조를 가지는가?
5. Hi-Fi가 바꾸면 안 되는 정보 위계와 component 역할은 무엇인가?

## 하지 않는 일

- Hi-Fi 색·font·shadow에 시간을 쓰기 전에 정보 위계와 행동을 확정한다.
- 정상 화면만 보고 상태별 구조를 미루지 않는다.
- 디자인 도구가 만든 화면을 annotation 없이 바로 canonical로 지정하지 않는다.

## 품질 게이트: Wireframe → Hi-Fi

- [ ] 각 핵심 과업이 시작점부터 완료점까지 화면 구조로 따라갈 수 있다.
- [ ] 화면마다 목적, 핵심 정보, primary action, secondary action이 명확하다.
- [ ] IA의 `SCR/FLOW/STATE` ID를 추적할 수 있다.
- [ ] empty/error/no-permission/failed를 필요한 화면에 포함했다.
- [ ] Hi-Fi가 재해석 없이 component와 visual hierarchy를 적용할 수 있다.

## 다음 인수인계

`05. Hi-Fi Design (Figma Make, Claude Design)`에는 accepted wireframe, screen state matrix, UI content, component requirement, accessibility/반응형 제약을 전달한다. Hi-Fi는 Wireframe의 정보 위계를 장식으로 바꾸지 않는다.

## 관련 공통 기준

- [`통합 R&R 및 전체 작업 흐름`](<../00. 운영·공통 기준/00. 통합 R&R 및 전체 작업 흐름.md>)
- [`산출물 계약·품질 게이트`](<../00. 운영·공통 기준/02. 산출물 계약·품질 게이트.md>)
- [`Hi-Fi Canonical Manifest 템플릿`](<../00. 운영·공통 기준/templates/02. Hi-Fi Canonical Manifest 템플릿.md>)
