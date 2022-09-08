import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Users from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash';
import * as jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
import Env from "@ioc:Adonis/Core/Env";

export default class UsersController {
    public async index(ctx: HttpContextContract) {
       const allUser = await Database  
        .query()  // 👈 gives an instance of select query builder
        .from('users')
        .select('id', 'email')  
        return {
          data: allUser
        }
    }

    public async store({ request, response }: HttpContextContract){
        /**
         * Step 1 - Define schema
        */
        const userSchema = schema.create({
            name: schema.string({}, [
                rules.maxLength(180)
            ]),
            email: schema.string({}, [
                rules.email(),
                rules.unique({
                    table: 'users',
                    column: 'email'
                })
            ]),
            password: schema.string({ trim: true }, [
                rules.minLength(8)
            ]),
            phone_number: schema.string({}, [
                rules.maxLength(13)
            ]),
            address: schema.string()
        })
        
        try {
            /**
            * Step 2 - Validate request body against
            *          the schema
            */
            let data = request.all()
            data.role = 'customer'
            // console.log(data)
            const payload: any = await request.validate({ schema: userSchema })
            const users: Users = await Users.create(data)
            
            return response.ok(data)
            
        } catch (error) {
              /**
             * Step 3 - Handle errors
             */
            console.log(error)
            return response.badRequest(error.messages)
        }
    }

    public async adminCreate({ request, response }: HttpContextContract){
        const userSchema = schema.create({
            name: schema.string({}, [
                rules.maxLength(180)
            ]),
            email: schema.string({}, [
                rules.email(),
                rules.unique({
                    table: 'users',
                    column: 'email'
                })
            ]),
            password: schema.string({ trim: true }, [
                rules.minLength(8)
            ]),
            phone_number: schema.string({}, [
                rules.maxLength(13)
            ]),
            address: schema.string()
        })
        
        try {
            let data = request.all()
            data.role = 'staff'
            const payload: any = await request.validate({ schema: userSchema })
            const users: Users = await Users.create(data)
            
            return response.ok(users)
            
        } catch (error) {
              /**
             * Step 3 - Handle errors
             */
            console.log(error)
            return response.badRequest(error.messages)
        }
    }

    public async login({ request, response }: HttpContextContract) {
        const body = request.all()
        const auth = request.header('authorization')
        const bearer = new String(auth)
        const userToken = bearer.substring(7, bearer.length);
        console.log(userToken)
        const userSchema = schema.create({
            email: schema.string({}, [
                rules.email()
            ]),
            password: schema.string({}, [
                rules.minLength(8)
            ])
        })
        
        try {
            const payload = await request.validate({ schema: userSchema })
            const user = await Users.findByOrFail('email', body.email)
            const accessDenied = 'Wrong Email or Password'
            body.role = user.role
            body.id = user.id
            if(user){
                const jwt_secret = Env.get('JWT_PRIVATE_KEY')
                if (await Hash.verify(user.password, body.password)){
                    let token = jwt.sign({ anyObject: body}, jwt_secret, { expiresIn: '1h' });
                    const decode = jwt_decode(token)
                    // console.log(decode)
                    return response.ok({ token })
                }
            } else {
                return response.badRequest(accessDenied)
            }
            
        } catch (error) {
            console.log(error)
            return response.badRequest(error.messages)
        }
    }
}   
