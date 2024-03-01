import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CreateUserData, LoginSuccess } from "../../../../components/api/user";

const handler = NextAuth({
  //...
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_PW,
    }),
  ],

  callbacks: {
    async signIn(userdata = { user, account, profile, email, credentials }) {
      // console.log(userdata.user.email + " 로그인 성공");
      // console.log(userdata.profile.locale);

      //DB에서 계정 찾고, 없을 경우 유저데이터를 만들어줌
      CreateUserData(userdata);
      //있을경우 마지막로그인시간 DB에서 수정
      LoginSuccess(userdata);

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      // console.log(session);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    // async signOut() {
    // console.log(userdata.email + "로그아웃 성공");
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
