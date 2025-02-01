const express = require("express");
const cors = require("cors");
const pg = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send('Hello server api!')
});

app.get("/gc", async (req, res) => {
    let result = null;
    try {
        result = await connPool.query("select * from golf_course");
        if (result && result.rows.length >= 0) {
            res.json({data: result.rows, meta: {totalRowCount: result.rows.length}});
        }
    } catch(err) {
        handleDbError(err, 'getGolfCourseCount');
        res.status(500).send('Internal Server Error');
    }
});

const port = 9876;
app.listen(port, () => console.log(`server running on port ${port}`));


//
// postgres
const POSTGRES_URL = "postgres://<>";

const connPool = new pg.Pool({
    connectionString: POSTGRES_URL,
});

function handleDbError(err, name) {
    console.error(`[${name}] query failed: ${err}`);
    if (err.code === 'ECONNREFUSED') {
        console.error('DB connection refused');
    } else if (err.code === '42P01') {
        console.error('DB table not found');
    }
}
