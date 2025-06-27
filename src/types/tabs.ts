interface Tab {
  id: string;
  title: string;
  path: string;
  parentId: string;
}

interface Tabs {
  activeTabId: string;
  tabs: Tab[];
}
