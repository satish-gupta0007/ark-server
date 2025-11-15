import XLSX from "xlsx";
import fs from "fs";
import College from "../models/collegeModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

const REQUIRED_HEADERS = ["Universities", "State"];

export const uploadCollegeList = catchAsyncError(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    if (data.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Excel file is empty" });
    }
    const headers = Object.keys(data[0]).map((h) => h.trim());
    const isValid = REQUIRED_HEADERS.every((h) => headers.includes(h));

    if (!isValid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid headers",
        expected: REQUIRED_HEADERS,
        found: headers,
      });
    }

    const bulkOps = [];

    for (const row of data) {
      const Universities = row["Universities"]?.toString().trim();
      const State = row["State"]?.toString().trim();
      if (!Universities || !State) continue;

      bulkOps.push({
        updateOne: {
          filter: { Universities },
          update: { $set: { State } },
          upsert: true,
        },
      });
    }

    if (bulkOps.length > 0) {
      const result = await College.bulkWrite(bulkOps, { ordered: false });
      res.status(200).json({
        success: true,
        message: "Excel processed successfully",
        created: result.upsertedCount,
        updated: result.modifiedCount,
      });
    } else {
      res.status(400).json({ success: false, message: "No valid data to process" });
    }
    fs.unlinkSync(req.file.path);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

export const getCollegeListExcel = catchAsyncError(async (req, res, next) => {
try {
  const colleges = await College.find().lean();
  const formatted = (colleges && colleges.length > 0)
    ? colleges.map(({ Universities, State }) => ({ Universities, State }))
    : []; 

  const worksheet = XLSX.utils.json_to_sheet(formatted, {
    header: ["Universities", "State"],
  });

  if (formatted.length === 0) {
    XLSX.utils.sheet_add_aoa(worksheet, [["Universities", "State"]], { origin: "A1" });
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Colleges");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  res.setHeader(
    "Content-Disposition",
    "inline; filename=college-list.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.status(200).send(buffer);
} catch (error) {
  res.status(500).json({ message: "Failed to generate Excel file" });
}
});

export const getCollegeListJson = catchAsyncError(async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const query = search
      ? { Universities: { $regex: search, $options: 'i' } } 
      : {};

    const colleges = await College.find(query)
      .select('Universities State') 
      .limit(20) 
      .lean();

    const formatted = (colleges && colleges.length > 0)
      ? colleges.map(({ Universities, State }) => ({
          college: Universities,
          state: State,
        }))
      : [];

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch college list' });
  }
});
