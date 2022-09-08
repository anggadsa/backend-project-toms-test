import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Ebooks from 'App/Models/Ebook'
import Database from '@ioc:Adonis/Lucid/Database'
import * as jwt from 'jsonwebtoken'
import jwt_decode from "jwt-decode"
import Env from "@ioc:Adonis/Core/Env"

export default class EbooksController {
    async index(ctx: HttpContextContract) {
        const allBooks = await Database  
         .query()  // 👈 gives an instance of select query builder
         .from('ebooks')
         .select('id', 'title', 'author', 'summary', 'price')  
         return {
           data: allBooks
         }
     }

    async store({ request, response }: HttpContextContract) {
        const ebookSchema = schema.create({
            title: schema.string({}, [
                rules.maxLength(180)
            ]),
            author: schema.string({}, [
                rules.maxLength(180)
            ]),
            summary: schema.string({}),
            price: schema.string({}, [
                rules.maxLength(20)
            ]),
        })
        try {
            const auth = request.header('authorization')
            const bearer = new String(auth)
            const userToken = bearer.substring(7, bearer.length);
            const data = request.body()
            const jwt_secret = Env.get('JWT_PRIVATE_KEY')
            const { anyObject } = await jwt.verify(userToken, jwt_secret)
            if(anyObject.role){
                if(anyObject.role === 'staff' || anyObject.role === 'admin')  {
                    const payload: any = await request.validate({ schema: ebookSchema })
                    const ebooks: Ebooks = await Ebooks.create(data)
                    return response.ok(ebooks)
                }
            }
            
        } catch (error) {
            return response.badRequest(error.messages)
        }
     }
     
    async update({ params, request, response }){
        const ebookSchema = schema.create({
            title: schema.string({}, [
                rules.maxLength(180)
            ]),
            author: schema.string({}, [
                rules.maxLength(180)
            ]),
            summary: schema.string({}),
            price: schema.string({}, [
                rules.maxLength(20)
            ]),
        })
        try {
            const { id } = params;
            const requestBody = request.only(["title", "price"]);
            const auth = request.header('authorization')
            const bearer = new String(auth)
            const userToken = bearer.substring(7, bearer.length);
            const data = request.body()
            const jwt_secret = Env.get('JWT_PRIVATE_KEY')
            const { anyObject } = await jwt.verify(userToken, jwt_secret)
            if(anyObject.role === 'staff' || anyObject.role === 'admin')  {
                const payload: any = await request.validate({ schema: ebookSchema })
                const ebooks = await Ebooks.findByOrFail("id", id);
                ebooks.title = requestBody.title;
			    ebooks.price = requestBody.price;
			    await ebooks.save();
                return response.ok(ebooks)
            }
            return response.ok(data)
            
        } catch (error) {
            return response.badRequest(error.messages)

        }
     }
    async destroy({ params, request, response }){
        try {
            const { id } = params;
            const auth = request.header('authorization')
            const bearer = new String(auth)
            const userToken = bearer.substring(7, bearer.length);
            const jwt_secret = Env.get('JWT_PRIVATE_KEY')
            const { anyObject } = await jwt.verify(userToken, jwt_secret)

            if(anyObject.role === 'staff' || anyObject.role === 'admin')  {
                const ebooks = await Ebooks.findByOrFail("id", id);
                await ebooks.delete();
                return response.ok({})
            }
        } catch (error) {
            return response.badRequest(error.messages)

        }
    }
}
