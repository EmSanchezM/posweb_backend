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

export const supplierPayload = {
    identidad: "080198700789",
    name: "supplierTest",
    lastName: "test",
    rtn: "08011987007890",
    gender: "Masculino",
    email:"stest@gmail.com",
    birth: "1987-03-10",
    workLocation: "Tegucigalpa",
    phone1: "+50495541323",
    phone2: "",
    location: "Tegucigalpa",
    country: "Honduras",
    city: "Tegucigalpa",
    website: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    companyName: "supplier test",
    companyLocation: "location test",
    companyPhone1: "+50495128325",
    companyPhone2: "",
    companyRtn: "08042000215670",
    companyLogo: "",
    workPosition: "position test",
    title: "title test",
    isActive: true 
};

export const supplierUpdate = {
    name: "supplierTest",
    lastName: "test",
    rtn: "0801987007890",
    gender: "Masculino",
    email:"stest@gmail.com",
    birth: "1987-03-10",
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
    companyName: "supplier test",
    companyLocation: "location test",
    companyPhone1: "+50495120320",
    companyPhone2: "",
    companyRtn: "08042000215670",
    companyLogo: "",
    workPosition: "position test",
    title: "title test",
    isActive: true 
};

export const supplierWithoutFields = {
    name: "supplierTest",
    lastName: "test",
    rtn: "0801987007890",
    gender: "Masculino",
    email:"stest@gmail.com",
    birth: "1987-03-10",
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
    companyName: "supplier test",
    companyLocation: "location test",
    companyPhone1: "+50495120320",
    companyPhone2: "",
    companyLogo: "",
    workPosition: "position test",
    title: "title test"
};

let supplierCreated: string;

describe('(/api/suppliers) - Suppliers', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/suppliers) Create supplier', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .post('/api/suppliers')
                .set('Cookie', [`jwt=${accessToken}`])
            
            expect(statusCode).to.equal(400); 

        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/suppliers')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(supplierWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Identidad es requerida'); 
        });

        it('Should be create supplier successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/suppliers')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(supplierPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Proveedor creado exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'person', 'companyName', 'companyPhone1');

            supplierCreated = body.data._id; 
        });
    });

    describe('GET (/api/suppliers) All Suppliers', () => {
        it('Should be all suppliers successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/suppliers')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data).to.be.an('array'); 
            
            body.data.should.each.have.any.keys('_id', 'person', 'companyName', 'companyPhone1'); 
        });
    });

    describe('GET (/api/suppliers/:supplierId) Get by Id supplier', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/suppliers/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .get(`/api/suppliers/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Proveedor no encontrado');
        });

        it('Should be get supplier successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/suppliers/${supplierCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'person', 'companyName', 'companyPhone1'); 
        });
    });

    describe('PUT (/api/suppliers) Update supplier', () => {
        it('Should be reject because invalid supplier id', async() => {
        
            const { statusCode, body } = await supertest(app)
                .put('/api/suppliers/12345')
                .send(supplierUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId(); 

            const { statusCode, body } = await supertest(app)
                .put(`/api/suppliers/${notFoundID}`)
                .send(supplierPayload)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Proveedor no encontrado');
        });

        it('Should be reject because not send data', async() => {
            const supplierId = new mongoose.Types.ObjectId();

            const { statusCode } = await supertest(app)
                .put(`/api/suppliers/${supplierId}`)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update supplier successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .put(`/api/suppliers/${supplierCreated}`)
                .set('Cookie', [`jwt=${accessToken}`])
                .send(supplierUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Proveedor actualizado exitosamente');
        });
    });

    describe('DELETE (/api/suppliers) Delete Supplier', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .delete(`/api/suppliers/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .delete(`/api/suppliers/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Proveedor no encontrado');
        });

        it('Should be delete supplier successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .delete(`/api/suppliers/${supplierCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Proveedor eliminado exitosamente');
        });
    });
});
