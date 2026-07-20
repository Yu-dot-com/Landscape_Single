import * as assetRepo from "../repositories/asset.repo";

export const getCategory = async() => {
    const result = await assetRepo.getCategory()
    return result
}

export const addAsset = async(data:any) => {
    const result = await assetRepo.addAsset(data)
    return result
}

export const getAsset = async() => {
    const result = await assetRepo.getAsset()
    return result
}