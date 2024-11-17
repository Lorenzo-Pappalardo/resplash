import { authorizeEndpoint, makeTokenRequest, tokenEndpoint } from '@/my_middleware';
import NextAuth, { User } from 'next-auth';

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: 'unsplash',
      name: 'Unsplash',
      type: 'oauth',
      clientId: process.env.ACCESS_KEY,
      clientSecret: process.env.NEXTAUTH_SECRET,
      authorization: {
        url: authorizeEndpoint,
        params: {
          scope: 'public'
        }
      },
      token: {
        url: tokenEndpoint,
        async request(context) {
          const tokens = (await makeTokenRequest(context.params.code)) ?? {};
          return { tokens };
        }
      },
      profile: (profile: User) => ({
        id: profile.id
      }),
      userinfo: {
        request: () => ({})
      }
    }
  ]
});

export { handler as GET, handler as POST };
