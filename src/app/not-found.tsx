import Link from 'next/link'

export default async function NotFoundPage() {
  return (
    <div className="h-full flex-center-center flex-col gap-5">
      <h1>Oh, it seems you&#39;re a little lost...</h1>
      <span className="text-sm">The page you are looking for does not exist.</span>
      <Link href={'/'} className="hover:text-gray-700 transition-all">
        Go to Catalog
      </Link>
    </div>
  )
}
