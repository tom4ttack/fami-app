import { useEffect, useRef, useState } from "react";
import type { LatLng } from "../data/parcel-coords";

declare global {
  interface Window { kakao: any; }
}

export type { LatLng };

export type ParcelPolygon = {
  id: string;
  label?: string;
  coordinates: LatLng[];
  state?: "danger" | "warn" | "safe";
  selected?: boolean;
};

const STATE_COLORS: Record<string, string> = {
  danger: "#CF4F0E",
  warn:   "#E9B44C",
  safe:   "#496942",
};

const KAKAO_APP_KEY = "39ee9c865e1a66a8f9a415a64c28a073";

let sdkReady = false;
const sdkCallbacks: Array<() => void> = [];

function loadSdk(cb: () => void) {
  if (sdkReady) { cb(); return; }
  sdkCallbacks.push(cb);
  if (document.getElementById("kakao-maps-sdk")) return;
  const script = document.createElement("script");
  script.id = "kakao-maps-sdk";
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
  script.onload = () => {
    window.kakao.maps.load(() => {
      sdkReady = true;
      sdkCallbacks.splice(0).forEach((fn) => fn());
    });
  };
  script.onerror = () => {
    console.error("[KakaoMap] SDK 로딩 실패. 카카오 개발자 콘솔에서 도메인을 등록해주세요.");
  };
  document.head.appendChild(script);
}

export type KakaoMapProps = {
  parcels?: ParcelPolygon[];
  center?: LatLng;
  level?: number;
  radiusKm?: number;
  onParcelClick?: (id: string) => void;
  /** 주소 문자열 — 제공 시 Geocoder로 해당 위치로 지도 이동 */
  searchAddress?: string;
  onAddressResolved?: (center: LatLng) => void;
  className?: string;
};

const DEFAULT_CENTER: LatLng = { lat: 36.4576, lng: 126.8032 };

export function KakaoMap({
  parcels = [],
  center,
  level = 4,
  radiusKm,
  onParcelClick,
  searchAddress,
  onAddressResolved,
  className = "",
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const [ready, setReady] = useState(sdkReady);

  // Load SDK once
  useEffect(() => {
    if (!sdkReady) loadSdk(() => setReady(true));
  }, []);

  // Reset map on unmount so remount creates a fresh instance
  useEffect(() => () => { mapRef.current = null; }, []);

  // Initialize or recenter map
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const { kakao } = window;
    const mapCenter = center
      ? new kakao.maps.LatLng(center.lat, center.lng)
      : parcels.length > 0
        ? (() => {
            const all = parcels.flatMap((p) => p.coordinates);
            return new kakao.maps.LatLng(
              all.reduce((s, c) => s + c.lat, 0) / all.length,
              all.reduce((s, c) => s + c.lng, 0) / all.length,
            );
          })()
        : new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);

    if (!mapRef.current) {
      mapRef.current = new kakao.maps.Map(containerRef.current, { center: mapCenter, level });
    } else {
      mapRef.current.setCenter(mapCenter);
      mapRef.current.setLevel(level);
    }
  }, [ready, center, level]);

  // Address search → recenter
  useEffect(() => {
    if (!ready || !mapRef.current || !searchAddress) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchAddress, (result: any[], status: string) => {
      if (status !== window.kakao.maps.services.Status.OK) return;
      const lat = parseFloat(result[0].y);
      const lng = parseFloat(result[0].x);
      mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
      mapRef.current.setLevel(level);
      onAddressResolved?.({ lat, lng });
    });
  }, [ready, searchAddress]);

  // Draw parcels + radius circle
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { kakao } = window;

    // Clear
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    // Polygons
    parcels.forEach((parcel) => {
      const color = STATE_COLORS[parcel.state ?? "safe"];
      const path = parcel.coordinates.map((c) => new kakao.maps.LatLng(c.lat, c.lng));

      const polygon = new kakao.maps.Polygon({
        path,
        strokeWeight: parcel.state === "danger" ? 2.5 : 1.8,
        strokeColor: color,
        strokeOpacity: 1,
        fillColor: color,
        fillOpacity: parcel.selected ? 0.65 : 0.38,
      });
      polygon.setMap(mapRef.current);
      overlaysRef.current.push(polygon);

      if (onParcelClick) {
        kakao.maps.event.addListener(polygon, "click", () => onParcelClick(parcel.id));
      }

      if (parcel.label) {
        const avgLat = parcel.coordinates.reduce((s, c) => s + c.lat, 0) / parcel.coordinates.length;
        const avgLng = parcel.coordinates.reduce((s, c) => s + c.lng, 0) / parcel.coordinates.length;
        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(avgLat, avgLng),
          content: `<span style="font-size:9px;font-weight:800;color:${color};background:rgba(255,255,255,0.88);padding:2px 5px;border-radius:4px;pointer-events:none;white-space:nowrap;">${parcel.label}</span>`,
          yAnchor: 0.5,
        });
        overlay.setMap(mapRef.current);
        overlaysRef.current.push(overlay);
      }
    });

    // Fit bounds to all parcels
    if (parcels.length > 0 && !center) {
      const bounds = new kakao.maps.LatLngBounds();
      parcels.flatMap((p) => p.coordinates).forEach((c) => bounds.extend(new kakao.maps.LatLng(c.lat, c.lng)));
      mapRef.current.setBounds(bounds);
    }

    // Radius circle
    if (radiusKm && radiusKm > 0) {
      const mapCenter = mapRef.current.getCenter();
      const circle = new kakao.maps.Circle({
        center: mapCenter,
        radius: radiusKm * 1000,
        strokeWeight: 2.5,
        strokeColor: "#E9B44C",
        strokeOpacity: 0.9,
        strokeStyle: "shortdash",
        fillColor: "#E9B44C",
        fillOpacity: 0.07,
      });
      circle.setMap(mapRef.current);
      overlaysRef.current.push(circle);
    }
  }, [ready, parcels, radiusKm, onParcelClick]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit]" style={{ background: "#eef2ea" }}>
          <span className="text-[11px] text-neutral-500 tracking-tight">지도 로딩 중…</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
