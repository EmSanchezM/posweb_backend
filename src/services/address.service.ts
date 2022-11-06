import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'; 
import Address, { AddressDocument } from '../models/address.model';

export async function createAddress(input: DocumentDefinition<Omit<AddressDocument, 'createdAt' | 'updatedAt'>>){
    try {
        const address = await Address.create(input);
        
        return address;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findAddresss(){
    try {
        const addresss = await Address.find();

        return addresss;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function findAddress(addressId: string){
    try {
        const address = await Address.findById(addressId);
        
        return address;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function updateAddress(addressId: string, addressUpdate: UpdateQuery<AddressDocument>){
    try {
        const address = Address.findByIdAndUpdate(addressId, addressUpdate);

        return address;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function deleteAddress(addressId: string){
    try {
        return Address.findByIdAndDelete(addressId);
    } catch (error: any) {
        throw new Error(error);
    }
}