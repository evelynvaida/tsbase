import express from "express"
import { z } from "zod"
import filesystem from "fs/promises"
import cors from "cors"

const server = express()
server.use(cors())

server.use(express.json())

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

readfile()

server.listen(4000)