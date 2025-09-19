//src/app/modules/division/division.model.ts
import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import { makeSlug } from "../../utils/makeSlug";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      
    },

    thumbnail: {
      type: String,
    },

    description: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);



// Pre-save middleware to generate unique slug

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {   // ✅ FIXED condition
    let baseSlug = makeSlug(this.name);
    let slug = `${baseSlug}-division`;

    let count = 0;
    while (await Division.exists({ slug })) {
      count++;
      slug = `${baseSlug}-division-${count}`;
    }
    this.slug = slug;
  }

  next();
});



// Pre-update middleware to handle slug on name change

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IDivision>;
  if (update.name) {
    let baseSlug = makeSlug(update.name);
    let slug = `${baseSlug}-division`;
    let count = 0;
    while (await Division.exists({ slug })) {
      count++;
      slug = `${baseSlug}-division-${count}`;
    }
    update.slug = slug;
    this.setUpdate(update);
  }
  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
