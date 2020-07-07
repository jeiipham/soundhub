const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express()
app.set('json spaces', 2)

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use('/api', require("./apiController"))

app.listen(process.env.PORT || 3001, () => {
    console.log("Listening on port 3001...")
    console.log(__dirname)
})