// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";

import iconMy from "../image/user_12888922.png";
import iconHome from "../image/home_12888754.png";
import iconPost from "../image/note_12888817.png";
import iconChat from "../image/message_15220048.png";

import "../styles/BottomNav.css";

// 전역 미읽음 합계
import { useUnread } from "../state/UnreadContext";

export default function BottomNav() {
  const { unreadTotal } = useUnread();

  const items = [
    { to: "/mypage", label: "마이페이지", icon: iconMy },
    { to: "/home", label: "메인", icon: iconHome },
    { to: "/post", label: "상품등록", icon: iconPost },
    { to: "/chat", label: "1:1 채팅", icon: iconChat },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            "nav-item" + (isActive ? " active" : "")
          }
        >
          <div className="icon-wrap">
            <img className="nav-icon" src={it.icon} alt={it.label} />

            {/* 채팅 탭에만 미읽음 배지 표시 */}
            {it.to === "/chat" && unreadTotal > 0 && (
              <span className="nav-badge">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </div>
          <span className="nav-label">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
