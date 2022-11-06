import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'; 
import Shipping, { ShippingDocument } from '../models/shipping.model';

export async function createShipping(input: DocumentDefinition<Omit<ShippingDocument, 'createdAt' | 'updatedAt'>>){
    try {
        const shipping = await Shipping.create(input);
        
        return shipping;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findShippings(){
    try {
        const shippings = await Shipping.find();

        return shippings;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findShipping(shippingId: string){
    try {
        const shipping = await Shipping.findById(shippingId);
        
        return shipping;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function updateShipping(shippingId: string, shippingUpdate: UpdateQuery<ShippingDocument>){
    try {
        const shipping = Shipping.findByIdAndUpdate(shippingId, shippingUpdate);

        return shipping;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function deleteShipping(ShippingId: string){
    try {
        return Shipping.findByIdAndDelete(ShippingId);
    } catch (error: any) {
        throw new Error(error);
    }
}