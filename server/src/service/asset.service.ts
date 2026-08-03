import redisClient from "../config/redis";
import * as assetRepo from "../repositories/asset.repo";

export const getCategory = async () => {
  const cacheKey = "asset-categories:all";

  const cachedCategories = await redisClient.get(cacheKey);

  if (cachedCategories) {
    console.log(`Redis HIT: ${cacheKey}`);
    redisClient.del(cacheKey)
    return JSON.parse(cachedCategories);
  }

  console.log(`Redis MISS: ${cacheKey}`);
  const result = await assetRepo.getCategory();
  // await redisClient.set(
  //   cacheKey,
  //   JSON.stringify(result),
  //   {
  //     EX: 3,
  //   }
  // );
  return result;
};

export const addAsset = async (data: any) => {
  const result = await assetRepo.addAsset(data);
  await redisClient.del("assets:all");
  return result;
};

export const getAsset = async () => {
    const cacheKey = "assets:all";

  const cachedAssets = await redisClient.get(cacheKey);

  if (cachedAssets) {
    console.log(`Redis HIT: ${cacheKey}`);
    return JSON.parse(cachedAssets);
  }
  console.log(`Redis MISS: ${cacheKey}`);
  const result = await assetRepo.getAsset();
  await redisClient.set(
    cacheKey,
    JSON.stringify(result),
    {
      EX: 3,
    }
  );
  return result;
};
