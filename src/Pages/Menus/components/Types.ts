import { baseType } from "../../../Components/Forms/hooks/Types";

export interface BaseMenuType {
  id            : string;         
  restaurant    : baseType
  title         : string;      
  slug          : string;       
  description?  : string;
  is_default    : boolean;
}

export type  DetailsMenuType = BaseMenuType | {
    sections: string[]
}