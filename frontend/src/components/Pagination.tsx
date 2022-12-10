import React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import PaginationT from '@/types/Pagination'

interface PaginationProps {
  onChange: (page: number) => void
  pagination: PaginationT<any>
}

export const Pagination: React.FC<PaginationProps> = ({ onChange: setPage, pagination }) => {
  const page = pagination.page

  const pageDecrement = () => page > 1 && setPage(page - 1)

  const pageIncrement = () => page < pagination.pagesCount && setPage(page + 1)

  const pageSetStart = () => page > 1 && setPage(1)

  const pageSetEnd = () => page < pagination.pagesCount && setPage(pagination.pagesCount)

  const range = (start: number, end: number) =>
    new Array(end - start).fill(1).map((d, i) => i + start)

  return (
    <div className="grid w-full grid-cols-11">
      <div
        className={`col-span-1 flex items-center justify-center p-3
          ${page > 1 ? 'cursor-pointer text-neutral-800' : 'text-neutral-400'}`}
        onClick={pageSetStart}
      >
        <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div
        className={`col-span-1 flex items-center justify-center p-3
          ${page > 1 ? 'cursor-pointer text-neutral-800' : 'text-neutral-400'}`}
        onClick={pageDecrement}
      >
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="col-span-7 h-full">
        <ul className="flex w-full items-center justify-center">
          {range(page - 3, page + 4)
            .filter((x) => x >= 1 && x <= pagination.pagesCount)
            .map((x, idx) => (
              <li
                key={idx}
                className={`
                    flex h-10 w-8 items-center justify-center
                    text-sm hover:bg-neutral-200
                    ${
                      x !== page
                        ? 'cursor-pointer bg-transparent text-neutral-700'
                        : 'bg-neutral-200 text-neutral-600'
                    }
                  `}
                onClick={() => setPage(x)}
              >
                {x}
              </li>
            ))}
        </ul>
      </div>
      <div
        className={`col-span-1 flex items-center justify-center p-3
          ${page < pagination.pagesCount ? 'cursor-pointer text-neutral-800' : 'text-neutral-400'}`}
        onClick={pageIncrement}
      >
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div
        className={`col-span-1 flex items-center justify-center p-3
          ${page < pagination.pagesCount ? 'cursor-pointer text-neutral-800' : 'text-neutral-400'}`}
        onClick={pageSetEnd}
      >
        <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  )
}

export default Pagination
