import { useApp } from "../context";

export function LoginScreen() {
  const { setStage, setUser, user } = useApp();

  const onStart = () => {
    setUser({ ...user, loginType: null });
    setStage("onboarding");
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--brand-green)" }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <h1
          className="text-white tracking-tight text-center"
          style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          FAMI
        </h1>
      </div>

      <div className="px-6 pb-10">
        <button
          onClick={onStart}
          className="w-full h-[54px] rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-white"
          style={{ color: "var(--brand-green)", fontSize: 15, fontWeight: 700 }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
