import { Link, Outlet } from 'react-router'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'
import { QueryClient,QueryClientProvider, } from '@tanstack/react-query'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
      <div className='px-4 py-4 h-screen flex flex-col'>
        <header className='flex justify-between m-2 bg-gray-900 rounded-full'>
          <Link to="/" className='rounded-full bg-blue-950 px-4 py-1 ring-1 text-center'>
            <span className='text-4xl text-blue-200 '>ASK-AI</span>
          </Link>
          <div className='user flex justify-center items-center pr-4'>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <main className='flex-1/2 overflow-hidden'>
          <Outlet />
        </main>
      </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout