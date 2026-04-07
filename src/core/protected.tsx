import { Button } from "@/components/ui/button"
import React from "react"
import { useAuth } from "react-oidc-context"
import { ThunderSDK } from "thunder-sdk"
import { LoadingScreen } from "./custom/LoadingScreen"

export function Protected({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false)
  const auth = useAuth()

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      ThunderSDK.plugins.essentials.registerAuthInterceptors(
        async () => auth.user?.access_token ?? null,
        async () => {
          await auth.signinSilent()
        }
      )

      ThunderSDK.plugins.essentials.registerPermissions().then(() => {
        setReady(true)
      })
    }

    return () => {
      ThunderSDK.plugins.essentials.unregisterAuthInterceptors()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated])

  const requireSignIn = !auth.isAuthenticated && !auth.isLoading && !auth.error
  const loadingPermissions = !requireSignIn && !ready

  const handleSignIn = () => {
    auth.signinRedirect()
  }

  const handleLogout = () => {
    auth.removeUser()
    auth.revokeTokens(["refresh_token", "access_token"])

    setReady(false)
  }

  const handleSignInAgain = () => {
    handleLogout()
    handleSignIn()
  }

  if (requireSignIn) {
    return (
      <LoadingScreen
        title="Sign in to continue"
        description="Click the following button to sign into your account"
      >
        <Button onClick={handleSignIn}>Sign In</Button>
      </LoadingScreen>
    )
  }

  if (auth.error) {
    return (
      <LoadingScreen
        title="Something went wrong!"
        description={auth.error.message}
      >
        <Button variant="outline" onClick={handleSignInAgain}>
          Sign in again?
        </Button>
      </LoadingScreen>
    )
  }

  if (loadingPermissions)
    return (
      <LoadingScreen
        title="Getting things ready!"
        description="We are loading your permissions..."
      >
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </LoadingScreen>
    )

  return children
}
