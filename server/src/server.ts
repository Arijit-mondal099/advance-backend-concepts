import "./lib/env"
import app from "./app";
import dbConnection from "./lib/db-connection";

const PORT = process.env.PORT ?? 8001;

app.listen(PORT, () => {
  dbConnection()
    .then(() => console.log(`Server running on port ${PORT}`))
    .catch(() => console.error("DB connection faild"));
});
