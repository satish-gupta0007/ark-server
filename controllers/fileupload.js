import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import College from "../models/collegeModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// Expected headers in Excel
const REQUIRED_HEADERS = ["Universities", "State"];

export const uploadCollegeList = catchAsyncError(async (req, res, next) => {
  try {
    console.log("req.file::", req.file);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    if (data.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Excel file is empty" });
    }

    // Validate headers
    const headers = Object.keys(data[0]).map((h) => h.trim());
    const isValid = REQUIRED_HEADERS.every((h) => headers.includes(h));

    if (!isValid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "Invalid headers",
        expected: REQUIRED_HEADERS,
        found: headers,
      });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const row of data) {
      // Normalize headers to avoid undefined
      const Universities = row["Universities"]?.toString().trim();
      const State = row["State"]?.toString().trim();

      if (!Universities || !State) continue; // skip invalid rows

      const existing = await College.findOne({ Universities });

      if (existing) {
        await College.updateOne({ Universities }, { $set: { State } });
        updatedCount++;
      } else {
        await College.create({ Universities, State });
        createdCount++;
      }
    }

    // Remove uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Excel processed successfully",
      created: createdCount,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("Error processing Excel:", error);

    // Remove file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Server error", error });
  }
});


export const getCollegeListExcel = catchAsyncError(async (req, res, next) => {
try {
  // 1️⃣ Fetch all colleges
  const colleges = await College.find().lean();

  // 2️⃣ Format data (if empty, still keep headers)
  const formatted = (colleges && colleges.length > 0)
    ? colleges.map(({ Universities, State }) => ({ Universities, State }))
    : []; // empty array → only headers will appear

  // 3️⃣ Create a worksheet (always with headers)
  const worksheet = XLSX.utils.json_to_sheet(formatted, {
    header: ["Universities", "State"],
  });

  // If no data, manually add headers to ensure Excel shows them
  if (formatted.length === 0) {
    XLSX.utils.sheet_add_aoa(worksheet, [["Universities", "State"]], { origin: "A1" });
  }

  // 4️⃣ Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Colleges");

  // 5️⃣ Write workbook to buffer (no disk)
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  // 6️⃣ Set response headers
  res.setHeader(
    "Content-Disposition",
    "inline; filename=college-list.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  // 7️⃣ Send buffer
  res.status(200).send(buffer);
} catch (error) {
  console.error("Error generating Excel:", error);
  res.status(500).json({ message: "Failed to generate Excel file" });
}

});

// export const getCollegeListJson = catchAsyncError(async (req, res, next) => {
//   try {
//     // 1️⃣ Fetch all colleges
//     const colleges = await College.find().lean();

//     // 2️⃣ Format data (same as before)
//     const formatted = (colleges && colleges.length > 0)
//       ? colleges.map(({ Universities, State }) => ({ college:Universities, state:State }))
//       : []; // empty array if none found

//     // 3️⃣ Return JSON response
//     res.status(200).json({
//       success: true,
//       count: formatted.length,
//       data: formatted
//     });
//   } catch (error) {
//     console.error("Error fetching college list:", error);
//     res.status(500).json({ message: "Failed to fetch college list" });
//   }
// });

export const getCollegeListJson = catchAsyncError(async (req, res, next) => {
  try {
    // 1️⃣ Get search term from query (optional)
    const search = req.query.search ? req.query.search.trim() : '';
console.log('req.query.search::',req.query.search)
    // 2️⃣ Build MongoDB query
    const query = search
      ? { Universities: { $regex: search, $options: 'i' } } // case-insensitive search
      : {};

    // 3️⃣ Fetch matching colleges, limit to avoid huge responses
    const colleges = await College.find(query)
      .select('Universities State') // fetch only required fields
      .limit(20) // limit results for performance
      .lean();

    // 4️⃣ Format data
    const formatted = (colleges && colleges.length > 0)
      ? colleges.map(({ Universities, State }) => ({
          college: Universities,
          state: State,
        }))
      : [];

    // 5️⃣ Return JSON response
    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching college list:', error);
    res.status(500).json({ message: 'Failed to fetch college list' });
  }
});
