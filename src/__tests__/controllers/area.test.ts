import supertest from "supertest";
import chai from "chai";
import chaiEach from "chai-each";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../../utils/server";
import { createArea } from "../../services/area.service";
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

export const areaPayload = {
    index: 1,
    parentCode: 1,
    nameArea: 'Cocina',
    codeArea: 'Cocina-01',
    phoneArea: '+50497412003',
    employee: new mongoose.Types.ObjectId().toString(),
    details: 'Cocina',
    isActive: true 
};

export const areaUpdate = {
    index: 1,
    parentCode: 1,
    nameArea: 'Estante',
    codeArea: 'Estante-01',
    phoneArea: '+50497412003',
    employee: new mongoose.Types.ObjectId().toString(),
    details: 'Estante',
    isActive: true 
};

export const areaWithoutFields = {
    parentCode: 1,
    nameArea: 'Cocina',
    codeArea: 'Cocina-01',
    phoneArea: '+50497412003',
    employee: new mongoose.Types.ObjectId().toString(),
    details: 'Cocina',
    isActive: true 
};

let areaCreated: string;

describe('(/api/areas) - Areas', () => {
    beforeAll( async() => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());
    });

    const accessToken = signAccessToken(authUser);

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close(); 
    });

    describe('POST (/api/areas) Create area', () => {
        it('Should be reject because not send data', async() => {
            const { statusCode } = await supertest(app)
                .post('/api/areas')
                .set('Cookie', [`jwt=${accessToken}`])
            
            expect(statusCode).to.equal(400); 

        });

        it('Should be reject because missing fields', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/areas')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(areaWithoutFields);
            
            expect(statusCode).to.equal(400); 
            expect(body).to.be.an('array');
            const [error] = body;
            expect(error.message).to.equal('Indice de area padre es requerida'); 
        });

        it('Should be create area successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .post('/api/areas')
                .set('Cookie', [`jwt=${accessToken}`])
                .send(areaPayload);
            
            expect(statusCode).to.equal(201);

            expect(body).to.be.an('object');
            expect(body.message).to.equal('Area creada exitosamente');

            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'codeArea', 'nameArea', 'phoneArea');

            areaCreated = body.data._id; 
        });
    });

    describe('PUT (/api/areas) Update area', () => {
        it('Should be reject because not invalid area id', async() => {
        
            const { statusCode, body } = await supertest(app)
                .put(`/api/areas/12345`)
                .send(areaUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId(); 

            const { statusCode, body } = await supertest(app)
                .put(`/api/areas/${notFoundID}`)
                .send(areaUpdate)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Area no encontrada');
        });

        it('Should be reject because not send data', async() => {
            const area = await createArea(areaPayload);

            const { statusCode } = await supertest(app)
                .put(`/api/areas/${area._id}`)
                .set('Cookie', [`jwt=${accessToken}`]);

            expect(statusCode).to.equal(400);
        });

        it('Should be update area successfully', async() => {

            const { statusCode, body } = await supertest(app)
                .put(`/api/areas/${areaCreated}`)
                .set('Cookie', [`jwt=${accessToken}`])
                .send(areaUpdate);
            
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Area actualizada exitosamente');
        });
    });

    describe('DELETE (/api/areas) Delete area', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .delete(`/api/areas/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .delete(`/api/areas/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Area no encontrada');
        });

        it('Should be delete area successfully', async() => {

            const area = await createArea(areaPayload);

            const { statusCode, body } = await supertest(app)
                .delete(`/api/areas/${area._id}`)
                .set('Cookie', [`jwt=${accessToken}`]);
                
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.message).to.equal('Area eliminada exitosamente');
        });
    });
    
    describe('GET (/api/areas) All areas', () => {
        it('Should be all areas successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get('/api/areas')
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data).to.be.an('array'); 
            
            body.data.should.each.have.any.keys('_id', 'codeArea', 'nameArea', 'phoneArea'); 
        });
    });

    describe('GET (/api/areas/:areaId) Get by Id area', () => {
        it('Should be reject because of invalid id', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/areas/12345`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(400);
            expect(body.message).to.match(/(?:no es un identificador valido)/);
        });

        it('Should be reject because not found', async() => {
            const notFoundID = new mongoose.Types.ObjectId().toString(); 

            const { statusCode, body } = await supertest(app)
                .get(`/api/areas/${notFoundID}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(404);
            expect(body.message).to.equal('Area no encontrada');
        });

        it('Should be get area successfully', async() => {
            const { statusCode, body } = await supertest(app)
                .get(`/api/areas/${areaCreated}`)
                .set('Cookie', [`jwt=${accessToken}`]);;

            expect(statusCode).to.equal(200); 
            expect(body).to.be.an('object');
            expect(body.data)
                .to.be.an('object')
                .to.include.all.keys('_id', 'codeArea', 'nameArea', 'phoneArea'); 
        });
    });
});
