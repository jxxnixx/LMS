// 카탈로그 페이지 공통 레이아웃.
//   <Page>
//     <PageHeader title="전체 도서">설명 문구</PageHeader>
//     ...
//   </Page>
export default function Page({ children }) {
  return <div className="cat-page">{children}</div>;
}

export function PageHeader({ title, children }) {
  return (
    <div className="cat-page-head">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
