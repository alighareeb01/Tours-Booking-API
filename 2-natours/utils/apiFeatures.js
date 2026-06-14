export class APIFeatures {
  constructor(query, qureyString) {
    this.query = query;
    this.qureyString = qureyString;
  }
  filter() {
    const queryObj = { ...this.qureyString };
    const excludedFields = ["sort", "fields", "limit", "page"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.qureyString.sort) {
      const sortBy = this.qureyString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limit() {
    if (this.qureyString.fields) {
      const fields = this.qureyString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.qureyString.page * 1 || 1;
    const limit = this.qureyString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
