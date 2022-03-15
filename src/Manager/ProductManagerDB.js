const options = require("./options/mysqlconfig.js");
const knex = require("knex");

const database = knex(options);

class ProductManagerDB {
  getAll = async () => {
    let tableExists = await database.schema.hasTable("products");
    if (tableExists) {
      let products = await database("products").select("*");
      return { status: "success", payload: products };
    } else {
      console.log("Table does not exist");
    }
  };

  add = async (product) => {
    let tableExists = await database.schema.hasTable("products");
    if (tableExists) {
      let products = await database("products").insert(product);
      return { status: "success", payload: products };
    } else {
      await database.schema
        .createTable("products", (table) => {
          table.increments("id").nullable(false);
          product.title = table.string("title").nullable(false);
          product.price = table.float("price").nullable(false);
          product.thumbnail = table.string("thumbnail", 100).nullable(false);
        })
        .then(() => {
          console.log("table created");
        });
    }
  };
}

module.exports = ProductManagerDB;
