exports.pagination = (page, itemsCount, url) => {
  const urlPrefix = url.split("").some((item) => item === "?")
    ? `${url}&page=`
    : `${url}?page=`;
  const pagination = {};
  pagination.hasPreviousPage = page > 1;
  pagination.currentPage = page;
  pagination.hasNextPage = process.env.LINES_PER_PAGE * page < itemsCount;
  pagination.lastPage =
    Math.ceil(itemsCount / process.env.LINES_PER_PAGE) || page;
  pagination.urlPrefix = urlPrefix;

  return pagination;
};
