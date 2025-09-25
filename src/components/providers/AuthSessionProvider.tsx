import SessionProvider from './SessionProvider'
import { Session } from 'next-auth'

interface Props {
  children: React.ReactNode
  session: Session | null
}

export default function AuthSessionProvider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}