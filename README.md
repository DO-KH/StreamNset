# StreamNest

Google Cloud의 YouTube Data Api v3 통해 실제 Youtube 영상을 제공하는 스트리밍 사이트입니다.

---

## Tech Stack

 - **Framework**: Next.js (App Router)
 - **Language**: TypeScript
 - **Auth**: NextAuth(Google OAuth)
 - **Style**: Tailwind CSS
 - **Etc**: Vercel, ESLint, Prettier

---

## Feature

 - 영상 목록 페이지, 영상 시청 페이지
 - 카테고리별 플레이리스트
 - OAuth 기반 구글 로그인
 - 로그인 유저의 좋아요 누른 영상 페이지
 - 영상 목록 무한 스크롤

## 페이지별 렌더링 전략
 - 영상 목록 페이지 : SSR + ISR
 - 영상 시청 페이지 : SSR(초기 페이지 렌더링은 늦어지겠지만 해당 영상 시청 페이지 접근이 빨라짐)
 - 카테고리별 플레이리스트 : SSR + ISR
 - 검색 결과 페이지: CSR

### 좋아요 누른 페이지(SSR 구현 전략)
 - 로그인 검증을 NextAuth의 getServerSession()을 사용하여 서버사이드에서 진행
 - 검증 시 가져온 accessToken을 통해 유저별 좋아요 누른 영상을 서버사이드에서 요청

## YouTube APi 요청 전략(영상 목록 페이지 구현 전략)
 - videos : 모든 영상을 대상으로 요청 가능하므로 거의 모든 데이터를 가져올 수 있음
 - channels : videoId를 이용하여 해당 채널의 정보를 가져옴
 - playlistitem : 플레이리스트를 대상으로하기에 개별 video 데이터는 가져올 수 없음
 - search : 검색어 기반 영상 데이터 가져옴
 - like : videos api + 헤더(accessToken)

## 무한스크롤 구현
 - 초기 페이지 렌더링시 영상 데이터와 함께 가져온 PageToken을 이용하여 fetch함수의 매개변수로 전달
 - 모든 페이지는 각자 렌더링 전략에 따라 동작하지만 스크롤을 이용한 영상 로드 시 CSR로 동작


🔥 메인 페이지 (한국 인기 영상)	CSR (useEffect로 API 요청)	✅ ISR로 캐싱 적용
🎭 카테고리별 페이지	CSR (useEffect로 API 요청)	✅ ISR로 캐싱 적용
🔎 검색 결과 페이지	CSR (useEffect로 API 요청)	✅ SSR로 SEO 최적화
❤️ 좋아요한 영상 페이지	CSR (useEffect로 API 요청)	✅ SSR로 보안 강화 (OAuth 필요)