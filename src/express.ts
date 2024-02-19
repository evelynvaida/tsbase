import express from "express"
import { z } from "zod"
import filesystem from "fs/promises"
import cors from "cors"

const server = express()
server.use(cors())

server.use(express.json())

const QueryParamPriceSchema = z.object({
    min: z.coerce.number(),
    max: z.coerce.number()
})
/* const QueryParamTypeSchema = z.object({
    type: z.string(),
}) */

const ProductSchema = z.object({
    id: z.number(),
    type: z.string(),
    productName: z.string(),
    price: z.number(),
})

type Product = z.infer<typeof ProductSchema>

const readfile = async () => {
    try {
        const rawData = await filesystem.readFile(`${__dirname}/../database.json`, "utf-8");
        const products: Product[] = JSON.parse(rawData)
        console.log(products)
        return products
    } catch (error) {
        return null
    }
}

server.get("/api/products", async (req, res) => {
    const products = await readfile()
    res.json(products)
}
)

server.get("/api/products/price", async (req, res) => {
    const result = QueryParamPriceSchema.safeParse(req.query)
    if (!result.success)
        return res.status(400).json(result.error.issues)

    const products = await readfile()
    const queryParams = result.data
    const filteredProducts = products?.filter(product => product.price > queryParams.min && product.price < queryParams.max)
    res.json(filteredProducts)
}
)

server.get("/api/products/:type", async (req, res) => {
    const type = req.params.type
    const products = await readfile()
    if (!products)
        return res.sendStatus(500)

    const filteredProductTypes = products?.filter(product => product.type === type)
    res.json(filteredProductTypes)

     /* const result = QueryParamPriceSchema.safeParse(req.query)
    if (!result.success)
        return res.status(400).json(result.error.issues)
    const queryParams = result.data
    const filteredProductPrice = filteredProductTypes.filter(product => product.price > queryParams.min && product.price < queryParams.max)
    if (result) {
        res.json(filteredProductPrice)
    } else {
        res.json(filteredProductTypes)
    }
    // res.json(fileteredProductPrice) */
} 
)

server.listen(4000)
//test 2