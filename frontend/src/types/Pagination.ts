type Pagination<T> = {
  page: number
  pageSize: number
  pagesCount: number
  count: number
  items: T[]
}

export default Pagination

export const convertFromServer = <T>(
  data: any,
  itemsConverter: (value: any) => T
): Pagination<T> => {
  return {
    count: data.count,
    page: data.page,
    pageSize: data.page_size,
    pagesCount: data.pages_count,
    items: data.items.map((val: any) => itemsConverter(val)),
  }
}
