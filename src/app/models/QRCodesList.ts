export interface QRCodesList {
  id: number;
  path: string;
  timestamp: string;
  warehouseLocationId: number;
  codeType: number;
  codeTypeNavigation: any | null;
  warehouseLocation: any | null;
}