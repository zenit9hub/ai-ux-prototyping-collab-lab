# 06. 개발 전달·퍼블리싱

## 이 단계의 역할

이 폴더는 05. Hi-Fi Design (Figma Make, Claude Design)의 기준 디자인을 구현 담당자에게 **재해석 없이 수신 가능하게 연결하는 handoff package**다. handoff manifest를 기준으로 하며, 구현 수신자가 동작·시각을 확인해야 할 때는 동결된 단일 standalone HTML을 `reference-only`로 함께 전달할 수 있다. 디자인을 다시 만들거나 실제 애플리케이션 코드를 보관하는 위치는 아니다.

실제 프론트엔드 소스, 패키지, 배포 설정은 기본적으로 별도 개발 저장소에서 관리한다. 이 폴더에는 그 저장소가 시작할 때 필요한 기준과 질의·확인 기록만 둔다.

## 승인된 입력

- 05의 accepted canonical design manifest
- 연결된 04. Wireframe, 03. IA, 02. PRD의 accepted baseline
- 구현 범위와 담당 개발 저장소 또는 팀 정보

## 이 폴더에서 만드는 것

- 사례별 handoff manifest
  - canonical source URL, page/frame ID, 동결 버전, 접근 방법
- 동결된 생성 프로토타입 참고본
  - manifest가 가리키는 단일 standalone HTML, 동결일·해시·도구·용도 표기
  - 퍼블리셔/프론트엔드가 동작·시각·상태를 비교하는 참고본이며 구현 원본이 아님
- 구현 대상 화면, 상태, breakpoint, interaction, asset, content 기준
- 디자인 수용 기준과 PRD 수용 기준의 매핑
- 퍼블리싱/프론트엔드 수신자의 확인, blocker, 질의, 해결 상태
- 구현 저장소·Issue·PR로 연결하는 링크

시작할 때는 [03. 개발 전달 Handoff Manifest 템플릿](<../00. 운영·공통 기준/templates/03. 개발 전달 Handoff Manifest 템플릿.md>)을 복사한다.

## 생성 프로토타입 참고본 규칙

- 기준은 항상 05의 canonical manifest다. standalone HTML은 그 기준을 대체하거나 새로운 결정을 만들 수 없다.
- 사례·동결 버전당 하나의 파일만 둔다. 파일명, 생성 도구, 동결일, 해시, `reference-only` 용도는 handoff manifest에 기록한다.
- 5 MB 이하의 단일 HTML만 허용한다. 비밀값, 개인정보, 운영 API, 라이선스가 불명확한 대형 자산은 포함하지 않는다.
- Handoff Owner(UX/UI Owner 또는 PM/기획 담당)가 package와 manifest를 정리하고, Publishing / Frontend Receiver가 수신 가능 여부와 blocker를 기록한다. 별도 전담 인력이 반드시 필요한 것은 아니다.
- 퍼블리셔/프론트엔드는 참고본을 열어 화면·상태·상호작용을 비교한 뒤, 별도 개발 저장소에서 유지보수 가능한 구조로 재구현한다.

## 이 폴더에 두지 않는 것

- Figma/Claude 화면을 복사한 중복 PDF·PNG 묶음
- manifest 없이 단독으로 둔 생성 번들, 기준 없이 생성한 개발 코드 또는 라이브러리
- 제품·디자인 결정을 조용히 바꾼 구현 메모
- 해결하지 않은 모호성을 “구현자 판단”으로 넘기는 기록

기준 디자인은 계속 05가 소유한다. 구현 중 디자인 기준을 바꿔야 하면 CR-###을 만들고 영향받는 가장 이른 단계부터 재검토한다.

## 개발 전달·퍼블리싱 수신 게이트

- [ ] 기준 디자인의 URL, page/frame ID, 버전, 접근 권한을 확인했다.
- [ ] 구현 대상 화면과 정상·빈·오류·권한·로딩 상태가 명확하다.
- [ ] 반응형, 콘텐츠, asset, interaction, component 규칙이 확인 가능하다.
- [ ] standalone HTML 참고본이 있으면 `reference-only`, 생성 도구, 동결일, 해시, 기준 manifest와의 연결이 기록됐다.
- [ ] PRD의 수용 기준과 구현 확인 항목이 연결되어 있다.
- [ ] OPEN·blocker마다 결정권자와 다음 행동이 기록되어 있다.
- [ ] 수신자는 ready, needs-rework, blocked 중 하나로 상태를 남겼다.

## 다음 연결

게이트를 통과한 handoff manifest는 07. 배포·검증 (GitHub Pages)의 정적 검증 source와 별도 개발 저장소 또는 구현 팀의 시작 기준이 된다. 07은 협업 결과를 즉시 확인하는 배포 환경이고, 실제 운영 코드의 변경·테스트·릴리스는 해당 개발 체계에서 관리한다. 기준 변경이 필요한 경우에만 이 저장소의 변경 요청으로 되돌아온다.
