import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Users from 'App/Models/User'
// import { UserRoles } from 'Contracts/enums' validate roles
import Database from '@ioc:Adonis/Lucid/Database'

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
            let data = request.all()
            data.role = 'staff'
            // console.log(data)
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

    // // }
}   
