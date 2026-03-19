import { useReport } from "../../context/ReportContext";
import HealthScoreCard from "../../components/HealthScoreCard";
import QualityGrade from "../../components/QualityGrade";
import TrendChart from "../../components/TrendChart";
import RiskHeatmap from "../../components/RiskHeatmap";
import CommitActivityChart from "../../components/CommitActivityChart";
import { useCountUp } from "../../hooks/useCountUp";

/* ── Animated stat chip ──────────────────────────────────── */
function StatChip({ label, value, icon, colorVar, delay = 0 }) {
  const animated = useCountUp(value ?? 0, 1000);
  return (
    <div
      className="card"
      style={{
        padding: "1.1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        opacity: 0,
        animation: `fadeUp 0.5s ease ${delay}ms forwards`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="card-header" style={{ marginBottom: 0 }}>
          {label}
        </span>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      </div>
      <span
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: `var(${colorVar})`,
          lineHeight: 1,
        }}
      >
        {animated.toLocaleString()}
      </span>
    </div>
  );
}

/* ── FadeCard wrapper ────────────────────────────────────── */
function FadeCard({ delay = 0, children, style = {} }) {
  return (
    <div
      style={{
        opacity: 0,
        animation: `fadeUp 0.5s ease ${delay}ms forwards`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Overview tab ────────────────────────────────────────── */
export default function Overview() {
  const { report, delta } = useReport();
  const data = report;
  const score = data?.summary?.healthScore ?? 0;
  const sum = data?.summary;

  return (
    <div>
      {/* Row 1: Score + Grade + 4 stat chips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <FadeCard delay={0}>
          <HealthScoreCard
            score={score}
            label={sum?.healthLabel}
            breakdown={sum?.scoreBreakdown}
            delta={delta}
          />
        </FadeCard>
        <FadeCard delay={60}>
          <QualityGrade score={score} />
        </FadeCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          <StatChip
            label="Files"
            value={sum?.totalFiles}
            icon="📁"
            colorVar="--c4"
            delay={120}
          />
          <StatChip
            label="Lines of Code"
            value={sum?.totalLOC}
            icon="📄"
            colorVar="--c2"
            delay={180}
          />
          <StatChip
            label="Functions"
            value={sum?.totalFunctions}
            icon="⚙️"
            colorVar="--c6"
            delay={240}
          />
          <StatChip
            label="Smells"
            value={sum?.totalSmells}
            icon="🚨"
            colorVar="--c1"
            delay={300}
          />
        </div>
      </div>

      {/* Row 2: TrendChart + CommitActivity side-by-side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <FadeCard delay={360}>
          <TrendChart score={score} />
        </FadeCard>
        <FadeCard delay={420}>
          <CommitActivityChart report={report} />
        </FadeCard>
      </div>

      {/* Row 3: RiskHeatmap full width */}
      <FadeCard delay={480}>
        <RiskHeatmap files={data?.files} />
      </FadeCard>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
