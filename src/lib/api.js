// src/lib/api.js

// ✅ 백엔드 주소 (너가 받은 IP/포트 입력)
export const BASE_URL = "http://10.39.149.82:8080";

// ✅ 공통 API 함수 (JSON용)
export async function api(path, options = {}) {
  const response = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  return response.json();
}
