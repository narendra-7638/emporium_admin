export interface IProducts {
    _id: String,
    name: String,
    price: Number,
    size: Array<Number>,
    details: String,
    features: Array<String>,
    primary_pics: String,
    secondary_pics: Array<String>,
    last_updated: String,
    is_active: Boolean,
    is_trending: Boolean,
    is_featured: Boolean,
    created_on: String
  }

  export interface IProductType {
    id: Number,
    name: String
  }