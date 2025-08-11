import type { AssetsId } from "@/core/commons/constants/AssetsId";

declare global { 
  type AssetId = AssetsId | (string & {}) | number;
  
}