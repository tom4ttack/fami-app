import { X, AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import { DiagZone } from "./diagnosis-sheet";
import { EmptyNotifications } from "./empty-states";
import { useApp } from "../context";

type Notif = {
  id: number;
  zone: string;
  title: string;
  body: string;
  time: string;
  level: "danger" | "warn";
  unread: boolean;
  diagZone: DiagZone;
};

const NOTIFS: Notif[] = [
  {
    id: 1, zone: "B-3", title: "B-3 구역 예찰 완료", body: "탄저병 의심 증상 발견 (정확도 92%)", time: "방금 전", level: "danger", unread: true,
    diagZone: {
      zone: "B-3", accuracy: 92, area: 15,
      photo: "https://images.unsplash.com/photo-1518568403628-df55701ade9e?w=400&q=80",
      time: "09:38", treat: "1-2일 내 방제 권장",
      disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
      drugs: [
        { name: "안트라콜",   primary: true, reason: "탄저병 전문 예방·치료제. 잔류효과 길고 우천 전 살포 효과적" },
        { name: "다이센엠-45", primary: true, reason: "접촉성 살균, 넓은 병해 스펙트럼. 저항성 발현 낮음" },
        { name: "캡타폴",              reason: "감염 초기 치료에 적합. 병반 확산 억제" },
        { name: "프로피네브",           reason: "예방 위주 살포용. 다른 계통과 교호 사용 권장" },
      ],
    }
  },
  {
    id: 2, zone: "C-1", title: "C-1 구역 이상 감지", body: "흰가루병 초기 증상 의심 (정확도 65%)", time: "14분 전", level: "warn", unread: true,
    diagZone: {
      zone: "C-1", accuracy: 65, area: 3,
      photo: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
      time: "08:47", treat: "관찰 후 판단",
      disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
      drugs: [
        { name: "안트라콜", primary: true, reason: "의심 단계 예방 처리. 확산 전 조기 차단" },
        { name: "캡타폴",              reason: "낮은 정확도 감안, 예방적 관찰 살포 권장" },
      ],
    }
  },
  {
    id: 3, zone: "B-4", title: "B-4 구역 예찰 완료", body: "탄저병 의심 (정확도 78%)", time: "37분 전", level: "danger", unread: false,
    diagZone: {
      zone: "B-4", accuracy: 78, area: 6,
      photo: "https://images.unsplash.com/photo-1582254465498-6bc70419bdd2?w=400&q=80",
      time: "09:12", treat: "3일 내 예방 살포",
      disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
      drugs: [
        { name: "안트라콜", primary: true, reason: "탄저병 예방에 최적. 초기 병반 억제 효과" },
        { name: "다이센엠-45", primary: true, reason: "광범위 살균. 저항성 낮아 초기 처리에 적합" },
        { name: "프로피네브",           reason: "예방 살포 전용. 잎 표면 보호막 형성" },
      ],
    }
  },
  {
    id: 4, zone: "A-3", title: "A-3 구역 주의", body: "흰가루병 예방 살포 필요", time: "1시간 전", level: "warn", unread: false,
    diagZone: {
      zone: "A-3", accuracy: 71, area: 4,
      photo: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
      time: "10:03", treat: "1주 내 예방 살포",
      disease: "흰가루병", diseaseEn: "Powdery Mildew", color: "#E9B44C",
      drugs: [
        { name: "훼나리몰", primary: true, reason: "흰가루병 전문 내흡수성 살균제. 발생 초기 치료 효과" },
        { name: "트리플루미졸", primary: true, reason: "예방 및 치료 겸용. 이삭도 보호 가능" },
        { name: "황수화제",              reason: "유기농 대체제. 환경 부담 적고 예방 효과" },
      ],
    }
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenDiagSheet: (zone: DiagZone) => void;
};

export function NotificationPanel({ open, onClose, onOpenDiagSheet }: Props) {
  const { mockData } = useApp();
  return (
    <>
      <div
        className={`absolute inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute top-0 bottom-0 right-0 z-50 w-[320px] bg-[#f5f5f3] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-12 px-5 pb-3 flex items-center justify-between bg-white">
          <div>
            <p className="text-[11px] text-neutral-500 tracking-tight">위험 · 주의 알림만 표시</p>
            <h2 className="text-[19px] tracking-tight text-neutral-900" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              예찰 이상 알림
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 active:bg-neutral-200 flex items-center justify-center"
            aria-label="close"
          >
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        <div className="px-3 py-3 overflow-y-auto space-y-2" style={{ maxHeight: "calc(100% - 90px)" }}>
          {!mockData ? (
            <EmptyNotifications />
          ) : NOTIFS.map((n) => {
            const isDanger = n.level === "danger";
            const accent = isDanger ? "#CF4F0E" : "#E9B44C";
            const bgAccent = isDanger ? "rgba(207,79,14,0.10)" : "rgba(233,180,76,0.12)";
            return (
              <button
                key={n.id}
                onClick={() => {
                  onClose();
                  onOpenDiagSheet(n.diagZone);
                }}
                className="w-full text-left rounded-[14px] bg-white p-3 flex items-start gap-3 active:bg-neutral-50 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: bgAccent }}
                >
                  {isDanger ? (
                    <AlertTriangle className="w-4 h-4" style={{ color: accent }} />
                  ) : (
                    <AlertCircle className="w-4 h-4" style={{ color: accent }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full text-white tracking-tight"
                      style={{ background: accent, fontWeight: 600 }}
                    >
                      {isDanger ? "위험" : "주의"}
                    </span>
                    <span className="text-[11px] text-neutral-500 tracking-tight">{n.zone}</span>
                    <span className="text-[11px] text-neutral-400 tracking-tight ml-auto">{n.time}</span>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#CF4F0E" }} />}
                  </div>
                  <p className="mt-0.5 text-[13.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 600 }}>
                    {n.title}
                  </p>
                  <p className="text-[12px] text-neutral-600 tracking-tight">{n.body}</p>
                  <div className="mt-1.5 inline-flex items-center gap-0.5 text-[11px]" style={{ color: accent, fontWeight: 600 }}>
                    진단 대시보드에서 보기 <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
