const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

// Add CORS headers manually for preflight requests
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tiffinbox-frontend.vercel.app",
    "https://tiffinbox-frontend-git-main-ramoliyayug55-5861s-projects.vercel.app/", // Add your specific Vercel URL pattern
  ]

  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Allow-Credentials", "true")

  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://tiffinbox-frontend.vercel.app",
        "https://tiffinbox-frontend-git-main-ramoliyayug55-5861s-projects.vercel.app/", // Add your specific Vercel URL pattern
      ]
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)

const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection
connection.once("open", () => {
  console.log("MongoDB database connection established successfully")
})

const usersRouter = require("./routes/users")
const tiffinRoutes = require("./routes/tiffin")
const orderRoutes = require("./routes/order")

app.use("/users", usersRouter)
app.use("/tiffin", tiffinRoutes)
app.use("/order", orderRoutes)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
