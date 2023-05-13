const fastify = require('fastify')({ logger: true })
import { anaysisTextLines, anaysisImage } from './utils'

const server = fastify

fastify.register(require('@fastify/multipart'))


server.post('/analyse', async (req: any, reply: any) => {
  let result
  const data = await req.file()
  try{
    const textLines = await anaysisImage(data)
    result = await anaysisTextLines(textLines as string[])
  } catch (error) {
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message })
    }
    else {
      console.log("Unexpected error", error)
    }
  }
  reply.status(200).send({result: result})
})

server.listen({ port: 8080 }, (err: Error, address: string) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
