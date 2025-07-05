const pathTitleMap: { [key: string]: string } = {
  "/": "社員検索",
  "/employee": "社員詳細",
};

export function getTitleByPathname(pathname: string): string {
  const matchedEntry = Object.entries(pathTitleMap).find(([key]) =>
    pathname.startsWith(key)
  );
  return matchedEntry ? matchedEntry[1] : "";
}
