export type FarmEntry = {
  name: string; // 전체 주소
  pnu: string;  // 19자리 필지고유번호
};

// 주소 → PNU 매핑 DB (백엔드 연동 전 로컬 참조용)
export const FARM_DB: FarmEntry[] = [
  { name: '충청남도 청양군 청양읍 적누리', pnu: '4479025025103890002' },
];

/** 공백·특수문자 제거 후 정규화 */
function normalize(s: string) {
  return s.replace(/\s+/g, '').replace(/[·,]/g, '').toLowerCase();
}

/**
 * 주소 부분일치 검색
 * - 입력값이 DB 주소를 포함하거나, DB 주소가 입력값을 포함하는 경우 모두 반환
 */
export function searchFarmByAddress(query: string): FarmEntry[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  return FARM_DB.filter((e) => {
    const n = normalize(e.name);
    return n.includes(q) || q.includes(n);
  });
}

/** PNU로 단건 조회 */
export function findByPnu(pnu: string): FarmEntry | undefined {
  return FARM_DB.find((e) => e.pnu === pnu);
}
