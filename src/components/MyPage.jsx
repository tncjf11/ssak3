// src/components/MyPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import "../styles/MyPage.css";

// 이미지들
import logo from "../image/Group 23.png";
import defaultProfile from "../image/profile-default.png";
import backIcon from "../image/vector-33.png";
import searchIcon from "../image/icon-search.png";

// PNG 탭 버튼 이미지
import tabMyOn from "../image/tab-my-on.png";
import tabWishOn from "../image/tab-wish-on.png";
import tabMyOff from "../image/tab-my-off.png";
import tabWishOff from "../image/tab-wish-off.png";

export default function MyPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my"); // "my" | "wish"
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("판매중");

  // 프로필 정보 (백엔드 연동 전 임시값)
  const temperature = 55.7;
  const sellCount = 12;
  const nickname = "닉네임님안녕하세요";

  // 임시 상품 데이터 (등록한 물건들)
  const [items, setItems] = useState([
    {
      id: 1,
      category: "가전 / 주방",
      title: "00자전거 팝니다 ...",
      price: 5350000,
      status: "판매중",
      wished: true,
    },
    {
      id: 2,
      category: "의류",
      title: "옷 사실 분~~",
      price: 500,
      status: "판매중",
      wished: false,
    },
    {
      id: 3,
      category: "가전 / 주방",
      title: "00자전거 팝니다 ...",
      price: 5350000,
      status: "예약중",
      wished: true,
    },
    {
      id: 4,
      category: "가전 / 주방",
      title: "중고 아이폰 사실분",
      price: 5350000,
      status: "판매완료",
      wished: false,
    },
    {
      id: 5,
      category: "도우미 / 기타",
      title: "향수 ㅇㅇ 개봉만함",
      price: 350000,
      status: "판매중",
      wished: true,
    },
    {
      id: 6,
      category: "도서 / 문구",
      title: "00전공서적 팝니다",
      price: 50000,
      status: "판매중",
      wished: false,
    },
  ]);

  // 내 상품 / 찜 목록
  const myItems = items;
  const wishItems = useMemo(
    () => items.filter((item) => item.wished),
    [items]
  );

  // 현재 탭 기준 기본 리스트
  const baseList = activeTab === "my" ? myItems : wishItems;

  // 상태(판매중/예약중/판매완료) 필터 적용
  const filteredItems = baseList.filter(
    (item) => item.status === filterStatus
  );

  // 상단에 보여줄 개수
  const productCount = myItems.length;
  const wishCount = wishItems.length;

  const countLabel = activeTab === "my" ? "상품" : "찜";
  const countValue = activeTab === "my" ? productCount : wishCount;

  const handleSelectFilter = (status) => {
    setFilterStatus(status);
    setFilterOpen(false);
  };

  // 찜 토글 (연동 전: 프론트 상태만 변경)
  const toggleLike = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, wished: !item.wished } : item
      )
    );
  };

  return (
    <div className="mypage-root">
      <div className="mypage-wrapper">
        {/* 상단 헤더 */}
        <header className="mypage-header">
          <button onClick={() => navigate(-1)} className="mypage-back-btn">
            <img src={backIcon} alt="뒤로가기" className="mypage-top-icon" />
          </button>

          <div className="mypage-logo-box">
            <img src={logo} className="mypage-logo" alt="logo" />
          </div>

          <button className="mypage-search-btn">
            <img src={searchIcon} alt="검색" className="mypage-top-icon" />
          </button>
        </header>

        {/* 갈색 프로필 영역 */}
        <section className="mypage-profile-section">
          <div className="mypage-profile-top">
            <div className="mypage-profile-left">
              <img src={defaultProfile} alt="" className="mypage-profile-img" />
              <div>
                <div className="mypage-nickname">{nickname}</div>
                <div className="mypage-selltext">판매수 {sellCount}</div>
              </div>
            </div>

            <div className="mypage-temperature">
              {temperature.toFixed(1)}°C
            </div>
          </div>

          <div className="mypage-temp-barwrap">
            <span className="mypage-temp-label">나눔 온기</span>
            <div className="mypage-temp-bar">
              <div
                className="mypage-temp-fill"
                style={{
                  width: `${Math.max(0, Math.min(temperature, 100))}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 탭 PNG */}
          <div className="mypage-tab-png-row">
            <button
              onClick={() => setActiveTab("my")}
              className="mypage-tab-btn"
            >
              <img
                src={activeTab === "my" ? tabMyOn : tabMyOff}
                alt="내 상품"
              />
            </button>
            <button
              onClick={() => setActiveTab("wish")}
              className="mypage-tab-btn"
            >
              <img
                src={activeTab === "wish" ? tabWishOn : tabWishOff}
                alt="찜"
              />
            </button>
          </div>
        </section>

        {/* 흰색 콘텐츠 영역 */}
        <section className="mypage-content">
          {/* 상품/찜 개수 + 판매상태 드롭다운 */}
          <div className="mypage-filter-wrap">
            <div className="mypage-count">
              <span className="mypage-count-label">{countLabel}</span>
              <span className="mypage-count-number">{countValue}</span>
            </div>

            <button
              className="mypage-filter-btn"
              onClick={() => setFilterOpen(true)}
            >
              {filterStatus} <span className="arrow">▾</span>
            </button>
          </div>

          {/* 카드 리스트 */}
          <div className="mypage-item-grid">
            {filteredItems.map((item) => {
              const isLiked = !!item.wished;

              return (
                <div key={item.id} className="mypage-item-card">
                  <div className="mypage-card-thumb">
                    {/* 추후 실제 이미지가 생기면 src 교체 */}
                    <div className="mypage-card-img-placeholder" />

                    {/* ❤️ 하트 버튼 */}
                    <button
                      className="mypage-heart-btn"
                      aria-label="찜"
                      type="button"
                      onClick={() => toggleLike(item.id)}
                    >
                      <HeartIcon filled={isLiked} />
                    </button>
                  </div>

                  <div className="mypage-card-info">
                    <div className="mypage-card-category">
                      {item.category}
                    </div>
                    <div className="mypage-card-title">{item.title}</div>
                    <div className="mypage-card-price">
                      {item.price.toLocaleString()} <span>원</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <BottomNav />

        {/* 판매 상태 바텀시트 */}
        {filterOpen && (
          <div
            className="mypage-filter-modal-backdrop"
            onClick={() => setFilterOpen(false)}
          >
            <div
              className="mypage-filter-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mypage-filter-panel">
                <div className="mypage-filter-inner">
                  <button
                    className="mypage-filter-option"
                    onClick={() => handleSelectFilter("판매중")}
                  >
                    판매중
                  </button>
                  <button
                    className="mypage-filter-option"
                    onClick={() => handleSelectFilter("예약중")}
                  >
                    예약중
                  </button>
                  <button
                    className="mypage-filter-option"
                    onClick={() => handleSelectFilter("판매완료")}
                  >
                    판매완료
                  </button>
                </div>

                <button
                  className="mypage-filter-close-btn"
                  onClick={() => setFilterOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 하트 아이콘 */
function HeartIcon({ filled }) {
  return filled ? (
    <svg
      className="mypage-heart-icon-svg mypage-heart-icon-svg--filled"
      viewBox="0 0 24 24"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ) : (
    <svg
      className="mypage-heart-icon-svg mypage-heart-icon-svg--empty"
      viewBox="0 0 24 24"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}
