// src/components/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

import brand23 from "../image/Group 23.png";
import brand19 from "../image/Group 19.png";

// 🔌 공통 API 함수 가져오기
import { api } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const fallback = (e) => (e.currentTarget.src = brand19);

  // ✅ 카카오 로그인 버튼 클릭 시 실행되는 함수
  const handleKakaoLogin = async () => {
    try {
      // 1) 원래는 카카오 SDK에서 받아오는 토큰
      const kakaoAccessToken = "DUMMY_KAKAO_TOKEN"; // TODO: 실제 카카오 토큰 사용

      // 2) 백엔드로 카카오 토큰 보내기
      //    백엔드 개발자에게 실제 엔드포인트 확인 필요
      const result = await api("/auth/kakao", {
        method: "POST",
        body: JSON.stringify({
          accessToken: kakaoAccessToken,
        }),
      });

      console.log("카카오 로그인 성공:", result);

      // 3) 백엔드에서 받은 사용자 정보 저장
      //    예: result.userName, result.userId, result.accessToken ...
      if (result?.userName) {
        localStorage.setItem("userName", result.userName);
      }

      // accessToken이 있다면 저장
      if (result?.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }

      // 4) 로그인 → 웰컴페이지로 이동
      navigate("/welcome");

    } catch (err) {
      console.error("카카오 로그인 실패:", err);
      alert("로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="app-shell">
      <div className="app-frame">
        {/* 상단바: 좌측 로고 */}
        <header className="m-topbar">
          <img
            src={brand23}
            onError={fallback}
            alt="ssaksseuri"
            className="topbar-logo"
          />
        </header>

        {/* 본문: 카드 정중앙 */}
        <main className="m-main">
          <section className="m-card" role="dialog" aria-labelledby="login-title">
            {/* 닫기(X) */}
            <button className="m-close" aria-label="닫기" type="button" />

            <div className="card-body">
              <img
                className="brand-hero"
                alt="ssaksseuri"
                src={brand23}
                onError={fallback}
              />

              <h1 id="login-title" className="m-headline">
                카카오로 <span className="m-accent">싹쓰리</span> 시작하기
              </h1>

              <p className="m-sub">
                간편하게 가입하고 원하는 상품을 확인하세요.
              </p>

              <hr className="m-divider" />

              <div className="m-bubble">
                SNS 로그인으로 쉽게 가입해 보세요!
              </div>

              {/* 🔥 카카오 로그인 버튼 */}
              <button
                className="kakao-btn"
                type="button"
                onClick={handleKakaoLogin}
              >
                <span className="kakao-icon" aria-hidden="true" />
                <span className="kakao-text">카카오 로그인</span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
