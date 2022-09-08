exports.pagination = (page, itemsCount, url) => {
  const clearPageFilter = url.split(/(&|\?)(page=)/)[0];
  const urlPrefix = clearPageFilter.split("").some((item) => item === "?")
    ? `${clearPageFilter}&page=`
    : `${clearPageFilter}?page=`;
  const pagination = {};
  pagination.hasPreviousPage = page > 1;
  pagination.currentPage = page;
  pagination.hasNextPage = process.env.LINES_PER_PAGE * page < itemsCount;
  pagination.lastPage =
    Math.ceil(itemsCount / process.env.LINES_PER_PAGE) || page;
  pagination.urlPrefix = urlPrefix;

  return pagination;
};
