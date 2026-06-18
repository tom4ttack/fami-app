import { useEffect, useRef, useState, useMemo } from "react";
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

const KAKAO_APP_KEY = "39ee9c865e1a66a8f9a415a64c24a073";

let sdkState: "idle" | "loading" | "ready" | "error" = "idle";
const sdkCallbacks: Array<(ok: boolean) => void> = [];

function loadSdk(cb: (ok: boolean) => void) {
  if (sdkState === "ready") { cb(true); return; }
  if (sdkState === "error") { cb(false); return; }
  sdkCallbacks.push(cb);
  if (sdkState === "loading") return;
  sdkState = "loading";
  const script = document.createElement("script");
  script.id = "kakao-maps-sdk";
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`;
  script.onload = () => {
    try {
      window.kakao.maps.load(() => {
        sdkState = "ready";
        sdkCallbacks.splice(0).forEach((fn) => fn(true));
      });
    } catch (err) {
      console.error("[KakaoMap] maps.load 실패 — 도메인 미등록 또는 앱키 오류:", err);
      sdkState = "error";
      sdkCallbacks.splice(0).forEach((fn) => fn(false));
    }
  };
  script.onerror = (err) => {
    console.error("[KakaoMap] SDK 스크립트 로드 실패 — 네트워크/CSP 차단:", err);
    sdkState = "error";
    sdkCallbacks.splice(0).forEach((fn) => fn(false));
  };
  document.head.appendChild(script);
}

// ─── Mock map rendered when the SDK is unavailable ───────────────────────────

const MOCK_GRID_LINES = 8;
const MOCK_ROAD_COLOR = "#d6d0c4";
const MOCK_BG = "#e8e0d0";
const MOCK_FIELD_COLOR = "#c8d4b8";

function latLngToSvgXY(
  coord: LatLng,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  w: number,
  h: number,
  padding = 20,
) {
  const lat = Math.min(Math.max(coord.lat, bounds.minLat), bounds.maxLat);
  const lng = Math.min(Math.max(coord.lng, bounds.minLng), bounds.maxLng);
  const x = padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * (w - padding * 2);
  const y = h - padding - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * (h - padding * 2);
  return { x, y };
}

function MockMap({
  parcels,
  center: centerLatLng,
  radiusKm,
  onParcelClick,
}: {
  parcels: ParcelPolygon[];
  center?: LatLng;
  radiusKm?: number;
  onParcelClick?: (id: string) => void;
}) {
  const W = 400;
  const H = 300;
  const KM_PER_LAT = 111;
  const KM_PER_LNG = 88.8;

  // Geographic center: explicit prop → parcel centroid → default
  const geoCenter = useMemo<LatLng>(() => {
    if (centerLatLng) return centerLatLng;
    const all = parcels.flatMap((p) => p.coordinates);
    if (all.length === 0) return { lat: 36.4576, lng: 126.8032 };
    return {
      lat: all.reduce((s, c) => s + c.lat, 0) / all.length,
      lng: all.reduce((s, c) => s + c.lng, 0) / all.length,
    };
  }, [centerLatLng, parcels]);

  // Bounds fixed at max radius (20km) so the map never rescales as radius changes
  const bounds = useMemo(() => {
    const all = parcels.flatMap((p) => p.coordinates);
    const lats = all.length > 0 ? all.map((c) => c.lat) : [geoCenter.lat];
    const lngs = all.length > 0 ? all.map((c) => c.lng) : [geoCenter.lng];
    const parcelPad = 0.003;

    // Always reserve space for the maximum possible radius (20 km)
    const maxRadiusLatDeg = 20 / KM_PER_LAT;
    const maxRadiusLngDeg = 20 / KM_PER_LNG;

    return {
      minLat: Math.min(Math.min(...lats) - parcelPad, geoCenter.lat - maxRadiusLatDeg),
      maxLat: Math.max(Math.max(...lats) + parcelPad, geoCenter.lat + maxRadiusLatDeg),
      minLng: Math.min(Math.min(...lngs) - parcelPad, geoCenter.lng - maxRadiusLngDeg),
      maxLng: Math.max(Math.max(...lngs) + parcelPad, geoCenter.lng + maxRadiusLngDeg),
    };
  }, [parcels, geoCenter]);

  // SVG position of the geographic center
  const centerSvg = useMemo(
    () => latLngToSvgXY(geoCenter, bounds, W, H),
    [geoCenter, bounds],
  );

  // Radius in px: use the lng→px scale factor
  const radiusPx = useMemo(() => {
    if (!radiusKm) return 0;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.01;
    const pxPerDeg = (W - 40) / lngSpan;
    const degPerKm = 1 / KM_PER_LNG;
    return radiusKm * degPerKm * pxPerDeg;
  }, [radiusKm, bounds]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      {/* Background */}
      <rect width={W} height={H} fill={MOCK_BG} />

      {/* Field texture tiles */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <rect
            key={`field-${row}-${col}`}
            x={col * 52 - 4}
            y={row * 52 - 4}
            width={46}
            height={46}
            fill={MOCK_FIELD_COLOR}
            opacity={0.5 + Math.sin(row * 3 + col) * 0.15}
            rx={2}
          />
        ))
      )}

      {/* Grid roads */}
      {Array.from({ length: MOCK_GRID_LINES }).map((_, i) => {
        const x = (W / MOCK_GRID_LINES) * i;
        const y = (H / MOCK_GRID_LINES) * i;
        return (
          <g key={`grid-${i}`}>
            <line x1={x} y1={0} x2={x} y2={H} stroke={MOCK_ROAD_COLOR} strokeWidth={3} />
            <line x1={0} y1={y} x2={W} y2={y} stroke={MOCK_ROAD_COLOR} strokeWidth={3} />
          </g>
        );
      })}

      {/* Diagonal accent roads */}
      <line x1={0} y1={H * 0.3} x2={W} y2={H * 0.55} stroke={MOCK_ROAD_COLOR} strokeWidth={5} opacity={0.7} />
      <line x1={0} y1={H * 0.7} x2={W * 0.6} y2={H} stroke={MOCK_ROAD_COLOR} strokeWidth={4} opacity={0.6} />

      {/* Parcels */}
      {parcels.map((parcel) => {
        const color = STATE_COLORS[parcel.state ?? "safe"];
        const pts = parcel.coordinates.map((c) => latLngToSvgXY(c, bounds, W, H));
        const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
        const avgX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
        const avgY = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        return (
          <g key={parcel.id} style={{ cursor: onParcelClick ? "pointer" : "default" }} onClick={() => onParcelClick?.(parcel.id)}>
            <polygon
              points={pointsStr}
              fill={color}
              fillOpacity={parcel.selected ? 0.35 : 0.18}
              stroke={color}
              strokeWidth={parcel.state === "danger" ? 2.5 : 1.8}
              strokeOpacity={0.9}
            />
            {parcel.label && (
              <text
                x={avgX}
                y={avgY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={800}
                fill={color}
                style={{ paintOrder: "stroke", stroke: "rgba(255,255,255,0.88)", strokeWidth: 4 }}
              >
                {parcel.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Radius circle */}
      {radiusKm && radiusKm > 0 && radiusPx > 0 && (
        <circle
          cx={centerSvg.x}
          cy={centerSvg.y}
          r={radiusPx}
          fill="#E9B44C"
          fillOpacity={0.10}
          stroke="#E9B44C"
          strokeWidth={2.5}
          strokeDasharray="6 4"
          strokeOpacity={0.9}
        />
      )}
      {/* Center dot */}
      {radiusKm && radiusKm > 0 && (
        <circle cx={centerSvg.x} cy={centerSvg.y} r={5} fill="#E9B44C" opacity={0.9} />
      )}

      {/* Map attribution watermark */}
      <text x={W - 6} y={H - 4} textAnchor="end" fontSize={8} fill="#999" opacity={0.6}>
        지도 미리보기
      </text>
    </svg>
  );
}

// ─── Main KakaoMap component ──────────────────────────────────────────────────

export type KakaoMapProps = {
  parcels?: ParcelPolygon[];
  center?: LatLng;
  level?: number;
  radiusKm?: number;
  onParcelClick?: (id: string) => void;
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
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">(
    sdkState === "ready" ? "ready" : sdkState === "error" ? "error" : "loading"
  );

  useEffect(() => {
    if (sdkStatus !== "loading") return;
    loadSdk((ok) => setSdkStatus(ok ? "ready" : "error"));
  }, []);

  useEffect(() => () => { mapRef.current = null; }, []);

  useEffect(() => {
    if (sdkStatus !== "ready" || !containerRef.current) return;
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
  }, [sdkStatus, center, level]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !mapRef.current || !searchAddress) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchAddress, (result: any[], status: string) => {
      if (status !== window.kakao.maps.services.Status.OK) return;
      const lat = parseFloat(result[0].y);
      const lng = parseFloat(result[0].x);
      mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
      mapRef.current.setLevel(level);
      onAddressResolved?.({ lat, lng });
    });
  }, [sdkStatus, searchAddress]);

  useEffect(() => {
    if (sdkStatus !== "ready" || !mapRef.current) return;
    const { kakao } = window;

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    parcels.forEach((parcel) => {
      const color = STATE_COLORS[parcel.state ?? "safe"];
      const path = parcel.coordinates.map((c) => new kakao.maps.LatLng(c.lat, c.lng));

      const polygon = new kakao.maps.Polygon({
        path,
        strokeWeight: parcel.state === "danger" ? 2.5 : 1.8,
        strokeColor: color,
        strokeOpacity: 1,
        fillColor: color,
        fillOpacity: parcel.selected ? 0.35 : 0.18,
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

    if (parcels.length > 0 && !center) {
      const bounds = new kakao.maps.LatLngBounds();
      parcels.flatMap((p) => p.coordinates).forEach((c) => bounds.extend(new kakao.maps.LatLng(c.lat, c.lng)));
      mapRef.current.setBounds(bounds);
    }

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
  }, [sdkStatus, parcels, radiusKm, onParcelClick]);

  if (sdkStatus === "error") {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ background: MOCK_BG }}>
        <MockMap parcels={parcels} center={center} radiusKm={radiusKm} onParcelClick={onParcelClick} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {sdkStatus === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit]" style={{ background: "#eef2ea" }}>
          <span className="text-[11px] text-neutral-500 tracking-tight">지도 로딩 중…</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
