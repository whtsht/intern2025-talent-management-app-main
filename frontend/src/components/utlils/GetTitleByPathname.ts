const pathTitleMap: { [key: string]: string } = {
  "/": "社員検索",
  "/employee": "社員詳細",
};

export function getTitleByPathname(pathname: string): string {
  // 1. pathTitleMap を 配列(["/","社員検索"]) に変換
  const entries = Object.entries(pathTitleMap);

  // 2. キーの長さが長い順にソート
  const sortedEntries = entries.sort((a, b) => b[0].length - a[0].length);

  // 3. pathname にマッチする配列を探す
  const matchedEntry = sortedEntries.find(([key]) => pathname.startsWith(key));

  // 4. 見つかればタイトルを返す
  return matchedEntry ? matchedEntry[1] : "";
}
