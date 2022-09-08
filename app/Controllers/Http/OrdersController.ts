// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Orders from 'App/Models/Order'
import Database from '@ioc:Adonis/Lucid/Database'
import * as jwt from 'jsonwebtoken'
import jwt_decode from "jwt-decode"
import Env from "@ioc:Adonis/Core/Env"

export default class OrdersController {
    async index({request, response}){
        try {
            const auth = request.header('authorization')
            const bearer = new String(auth)
            const userToken = bearer.substring(7, bearer.length);
            const jwt_secret = Env.get('JWT_PRIVATE_KEY')
            const { anyObject } = await jwt.verify(userToken, jwt_secret)
            const id = anyObject.id
            const allOrder = await Database  
                .query()  // 👈 gives an instance of select query builder
                .from('orders')
                .where('customer_id', id)
                .select('id', 'ebook_id', 'customer_id', 'status')  
            return {
                data: allOrder
            }
            
        } catch (error) {
            return response.badRequest(error.messages)

        }
    }
    async allOrders(){
        const allOrder = await Database  
            .query()  // 👈 gives an instance of select query builder
            .from('orders')
            .select('id', 'ebook_id', 'customer_id', 'status')  
        return {
            data: allOrder
        }
    }
    
    async store({request, response}){
        try {
            const { ebook_id } = request.only(["ebook_id"]);
            const auth = request.header('authorization')
            const bearer = new String(auth)
            const userToken = bearer.substring(7, bearer.length);
            const jwt_secret = Env.get('JWT_PRIVATE_KEY')
            const { anyObject } = await jwt.verify(userToken, jwt_secret)
            console.log(anyObject, ebook_id);
            if(anyObject.role === 'customer'){
                const orders = await Orders.create({
                    ebook_id :  ebook_id,
                    customer_id : anyObject.id,
                    status : "unpaid"
                })
                return response.ok(orders)
            }

        } catch (error) {
            return response.badRequest(error.messages)

        }
    }

    
}
