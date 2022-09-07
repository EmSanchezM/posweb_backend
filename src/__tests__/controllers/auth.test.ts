import supertest from "supertest";
import chai from "chai";
import chaiEach from "chai-each";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../../utils/server";
import { signAccessToken } from "../../services/auth.service";

const { use, expect } = chai;
chai.should();
use(chaiEach);

const app = createServer();

let authUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'testname',
    password: '12345',
    employee: new mongoose.Types.ObjectId().toString(),
    rol: 'Admin',
    isActive: true
};

export const userPayload = {
    identidad: "0801199700789",
    name: "userTest",
    lastName: "test",
    rtn: "08011997007890",
    gender: "Masculino",
    username: "testname",
    password: "123456",
    passwordConfirm: "123456",
    rol: "Admin",
    email:"mtest@gmail.com",
    birth: "1997-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50491558396",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: ""
};

export const userUpdate = {
    identidad: "0801199700789",
    name: "userupdateTest",
    lastName: "test",
    rtn: "08011997007890",
    gender: "Masculino",
    username: "testupdatename",
    password: "123456",
    rol: "Admin",
    email:"mtest@gmail.com",
    birth: "1997-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50491558396",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: ""
};

export const userWithoutFields = {
    name: "userTest",
    lastName: "test",
    rtn: "08011997007890",
    gender: "Masculino",
    username: "testname",
    password: "123456",
    rol: "Admin",
    email:"mtest@gmail.com",
    birth: "1997-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50491558396",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: ""
};

let userCreated: string;

describe('(/api/auth/) - Authentication Users', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/auth/register) Create user', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .post('/api/auth/register');
            
            expect(statusCode).to.equal(400); 

        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/auth/register')
                .send(userWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Identidad es requerida'); 
        });

        it('Should be create user successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/auth/register')
                .send(userPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Usuario creado exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.includes.all.keys('_id', 'username', 'email', 'rol');

            userCreated = body.data._id; 
        });
    });

    describe('POST (/api/auth/login) Login User', () => {
        it('Should be login successfully', async() => {
            const authValid = {
                username: userPayload.username,
                password: userPayload.password 
            }; 
    
            const { statusCode, body } = await supertest(app)
                .post('api/auth/login')
                .send(authValid)
            
            expect(statusCode).to.equal(200);
            expect(body.message).to.equal('Inicio de sesion exitoso');
        });
    });

    describe('GET (/api/auth/user) Get by user authenticated', () => {
        it('Should be get user successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/auth/user')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'username', 'email', 'rol'); 
        });
    });

    describe('PUT (/api/auth/user) Update profile user', () => {
        it('Should be reject because not found', async() => {
            const { statusCode, body } = await supertest(app)
                .put('/api/auth/profile')
                .send(userPayload)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Usuario no encontrado');
        });

        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .put('/api/auth/profile')
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update profile user successfully', async() => {
            const userValid = {
                ...authUser,
                _id: userCreated
            }; 

            const accessToken = signAccessToken(userValid);

            const { statusCode, body } = await supertest(app)
                .put('/api/auth/profile')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(userUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Perfil de usuario actualizado exitosamente');
        });
    });

    describe('POST (/api/auth/logout) Close session user', () => {
        it('Should be reject because not found', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/auth/logout')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Usuario no encontrado');
        });

        it('Should be clouse session user successfully', async() => {
            const userValid = {
                ...authUser,
                _id: userCreated
            }; 

            const accessToken = signAccessToken(userValid);

            const { statusCode, body } = await supertest(app)
                .post('/api/auth/logout')
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Cerrada sesión');
        });
    });
});
