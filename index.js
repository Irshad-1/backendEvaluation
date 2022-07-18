const express = require("express");
const dns = require("node:dns");
var fs = require("fs");

const options = {
  family: 4,
};
const app = express();

app.use(express.json());

app.post("/getmeip", (req, res) => {
  dns.lookup(req.body.website_name, options, (err, address, family) => {
    console.log(address);
    if (err) {
      return res.status(404).send("Website name doesn't exist");
    } else {
      return res.status(200).send("address: " + address);
    }
  });
});

app.post("/products/create", (req, res) => {
  const jsonString = req.body;

  fs.readFile("products.json", (err, data) => {
    let productData = JSON.parse(data).products;
    let maxId = -1;
    productData.forEach((ele) => {
      if (ele.id > maxId) maxId = ele.id;
    });
    fs.writeFile(
      "./products.json",
      JSON.stringify({
        products: [...productData, { id: maxId + 1, ...req.body }],
      }),
      (err) => {
        if (err) {
          console.log("Error writing file", err);
          return res.status(404).send("Product not added");
        } else {
          console.log("Successfully wrote file");
          return res.send("Product added succesfully");
        }
      }
    );
  });
  return res.send("Product added succesfully");
});

app.get("/products", (req, res) => {
  fs.readFile("products.json", (err, data) => {
    if (err) return res.status(404).send("Not Found");
    res.send(JSON.parse(data).products);
  });
});

app.put("/products/:productid", (req, res) => {
  let id = req.params.productid;
  let modify = req.body;
  //   console.log(modify);
  fs.readFile("products.json", (err, data) => {
    let productData = JSON.parse(data).products;
    productData.forEach((el, index, arr) => {
      if (el.id == id) {
        let Id = Number(id);
        el = { id: Id, ...modify };
        arr[index] = el;
      }
    });
    fs.writeFile(
      "./products.json",
      JSON.stringify({ products: productData }),
      (err) => {
        if (err) {
          console.log("Error writing file", err);
          return res.status(404).send("Product modify failed");
        } else {
          console.log("Successfully wrote file");
          return res.send("Product modified succesfully");
        }
      }
    );
  });
});

app.delete("/products/:productid", (req, res) => {
  let id = req.params.productid;
  fs.readFile("products.json", (err, data) => {
    let productData = JSON.parse(data).products;
    let filtered = productData.filter((el) => {
      if (el.id != id) return el;
    });
    fs.writeFile(
      "./products.json",
      JSON.stringify({ products: filtered }),
      (err) => {
        if (err) {
          console.log("Error writing file", err);
          return res.status(404).send("Product delete failed");
        } else {
          console.log("Successfully wrote file");
          return res.send("Product deleted succesfully");
        }
      }
    );
  });
});

app.listen(3002, () => {
  console.log("Server running at http://localhost:3002");
});
