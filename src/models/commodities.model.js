import mongoose from "mongoose";

const commoditiesSchema = new mongoose.Schema(
  {
    variety: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    market: {
      type: String,
      required: true,
    },

    commodity: {
      type: String,
      required: true,
    },

    arrival_date: {
      type: Date,
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },

    min_price: {
      type: Number,
      required: true,
    },

    max_price: {
      type: Number,
      required: true,
    },

    modal_price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

commoditiesSchema.index(
  {
    arrival_date: 1,
    state: 1,
    district: 1,
    market: 1,
    commodity: 1,
    variety: 1,
  },
  {
    unique: true,
  },
);

commoditiesSchema.index({
  commodity: 1,
  market: 1,
  district: 1,
  arrival_date: -1,
});

commoditiesSchema.index(
  { arrival_date: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 100 },
);

const Commodity = mongoose.model("Commodity", commoditiesSchema);

export default Commodity;
