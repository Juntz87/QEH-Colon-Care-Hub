import Head from 'next/head'
import NavBar from './NavBar'
import Footer from './Footer'

export default function Layout({
  children,
  title = 'QEH Colorectal Hub',
  description = 'Clinic portal for colorectal cancer education, counselling, support, and internal updates.',
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">{children}</main>
        <Footer />
      </div>
    </>
  )
}
