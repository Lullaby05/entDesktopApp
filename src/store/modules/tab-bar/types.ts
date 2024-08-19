export interface TagProps {
  title: string;
  name: string;
  fullPath: string;
  query?: any;
  ignoreCache?: boolean;
  modelName?: string;
  icon?: string;
}

export interface TabBarState {
  tagList: TagProps[];
  cacheTabList: Set<string>;
}
