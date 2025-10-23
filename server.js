import { app } from "./app.js";
const PORT = 4000; // fallback to 4000 if env variable is missing~
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server listening on port ${process.env.PORT}`);
});


