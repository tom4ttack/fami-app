import { useState } from "react";
import { ChevronLeft, ChevronRight, User as UserIcon, Map as MapIcon, Search, Check, X, Sprout, ChevronDown } from "lucide-react";
import { useApp, Parcel } from "../context";

const CROPS = ["청양고추", "오이", "토마토", "딸기", "참외", "수박", "감자", "고구마", "상추", "깻잎", "배추", "무"];

type MockZone = { id: string; area: string; d: string; lx: number; ly: number };

const MOCK_ZONES: MockZone[] = [
  { id: "A-1", area: "310", d: "M22,24 L130,20 L138,80 L28,88 Z",     lx: 75,  ly: 58  },
  { id: "A-2", area: "295", d: "M150,22 L256,30 L246,84 L142,80 Z",    lx: 195, ly: 58  },
  { id: "A-3", area: "280", d: "M266,32 L340,42 L334,102 L258,90 Z",   lx: 295, ly: 68  },
  { id: "B-3", area: "330", d: "M30,100 L142,94 L150,170 L38,178 Z",   lx: 88,  ly: 136 },
  { id: "B-4", area: "320", d: "M160,94 L268,104 L260,176 L156,168 Z", lx: 208, ly: 138 },
  { id: "B-5", area: "300", d: "M278,114 L340,118 L334,182 L270,180 Z",lx: 302, ly: 152 },
];

type ZoneCrop = Record<string, string>;

