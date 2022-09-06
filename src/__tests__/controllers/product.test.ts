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

export const productPayload = {
    name: "productTest",
    description: "test description",
    category: new mongoose.Types.ObjectId().toString(),
    supplier: new mongoose.Types.ObjectId().toString(),
    price1: 50,
    price2: 40,
    price3: 30,
    price4: 20,
    inStock: 50,
    cost: 10,
    brand: "brand test",
    serie:"serie test",
    color: "color test",
    year: "2022",
    weight: "",
    size: "",
    minCount: 25,
    expiredDate: "2022-06-30",
    expiredSaleDate: "2022-02-01",
    isConsumible: false,
    isActive: true 
};

export const productUpdate = {
    name: "productupdateTest",
    description: "test update description",
    category: new mongoose.Types.ObjectId().toString(),
    supplier: new mongoose.Types.ObjectId().toString(),
    price1: 50,
    price2: 40,
    price3: 30,
    price4: 20,
    inStock: 50,
    cost: 10,
    brand: "brand test",
    serie:"serie test",
    color: "color test",
    year: "2022",
    weight: "",
    size: "",
    minCount: 30,
    expiredDate: "2022-06-30",
    expiredSaleDate: "2022-02-01",
    isConsumible: false,
    isActive: true  
};

export const productWithoutFields = {
    description: "test description",
    category: new mongoose.Types.ObjectId().toString(),
    supplier: new mongoose.Types.ObjectId().toString(),
    price1: 50,
    price2: 40,
    price3: 30,
    price4: 20,
    inStock: 50,
    cost: 10,
    brand: "brand test",
    serie:"serie test",
    color: "color test",
    year: "2022",
    weight: "",
    size: "",
    minCount: 25,
    expiredDate: "2022-06-30",
    expiredSaleDate: "2022-02-01",
    isConsumible: false,
    isActive: true 
};

let productCreated: string;

describe('(/api/products) - Products', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/products) Create product', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/products')
                .set('Cookie', [`jwt=${accessToken}`])
            
            expect(statusCode).to.equal(400);
        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/products')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(productWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Nombre es requerido'); 
        });

        it('Should be create product successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/products')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(productPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Producto creado exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'name', 'price1', 'cost', 'minCount');

            productCreated = body.data._id; 
        });
    });

    describe('GET (/api/products) All products', () => {
        it('Should be all products successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/products')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data).to.be.an('array'); 
            
            body.data.should.each.have.any.keys('_id', 'name', 'price1', 'cost', 'minCount'); 
        });
    });

    describe('GET (/api/products/:productId) Get by Id product', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/products/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .get(`/api/products/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Producto no encontrado');
        });

        it('Should be get product successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/products/${productCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'name', 'price1', 'cost', 'minCount'); 
        });
    });

    describe('PUT (/api/products) Update product', () => {
        it('Should be reject because invalid product id', async() => {
        
            const { statusCode, body } = await supertest(app)
                .put('/api/products/12345')
                .send(productUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId(); 

            const { statusCode, body } = await supertest(app)
                .put(`/api/products/${notFoundID}`)
                .send(productPayload)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Producto no encontrado');
        });

        it('Should be reject because not send data', async() => {
            const productId = new mongoose.Types.ObjectId();

            const { statusCode } = await supertest(app)
                .put(`/api/products/${productId}`)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update product successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .put(`/api/products/${productCreated}`)
                .set('Cookie', [`jwt=${accessToken}`])
                .send(productUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Producto actualizado exitosamente');
        });
    });

    describe('DELETE (/api/products) Delete product', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .delete(`/api/products/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .delete(`/api/products/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Producto no encontrado');
        });

        it('Should be delete product successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .delete(`/api/products/${productCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Producto eliminado exitosamente');
        });
    });
});
