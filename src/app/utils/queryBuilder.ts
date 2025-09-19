// queryBuilder.ts

class QueryBuilder<T> {
  model: any;
  query: Record<string, any>;

  constructor(model: any, query: Record<string, any>) {
    this.model = model;
    this.query = query;
  }

  parsePaginationAndSort() {
    const page = Number(this.query.page || 1);
    const limit = Number(this.query.limit || 10);
    const skip = (page - 1) * limit;
    const sort = this.query.sort || "-createdAt";
    return { page, limit, skip, sort };
  }

  buildSearchQuery(searchableFields: string[]) {
    const search = this.query.search;
    if (!search) return {};
    return {
      $or: searchableFields.map(field => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  }

  buildFilters() {
    const { search, page, limit, sort, fields, ...filters } = this.query;
    return Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        typeof value === "string" ? { $regex: value, $options: "i" } : value,
      ])
    );
  }

  buildFieldSelection() {
    return this.query.fields ? this.query.fields.split(",").join(" ") : "";
  }

  async execute(searchableFields: string[]) {
    const { page, limit, skip, sort } = this.parsePaginationAndSort();
    const searchQuery = this.buildSearchQuery(searchableFields);
    const filterQuery = this.buildFilters();
    const queryObj = { ...searchQuery, ...filterQuery };

    const [total, data] = await Promise.all([
      this.model.countDocuments(queryObj),
      this.model
        .find(queryObj)
        .sort(sort)
        .select(this.buildFieldSelection())
        .skip(skip)
        .limit(limit),
    ]);

    return {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    };
  }
}

// ✅ Export the class
export default QueryBuilder;
