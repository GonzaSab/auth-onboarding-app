import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createServerSupabaseClient } from '@/lib/supabase'
import LogoutButton from './components/LogoutButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth Onboarding App',
  description: 'User authentication and onboarding application with Supabase',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        {user && (
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                  <span className="text-xl font-bold text-gray-900">
                    MyApp
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </header>
        )}
        <main>{children}</main>
      </body>
    </html>
  )
}
