// src/app/modules/division/division.service.ts

import { Division } from "./division.model";
import { IDivision} from "./division.interface";
import { makeSlug } from "../../utils/makeSlug";
import QueryBuilder from "../../utils/queryBuilder";
import { DIVISION_SEARCHABLE_FIELDS } from "./division.constant";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import mongoose from "mongoose";



// Create Division service
const createDivisionService = async (payload: IDivision) => {
  
  // 1. Check duplicate
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("Division name already exists");
  }

  // 2. Create new division
  const result = await Division.create(payload);
  return result;
};







export const updateDivisionService = async (
  id: string,
  payload: IDivision
) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if division exists
    const existingDivision = await Division.findById(id).session(session);
    if (!existingDivision) {
      throw new Error("Division not found");
    }

    // 2. Check for duplicate name (excluding current id)
    if (payload.name) {
      const duplicate = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
      }).session(session);

      if (duplicate) {
        throw new Error("Division name already exists");
      }
    }

    // 3. Update division
    const result = await Division.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    // 4. Delete old image if thumbnail is updated
    if (payload.thumbnail && existingDivision.thumbnail) {
      await deleteImageFromCLoudinary(existingDivision.thumbnail);
    }

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return result;
    
  } catch (error) {
    // ❌ Rollback transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




// Delete Division
 const deleteDivisionService = async (id: string) => {
  const result = await Division.findByIdAndDelete(id);
  return result;
};

const getAllDivisionsService = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(Division, query);
  const result = await qb.execute(DIVISION_SEARCHABLE_FIELDS); // no searchable fields
  return result;
};


 const getSingleDivisionService = async (slug: string) => {
  const result = await Division.findOne({ slug }); // find by slug
  return result;
};


export const DivisionServices = {
    createDivisionService,
    updateDivisionService,
    deleteDivisionService,
    getAllDivisionsService,
    getSingleDivisionService
};