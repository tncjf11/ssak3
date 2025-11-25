// src/components/SearchPage.jsx
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

import flamel1 from "../image/flamel-ai-edit-1982838-2-2-4.png";
import flamel2 from "../image/flamel-ai-edit-1982838-2-2-3.png";
import group115 from "../image/Group 23.png";
import vector33 from "../image/vector-33.png";
import "../styles/SearchPage.css";

import BottomNav from "./BottomNav";

import stickerReserved from "../image/status-reserved.png";
import stickerSoldout from "../image/status-soldout.png";

import { MOCK_PRODUCTS } from "../data/mockProducts";
import { api } from "../lib/api";
import { buildImageUrl } from "../lib/products";

const mapStatusFromKorean = (status) => {
  switch (status) {
    case "판매중":
      return "ON_SALE";
    case "예약중":
      return "RESERVED";
    case "판매완료":
      return "SOLD_OUT";
    default:
      return "ON_SALE";
  }
};

const normalizeStatus = (status) => {
  if (!status) return "ON_SALE";
  if (["ON_SALE", "RESERVED", "SOLD_OUT"].includes(status))
    return status;
  return mapStatusFromKorean(status);
};

export default function SearchPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("바람막이");
  const [keyword, setKeyword] = useState("");
  const [recent, setRecent] = useState(["바람막이", "자켓", "패딩"]);
  const removeRecent = (word) =>
    setRecent((prev) => prev.filter((w) => w !== word));

  const [filters, setFilters] = useState([]);
  const removeFilter = (tag) =>
    setFilters((prev) => prev.filter((t) => t !== tag));

  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("인기순");
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState(() =>
    MOCK_PRODUCTS.filter((p) => p.tags?.includes("search")).map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      thumbnail: p.thumbnail || p.images?.[0],
      status: normalizeStatus(p.status),
      seller: { nickname: p.seller?.nickname || "닉네임" },
      likes: p.likes ?? 0,
      liked: !!p.isWishlisted,
      createdAt: p.createdAt,
    }))
  );

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  // 🔥 핵심: 검색 API keyword= 로 고정
  const runSearch = useCallback(
    async (raw) => {
      const q = raw.trim();
      if (!q) return;

      setSearchTerm(q);
      setKeyword(q);

      setRecent((prev) => {
        const next = [q, ...prev.filter((w) => w !== q)];
        return next.slice(0, 3);
      });

      setLoading(true);

      try {
        const data = await api(
          `/api/products/search?keyword=${encodeURIComponent(q)}`
        );

        const mapped = data.map((raw) => ({
          id: raw.id,
          title: raw.title,
          price: raw.price,
          category: raw.categoryName || "의류",
          thumbnail:
            raw.thumbnail
              ? buildImageUrl(raw.thumbnail)
              : Array.isArray(raw.imageUrls) && raw.imageUrls.length > 0
              ? buildImageUrl(raw.imageUrls[0])
              : "",
          status: normalizeStatus(raw.status),
          seller: {
            nickname:
              raw.sellerNickname ||
              raw.seller?.nickname ||
              "닉네임",
          },
          likes: raw.likeCount ?? 0,
          liked: !!raw.isWishlisted,
          createdAt: raw.createdAt,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("[검색 실패 → mock fallback]", err);

        const fallbackRaw = MOCK_PRODUCTS.filter((p) =>
          p.title.toLowerCase().includes(q.toLowerCase())
        );

        const fallback = fallbackRaw.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          thumbnail: p.thumbnail || p.images?.[0],
          status: normalizeStatus(p.status),
          seller: {
            nickname: p.seller?.nickname || "닉네임",
          },
          likes: p.likes ?? 0,
          liked: !!p.isWishlisted,
          createdAt: p.createdAt,
        }));

        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(searchTerm);
  };

  const handleRecentClick = (word) => runSearch(word);

  useEffect(() => {
    runSearch(searchTerm);
  }, []);

  const toggleLike = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked
                ? Math.max(0, (p.likes || 0) - 1)
                : (p.likes || 0) + 1,
            }
          : p
      )
    );
  };

  const pickSort = (t) => {
    setSortType(t);
    setSortOpen(false);
  };

  const visibleProducts = useMemo(() => {
    let base = products;

    const q = keyword.trim().toLowerCase();
    if (q) base = base.filter((p) =>
      p.title.toLowerCase().includes(q)
    );

    if (sortType === "거래 가능") {
      return base.filter((p) => p.status === "ON_SALE");
    }

    const sorted = [...base];
    if (sortType === "인기순") {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortType === "최신순") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return sorted;
  }, [products, sortType, keyword]);

  return (
    <div className="search-screen">
      <div className="search-frame">
        <header className="sp-topbar">
          <button
            className="sp-back"
            onClick={() => navigate(-1)}
          >
            <img src={vector33} alt="" />
          </button>
          <img className="sp-logo" src={group115} alt="logo" />
          <div className="sp-mascot">
            <img className="mascot-1" src={flamel1} alt="" />
            <img className="mascot-2" src={flamel2} alt="" />
          </div>
        </header>

        <form className="sp-searchbar" onSubmit={handleSearch}>
          <input
            className="sp-input"
            type="text"
            placeholder="원하시는 물건이 있으신가요?"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button className="sp-searchbtn" type="submit">
            🔍
          </button>
        </form>

        <section className="sp-section">
          <div className="sp-section-title">최근 검색어</div>
          <div className="chips">
            {recent.map((word) => (
              <span key={word} className="chip recent">
                <button
                  type="button"
                  className="chip-label"
                  onClick={() => handleRecentClick(word)}
                >
                  {word}
                </button>
                <button
                  className="chip-x"
                  onClick={() => removeRecent(word)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        {filters.length > 0 && (
          <section className="sp-section">
            <div className="chips">
              {filters.map((f) => (
                <span key={f} className="chip filter">
                  {f}
                  <button
                    className="chip-x"
                    onClick={() => removeFilter(f)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="sp-list-header">
          <div className="left">
            <span className="label">상품</span>
            <span className="count">
              {loading ? "…" : visibleProducts.length}
            </span>
          </div>

          <button className="right" onClick={() => setSortOpen(true)}>
            <span className="sort">{sortType}</span> ▼
          </button>
        </div>

        {loading && <div className="sp-loading">검색 중...</div>}

        {!loading && (
          <div className="sp-product-list">
            {visibleProducts.map((p) => {
              const isReserved = p.status === "RESERVED";
              const isSoldOut = p.status === "SOLD_OUT";

              return (
                <article
                  key={p.id}
                  className="sp-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="sp-thumb-wrap">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className={
                        isReserved || isSoldOut
                          ? "sp-thumb-img gray"
                          : "sp-thumb-img"
                      }
                    />
                    {isReserved && (
                      <img
                        src={stickerReserved}
                        className="sp-status-sticker"
                      />
                    )}
                    {isSoldOut && (
                      <img
                        src={stickerSoldout}
                        className="sp-status-sticker"
                      />
                    )}
                  </div>

                  <div className="info">
                    <div className="category">{p.category}</div>
                    <h3 className="title">{p.title}</h3>
                    <div className="price">
                      {p.price?.toLocaleString()}원
                    </div>
                    <div className="meta">
                      {p.seller?.nickname || "닉네임"}
                    </div>
                  </div>

                  <button
                    className={
                      "like-btn" + (p.liked ? " liked" : "")
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(p.id);
                    }}
                  >
                    ❤️ {p.likes}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {sortOpen && (
          <div
            className="sheet-backdrop"
            onClick={() => setSortOpen(false)}
          >
            <div className="bottom-sheet">
              <button
                className="sheet-item"
                onClick={() => pickSort("인기순")}
              >
                인기순
              </button>
              <button
                className="sheet-item"
                onClick={() => pickSort("최신순")}
              >
                최신순
              </button>
              <button
                className="sheet-item"
                onClick={() => pickSort("거래 가능")}
              >
                거래 가능
              </button>
              <button
                className="sheet-item close"
                onClick={() => setSortOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        <div className="sp-bottom-space" />
        <BottomNav />
      </div>
    </div>
  );
}
