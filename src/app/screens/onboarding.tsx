import { useState } from "react";
import { ChevronLeft, ChevronRight, User as UserIcon, Map as MapIcon, Search, Check, Sprout, ChevronDown, Bell, AlertCircle, MapPinOff } from "lucide-react";
import { useApp, Parcel } from "../context";
import { KakaoMap, ParcelPolygon } from "../components/kakao-map";
import { LatLng, MAP_CENTER } from "../data/parcel-coords";
import { searchFarmByAddress } from "../data/farm-db";
import { mapService, getMockPnuData, PnuParcelData } from "../../api/services/mapService";

const CROPS = ["고추", "배추", "무"];

type ZoneCrop = Record<string, string>;
type LoadState = "idle" | "loading" | "done" | "notfound" | "error";

export function OnboardingScreen() {
  const { user, setUser, setParcels, setStage, notificationRadius, setNotificationRadius } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [region, setRegion] = useState(user.region);

  // Step 2 — address & PNU
  const [address, setAddress] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fetchedZones, setFetchedZones] = useState<PnuParcelData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [resolvedCenter, setResolvedCenter] = useState<LatLng>(MAP_CENTER);

  // Step 2 — crops
  const [globalCrop, setGlobalCrop] = useState("고추");
  const [perZone, setPerZone] = useState(false);
  const [zoneCrops, setZoneCrops] = useState<ZoneCrop>({});
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!address.trim()) return;
    setLoadState("loading");
    setLoadError(null);
    setFetchedZones([]);
    setSelectedIds(new Set());

    // 1. FARM_DB에서 PNU 매칭
    const matches = searchFarmByAddress(address.trim());
    if (matches.length === 0) {
      setLoadState("notfound");
      return;
    }

    // 2. 각 PNU에 대해 AWS 서버에서 좌표 조회
    try {
      const zones: PnuParcelData[] = await Promise.all(
        matches.map(async (entry) => {
          try {
            const res = await mapService.getCoordinatesByPnu(entry.pnu);
            return res.data;
          } catch {
            // 백엔드 미연결 시 mock 데이터 사용
            const mock = getMockPnuData(entry.pnu);
            if (mock) return mock;
            throw new Error(`PNU ${entry.pnu} 좌표 조회 실패`);
          }
        }),
      );

      setFetchedZones(zones);
      setSelectedIds(new Set(zones.map((z) => z.id)));
      if (zones[0]?.center) setResolvedCenter(zones[0].center);
      setLoadState("done");
    } catch (err) {
      setLoadError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setLoadState("error");
    }
  };

  const toggleZone = (id: string) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const getCrop = (id: string) => (perZone ? zoneCrops[id] ?? globalCrop : globalCrop);

  const finishStep2 = () => {
    setUser({ ...user, name, phone, region });
    const list: Parcel[] = fetchedZones
      .filter((z) => selectedIds.has(z.id))
      .map((z) => ({
        id: z.id,
        name: z.address.split(' ').slice(-1)[0] + ' 필지',
        area: z.area,
        crop: getCrop(z.id),
      }));
    setParcels(list);
    setStep(3);
  };

  const finish = () => setStage("app");

  // KakaoMap용 파셀 배열
  const mapParcels: ParcelPolygon[] = fetchedZones.map((z, idx) => ({
    id: z.id,
    label: String(idx + 1),
    coordinates: z.coordinates,
    state: "safe" as const,
    selected: selectedIds.has(z.id),
  }));

  const step3Parcels: ParcelPolygon[] = fetchedZones
    .filter((z) => selectedIds.has(z.id))
    .map((z, idx) => ({
      id: z.id,
      label: String(idx + 1),
      coordinates: z.coordinates,
      state: "safe" as const,
      selected: true,
    }));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex items-center gap-2">
        {(step === 2 || step === 3) && (
          <button
            onClick={() => setStep((step - 1) as 1 | 2 | 3)}
            className="w-9 h-9 -ml-1.5 rounded-full active:bg-neutral-200/60 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-900" />
          </button>
        )}
        <div className="flex-1">
          <span className="text-[11.5px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 700 }}>
            첫 설정 · {step}/3
          </span>
          <h1
            className="text-neutral-900 tracking-tight"
            style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            {step === 1 && "사용자 정보를 입력하세요"}
            {step === 2 && "관리할 필지를 등록하세요"}
            {step === 3 && "주변 필지 알림 반경 설정"}
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
        >
          {step === 1 && <UserIcon className="w-5 h-5" style={{ color: "var(--brand-green)" }} />}
          {step === 2 && <MapIcon className="w-5 h-5" style={{ color: "var(--brand-green)" }} />}
          {step === 3 && <Bell className="w-5 h-5" style={{ color: "var(--brand-green)" }} />}
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 mb-3">
        <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%", background: "#E9B44C" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {/* ── STEP 1 ── */}
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

        {/* ── STEP 2 ── */}
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
                  onChange={(e) => { setAddress(e.target.value); if (loadState !== "idle") setLoadState("idle"); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                  placeholder="예: 충청남도 청양군 청양읍 적누리"
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


              {/* 로딩 */}
              {loadState === "loading" && (
                <div className="mt-3 h-[180px] rounded-[13px] bg-neutral-50 flex flex-col items-center justify-center gap-2">
                  <LoadSpinner size={20} color="var(--brand-green)" />
                  <span className="text-[12px] text-neutral-500 tracking-tight">지도 데이터를 불러오는 중…</span>
                </div>
              )}

              {/* 검색 결과 없음 */}
              {loadState === "notfound" && (
                <div className="mt-3 h-[120px] rounded-[13px] bg-neutral-50 flex flex-col items-center justify-center gap-2">
                  <MapPinOff className="w-6 h-6 text-neutral-300" />
                  <p className="text-[12px] text-neutral-500 tracking-tight text-center">
                    일치하는 필지를 찾을 수 없습니다.<br />
                    <span className="text-[11px] text-neutral-400">주소를 더 자세히 입력해 주세요.</span>
                  </p>
                </div>
              )}

              {/* 서버 오류 */}
              {loadState === "error" && (
                <div className="mt-3 rounded-[13px] bg-red-50 p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-red-600 tracking-tight" style={{ lineHeight: 1.5 }}>
                    {loadError}
                  </p>
                </div>
              )}

              {/* 지도 + 필지 선택 */}
              {loadState === "done" && (
                <div className="mt-3">
                  <p className="text-[10.5px] text-neutral-500 tracking-tight mb-1.5">
                    필지를 탭하여 선택/해제하세요 · {selectedIds.size}/{fetchedZones.length}개 선택됨
                  </p>
                  <div className="relative w-full h-[200px] rounded-[13px] overflow-hidden">
                    <KakaoMap
                      parcels={mapParcels}
                      center={resolvedCenter}
                      level={3}
                      onParcelClick={toggleZone}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-[8px] bg-white/85 backdrop-blur-md flex items-center pointer-events-none" style={{ lineHeight: 1 }}>
                      <span className="text-[9.5px] text-neutral-600 tracking-tight" style={{ lineHeight: 1 }}>{address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 작물 설정 */}
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
                    {fetchedZones.filter((z) => selectedIds.has(z.id)).map((z) => {
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
                              <span className="text-[11px]" style={{ color: "var(--brand-green)", fontWeight: 800 }}>
                                {fetchedZones.indexOf(z) + 1}
                              </span>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-[12px] text-neutral-900 tracking-tight" style={{ fontWeight: 600 }}>
                                {z.address.split(' ').slice(-2).join(' ')}
                              </p>
                              <p className="text-[10.5px] text-neutral-500 tracking-tight">{crop} · {z.area}㎡</p>
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

            {/* 등록 필지 요약 */}
            {loadState === "done" && selectedIds.size > 0 && (
              <div className="rounded-[16px] bg-white p-3.5">
                <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                  등록될 필지 · {selectedIds.size}개
                </span>
                <div className="mt-2 space-y-1.5">
                  {fetchedZones.filter((z) => selectedIds.has(z.id)).map((z) => (
                    <div key={z.id} className="flex items-center gap-2.5 px-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--brand-green)" }} />
                      <span className="text-[12px] text-neutral-900 tracking-tight" style={{ fontWeight: 600 }}>
                        {z.address.split(' ').slice(-2).join(' ')}
                      </span>
                      <span className="ml-auto text-[11px] text-neutral-400 tracking-tight">{z.area}㎡</span>
                      <span className="text-[11px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 600 }}>
                        {getCrop(z.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-[16px] bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
                <div>
                  <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                    주변 필지 알림 설정
                  </span>
                  <p className="text-[14px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
                    병해 발생 시 알림 받을 반경
                  </p>
                </div>
              </div>

              <div className="relative w-full h-[240px] rounded-[13px] overflow-hidden">
                <KakaoMap
                  parcels={step3Parcels}
                  center={resolvedCenter}
                  level={6}
                  radiusKm={notificationRadius}
                  className="w-full h-full"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-[8px] bg-white/85 backdrop-blur-md flex items-center pointer-events-none">
                  <span className="text-[10px] text-neutral-700 tracking-tight leading-none" style={{ fontWeight: 600 }}>
                    🔔 알림 반경: {notificationRadius}km
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-[8px] bg-white/80 backdrop-blur-md flex items-center pointer-events-none">
                  <span className="text-[9px] text-neutral-600 tracking-tight leading-none">내 필지 중심</span>
                </div>
              </div>

              <div className="mt-3 rounded-[14px] bg-neutral-50 p-3.5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[12px] text-neutral-600 tracking-tight" style={{ fontWeight: 600 }}>
                    알림 반경 조절
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                      {notificationRadius}
                    </span>
                    <span className="text-[13px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>km</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={notificationRadius}
                  onChange={(e) => setNotificationRadius(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--brand-green) 0%, var(--brand-green) ${((notificationRadius - 1) / 19) * 100}%, #e5e5e5 ${((notificationRadius - 1) / 19) * 100}%, #e5e5e5 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-neutral-400 tracking-tight">1km</span>
                  <span className="text-[10px] text-neutral-400 tracking-tight">20km</span>
                </div>
              </div>

              <div className="mt-3 rounded-[12px] p-3" style={{ background: "rgba(233,180,76,0.10)" }}>
                <p className="text-[11.5px] text-neutral-700 tracking-tight" style={{ lineHeight: 1.5 }}>
                  내 필지에서 <span style={{ color: "#8a6620", fontWeight: 700 }}>{notificationRadius}km 이내</span>의 다른 농가 필지에서 병해가 검출되면 실시간 알림을 받습니다.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] bg-white p-3.5">
              <span className="text-[11px] text-neutral-500 tracking-tight" style={{ fontWeight: 600 }}>
                추천 설정
              </span>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[3, 5, 10].map((km) => (
                  <button
                    key={km}
                    onClick={() => setNotificationRadius(km)}
                    className="py-2.5 rounded-[11px] transition-all active:scale-[0.97]"
                    style={
                      notificationRadius === km
                        ? { background: "var(--brand-green)", color: "#fff" }
                        : { background: "#f0f0ee", color: "#555" }
                    }
                  >
                    <span className="text-[13px] tracking-tight" style={{ fontWeight: 700 }}>{km}km</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-neutral-400 tracking-tight">
                • 3km: 인접 농가만 • 5km: 같은 마을권 • 10km: 광역 모니터링
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-7 pt-2">
        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            disabled={!name.trim() || !region.trim()}
            className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
            style={{ background: "var(--brand-green)", fontSize: 15, fontWeight: 700 }}
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        )}
        {step === 2 && (
          <button
            onClick={finishStep2}
            disabled={selectedIds.size === 0 || loadState !== "done"}
            className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform disabled:opacity-40"
            style={{ background: "var(--brand-green)", fontSize: 15, fontWeight: 700 }}
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        )}
        {step === 3 && (
          <button
            onClick={finish}
            className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform"
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
    <div className="grid grid-cols-3 gap-2">
      {CROPS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="py-2.5 rounded-[11px] text-[13px] tracking-tight transition-all active:scale-[0.96]"
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
