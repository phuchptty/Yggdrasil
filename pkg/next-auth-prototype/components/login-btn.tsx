import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginBtn() {
  const { data: session } = useSession()
  console.log(session);

  if (session) {
    return (
      <>
        <div>Signed in as {JSON.stringify(session?.user, null, 2)} <br /></div>
        <div>Access Token: <br/>{session?.accessToken}</div>
        <div>
          Refresh Token: <br/>{session?.refreshToken}
        </div>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("keycloak", undefined, {
        prompt: "login",
        grant_type: "refresh_token"
      })}>Sign in</button>
    </>
  )
}