export function OnboardingScreen() {
  const { user, setUser, parcels, setParcels, setStage } = useApp();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [region, setRegion] = useState(user.region);

  // Step 2 — address
  const [address, setAddress] = useState("");
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done">("idle");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Step 2 — crops
  const [globalCrop, setGlobalCrop] = useState("청양고추");
  const [perZone, setPerZone] = useState(false);
  const [zoneCrops, setZoneCrops] = useState<ZoneCrop>({});
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const handleLoad = () => {
    if (!address.trim()) return;
    setLoadState("loading");
    setTimeout(() => {
      setLoadState("done");
      setSelectedIds(new Set(MOCK_ZONES.map((z) => z.id)));
    }, 1400);
  };

  const toggleZone = (id: string) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const getCrop = (id: string) => (perZone ? zoneCrops[id] ?? globalCrop : globalCrop);

  const finish = () => {
    setUser({ ...user, name, phone, region });
    const list: Parcel[] = MOCK_ZONES.filter((z) => selectedIds.has(z.id)).map((z) => ({
      id: z.id,
      name: `${z.id} 구역`,
      area: z.area,
      crop: getCrop(z.id),
    }));
    setParcels(list);
    setStage("app");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex items-center gap-2">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="w-9 h-9 -ml-1.5 rounded-full active:bg-neutral-200/60 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-900" />
          </button>
        )}
        <div className="flex-1">
          <span className="text-[11.5px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 700 }}>
            첫 설정 · {step}/2
          </span>
          <h1
            className="text-neutral-900 tracking-tight"
            style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            {step === 1 ? "사용자 정보를 입력하세요" : "관리할 필지를 등록하세요"}
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
        >
          {step === 1 ? (
            <UserIcon className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
          ) : (
            <MapIcon className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-3">
        <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%", background: "#E9B44C" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {step === 1 && (
          <div className="space-y-3">
            <Field label="이름" value={name} onChange={setName} placeholder="홍길동" />
            <Field label="전화번호" value={phone} onChange={setPhone} placeholder="010-0000-0000" inputMode="tel" />
            <Field label="농장 지역" value={region} onChange={setRegion} placeholder="예: 충남 청양군" />
            <div className="mt-4 rounded-[14px] p-3.5" style={{ background: "rgba(233,180,76,0.10)" }}>
              <div className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" style={{ color: "#8a6620" }} />
                <span className="text-[11.5px] tracking-tight" style={{ color: "#8a6620", fontWeight: 700 }}>
                  입력 정보는 언제든 메뉴에서 수정 가능합니다.
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {/* Address search */}
            <div className="rounded-[16px] bg-white p-3.5">
              <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                팜맵 주소로 필지 불러오기
              </span>
              <div className="mt-2 flex gap-2">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                  placeholder="예: 충남 청양군 청양읍 읍내리 123"
                  className="flex-1 h-10 rounded-[11px] bg-neutral-50 px-3 text-[13px] text-neutral-900 tracking-tight outline-none placeholder:text-neutral-300"
                  style={{ fontWeight: 500 }}
                />
                <button
                  onClick={handleLoad}
                  disabled={!address.trim() || loadState === "loading"}
                  className="h-10 px-3.5 rounded-[11px] flex items-center gap-1.5 text-white tracking-tight active:scale-[0.97] transition-transform disabled:opacity-50"
                  style={{ background: "var(--brand-green)", fontSize: 13, fontWeight: 700, minWidth: 72 }}
                >
                  {loadState === "loading" ? (
                    <span className="flex items-center gap-1.5">
                      <LoadSpinner />
                      검색 중
                    </span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      불러오기
                    </>
                  )}
                </button>
              </div>

              {/* Map preview */}
              {loadState === "loading" && (
                <div className="mt-3 h-[180px] rounded-[13px] bg-neutral-50 flex flex-col items-center justify-center gap-2">
                  <LoadSpinner size={20} color="var(--brand-green)" />
                  <span className="text-[12px] text-neutral-500 tracking-tight">팜맵 데이터를 불러오는 중…</span>
                </div>
              )}

              {loadState === "done" && (
                <div className="mt-3">
                  <p className="text-[10.5px] text-neutral-500 tracking-tight mb-1.5">
                    구역을 탭하여 선택/해제하세요 · {selectedIds.size}/{MOCK_ZONES.length}개 선택됨
                  </p>
                  <div className="relative w-full h-[180px] rounded-[13px] overflow-hidden bg-gradient-to-br from-[#eef2ea] via-[#e3ead9] to-[#d4dfc5]">
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <defs>
                        <pattern id="obGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--brand-green)" strokeWidth="0.4" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#obGrid)" />
                    </svg>
                    <svg viewBox="0 0 360 200" className="absolute inset-0 w-full h-full">
                      {MOCK_ZONES.map((z) => {
                        const sel = selectedIds.has(z.id);
                        return (
                          <g key={z.id} className="cursor-pointer" onClick={() => toggleZone(z.id)}>
                            <path
                              d={z.d}
                              fill={sel ? "var(--brand-green)" : "#aaa"}
                              fillOpacity={sel ? 0.45 : 0.2}
                              stroke={sel ? "var(--brand-green)" : "#aaa"}
                              strokeWidth={sel ? 1.8 : 1}
                              strokeLinejoin="round"
                            />
                            <text
                              x={z.lx} y={z.ly}
                              fontSize={10}
                              fill={sel ? "#3a5235" : "#888"}
                              fontWeight={800}
                              textAnchor="middle"
                            >
                              {z.id}
                            </text>
                            {sel && (
                              <circle cx={z.lx} cy={z.ly + 13} r="6" fill="var(--brand-green)" fillOpacity="0.9">
                                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                            {sel && (
                              <text x={z.lx} y={z.ly + 17} fontSize={7} fill="white" fontWeight={900} textAnchor="middle">✓</text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-[8px] bg-white/80 backdrop-blur-md">
                      <span className="text-[9.5px] text-neutral-600 tracking-tight">{address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Crop setting — shown after map loaded */}
            {loadState === "done" && (
              <div className="rounded-[16px] bg-white p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                      작물 설정
                    </span>
                    <p className="text-[13px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
                      {perZone ? "구역별 작물" : "전체 일괄 적용"}
                    </p>
                  </div>
                  <button
                    onClick={() => setPerZone((v) => !v)}
                    className="px-2.5 py-1 rounded-full text-[11px] tracking-tight transition-colors"
                    style={
                      perZone
                        ? { background: "var(--brand-green)", color: "#fff", fontWeight: 700 }
                        : { background: "color-mix(in srgb, var(--brand-green) 10%, transparent)", color: "var(--brand-green)", fontWeight: 600 }
                    }
                  >
                    {perZone ? "구역별 ✓" : "구역별 설정"}
                  </button>
                </div>

                {!perZone && (
                  <>
                    <p className="text-[10.5px] text-neutral-400 tracking-tight mb-2">
                      선택한 작물이 모든 필지에 일괄 적용됩니다.
                    </p>
                    <CropPicker selected={globalCrop} onChange={setGlobalCrop} />
                  </>
                )}

                {perZone && (
                  <div className="space-y-2">
                    {MOCK_ZONES.filter((z) => selectedIds.has(z.id)).map((z) => {
                      const crop = zoneCrops[z.id] ?? globalCrop;
                      const isExpanded = expandedZone === z.id;
                      return (
                        <div key={z.id} className="rounded-[12px] bg-neutral-50 overflow-hidden">
                          <button
                            onClick={() => setExpandedZone(isExpanded ? null : z.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5"
                          >
                            <div
                              className="w-8 h-8 rounded-[9px] flex items-center justify-center"
                              style={{ background: "color-mix(in srgb, var(--brand-green) 12%, transparent)" }}
                            >
                              <span className="text-[10px]" style={{ color: "var(--brand-green)", fontWeight: 800 }}>{z.id}</span>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-[12.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 600 }}>{z.id} 구역</p>
                              <p className="text-[10.5px] text-neutral-500 tracking-tight">{crop}</p>
                            </div>
                            <ChevronDown
                              className="w-4 h-4 text-neutral-400 transition-transform"
                              style={{ transform: isExpanded ? "rotate(180deg)" : undefined }}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-3 pb-3 border-t border-neutral-100 pt-2.5">
                              <CropPicker
                                selected={crop}
                                onChange={(c) => setZoneCrops((prev) => ({ ...prev, [z.id]: c }))}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {loadState === "done" && selectedIds.size > 0 && (
              <div className="rounded-[16px] bg-white p-3.5">
                <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                  등록될 필지 · {selectedIds.size}개
                </span>
                <div className="mt-2 space-y-1.5">
                  {MOCK_ZONES.filter((z) => selectedIds.has(z.id)).map((z) => (
                    <div key={z.id} className="flex items-center gap-2.5 px-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--brand-green)" }} />
                      <span className="text-[12.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 600 }}>
                        {z.id} 구역
                      </span>
                      <span className="text-[11px] text-neutral-400 tracking-tight">{z.area}㎡</span>
                      <span className="ml-auto text-[11px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 600 }}>
                        {getCrop(z.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-7 pt-2">
        {step === 1 ? (
          <button
            onClick={() => setStep(2)}
            disabled={!name.trim() || !region.trim()}
            className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
            style={{ background: "var(--brand-green)", fontSize: 15, fontWeight: 700 }}
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={selectedIds.size === 0 || loadState !== "done"}
            className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
            style={{ background: "var(--brand-green)", fontSize: 15, fontWeight: 700 }}
          >
            <Check className="w-4 h-4" />
            설정 완료
          </button>
        )}
      </div>
    </div>
  );
}

function CropPicker({ selected, onChange }: { selected: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CROPS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="px-2.5 py-1 rounded-full text-[12px] tracking-tight transition-all active:scale-[0.96]"
          style={
            selected === c
              ? { background: "var(--brand-green)", color: "#fff", fontWeight: 700 }
              : { background: "#f0f0ee", color: "#555", fontWeight: 500 }
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function LoadSpinner({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Field({
  label, value, onChange, placeholder, inputMode,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <div className="rounded-[14px] bg-white px-3.5 py-2.5">
      <span className="text-[10.5px] text-neutral-500 tracking-tight">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="block w-full bg-transparent outline-none text-[15px] text-neutral-900 tracking-tight placeholder:text-neutral-300"
        style={{ fontWeight: 600 }}
      />
    </div>
  );
}
