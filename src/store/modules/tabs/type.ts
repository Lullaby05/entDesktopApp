export interface TabProps {
    key:string;
    name?:string;
    modelName?: string;
    route?: string;
    icon?: string;
  }
  
  export interface TabsState {
    tabList: TabProps[];
  }