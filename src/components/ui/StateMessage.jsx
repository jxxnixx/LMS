// 로딩 / 서버 연결 실패 / 빈 상태 같은 안내 문구를 한 곳에서 관리.
// status 프리셋을 쓰거나, children으로 임의 문구를 넣을 수 있다.
const SERVER_ERROR = (
  <>
    json-server에 연결할 수 없어요.
    <br />
    <code>npm run server</code> 실행 후 새로고침하세요.
  </>
);

export default function StateMessage({ status, children }) {
  let content = children;
  if (status === "loading") content = "불러오는 중…";
  else if (status === "server-error") content = SERVER_ERROR;

  return <div className="cat-state">{content}</div>;
}
