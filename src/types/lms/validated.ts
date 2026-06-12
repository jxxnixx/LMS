import type { components, paths } from './schema';

//// getBooks
// getBooks
export type getBooks_Params = {
  query?: paths['/books']['get']['parameters']['query'];
};
export type getBooks_Response = components['schemas']['PageBookResponse'];
//// createBook
// createBook
export type createBook_Body = components['schemas']['BookCreateRequest'];
export type createBook_Response = components['schemas']['BookResponse'];

//// signup
// signup
export type signup_Body = components['schemas']['SignupRequest'];
export type signup_Response = components['schemas']['AuthResponse'];

//// sendCode
// sendCode
export type sendCode_Body = components['schemas']['SendCodeRequest'];
export type sendCode_Response = any;

//// login
// login
export type login_Body = components['schemas']['LoginRequest'];
export type login_Response = components['schemas']['AuthResponse'];

//// checkCode
// checkCode
export type checkCode_Body = components['schemas']['CheckCodeRequest'];
export type checkCode_Response = any;

//// image
// image
export type image_Body = components['schemas']['ImageRequest'];
export type image_Response = any;

//// chat
// chat
export type chat_Body = components['schemas']['ChatRequest'];
export type chat_Response = any;

//// getBook
// getBook
export type getBook_Params = {
  path: paths['/books/{id}']['get']['parameters']['path'];
};
export type getBook_Response = components['schemas']['BookResponse'];
//// deleteBook
// deleteBook
export type deleteBook_Params = {
  path: paths['/books/{id}']['delete']['parameters']['path'];
};
export type deleteBook_Response = void;
//// updateBook
// updateBook
export type updateBook_Params = {
  path: paths['/books/{id}']['patch']['parameters']['path'];
};
export type updateBook_Body = components['schemas']['BookUpdateRequest'];
export type updateBook_Response = components['schemas']['BookResponse'];

//// toggleLike
// toggleLike
export type toggleLike_Params = {
  path: paths['/books/{id}/like']['patch']['parameters']['path'];
};
export type toggleLike_Response = components['schemas']['BookResponse'];

//// getGenres
// getGenres
export type getGenres_Params = {
  query?: paths['/genres']['get']['parameters']['query'];
};
export type getGenres_Response = any;

//// proxy
// proxy
export type proxy_Params = {
  query: paths['/api/naver']['get']['parameters']['query'];
};
export type proxy_Response = any;
