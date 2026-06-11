import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // 네이버 검색은 이제 lmsFetcher가 백엔드 /api/naver(프록시)를 직접 호출하므로
    // 옛 dev 프록시는 제거. (백엔드 CORS 정책 적용)
  };
});
