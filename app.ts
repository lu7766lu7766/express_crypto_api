import { Request, Response, Express, NextFunction } from "express"
import express from "express"
import crypto from "crypto-js"
import bodyParser from "body-parser"
import "dotenv/config"

const app: Express = express()
app.use(bodyParser.json())
const PORT: Number = 8099

const salt = process.env.SALT || "123456"

class ApiException extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = "ApiException"
  }
}
// Route.
app.use((req, res, next) => {
  res.response = (data) => {
    res.json({
      code: [0],
      data,
    })
  }
  next()
})

app.get("/", (req: Request, res: Response) => {
  // throw new ApiException(10000, "api exception")
  // throw new Error("error")
  res.response("ok")
})

app.get("/encrypt", (req: Request, res: Response) => {
  res.response(crypto.AES.encrypt(req.query.planeText as string, salt).toString())
})
app.post("/decrypt", (req: Request, res: Response) => {
  res.response(crypto.AES.decrypt(req.body.encodedText as string, salt).toString(crypto.enc.Utf8))
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error.name === "ApiException") {
    const apiException = error as ApiException
    res.status(200).json({
      code: apiException.code,
      message: apiException.message,
    })
  } else {
    res.status(500).json({
      code: [-1],
      message: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log("port is running on the " + PORT)
})
