// import express from "express";
// import { isAuthenticated } from "../middlewares/auth.js";
// import {
//       addAboutAbvp, addAbvpCollege,
//       addAbvpEvent, addAbvpEventCategory,
//       addAbvpPadhadhikariDetails,
//       deleteAbvpCollege, deletePadhadhikari, getAboutAbvp, getAbvpColleges,
//       getActiveAbvpColleges,
//       getAllEvetnsList,
//       getEventByCategoryGroup,
//       getEventDetails,
//       getEvetnCategoryAllList,
//       getEvetnCategoryList, getEvetnsList, getPadhadhikariActiveList, getPadhadhikariDetails, getPadhadhikariList, updateAbvpEvent,
//       updateAbvpEventCategory,
//       updateAbvpPadhadhikari,
//       updategAbvpCollege,
//       updatePadhadhikariStatus
// } from "../controllers/abvpController.js";

// const abvpRouter = express.Router();
// //colleges and abvp
// abvpRouter.post("/add-what-is-abvp", isAuthenticated, addAboutAbvp);
// abvpRouter.get("/get-what-is-abvp", isAuthenticated, getAboutAbvp);
// abvpRouter.get("/get-colleges", isAuthenticated, getAbvpColleges);
// abvpRouter.get("/get-active-colleges", isAuthenticated, getActiveAbvpColleges);
// abvpRouter.post("/add-college", isAuthenticated, addAbvpCollege);
// abvpRouter.put("/update-college/:id", isAuthenticated, updategAbvpCollege);
// abvpRouter.delete("/delete-college/:id", isAuthenticated, deleteAbvpCollege);

// //events
// abvpRouter.get("/get-events", isAuthenticated, getEvetnsList);
// abvpRouter.get("/get-events/by-category", isAuthenticated, getEventByCategoryGroup);
// abvpRouter.get("/get-event-details/:id", isAuthenticated, getEventDetails);


// abvpRouter.get("/get-all-events", isAuthenticated, getAllEvetnsList);

// abvpRouter.post("/add-events", isAuthenticated, addAbvpEvent);
// abvpRouter.put("/update-events/:id", isAuthenticated, updateAbvpEvent);
// abvpRouter.put("/update-event-details/:id", isAuthenticated, updateAbvpEvent);


// abvpRouter.get("/get-event-category-all", isAuthenticated, getEvetnCategoryAllList);
// abvpRouter.get("/get-event-category", isAuthenticated, getEvetnCategoryList);
// abvpRouter.post("/add-event-category", isAuthenticated, addAbvpEventCategory);
// abvpRouter.put("/update-event-category/:id", isAuthenticated, updateAbvpEventCategory);


// //padhadhikari
// abvpRouter.post("/add-padhadhikari-details", isAuthenticated, addAbvpPadhadhikariDetails);
// abvpRouter.get("/get-active-padhadhikari", isAuthenticated, getPadhadhikariActiveList);
// abvpRouter.get("/get-padhadhikari", isAuthenticated, getPadhadhikariList);
// abvpRouter.put("/update-padhadhikari-details/:id", isAuthenticated, updateAbvpPadhadhikari);
// abvpRouter.get("/get-padhadhikari-details/:id", isAuthenticated, getPadhadhikariDetails);

// abvpRouter.delete("/delete-padhadhikari/:id", isAuthenticated, deletePadhadhikari);
// abvpRouter.patch("/update-padhadhikari-status/:id", isAuthenticated, updatePadhadhikariStatus);

// export default abvpRouter;
