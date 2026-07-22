# 05. Hi-Fi Design (Figma Make, Claude Design)

## 이 단계의 역할

04. Wireframe에서 합의한 정보 구조·행동·상태를 시각적 인터페이스와 상호작용 기준으로 구체화한다. Figma Make와 Claude Design은 빠른 탐색과 제작을 돕는 도구이며, 이 폴더는 사례별 **유일한 canonical design source**를 선언하고 관리하는 위치다.

## 승인된 입력

- 04. Wireframe의 accepted 화면 구조, 화면 ID, CTA, 상태별 annotation
- 03. IA의 task flow·권한·예외 조건
- 02. PRD의 범위·수용 기준·우선순위
- 00. 운영·공통 기준의 접근성·브랜드·보안·AI 협업 가드레일

입력이 draft 또는 review 상태라면 Hi-Fi를 탐색할 수는 있지만, 그것을 전달 기준으로 선언할 수 없다.

## 이 폴더에서 만드는 것

- 사례별 canonical design manifest
  - 기준 도구(Figma 또는 Claude Design), URL, page/frame ID, 동결일, 버전, 접근 권한
- 화면별 정상·빈·오류·권한·로딩 상태와 breakpoint 기준
- token, component, content, asset, interaction의 구현 전달 기준
- AI가 생성한 비교안·선정 이유·사람 검토 범위를 남긴 작업 기록
- 필요할 때 회의·리뷰용 HTML showcase 또는 export
- 구현 수신자가 상호작용을 확인해야 할 때, 06 handoff package로 넘길 동결된 단일 standalone HTML 참고본

시작할 때는 [02. Hi-Fi Canonical Manifest 템플릿](<../00. 운영·공통 기준/templates/02. Hi-Fi Canonical Manifest 템플릿.md>)과 [05. AI 작업 기록 템플릿](<../00. 운영·공통 기준/templates/05. AI 작업 기록 템플릿.md>)을 복사해 사례 ID를 부여한다.

## 이 폴더에 두지 않는 것

- 구현용 프론트엔드 소스 코드
- 기준이 정해지지 않은 화면 export의 무분별한 누적
- 기준 원본의 복사본을 다시 만든 handoff 문서
- AI 도구가 생성했지만 사람의 검토·선정이 끝나지 않은 결과를 canonical로 표기한 파일

대형 Figma 원본, PSD, 영상 등은 Git에 직접 넣지 않는다. 저장소에는 그것을 해석할 수 있는 manifest와 필요한 경량 export만 남긴다.

## Hi-Fi → 개발 전달·퍼블리싱 품질 게이트

- [ ] wireframe의 정보 위계·핵심 행동·필수 상태가 보존되었다.
- [ ] 사례마다 기준 도구와 URL, page/frame ID, 동결 버전이 하나로 선언되었다.
- [ ] desktop/mobile 또는 필요한 breakpoint와 화면 상태가 명시되었다.
- [ ] component, token, asset, 콘텐츠, interaction 기준이 수신자가 확인할 수 있는 수준이다.
- [ ] 접근성·표현 제약·미해결 질문이 기록되었다.
- [ ] Publishing / Frontend Receiver가 이 기준으로 구현 검토를 시작할 수 있다.

통과하면 canonical manifest를 accepted로 바꾼다. 06. 개발 전달·퍼블리싱에는 기준 링크와 전달 정보를 넘기며, 구현 수신에 상호작용 참고가 필요한 경우에 한해 그 기준을 가리키는 동결된 단일 standalone HTML을 `reference-only`로 함께 패키징할 수 있다. 이 파일은 canonical source나 구현 원본으로 승격되지 않는다.

## 다음 단계 전달 패키지

1. accepted canonical manifest 경로와 Git commit/PR
2. Figma 또는 Claude Design URL, page/frame ID, 동결일·버전
3. 화면·상태·반응형·component·asset·content 기준
4. 구현 시 확인해야 할 OPEN 항목과 담당자
5. 관련 변경 요청(CR-###) 및 수용 기준 매핑
