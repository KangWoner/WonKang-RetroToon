# RetroToon 배포 가이드

## 🎉 최근 업데이트 (Railway 배포 최적화)

다음 Railway 배포 문제들이 수정되었습니다:

✅ **서버 호스트 바인딩 수정** - 0.0.0.0으로 명시적 바인딩
✅ **정적 파일 경로 수정** - 절대 경로 사용으로 변경
✅ **Sharp 라이브러리 설정** - nixpacks.toml로 컴파일 최적화
✅ **에러 핸들링 강화** - Sharp 이미지 처리 오류 처리 추가
✅ **TypeScript 타입 오류 수정** - PORT 타입 변환 추가

이제 Railway에 배포하면 즉시 작동합니다!

## 빠른 시작 (Railway 배포)

### 1. Railway 계정 생성
1. https://railway.app 방문
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인

### 2. 프로젝트 배포
1. "Deploy from GitHub repo" 선택
2. WonKang-RetroToon 저장소 선택
3. 자동 배포 시작 (5-10분 소요)

### 3. 환경 변수 (선택사항)
Variables 탭:
- NODE_ENV=production

### 4. 배포 완료!
생성된 URL로 접속:
https://retrotoon-xxxx.up.railway.app

## 비용 예상

### 무료 티어 ($5 크레딧/월)
- 월 10-50명 사용: 무료
- 항상 켜져있음 (Sleep 없음)

### 유료 (사용량 기반)
- 월 100명: $3-5
- 월 500명: $8-15
- 월 1000명: $15-30

## 배포 전 확인사항

✅ 코드가 최신 상태인지 확인
✅ 테스트 통과 (npm test)
✅ 빌드 성공 (npm run build)
✅ uploads/ 디렉토리 존재

## 배포 후 확인사항

1. 웹사이트 접속 확인
2. 이미지 업로드 테스트
3. 80s/90s 스타일 변환 테스트
4. 다운로드 기능 테스트

## 문제 해결

### 배포 실패 시
1. Railway 로그 확인
2. package.json 의 "start" 스크립트 확인
3. Node.js 버전 확인 (20.x 권장)

### 이미지 변환 실패 시
1. Sharp 라이브러리 설치 확인
2. 메모리 제한 확인 (최소 512MB)
3. 이미지 크기 확인 (10MB 이하)

## 모니터링

Railway Dashboard에서 확인:
- CPU 사용량
- 메모리 사용량
- 네트워크 트래픽
- 비용 추정

## 커스텀 도메인 설정 (선택)

1. Settings → Domains
2. Add Custom Domain
3. DNS 설정 (A 레코드 또는 CNAME)
4. SSL 자동 적용 (무료)
