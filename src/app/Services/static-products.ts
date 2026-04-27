import { Injectable } from '@angular/core';
import { Iproduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root',
})
export class StaticProducts {
  
    products :Iproduct[]
  
  
  constructor()
  {
this.products = [
      {
        id: 100,
        name: 'lapTop-windos',
        price: 4444,
        quantity: 3,
        cateId: 1,
        imgUrl: 'https://picsum.photos/150/150?random=1',
      },
      {
        id: 200,
        name: 'PC-mac',
        price: 5555,
        quantity: 0,
        cateId: 1,
        imgUrl: 'https://picsum.photos/300/200?random=2',
      },
      {
        id: 300,
        name: 'Ximoi',
        price: 5454,
        quantity: 6,
        cateId: 2,
        imgUrl: 'https://picsum.photos/300/300?random=3',
      },
      {
        id: 400,
        name: 'Iphone',
        price: 111,
        quantity: 1,
        cateId: 2,
        imgUrl: 'https://picsum.photos/300/300?random=4',
      },
      {
        id: 500,
        name: 'Airpods-Acces',
        price: 222,
        quantity: 22,
        cateId: 3,
        imgUrl: 'https://picsum.photos/300/300?random=5',
      },
      {
        id: 600,
        name: 'headPhone-accessorie',
        price: 111,
        quantity: 2,
        cateId: 3,
        imgUrl: 'https://picsum.photos/300/300?random=6',
      },
    ];
  }
  getAllProducts():Iproduct[]
  {
    return this.products
  }
  getproductsById(id:number):Iproduct|null{
    let foundedProducts =  this.products.find((prd)=>prd.id ==id) 
    return foundedProducts ? foundedProducts : null

  }
  getcatbyid(catId:number) :Iproduct[]
  {
    return this.products.filter((prd)=>prd.cateId ===+catId)
  }
  maapproductstoid() :number[]
  {
     return this.products.map((prd)=>prd.id)
  }
}
