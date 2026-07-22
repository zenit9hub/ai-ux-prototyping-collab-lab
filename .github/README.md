# GitHub 협업 설정

이 폴더는 문서 작성 자체를 자동화하기 위한 곳이 아니라, 단계별 작업의 검토와 인수인계를 안전하게 반복하기 위한 최소 장치다.

- PULL_REQUEST_TEMPLATE.md: 입력 baseline, 전달물, AI 기여, 품질 게이트를 같은 형식으로 남긴다.
- ISSUE_TEMPLATE/decision.md: 결정의 근거·선택지·영향을 기록한다.
- ISSUE_TEMPLATE/change-request.md: accepted baseline 변경과 downstream 재검토를 기록한다.
- CODEOWNERS: 실제 GitHub 계정이 정해진 뒤 역할별 reviewer를 연결한다. 현재는 잘못된 리뷰 요청을 막기 위해 예시만 주석으로 남겨 두었다.
- workflows/validate-stage.yml: 폴더·필수 운영 문서·canonical metadata의 기본 형식만 검사한다.
- workflows/deploy-github-pages.yml: 07. 배포·검증 (GitHub Pages)의 정적 site를 main 변경 시 GitHub Pages로 배포한다.

자동화는 문서 구조와 연결을 확인할 뿐 UX 적합성, 제품 우선순위, 디자인 완성도를 판정하지 않는다. 그 판단은 단계별 Quality Gate와 사람의 리뷰가 맡는다.
