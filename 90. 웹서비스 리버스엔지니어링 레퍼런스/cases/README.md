# 사례 폴더 운영 안내

실제 서비스 URL과 관찰 범위가 승인된 뒤에만 이 폴더 아래에 `<service-slug>/` 사례 폴더를 만든다. 대상이 아직 정해지지 않았거나 접근·권리 검토가 끝나지 않았다면 빈 사례 폴더나 임시 캡처를 만들지 않는다.

## 새 사례의 권장 구조

```text
<service-slug>/
├── 00. 범위·출처·권리 확인.md
├── 01. 관찰 근거 맵.md
├── 02. 역설계 PRD.md
├── 03. IA·User Flow.md
├── 04. Wireframe·UX 패턴.md
├── 05. 시니어 Q&A·결정 기록.md
└── 06. 현업 적용 포인트.md
```

## 사례 문서의 기본 frontmatter

```yaml
case_id: <service-slug>-reference
stage: 90-<artifact-name>
status: draft # draft | review | accepted | superseded
reference_only: true
owner: Research / Product / UX 담당자
reviewer: 다음 수신자 또는 강사·퍼실리테이터
upstream_baseline: 대상 URL, 관찰일, 00. 범위·출처·권리 확인
decision_ids: []
next_consumer: 다음 사례 문서 담당자
ai_contribution: 사용한 도구, 입력, 사람 검토 범위
```

## 문서별 최소 내용

| 파일 | 반드시 남길 것 | 주의할 점 |
| --- | --- | --- |
| 00. 범위·출처·권리 확인 | URL, 관찰 목적, 허용 방법, 제외 범위, 중단 조건 | 자동 수집을 기본값으로 가정하지 않음 |
| 01. 관찰 근거 맵 | `EVD-##`, URL, 관찰일, 화면/경로, FACT, 요약 | 긴 원문·asset·코드를 복사하지 않음 |
| 02. 역설계 PRD | 문제·사용자·핵심 과업의 가설, 범위·비범위, OPEN | 외부 서비스의 실제 사업 정책으로 단정하지 않음 |
| 03. IA·User Flow | 메뉴·화면·flow·상태·예외의 가설 | 정상 흐름만 기록하지 않음 |
| 04. Wireframe·UX 패턴 | 정보 위계, CTA, 반복 가능한 UX 패턴 | 브랜드·화면을 그대로 재현하지 않음 |
| 05. 시니어 Q&A·결정 기록 | 운영·권한·데이터·실패·책임의 질문 | 질문을 임의의 정책으로 답하지 않음 |
| 06. 현업 적용 포인트 | 우리 문제에 적용할 패턴·변형·검증 계획 | “그대로 구현”으로 결론 내리지 않음 |

## 상태와 수명 주기

- 수집 중에는 `draft`, 검토 중에는 `review`를 사용한다.
- 교육용 관찰 기록으로 검토가 끝났을 때만 `accepted`로 바꿀 수 있다.
- `accepted`여도 이 폴더의 문서는 `reference_only`이며, `01~07`의 upstream baseline이 아니다.
- 서비스가 바뀌거나 관찰 근거가 오래되면 삭제하지 말고 `superseded`로 표시하고 최신 관찰일을 남긴다.

## 시작하기

먼저 [`../00. 역설계 방법·안전 원칙.md`](<../00. 역설계 방법·안전 원칙.md>)의 착수 전 체크를 통과한다. 이후 해당 서비스의 공개 URL, 관찰 목적, 허용 범위를 기록한 `00. 범위·출처·권리 확인.md`부터 작성한다.
