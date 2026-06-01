import { useApp } from "../context";

export function LoginScreen() {
  const { setStage, setUser, user } = useApp();

  const onLogin = (loginType: "kakao" | "google") => {
    setUser({ ...user, loginType });
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
        <div className="flex items-center gap-3 mb-4">
          <span className="flex-1 h-px bg-white/20" />
          <span className="text-[11px] tracking-tight" style={{ color: "rgba(255,255,255,0.6)" }}>간편 로그인</span>
          <span className="flex-1 h-px bg-white/20" />
        </div>

        <button
          onClick={() => onLogin("kakao")}
          className="w-full h-[54px] rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: "#FEE500", color: "#191600", fontSize: 15, fontWeight: 700 }}
        >
          <KakaoIcon />
          카카오로 시작하기
        </button>

        <button
          onClick={() => onLogin("google")}
          className="mt-2.5 w-full h-[54px] rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-white"
          style={{ color: "#1f1f1f", fontSize: 15, fontWeight: 600 }}
        >
          <GoogleIcon />
          Google로 시작하기
        </button>

        <p className="mt-5 text-center text-[11px] tracking-tight" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          계속 진행 시 이용약관 및 개인정보 처리방침에<br />동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4C7 4 3 7.1 3 10.9c0 2.4 1.7 4.5 4.2 5.7L6.3 20l3.6-2c.7.1 1.4.2 2.1.2 5 0 9-3.1 9-6.9C21 7.1 17 4 12 4z"
        fill="#191600"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.3 5.2c-.4.4 6.7-4.9 6.7-14.8 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
