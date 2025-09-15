// src/app/modules/division/division.service.ts

import { Division } from "./division.model";
import { IDivision} from "./division.interface";
import { makeSlug } from "../../utils/makeSlug";
import QueryBuilder from "../../utils/queryBuilder";
import { DIVISION_SEARCHABLE_FIELDS } from "./division.constant";



// Create Division
const createDivisionService = async (payload: IDivision) => {

  
  // 1. Check for duplicate name
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("Division name already exists");
  }

  // 2. Create new division
  const result = await Division.create(payload);
  return result;
};





// Update Division
const updateDivisionService = async (
  id: string,
  payload: IDivision
) => {
  // 1. Check if division exists
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new Error("Division not found");
  }

  // 2. Check for duplicate name (excluding current id)
  if (payload.name) {
    const duplicate = await Division.findOne({
      name: payload.name,
      _id: { $ne: id }, // exclude current division
    });

    if (duplicate) {
      throw new Error("Division name already exists");
    }
  }


  // 3. Update division
  const result = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
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