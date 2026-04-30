import { GlobalConfig } from "../common/interface/globalConfig.interface";

export const globalConfig:GlobalConfig = {
  debugMode: true,
  enableImageUploadAPI: true,  //POST /uploadImage
  enableCreateGroupAPI: true,  //POST /createGroup
  enableGetGroupsAPI: true,    //GET /getGroups
  enableDeleteGroupAPI: true,  //DELETE /deleteGroup  
};