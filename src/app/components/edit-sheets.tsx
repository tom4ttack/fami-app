import { useState, useEffect } from "react";
import { X, Check, Plus, Trash2, User as UserIcon, Map as MapIcon } from "lucide-react";
import { useApp, Parcel } from "../context";

type Props = { open: boolean; onClose: () => void };

function SheetShell({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  onSave,
}: Props & { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode; onSave: () => void }) {
  return (
    <>
      <div
        className={`absolute inset-0 z-[60] bg-black/45 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 right-0 bottom-0 z-[70] rounded-t-[22px] bg-white transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "82%" }}
      >
        <div className="pt-2.5 pb-1 flex justify-center">
          <span className="w-9 h-1 rounded-full bg-neutral-300" />
        </div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
            >
              {icon}
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 tracking-tight">{subtitle}</span>
              <h3
                className="text-[19px] tracking-tight text-neutral-900"
                style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 active:bg-neutral-200 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        <div className="px-5 pb-3 overflow-y-auto" style={{ height: "calc(100% - 70px - 80px)" }}>
          {children}
        </div>

        <div className="px-5 py-3 border-t border-neutral-100">
          <button
            onClick={onSave}
            className="w-full h-[50px] rounded-[14px] flex items-center justify-center gap-2 text-white tracking-tight active:scale-[0.98] transition-transform"
            style={{ background: "var(--brand-green)", fontSize: 14.5, fontWeight: 700 }}
          >
            <Check className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// USER INFO EDIT
// ─────────────────────────────────────────────

export function UserEditSheet({ open, onClose }: Props) {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [region, setRegion] = useState(user.region);

  useEffect(() => {
    if (open) {
      setName(user.name);
      setPhone(user.phone);
      setRegion(user.region);
    }
  }, [open, user]);

  const save = () => {
    setUser({ ...user, name, phone, region });
    onClose();
  };

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      title="사용자 정보 수정"
      subtitle={user.loginType === "kakao" ? "카카오 계정" : user.loginType === "google" ? "Google 계정" : "계정"}
      icon={<UserIcon className="w-[18px] h-[18px]" style={{ color: "var(--brand-green)" }} />}
      onSave={save}
    >
      <div className="space-y-3 pt-1">
        <Field label="이름" value={name} onChange={setName} placeholder="홍길동" />
        <Field label="전화번호" value={phone} onChange={setPhone} placeholder="010-0000-0000" inputMode="tel" />
        <Field label="농장 지역" value={region} onChange={setRegion} placeholder="충남 청양군" />
      </div>
    </SheetShell>
  );
}

// ─────────────────────────────────────────────
// PARCEL INFO EDIT
// ─────────────────────────────────────────────

export function ParcelEditSheet({ open, onClose }: Props) {
  const { parcels, setParcels } = useApp();
  const [list, setList] = useState<Parcel[]>(parcels);
  const [draftId, setDraftId] = useState("");
  const [draftArea, setDraftArea] = useState("");
  const [draftCrop, setDraftCrop] = useState("청양고추");

  // 🚨 상세창과 동일하게 A-1, A-2 형식으로 변환해주는 로직 추가
  const LETTERS = ['A','B','C','D','E','F','G','H','I','J'];
  const getShortLabel = (id: string, idx: number) => {
    if (id.length <= 8) return id; // 기존 목업 데이터(A-1 등)는 그대로 사용
    const letter = LETTERS[Math.floor(idx / 5)] ?? 'P';
    const num = (idx % 5) + 1;
    return `${letter}-${num}`;
  };

  useEffect(() => {
    if (open) setList(parcels);
  }, [open, parcels]);

  const addParcel = () => {
    if (!draftId.trim()) return;
    if (list.some((p) => p.id === draftId.trim())) return;
    setList([
      ...list,
      { id: draftId.trim(), name: `${draftId.trim()} 구역`, area: draftArea || "0", crop: draftCrop || "고추" },
    ]);
    setDraftId("");
    setDraftArea("");
  };
  const remove = (id: string) => setList(list.filter((p) => p.id !== id));
  const update = (id: string, patch: Partial<Parcel>) =>
    setList(list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const save = () => {
    setParcels(list);
    onClose();
  };

  return (
    <SheetShell
      open={open}
      onClose={onClose}
      title="필지 정보 수정"
      subtitle={`등록 필지 · ${list.length}개`}
      icon={<MapIcon className="w-[18px] h-[18px]" style={{ color: "var(--brand-green)" }} />}
      onSave={save}
    >
      <div className="rounded-[14px] bg-neutral-50 p-3 mt-1">
        <span className="text-[11px] text-neutral-500 tracking-tight">새 필지 추가</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <CompactField label="구역명" value={draftId} onChange={setDraftId} placeholder="C-1" />
          <CompactField label="면적(㎡)" value={draftArea} onChange={setDraftArea} placeholder="300" inputMode="numeric" />
          <CompactField label="작물" value={draftCrop} onChange={setDraftCrop} placeholder="청양고추" />
        </div>
        <button
          onClick={addParcel}
          disabled={!draftId.trim()}
          className="mt-2 w-full h-9 rounded-[10px] flex items-center justify-center gap-1 text-white tracking-tight disabled:opacity-40"
          style={{ background: "var(--brand-green)", fontSize: 12.5, fontWeight: 700 }}
        >
          <Plus className="w-3.5 h-3.5" />
          추가
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {list.map((p, index) => {
          // 🚨 여기서 짧은 라벨(A-1, B-2 등)을 생성합니다.
          const shortLabel = getShortLabel(p.id, index);

          return (
            <div key={p.id} className="rounded-[12px] bg-white p-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{ background: "color-mix(in srgb, var(--brand-green) 12%, transparent)" }}
                >
                  <span className="text-[11px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 800 }}>
                    {/* 🚨 긴 PNU 대신 짧은 A-1 라벨을 렌더링 */}
                    {shortLabel}
                  </span>
                </div>
                <span className="text-[13.5px] text-neutral-900 tracking-tight flex-1" style={{ fontWeight: 700 }}>
                  {p.name}
                </span>
                <button
                  onClick={() => remove(p.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 active:bg-neutral-200"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: "#CF4F0E" }} />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <CompactField
                  label="면적(㎡)"
                  value={p.area}
                  onChange={(v) => update(p.id, { area: v })}
                  inputMode="numeric"
                />
                <CompactField label="작물" value={p.crop} onChange={(v) => update(p.id, { crop: v })} />
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="rounded-[12px] bg-neutral-50 py-6 text-center">
            <span className="text-[12px] text-neutral-500 tracking-tight">등록된 필지가 없습니다.</span>
          </div>
        )}
      </div>
    </SheetShell>
  );
}

// ─────────────────────────────────────────────
// SHARED FIELDS
// ─────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <div className="rounded-[14px] bg-neutral-50 px-3.5 py-2.5">
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

function CompactField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <div className="rounded-[10px] bg-neutral-50 px-2.5 py-1.5">
      <span className="text-[9.5px] text-neutral-500 tracking-tight">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="block w-full bg-transparent outline-none text-[13px] text-neutral-900 tracking-tight placeholder:text-neutral-300"
        style={{ fontWeight: 600 }}
      />
    </div>
  );
}