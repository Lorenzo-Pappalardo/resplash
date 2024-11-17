import { NextRequest, NextResponse } from 'next/server';

const jwtCookieKey = 'UNSPLASH_JWT';
const oAuth2Location = 'https://unsplash.com/oauth';
export const authorizeEndpoint = `${oAuth2Location}/authorize`;
export const tokenEndpoint = `${oAuth2Location}/token`;

export const config = {
  matcher: '/authentication'
};

export async function middleware(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const urlSearchParams = new URLSearchParams(searchParams);

  console.log('[Middleware]', 'Request URL:', request.url);

  const response = NextResponse.next();

  const authorizationCode = urlSearchParams.get('code');

  if (authorizationCode !== null) {
    console.log('[Middleware]', 'Found authorization code:', authorizationCode);

    const tokens = await makeTokenRequest(authorizationCode);

    console.log(tokens);

    if (tokens?.access_token !== undefined) {
      response.cookies.set(jwtCookieKey, tokens?.access_token);
    }
  } else if (request.cookies.get(jwtCookieKey) === undefined) {
    const queryParameters = new URLSearchParams();
    queryParameters.append('client_id', process.env.ACCESS_KEY ?? '');
    queryParameters.append('redirect_uri', process.env.REDIRECT_URI ?? '');
    queryParameters.append('response_type', 'code');
    queryParameters.append('scope', ['public'].join('+'));

    return NextResponse.redirect(`${authorizeEndpoint}?${queryParameters}`);
  }

  return response;
}

export const makeTokenRequest = async (
  authorizationCode?: string
): Promise<undefined | TokenSetParameters> => {
  if (authorizationCode === undefined) {
    return undefined;
  }

  const queryParameters = new URLSearchParams();
  queryParameters.append('client_id', process.env.ACCESS_KEY ?? '');
  queryParameters.append('client_secret', process.env.SECRET_KEY ?? '');
  queryParameters.append('redirect_uri', process.env.REDIRECT_URI ?? '');
  queryParameters.append('code', authorizationCode);
  queryParameters.append('grant_type', 'authorization_code');

  const tokenResponse = await fetch(new URL(`${tokenEndpoint}?${queryParameters}`), {
    method: 'POST'
  });

  if (tokenResponse.ok) {
    return await tokenResponse.json();
  }
};

interface TokenSetParameters {
  access_token?: string;
  token_type?: string;
  id_token?: string;
  refresh_token?: string;
  scope?: string;

  expires_at?: number;
  session_state?: string;

  [key: string]: unknown;
}
