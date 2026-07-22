# 06. 개발 전달·퍼블리싱

## 이 단계의 역할

이 폴더는 05. Hi-Fi Design (Figma Make, Claude Design)의 기준 디자인을 구현 담당자에게 **재해석 없이 수신 가능하게 연결하는 얇은 handoff 계층**이다. 디자인을 다시 만들거나 실제 애플리케이션 코드를 보관하는 위치가 아니다.

실제 프론트엔드 소스, 패키지, 배포 설정은 기본적으로 별도 개발 저장소에서 관리한다. 이 폴더에는 그 저장소가 시작할 때 필요한 기준과 질의·확인 기록만 둔다.

## 승인된 입력

- 05의 accepted canonical design manifest
- 연결된 04. Wireframe, 03. IA, 02. PRD의 accepted baseline
- 구현 범위와 담당 개발 저장소 또는 팀 정보

## 이 폴더에서 만드는 것

- 사례별 handoff manifest
  - canonical source URL, page/frame ID, 동결 버전, 접근 방법
- 구현 대상 화면, 상태, breakpoint, interaction, asset, content 기준
- 디자인 수용 기준과 PRD 수용 기준의 매핑
- 퍼블리싱/프론트엔드 수신자의 확인, blocker, 질의, 해결 상태
- 구현 저장소·Issue·PR로 연결하는 링크

시작할 때는 [03. 개발 전달 Handoff Manifest 템플릿](<../00. 운영·공통 기준/templates/03. 개발 전달 Handoff Manifest 템플릿.md>)을 복사한다.

## 이 폴더에 두지 않는 것

- Figma/Claude 화면을 복사한 중복 PDF·PNG 묶음
- 기준 없이 생성한 개발 코드 또는 라이브러리
- 제품·디자인 결정을 조용히 바꾼 구현 메모
- 해결하지 않은 모호성을 “구현자 판단”으로 넘기는 기록

기준 디자인은 계속 05가 소유한다. 구현 중 디자인 기준을 바꿔야 하면 CR-###을 만들고 영향받는 가장 이른 단계부터 재검토한다.

## 개발 전달·퍼블리싱 수신 게이트

- [ ] 기준 디자인의 URL, page/frame ID, 버전, 접근 권한을 확인했다.
- [ ] 구현 대상 화면과 정상·빈·오류·권한·로딩 상태가 명확하다.
- [ ] 반응형, 콘텐츠, asset, interaction, component 규칙이 확인 가능하다.
- [ ] PRD의 수용 기준과 구현 확인 항목이 연결되어 있다.
- [ ] OPEN·blocker마다 결정권자와 다음 행동이 기록되어 있다.
- [ ] 수신자는 ready, needs-rework, blocked 중 하나로 상태를 남겼다.

## 다음 연결

게이트를 통과한 handoff manifest는 별도 개발 저장소 또는 구현 팀의 시작 기준이 된다. 구현 과정의 코드 변경·테스트·배포 이력은 해당 저장소에서 관리하고, 기준 변경이 필요한 경우에만 이 저장소의 변경 요청으로 되돌아온다.
