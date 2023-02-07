import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";

export const getOrders = async () => {
  const orders: any = [];

  await new Promise((resolve: any, reject: any) => {
    fs.createReadStream("./data/orders.csv")
      .pipe(csv())
      .on("data", (data: any) => orders.push(data))
      .on("end", () => resolve());
  });

  return orders;
};

export const getStores = async () => {
  const stores: any = [];

  await new Promise((resolve: any, reject: any) => {
    fs.createReadStream("./data/stores.csv")
      .pipe(csv())
      .on("data", (data: any) => stores.push(data))
      .on("end", () => resolve());
  });

  return stores;
};


const getSalesSummary = async (req: Request, res: Response) => {
  let subTotal = 0;
  let taxTotal = 0;

  try {
    const orders = await getOrders();

    if (!orders?.length) {
      return res.send({
        orders: [],
      });
    }
    
    orders.forEach((order:any) => {
      let totalItem = 0;
      totalItem = parseFloat(order.items) * parseFloat(order.orderValue)

      subTotal += totalItem;
      taxTotal += totalItem * (parseFloat(order.taxes) / 100);
    });
    
    let summaryObj = {
      subTotal: subTotal.toFixed(2),
      taxTotal: taxTotal.toFixed(3),
      total: (subTotal + taxTotal).toFixed(3)
    }
    

    return res.json({
      ...summaryObj,
    });
  } catch (error) {
    console.log("--------Failed to getSalesSummary.", error);
    return res.status(500).json("Internal Server Error");
  }
};

export default getSalesSummary;
