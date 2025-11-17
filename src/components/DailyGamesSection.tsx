"use client";
import React, { useEffect, useState } from "react";

type Game = {
  구장: string;
  홈팀: string;
  홈점수: number | string;
  원정팀: string;
  원정점수: number | string;
  날짜?: string;
};

const teams: { code: string; name: string; logo: string }[] = [
  { code: "두산", name: "두산 베어스", logo: "/teams/두산.png" },
  { code: "삼성", name: "삼성 라이온즈", logo: "/teams/삼성.png" },
  { code: "KIA", name: "KIA 타이거즈", logo: "/teams/kia.png" },
  { code: "롯데", name: "롯데 자이언츠", logo: "/teams/롯데.png" },
  { code: "NC", name: "NC 다이노스", logo: "/teams/nc.png" },
  { code: "한화", name: "한화 이글스", logo: "/teams/한화.png" },
  { code: "LG", name: "LG 트윈스", logo: "/teams/lg.png" },
  { code: "SSG", name: "SSG 랜더스", logo: "/teams/ssg.png" },
  { code: "KT", name: "KT 위즈", logo: "/teams/kt.png" },
  { code: "키움", name: "키움 히어로즈", logo: "/teams/키움.png" },
];

function getTeamLogo(teamCode: string): string {
  const found = teams.find((t) => t.code === teamCode);
  return found ? found.logo : "/teams/default.png";
}

function pad(num: number): string {
  return String(num).padStart(2, "0");
}
function toISO(date: string | Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function GameCard({ match }: { match: Game }) {
  return (
    <div className="game-card">
      <div className="game-card-title">{match.구장}</div>

      <div className="game-card-teams">
        <div className="game-team">
          <img src={getTeamLogo(match.홈팀)} alt={match.홈팀} />
          <div>{match.홈팀}</div>
        </div>

        <div className="game-score">
          {match.홈점수} : {match.원정점수}
        </div>

        <div className="game-team">
          <img src={getTeamLogo(match.원정팀)} alt={match.원정팀} />
          <div>{match.원정팀}</div>
        </div>
      </div>
    </div>
  );
}

export default function DailyGamesSection({ initialDate = "2025-09-10" }: { initialDate?: string }) {
  const [targetDate, setTargetDate] = useState<string>(initialDate);
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  function moveDate(offset: number) {
    const d = new Date(targetDate);
    d.setDate(d.getDate() + offset);
    setTargetDate(toISO(d));
  }

  useEffect(() => {
    fetch(`/api/games_by_date?date=${targetDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.games)) {
          setGames(data.games.filter((g: Game) => g.날짜 === targetDate));
          setError(null);
        } else {
          setGames([]);
          setError("경기 데이터를 불러올 수 없습니다.");
        }
      })
      .catch(() => setError("경기 데이터를 불러올 수 없습니다."));
  }, [targetDate]);

  return (
    <div>
      <h3 className="section-title" style={{ textAlign: "center", marginTop: "1rem" }}>
        ⚾ 오늘의 경기
      </h3>

      <div className="game-date-nav">
        <button onClick={() => moveDate(-1)}>← 이전</button>
        <span>{targetDate}</span>
        <button onClick={() => moveDate(1)}>다음 →</button>
      </div>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="game-card-container">
          {games.length === 0 ? (
            <div className="loading">해당 날짜 경기가 없습니다.</div>
          ) : (
            games.map((match, i) => <GameCard key={i} match={match} />)
          )}
        </div>
      )}
    </div>
  );
}
