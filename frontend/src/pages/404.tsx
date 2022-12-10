import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

const NotFound = () => {
  return (
    <>
      <PageSEO title={`Страница не найдена - ${siteMetadata.title}`} />
      <div className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-center md:space-x-6 md:pt-24">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="md:border-r2 md:leading-14 text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:px-6 md:text-8xl">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Извините, у нас не получилось найти эту страницу
          </p>
          <p className="mb-8">
            К сожалению, данная страница не была найдена. Вы можете вернуться на главную.
          </p>
          <Link href="/home">
            <button
              className={`inline rounded-lg border border-transparent bg-indigo-600 
              px-4 py-2 text-sm font-medium leading-5 text-neutral-50 shadow transition-colors
              duration-150 hover:bg-indigo-700 focus:outline-none dark:hover:bg-indigo-500`}
            >
              Вернуться на главную
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
