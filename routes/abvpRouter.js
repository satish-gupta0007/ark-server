import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addAboutAbvp, addAbvpCollege,
     addAbvpEvent, addAbvpEventCategory, 
     deleteAbvpCollege, getAboutAbvp, getAbvpColleges,
      getActiveAbvpColleges,
      getAllEvetnsList,
      getEvetnCategoryList, getEvetnsList, updateAbvpEvent, 
      updategAbvpCategoy } from "../controllers/abvpController.js";

const abvpRouter = express.Router();
abvpRouter.post("/add-what-is-abvp",isAuthenticated, addAboutAbvp);
abvpRouter.get("/get-what-is-abvp", isAuthenticated,getAboutAbvp);

//advp-college

abvpRouter.get("/get-colleges", isAuthenticated,getAbvpColleges);
abvpRouter.get("/get-active-colleges", isAuthenticated,getActiveAbvpColleges);

abvpRouter.post("/add-college", isAuthenticated,addAbvpCollege);
abvpRouter.put("/update-college/:id", isAuthenticated,updategAbvpCategoy);
abvpRouter.delete("/delete-college/:id", isAuthenticated,deleteAbvpCollege);

abvpRouter.get("/get-events", isAuthenticated,getEvetnsList);
abvpRouter.get("/get-all-events", isAuthenticated,getAllEvetnsList);

abvpRouter.post("/add-events", isAuthenticated,addAbvpEvent);
abvpRouter.put("/update-events", isAuthenticated,updateAbvpEvent);


abvpRouter.get("/get-event-category", isAuthenticated,getEvetnCategoryList);
abvpRouter.post("/add-event-category", isAuthenticated,addAbvpEventCategory);

// 
// abvpRouter.put("/update-college/:id", isAuthenticated,updategAbvpEvent);
// abvpRouter.delete("/delete-college/:id", isAuthenticated,deleteAbvpCollege);

export default abvpRouter;
