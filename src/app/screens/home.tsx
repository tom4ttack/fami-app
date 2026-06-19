import { useState, useEffect, useRef } from "react";
import { ChevronRight, ScanSearch, AlertTriangle, Play, Square, AlertOctagon, Camera } from "lucide-react";
import { FarmMap } from "../components/farm-map";
import { EmptyFarmMap, EmptyTodaySummary } from "../components/empty-states";
import { useApp } from "../context";
import { triggerCapture, getDiagnosis } from "../services/device-api";

type Props = {
  onAllParcels: () => void;
  onZoneSelect: (zoneId: string) => void;
};

function TodaySummary() {
  return (
    <div className="rounded-[16px] bg-white p-4">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E9B44C" }} />
        <span className="text-[11.5px] text-neutral-500 tracking-tight">오늘의 진단 요약 · 2026.05.16</span>
      </div>
      <p
        className="mt-2 tracking-tight text-neutral-900"
        style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}
      >
        오늘 <span style={{ color: "var(--brand-green)" }}>12구역</span> 예찰 완료,{" "}
        <span style={{ color: "#CF4F0E" }}>위험 2구역</span> 감지
      </p>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <Stat label="예찰 완료" value="12" tone="var(--brand-green)" Icon={ScanSearch} />
        <Stat label="위험 감지" value="2" tone="#CF4F0E" Icon={AlertTriangle} />
        <Stat label="정상 구역" value="10" tone="var(--brand-green)" subtle />
      </div>
    </div>
  );
}

function Stat({
  label, value, tone, Icon, subtle,
}: {
  label: string; value: string; tone: string;
  Icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  subtle?: boolean;
}) {
  return (
    <div
      className="rounded-[12px] p-2.5"
      style={{ background: subtle ? "#fafaf8" : `${tone}18` }}
    >
      <div className="flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" style={{ color: tone }} />}
        <span className="text-[10.5px] text-neutral-500 tracking-tight">{label}</span>
      </div>
      <p
        className="mt-0.5 tracking-tight"
        style={{ fontSize: 22, fontWeight: 700, color: tone, letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {value}
        <span className="text-[11px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>구역</span>
      </p>
    </div>
  );
}

const CAPTURE_INTERVAL_MS = 5000;

function DiagnosisControl() {
  const { captureRunning, setCaptureRunning, setLiveImageTs, setLiveDiagnosis, liveImageTs } = useApp();
  const [showStop, setShowStop] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doCapture = async () => {
  setCapturing(true);
  try {
    console.log("촬영 명령 전송 중...");
    await triggerCapture();
    setLiveImageTs(Date.now());
    
    try {
      const result = await getDiagnosis();
      setLiveDiagnosis(result);
      console.log("진단 결과:", result);
    } catch (err) {
      console.error("진단 API 호출 실패:", err); // 🚨 에러 내용을 확인하세요!
    }
  } catch (err) {
    console.error("촬영 명령 실패:", err); // 🚨 에러 내용을 확인하세요!
  }
  setCapturing(false);
};

  useEffect(() => {
    if (!captureRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    doCapture();
    // intervalRef.current = setInterval(doCapture, CAPTURE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [captureRunning]);

  const handleStop = () => {
    setCaptureRunning(false);
    setShowStop(false);
  };

  return (
    <div className="rounded-[16px] bg-white p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-[13px] text-neutral-800 tracking-tight" style={{ fontWeight: 700 }}>AI 예찰 제어</span>
        {captureRunning && (
          <span
            className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full text-white"
            style={{ background: "var(--brand-green)", fontWeight: 600 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {capturing ? "촬영 중" : "진행 중"}
          </span>
        )}
        {!captureRunning && liveImageTs > 0 && (
          <span className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full text-neutral-500 bg-neutral-100 tracking-tight">
            <Camera className="w-3 h-3" />
            마지막 촬영 완료
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setCaptureRunning(true)}
          disabled={captureRunning}
          className="h-[52px] rounded-[14px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
          style={{ background: "var(--brand-green)", fontSize: 14, fontWeight: 700 }}
        >
          <Play className="w-4 h-4" />
          진단 시작
        </button>
        <button
          onClick={handleStop}
          disabled={!captureRunning}
          className="h-[52px] rounded-[14px] flex items-center justify-center gap-2 tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
          style={{
            background: captureRunning ? "rgba(233,180,76,0.12)" : "#f0f0ee",
            color: "#E9B44C", fontSize: 14, fontWeight: 700,
          }}
        >
          <Square className="w-4 h-4" />
          진단 중지
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={() => setShowStop((v) => !v)}
          className="w-full text-center text-[10.5px] text-neutral-400 tracking-tight py-1"
          style={{ fontWeight: 500 }}
        >
          {showStop ? "▲ 접기" : "▼ 비상 정지 보기"}
        </button>
        {showStop && (
          <button
            onClick={() => { handleStop(); }}
            className="mt-1 w-full h-11 rounded-[13px] flex items-center justify-center gap-2 text-[13.5px] text-white tracking-tight active:scale-[0.98] transition-transform"
            style={{ background: "#CF4F0E", fontWeight: 700 }}
          >
            <AlertOctagon className="w-4 h-4" />
            비상 정지
          </button>
        )}
      </div>
    </div>
  );
}

export function HomeScreen({ onAllParcels, onZoneSelect }: Props) {
  const { mockData, parcels } = useApp();
  const hasRealParcels = !mockData && parcels.length > 0;

  return (
    <div className="pb-6">
      <div className="px-5 pt-2">
        {mockData ? <TodaySummary /> : <EmptyTodaySummary />}
      </div>

      <section className="mt-4 px-5">
        <div className="flex items-end justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-[20px] tracking-tight text-neutral-900" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              팜맵 지도
            </h2>
            <p className="text-[11.5px] text-neutral-500 tracking-tight mt-0.5">
              {mockData || hasRealParcels ? "구역을 눌러 바로 상세 보기" : "필지를 등록하면 여기에 표시됩니다"}
            </p>
          </div>
        </div>
        {mockData || hasRealParcels ? (
          <>
            <FarmMap onZoneSelect={onZoneSelect} onZoneClick={onAllParcels} />
            <button
              onClick={onAllParcels}
              className="mt-3 w-full h-11 rounded-[14px] bg-white active:bg-neutral-50 flex items-center justify-between px-4 transition-colors"
            >
              <span className="text-[13.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 500 }}>
                전체 필지 보기 · {mockData ? 6 : parcels.length} 필지
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </>
        ) : (
          <EmptyFarmMap />
        )}
      </section>

      <div className="mt-4 px-5">
        <DiagnosisControl />
      </div>
    </div>
  );
}
