// src/app/modules/division/division.service.ts

import { Division } from "./division.model";
import { IDivision} from "./division.interface";

// Create Division
const createDivisionService = async (payload: IDivision) => {
  const result = await Division.create(payload);
  return result;
};

// Update Division
 const updateDivisionService = async (
  id: string,
  payload: IDivision
) => {
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

// Get All Divisions
 const getAllDivisionsService = async () => {
  const result = await Division.find().sort({ createdAt: -1 });
  return result;
};


export const DivisionServices = {
    createDivisionService,
    updateDivisionService,
    deleteDivisionService,
    getAllDivisionsService
};