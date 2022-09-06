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

const authUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'testname',
    password: '12345',
    employee: new mongoose.Types.ObjectId().toString(),
    rol: 'Admin',
    isActive: true
};

export const customerPayload = {
    identidad: "0801199500789",
    name: "cusmoterTest",
    lastName: "test",
    rtn: "08011995007890",
    gender: "Masculino",
    email:"mtest@gmail.com",
    birth: "1995-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50496541321",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    creditLimit: 200,
    payIVA: true,
    isActive: true 
};

export const customerUpdate = {
    identidad: "0801199500789",
    name: "cusmoterUpdateTest",
    lastName: "testUpdate",
    rtn: "08011995007890",
    gender: "Masculino",
    email:"mtest@gmail.com",
    birth: "1995-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50496541321",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    creditLimit: 200,
    payIVA: true,
    isActive: true 
};

export const customerWithoutFields = {
    name: "cusmoterTest",
    lastName: "test",
    rtn: "08011995007890",
    gender: "Masculino",
    email:"mtest@gmail.com",
    birth: "1995-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50496541321",
    location: "Tegucigalpa",
    country: "Honduras",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    creditLimit: 200,
    payIVA: true,
    isActive: true 
};

let customerCreated: string;

describe('(/api/customers) - Customers', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/customers) Create customer', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .post('/api/customers')
                .set('Cookie', [`jwt=${accessToken}`])
            
            expect(statusCode).to.equal(400); 

        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/customers')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(customerWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Identidad es requerida'); 
        });

        it('Should be create customer successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/customers')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(customerPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Cliente creado exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'person', 'payIVA', 'creditLimit');

            customerCreated = body.data._id; 
        });
    });

    describe('GET (/api/customers) All customers', () => {
        it('Should be all customers successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/customers')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data).to.be.an('array'); 
            
            body.data.should.each.have.any.keys('_id', 'person', 'payIVA', 'creditLimit'); 
        });
    });

    describe('GET (/api/customers/:customerId) Get by Id customer', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/customers/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .get(`/api/customers/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Cliente no encontrado');
        });

        it('Should be get customer successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/customers/${customerCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'person', 'payIVA', 'creditLimit'); 
        });
    });

    describe('PUT (/api/customers) Update customer', () => {
        it('Should be reject because invalid customer id', async() => {
        
            const { statusCode, body } = await supertest(app)
                .put('/api/customers/12345')
                .send(customerUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId(); 

            const { statusCode, body } = await supertest(app)
                .put(`/api/customers/${notFoundID}`)
                .send(customerPayload)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Cliente no encontrado');
        });

        it('Should be reject because not send data', async() => {
            const customerId = new mongoose.Types.ObjectId();

            const { statusCode } = await supertest(app)
                .put(`/api/customers/${customerId}`)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update area successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .put(`/api/customers/${customerCreated}`)
                .set('Cookie', [`jwt=${accessToken}`])
                .send(customerUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Cliente actualizado exitosamente');
        });
    });

    describe('DELETE (/api/customers) Delete customer', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .delete(`/api/customers/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .delete(`/api/customers/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Cliente no encontrado');
        });

        it('Should be delete customer successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .delete(`/api/customers/${customerCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Cliente eliminado exitosamente');
        });
    });
});
