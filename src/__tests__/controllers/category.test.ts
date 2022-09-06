import supertest from "supertest";
import chai from "chai";
import chaiEach from "chai-each";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../../utils/server";
import { createCategory } from "../../services/category.service";
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

export const categoryPayload = {
    index: 1,
    parentCode: 1,
    codeCategory: 'Cocina-01',
    nameCategory: 'Cocina',
    description: 'Cocina',
    isActive: true 
};

export const categoryUpdate = {
    index: 1,
    parentCode: 1,
    nameCategory: 'Electrodomesticos',
    description: 'Electrodomesticos',
    isActive: true 
};

export const categoryWithoutFields = {
    parentCode: 1,
    nameCategory: 'Cocina',
    description: 'Cocina',
    isActive: true 
};

let categoryCreated: string;

describe('(/api/categories) - Categories', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/categories) Create category', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .post('/api/categories')
                .set('Cookie', [`jwt=${accessToken}`])
            
            expect(statusCode).to.equal(400); 

        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/categories')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(categoryWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Indice de categoria padre es requerida'); 
        });

        it('Should be create category successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/categories')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(categoryPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Categoría creada exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'codeCategory', 'nameCategory', 'description');

            categoryCreated = body.data._id; 
        });
    });

    describe('PUT (/api/categories) Update category', () => {
        it('Should be reject because invalid category id', async() => {
        
            const { statusCode, body } = await supertest(app)
                .put('/api/categories/12345')
                .send(categoryUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId(); 

            const { statusCode, body } = await supertest(app)
                .put(`/api/categories/${notFoundID}`)
                .send(categoryUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Categoría no encontrada');
        });

        it('Should be reject because not send data', async() => {
            const category = await createCategory(categoryPayload);

            const { statusCode } = await supertest(app)
                .put(`/api/categories/${category._id}`)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update area successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .put(`/api/categories/${categoryCreated}`)
                .set('Cookie', [`jwt=${accessToken}`])
                .send(categoryUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Categoría actualizada exitosamente');
        });
    });

    describe('DELETE (/api/categories) Delete category', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .delete(`/api/categories/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .delete(`/api/categories/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Categoría no encontrada');
        });

        it('Should be delete category successfully', async() => {

            const category = await createCategory(categoryPayload);

            const { statusCode, body } = await supertest(app)
                .delete(`/api/categories/${category._id}`)
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Categoría eliminada exitosamente');
        });
    });
    
    describe('GET (/api/categories) All areas', () => {
        it('Should be all categories successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/categories')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data).to.be.an('array'); 
            
            body.data.should.each.have.any.keys('_id', 'codeCategory', 'nameCategory', 'description'); 
        });
    });

    describe('GET (/api/categories/:areaId) Get by Id category', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/categories/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .get(`/api/categories/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Categoría no encontrada');
        });

        it('Should be get categories successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/categories/${categoryCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'codeCategory', 'nameCategory', 'description'); 
        });
    });
});
